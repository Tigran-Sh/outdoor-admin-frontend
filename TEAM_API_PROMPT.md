Implement the Team Members (club staff/guides) CRUD API in the `outdoor-backend` Django project. This mirrors the "Team" section of the admin frontend (`src/pages/team/TeamMember.schema.ts`, `src/pages/team/TeamPage.data.ts`, `src/pages/team/components/TeamMemberFormFields.tsx`) but the **only fields required for create are `name`, `email`, and `password`** — every other field below is optional. Creating a team member also provisions a login account for that person (password is their initial login password), so this ties into the existing `apps.users` auth system rather than being a plain data-only record.

Follow the existing project conventions — use `apps/users/` as the reference implementation (models, `api/serializers.py`, `api/views.py`, `api/permissions.py`, `urls.py`, `admin.py`, `tests/`) before writing code.

## Field Table

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | server-generated | |
| `name` (or `firstName`/`lastName` — confirm with me which; frontend currently splits into `firstName`+`lastName`) | string | **Required** | |
| `email` | string (email) | **Required** | Must be unique; used as the login identifier, same as other `apps.users` accounts |
| `password` | string (write-only) | **Required on create only** | Sets the initial login password for the team member's user account. Not returned in responses. Not required on update (should have a separate change-password/reset flow, consistent with `apps.users.api.views.ChangePasswordView`) |
| `photo` | file (image) | Optional | |
| `phone` | string | Optional | |
| `birthDate` | string (`YYYY-MM-DD`) | Optional | |
| `role` | enum string | Optional | Team job-title, **not** the platform `Role` — see below |
| `permissionIds` | string[] | Optional | See permission enum below |
| `activityTypeIds` | enum string[] | Optional | Same activity-type enum as Events (`hiking`, `climbing`, etc. — see `EVENTS_API_SPEC.md`) |
| `languageIds` | enum string[] | Optional | `en`, `hy`, `ru` |
| `experienceYears` | number (integer, ≥ 0) | Optional | |
| `bio` | string (long text) | Optional | |
| `certificates` | file[] | Optional | |
| `assignedEventIds` | string[] (FK → Event) | Optional | |
| `isActive` | boolean | Optional | Defaults to `true` |
| `joinedDate` | date | server-generated | Set on creation, not client-writable |

## Team Role enum (`role` field)

This is a **club-internal job title**, separate from the platform-wide `apps.users.constants.Role` enum (`participant`, `club_owner`, `guide`, `internal_admin`, `platform_admin`). Do not confuse the two or reuse the same Django model field/choices class.

Hardcode it the same way the frontend does in `TeamPage.data.ts` (`TEAM_ROLES`) — a fixed `TextChoices`, not a DB-driven table, same pattern as how `apps.users.constants.Role` is a fixed hardcoded enum used when creating a platform user (see `CreateUserPage`/`AdminUserViewSet`):

`leadGuide, sweepGuide, manager, adminAssistant`

## Permission enum (`permissionIds` items)

`qrCheckIn, participantsView, gpsTracking, emergencyButton, eventManage, financeView`

(These look like a subset/rename of the existing `apps.users.constants.Capability` values — check whether they should map onto real `Capability` values instead of a separate free-standing list, and ask me if unclear rather than guessing.)

## Access Control

Reuse the existing role/capability system in `apps.users.constants` and `apps.users.services.authorization` — do not build a parallel permission scheme:

- **Club Owner** (`Role.CLUB_OWNER`, gated by the existing `Capability.MANAGE_TEAM_MEMBERS`): full CRUD, but scoped to team members belonging to their own club only.
- **Internal Admin** (`Role.INTERNAL_ADMIN`): **read-only** access (list + detail) across all clubs' team members, for moderation/support checks — no create/update/delete. Check the role the same hardcoded way it's already checked elsewhere for internal-admin-only views (e.g. how `AdminUserViewSet`/admin endpoints in `apps/users/api/views.py` and `apps/users/api/permissions.py` gate access to `Role.INTERNAL_ADMIN`) — reuse that exact pattern instead of inventing a new check.
- **Platform Admin** (`Role.PLATFORM_ADMIN`): full access (has `ALL_CAPABILITIES` already).
- No other role should be able to list/view/edit team members.

## Suggested Endpoints

- `GET /api/v1/club/team-members/` — list, club-owner scoped to own club; internal-admin/platform-admin see all (add a query filter for club if internal/platform admin needs to narrow it)
- `POST /api/v1/club/team-members/` — create (multipart/form-data for `photo`/`certificates`); club-owner only
- `GET /api/v1/club/team-members/{id}/` — detail; club-owner (own club) or internal/platform admin
- `PATCH /api/v1/club/team-members/{id}/` — update; club-owner (own club) only
- `DELETE /api/v1/club/team-members/{id}/` — club-owner (own club) only, or soft-delete via `isActive` — confirm which with me
- Adjust the URL prefix/module name to whatever convention the club-scoped app already uses (check if a `clubs` app/prefix exists yet; if not, ask before picking one).

## Conventions to follow

- Base model on `apps.common.models.UUIDTimeStampedModel`.
- Paginate list endpoint with `apps.common.pagination.DefaultPagination`.
- Register app in `INSTALLED_APPS` and wire URLs under `api_v1_patterns` in `outdoor_backend/urls.py`, per the pattern in `apps/users/urls.py`.
- Document new endpoints via drf-yasg, consistent with `apps/users/api/schema.py`.
- Write tests under the new app's `tests/`, mirroring `apps/users/tests/test_admin_users_api.py` and `test_authorization.py` style, covering: required-field validation (`name`/`email`/`password` only), password not returned in responses, club-owner scoping (cannot see/edit another club's team members), internal-admin read-only enforcement (403 on write attempts), and email-uniqueness.

## Open questions — ask me, don't guess

- Whether `name` should be a single field or stay split as `firstName`/`lastName` on the backend.
- Whether creating a team member creates a full `apps.users` `User` row with `Role.GUIDE` (or another role) under the hood, and how that interacts with login/auth for that person.
- Whether `permissionIds` should map directly onto existing `Capability` values or remain a separate enum.
- Whether a `clubs` app/model already exists (or is being built in parallel) to scope team members to — if not, how club ownership should be modeled on this new table.
