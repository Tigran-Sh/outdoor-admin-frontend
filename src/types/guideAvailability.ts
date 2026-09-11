export interface GuideAssignmentApi {
  id: string;
  title: string;
  status: string;
  start_at: string;
  end_at: string | null;
}

export interface GuideAssignment {
  /** The event's id -- `GET /api/v1/events/guide-availability/` returns the guide's own events. */
  id: string;
  title: string;
  status: string;
  startAt: string;
  endAt: string | null;
}

export interface GuideAvailabilityApi {
  /** Team member id -- the same value `Event.guide` takes. */
  id: string;
  full_name: string;
  photo: string | null;
  is_available: boolean;
  assignments: GuideAssignmentApi[];
}

export interface GuideAvailability {
  id: string;
  fullName: string;
  photo: string | null;
  isAvailable: boolean;
  assignments: GuideAssignment[];
}

export function mapGuideAvailabilityFromApi(raw: GuideAvailabilityApi): GuideAvailability {
  return {
    id: raw.id,
    fullName: raw.full_name,
    photo: raw.photo,
    isAvailable: raw.is_available,
    assignments: raw.assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      status: assignment.status,
      startAt: assignment.start_at,
      endAt: assignment.end_at,
    })),
  };
}

export interface GuideAvailabilityParams {
  /** `YYYY-MM-DD`. Defaults to today. */
  from?: string;
  /** `YYYY-MM-DD`. Defaults to `from` + 30 days; the window can't exceed 186 days. */
  to?: string;
  /** Platform staff only -- scopes the lookup to a specific club. */
  club?: string;
}
