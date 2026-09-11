import httpClient from "./httpClient";

import type { PaginatedResponse } from "@/types/adminUser";
import { buildEventFormData, mapEventFromApi, type Event, type EventApi, type EventListParams } from "@/types/event";
import {
  mapGuideAvailabilityFromApi,
  type GuideAvailability,
  type GuideAvailabilityApi,
  type GuideAvailabilityParams,
} from "@/types/guideAvailability";

import type { EventFormValues } from "@/pages/events/EventForm.schema";

const BASE_URL = "/api/v1/events/";

export async function listEvents(params: EventListParams = {}): Promise<PaginatedResponse<Event>> {
  const { data } = await httpClient.get<PaginatedResponse<EventApi>>(BASE_URL, { params });
  return { ...data, results: data.results.map(mapEventFromApi) };
}

export async function getEvent(id: string): Promise<Event> {
  const { data } = await httpClient.get<EventApi>(`${BASE_URL}${id}/`);
  return mapEventFromApi(data);
}

export async function createEvent(values: EventFormValues, club?: string): Promise<Event> {
  const { data } = await httpClient.post<EventApi>(BASE_URL, buildEventFormData(values, club));
  return mapEventFromApi(data);
}

export async function updateEvent(id: string, values: EventFormValues): Promise<Event> {
  const { data } = await httpClient.patch<EventApi>(
    `${BASE_URL}${id}/`,
    buildEventFormData(values),
  );
  return mapEventFromApi(data);
}

export async function deleteEvent(id: string): Promise<void> {
  await httpClient.delete(`${BASE_URL}${id}/`);
}

export async function publishEvent(id: string): Promise<Event> {
  const { data } = await httpClient.post<EventApi>(`${BASE_URL}${id}/publish/`);
  return mapEventFromApi(data);
}

export async function cancelEvent(
  id: string,
  reason: string,
  reasonOther?: string,
): Promise<Event> {
  const { data } = await httpClient.post<EventApi>(`${BASE_URL}${id}/cancel/`, {
    reason,
    reason_other: reasonOther,
  });
  return mapEventFromApi(data);
}

export async function getGuideAvailability(
  params: GuideAvailabilityParams = {},
): Promise<GuideAvailability[]> {
  const { data } = await httpClient.get<GuideAvailabilityApi[]>(
    `${BASE_URL}guide-availability/`,
    { params },
  );
  return data.map(mapGuideAvailabilityFromApi);
}
