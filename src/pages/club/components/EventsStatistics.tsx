import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ReactApexChart from "react-apexcharts";

import Card, { CardBody, CardHeader } from "@/components/ui/Card/Card";

import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";

import {
  getEventCountByCategory,
  getMonthlyTicketsSold,
  getTotalRevenue,
  getTotalTicketsSold,
  getUpcomingEventsCount,
  mockEvents,
} from "@/pages/events/EventsPage.data";

const VARIANT_COLORS: Record<BadgeVariant, string> = {
  primary: "#25a0e2",
  secondary: "#878a99",
  success: "#00bd9d",
  info: "#32ccff",
  warning: "#FFBC0A",
  danger: "#f06548",
  dark: "#343a40",
  light: "#f3f6f9",
};

const CATEGORY_VARIANTS = new Map(ACTIVITY_TYPES.map((type) => [type.id, type.variant]));

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  variant: BadgeVariant;
}

function StatCard({ label, value, icon, variant }: StatCardProps) {
  return (
    <div className="col-md-4">
      <Card className="card-animate mb-3 mb-md-0">
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="text-uppercase fw-medium text-muted text-truncate mb-2">{label}</p>
              <h4 className="fs-22 fw-semibold mb-0">{value}</h4>
            </div>

            <div className="avatar-sm flex-shrink-0">
              <span className={`avatar-title rounded fs-3 bg-${variant}-subtle`}>
                <i className={`${icon} text-${variant}`} />
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function EventsStatistics() {
  const { t } = useTranslation();

  const monthlyTicketsSold = useMemo(() => getMonthlyTicketsSold(mockEvents), []);
  const eventsByType = useMemo(() => getEventCountByCategory(mockEvents), []);
  const totalTicketsSold = useMemo(() => getTotalTicketsSold(mockEvents), []);
  const totalRevenue = useMemo(() => getTotalRevenue(mockEvents), []);
  const upcomingEventsCount = useMemo(() => getUpcomingEventsCount(mockEvents), []);

  const ticketsSoldOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: monthlyTicketsSold.map((item) => item.label),
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    grid: {
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    colors: [VARIANT_COLORS.primary],
    tooltip: {
      y: {
        formatter: (value: number) => t("dashboard.events.ticketsSoldTooltip", { count: value }),
      },
    },
  };

  const ticketsSoldSeries = [
    {
      name: t("dashboard.events.ticketsSoldSeriesName"),
      data: monthlyTicketsSold.map((item) => item.sold),
    },
  ];

  const eventsByTypeOptions = {
    chart: {
      fontFamily: "inherit",
    },
    labels: eventsByType.map((item) => t(`activityTypes.${item.category}`)),
    colors: eventsByType.map(
      (item) => VARIANT_COLORS[CATEGORY_VARIANTS.get(item.category) ?? "secondary"],
    ),
    legend: {
      position: "bottom" as const,
    },
    stroke: { show: false },
    dataLabels: {
      dropShadow: { enabled: false },
    },
  };

  const eventsByTypeSeries = eventsByType.map((item) => item.count);

  return (
    <>
      <div className="row mb-4">
        <StatCard
          label={t("dashboard.events.totalEvents")}
          value={String(mockEvents.length)}
          icon="ri-calendar-event-line"
          variant="primary"
        />
        <StatCard
          label={t("dashboard.events.ticketsSold")}
          value={String(totalTicketsSold)}
          icon="ri-ticket-2-line"
          variant="success"
        />
        <StatCard
          label={t("dashboard.events.upcomingEvents")}
          value={String(upcomingEventsCount)}
          icon="ri-calendar-check-line"
          variant="warning"
        />
      </div>

      <div className="row">
        <div className="col-xl-7">
          <Card>
            <CardHeader
              title={t("dashboard.events.ticketsSoldChartTitle")}
              actions={
                <span className="text-muted fs-13">
                  {t("dashboard.events.totalRevenue", { amount: totalRevenue.toLocaleString() })}
                </span>
              }
            />

            <CardBody>
              <ReactApexChart
                options={ticketsSoldOptions}
                series={ticketsSoldSeries}
                type="bar"
                height={320}
                className="apex-charts"
              />
            </CardBody>
          </Card>
        </div>

        <div className="col-xl-5">
          <Card>
            <CardHeader title={t("dashboard.events.eventsByTypeChartTitle")} />

            <CardBody>
              <ReactApexChart
                options={eventsByTypeOptions}
                series={eventsByTypeSeries}
                type="pie"
                height={320}
                className="apex-charts"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default EventsStatistics;
