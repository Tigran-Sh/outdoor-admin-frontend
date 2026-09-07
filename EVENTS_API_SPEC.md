# Events API — Field Spec for Backend

This document describes the `Event` resource fields expected by the admin frontend (club side), so the backend can implement matching endpoints/serializers. Source of truth on the frontend: `src/pages/events/EventForm.schema.ts`, `src/pages/events/components/EventFormFields.tsx`, `src/pages/events/EventsPage.data.ts`.

## Field Table

| Field | Type | Required | Notes / Validation |
|---|---|---|---|
| `id` | string (uuid) | server-generated | Returned by backend, not sent on create |
| `name` | string | **Required** | Event title |
| `description` | string (long text) | Optional | |
| `category` | enum string | **Required** | See **Activity Type enum** below |
| `region` | enum string | **Required** | See **Region enum** below |
| `coverImage` | file (image) | Optional | Single image |
| `galleryImages` | file[] (images) | Optional | Multiple images |
| `date` | string (`YYYY-MM-DD`) | **Required** | Start date |
| `time` | string (`HH:mm`) | **Required** | Start time |
| `durationType` | enum: `single` \| `multi` | **Required** | Default `single` |
| `endDate` | string (`YYYY-MM-DD`) | **Required only if `durationType = multi`** | Ignored/empty when `single` |
| `guideId` | string (FK → Guide/User) | **Required** | Lead guide |
| `sweepGuideId` | string (FK → Guide/User) | Optional | Backup/sweep guide |
| `languageIds` | enum string[] | **Required, min 1** | See **Language enum** |
| `difficultyIds` | enum string[] | **Required, min 1** | See **Difficulty enum** |
| `distanceKm` | number (decimal, positive) | **Required** | |
| `elevationGainM` | number (integer, ≥ 0) | **Required** | |
| `meetingPointDescription` | string | **Required** | Free text address/description |
| `meetingPointCoordinates` | string (`lat, lng`) | **Required** | e.g. `"40.7397, 44.8639"` |
| `maxParticipants` | number (integer, positive) | **Required** | |
| `priceType` | enum: `free` \| `paid` | **Required** | |
| `price` | number (decimal, ≥ 0) | **Required only if `priceType = paid`** | Disabled/ignored when `free` |
| `whatIsNecessary` | string (long text) | Optional | What participants should bring |
| `includedItems` | string (long text) | Optional | What's included in price |
| `excludedItems` | string (long text) | Optional | What's not included |
| `cancellationPolicy` | string (long text) | Optional | |
| `additionalInfo` | string (long text) | Optional | |
| `status` | enum: `scheduled` \| `cancelled` | server-managed | Set via a dedicated cancel action, not the create/edit form |
| `cancellationReason` | enum string | Optional, set on cancel | See **Cancellation Reason enum**; when `reason = other`, an accompanying free-text reason should also be stored |
| `soldCount` | number (integer) | server-managed | Tickets/spots booked; read-only, used for dashboard stats |

## Enums

**Activity Type (`category`)** — id list (extendable), used as translation keys on the frontend:
`hiking, trailRunning, cycling, climbing, zipline, skydiving, parachuting, paragliding, hangGliding, supBoarding, yachting, surfing, kayaking, rafting, canyoneering, wakeboarding, skiing, snowboarding`

**Region (`region`)**:
`yerevan, aragatsotn, ararat, armavir, gegharkunik, kotayk, lori, shirak, syunik, tavush, vayotsDzor`

**Language (`languageIds` items)**:
`en, hy, ru`

**Difficulty (`difficultyIds` items)**:
`easy, medium, hard, extreme`

**Duration Type (`durationType`)**:
`single, multi`

**Price Type (`priceType`)**:
`free, paid`

**Event Status (`status`)**:
`scheduled, cancelled`

**Cancellation Reason (`cancellationReason`)**:
`lowRegistrations, weatherConditions, guideUnavailable, safetyConcerns, other`

## Guide reference

`guideId` / `sweepGuideId` reference a Guide/Team-member resource with at least `{ id, name }`. The frontend expects a way to list guides for select dropdowns (e.g. `GET /guides` or reuse the team members endpoint).

## Suggested Endpoints

- `GET /events` — paginated list, filterable by `status`, `category`, `region`, date range
- `POST /events` — create (multipart/form-data because of `coverImage`/`galleryImages`)
- `GET /events/{id}` — detail
- `PUT/PATCH /events/{id}` — update (multipart/form-data)
- `DELETE /events/{id}` — optional, if hard delete is supported
- `POST /events/{id}/cancel` — body: `{ reason: CancellationReason, reasonOther?: string }` → sets `status = cancelled`

## Conditional Validation Summary

- `endDate` required only when `durationType === "multi"`.
- `price` required only when `priceType === "paid"`; should be null/ignored when `"free"`.
- `languageIds` and `difficultyIds` must each have at least 1 item.
