import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import type {
  DatesSetArg,
  EventClickArg,
  EventHoveringArg,
  EventInput,
} from "@fullcalendar/core";

import Avatar from "@/components/ui/Avatar/Avatar";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import Button from "@/components/ui/Button/Button";
import Card, { CardBody } from "@/components/ui/Card/Card";

import { useAuth } from "@/app/providers/useAuth";
import { getGuideAvailability, listEvents } from "@/services/events.api";
import { formatDateInputValue, getTodayDateString } from "@/utils/date";

const OWN_EVENTS_PAGE_SIZE = 100;

interface DateRange {
  from: string;
  to: string;
}

interface HoveredGuide {
  guideId: string;
  guideName: string;
  guidePhoto: string | null;
  x: number;
  y: number;
}

function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return formatDateInputValue(date);
}

function CalendarPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuide = user?.role === "guide";

  const [range, setRange] = useState<DateRange>(() => ({
    from: getTodayDateString(),
    to: addDays(getTodayDateString(), 42),
  }));
  const [hoveredGuide, setHoveredGuide] = useState<HoveredGuide | null>(null);
  const hideTooltipTimeoutRef = useRef<number | null>(null);

  const availabilityQuery = useQuery({
    queryKey: ["guide-availability", range.from, range.to],
    queryFn: () => getGuideAvailability({ from: range.from, to: range.to }),
    enabled: !isGuide,
  });

  // A plain guide has no `view_team_members` capability, so the
  // guide-availability endpoint 403s for them; fall back to their own
  // scoped event list (the backend already restricts it to events they
  // guide) instead.
  const ownEventsQuery = useQuery({
    queryKey: ["my-events-calendar"],
    queryFn: () => listEvents({ page_size: OWN_EVENTS_PAGE_SIZE, ordering: "start_at" }),
    enabled: isGuide,
  });

  const guides = useMemo(() => availabilityQuery.data ?? [], [availabilityQuery.data]);

  const calendarEvents: EventInput[] = useMemo(() => {
    if (isGuide) {
      return (ownEventsQuery.data?.results ?? [])
        .filter((event) => Boolean(event.startAt))
        .map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startAt as string,
          end: event.endAt ?? undefined,
          extendedProps: { eventId: event.id },
        }));
    }
    return guides.flatMap((guide) =>
      guide.assignments
        .filter((assignment) => assignment.startAt)
        .map((assignment) => ({
          id: `${guide.id}:${assignment.id}`,
          title: assignment.title,
          start: assignment.startAt,
          end: assignment.endAt ?? undefined,
          extendedProps: {
            eventId: assignment.id,
            guideId: guide.id,
            guideName: guide.fullName,
            guidePhoto: guide.photo,
          },
        })),
    );
  }, [isGuide, ownEventsQuery.data, guides]);

  const dataQuery = isGuide ? ownEventsQuery : availabilityQuery;

  function handleEventClick(arg: EventClickArg) {
    arg.jsEvent.preventDefault();
    const eventId = arg.event.extendedProps.eventId as string;
    navigate(`/club/events/${eventId}`);
  }

  function handleDatesSet(arg: DatesSetArg) {
    const from = formatDateInputValue(arg.start);
    const to = formatDateInputValue(arg.end);
    setRange((prev) => (prev.from === from && prev.to === to ? prev : { from, to }));
  }

  function clearHideTooltipTimeout() {
    if (hideTooltipTimeoutRef.current !== null) {
      window.clearTimeout(hideTooltipTimeoutRef.current);
      hideTooltipTimeoutRef.current = null;
    }
  }

  function handleEventMouseEnter(arg: EventHoveringArg) {
    clearHideTooltipTimeout();
    const rect = arg.el.getBoundingClientRect();
    setHoveredGuide({
      guideId: arg.event.extendedProps.guideId as string,
      guideName: arg.event.extendedProps.guideName as string,
      guidePhoto: arg.event.extendedProps.guidePhoto as string | null,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }

  function handleEventMouseLeave() {
    clearHideTooltipTimeout();
    hideTooltipTimeoutRef.current = window.setTimeout(() => setHoveredGuide(null), 150);
  }

  function handleGuideTooltipClick() {
    if (!hoveredGuide) return;
    navigate(`/club/team/${hoveredGuide.guideId}`);
  }

  return (
    <>
      <Breadcrumbs title={t("calendar.title")} />

      {dataQuery.isError && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between mb-4">
          <span>{t("calendar.loadError")}</span>
          <Button
            variant="danger"
            appearance="outline"
            size="sm"
            onClick={() => dataQuery.refetch()}
          >
            {t("common.retry")}
          </Button>
        </div>
      )}

      <Card>
        <CardBody>
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,listMonth",
            }}
            buttonText={{
              today: t("calendar.today"),
              month: t("calendar.month"),
              list: t("calendar.list"),
            }}
            height="auto"
            displayEventTime={false}
            events={calendarEvents}
            eventClick={handleEventClick}
            eventMouseEnter={isGuide ? undefined : handleEventMouseEnter}
            eventMouseLeave={isGuide ? undefined : handleEventMouseLeave}
            datesSet={handleDatesSet}
          />
        </CardBody>
      </Card>

      {hoveredGuide && (
        <div
          className="dropdown-menu show p-2"
          style={{
            position: "fixed",
            left: hoveredGuide.x,
            top: hoveredGuide.y,
            transform: "translate(-50%, calc(-100% - 8px))",
            zIndex: 1090,
            cursor: "pointer",
          }}
          onMouseEnter={clearHideTooltipTimeout}
          onMouseLeave={handleEventMouseLeave}
          onClick={handleGuideTooltipClick}
        >
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <Avatar src={hoveredGuide.guidePhoto ?? undefined} name={hoveredGuide.guideName} size="xs" />
            <span className="fw-medium fs-13">{hoveredGuide.guideName}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default CalendarPage;
