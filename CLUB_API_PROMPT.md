Implement the Club API in the `outdoor-backend` Django project, matching the field spec in `docs/club-fields.md` (from the `outdoor-admin-frontend` repo — paste its full contents below before sending this prompt) exactly: same field names, types, enum values, and required/optional/conditional rules. The admin frontend already codes against this contract.

Follow the existing project conventions — use `apps/users/` as the reference implementation (models, `api/serializers.py`, `api/views.py`, `api/permissions.py`, `urls.py`, `admin.py`, `tests/`) before writing code.

## App structure

- New app: `apps/clubs/` with the standard layout:
  - `models.py`
  - `api/serializers.py`, `api/views.py`, `api/permissions.py` (`api/__init__.py`)
  - `urls.py`
  - `admin.py`
  - `tests/`
- Register in `INSTALLED_APPS` and wire into `api_v1_patterns` in `outdoor_backend/urls.py` (e.g. `path("", include("apps.clubs.urls"))`), final paths under `/api/v1/club/...` (singular "club" since a club-owner manages exactly one club — confirm this one-club-per-owner assumption with me if uncertain, since it affects whether this is a singleton "my club" endpoint vs. a full collection).
- Model: inherit `apps.common.models.UUIDTimeStampedModel`.
- Pagination: `apps.common.pagination.DefaultPagination` for any list endpoint (e.g. an internal-admin-facing club list for verification).

## Field & validation rules

Implement exactly as documented in `docs/club-fields.md` (paste below). Key points to get right:

- `ownerId`: **not a client-submitted field.** Set server-side from `request.user` when creating the club. The serializer must reject/ignore any client-supplied value for this.
- `name`, `logo`, `about` (min 50 chars), `activityTypeIds` (min 1), `baseRegion`, `email`, `entityType` — required.
- `phone` — required (free text, no format validation, matching the frontend).
- `coverImage`, `yearFounded`, `website` — optional. `yearFounded` if provided must be an integer between 1900 and the current year. `website` if provided must be a valid URL.
- **Conditional — social links**: at least one of `instagram` / `facebook` / `telegram` must be non-empty. Enforce this as object-level (`validate()`) logic in the serializer, not per-field.
- **Conditional — `taxId`**: required only when `entityType` is `soleTrader` or `llc`.
- **Conditional — `ownerIdDocument`**: required only when `entityType` is `individual` or `informal`.
- `identityVerified`, `paymentVerified`: booleans, **not writable via the club create/update serializer** — system/admin-set only (see verification endpoints below).
- Enums: implement `entityType`, `baseRegion`, and the `activityTypeIds` item enum as Django `TextChoices` using the exact string values from the doc (they double as frontend i18n keys — do not rename, translate, or reorder them). `baseRegion` and `activityTypeIds` enums are the same value sets already used for Events (see `EVENTS_API_SPEC.md` if present in this repo) — reuse a shared choices module/constants if one already exists for regions/activity types instead of redefining them in the clubs app.
- `activityTypeIds`: multi-select, min 1 — same modeling approach you use for the Events app's `languageIds`/`difficultyIds` (Postgres `ArrayField` with `choices`, or a through table — pick whichever pattern is already established elsewhere in this codebase for consistency).
- File uploads (`logo`, `coverImage`, `ownerIdDocument`): single-file image fields, `multipart/form-data` on create/update. No size/type restriction is enforced client-side, but apply the project's standard image validation if one already exists (check settings/other file-upload fields); otherwise ask before inventing new limits.

## Access control

Reuse the existing role/capability system in `apps.users.constants` — do not build a parallel scheme:

- **Club Owner** (`Role.CLUB_OWNER`, capability `Capability.EDIT_CLUB_PROFILE`): can create their own club (if they don't have one yet) and read/update it. Cannot see or edit other clubs.
- **Internal Admin** (`Role.INTERNAL_ADMIN`) / **Platform Admin** (`Role.PLATFORM_ADMIN`): read access to all clubs, and are the only roles allowed to set `identityVerified` (capability `Capability.VERIFY_CLUB`) — reuse existing capabilities rather than inventing new ones. Check `apps.users.constants.Capability` for `VERIFY_CLUB` / `SUSPEND_CLUB` and wire the verification/suspension actions to those.
- No other role should access club data beyond what's already public-facing (if there's a public/marketplace-facing club listing elsewhere, that's out of scope here — this is the admin-facing CRUD only).

## Suggested endpoints

- `GET /api/v1/club/profile/` — the authenticated club-owner's own club (404/empty if not created yet)
- `POST /api/v1/club/profile/` — create the authenticated user's club (multipart/form-data); reject if the owner already has one
- `PATCH /api/v1/club/profile/` — update own club (multipart/form-data)
- `GET /api/v1/admin/clubs/` — internal/platform admin list (paginated), filterable by `identityVerified`, `paymentVerified`, `entityType`, `baseRegion`
- `GET /api/v1/admin/clubs/{id}/` — internal/platform admin detail
- `POST /api/v1/admin/clubs/{id}/verify-identity/` — sets `identityVerified = true` (capability `VERIFY_CLUB`)
- `POST /api/v1/admin/clubs/{id}/suspend/` — if a suspend flow is wanted (capability `SUSPEND_CLUB`) — confirm with me whether this belongs here or is out of scope for this pass
- Adjust naming/prefixes to match whatever `clubs`/`admin` URL conventions already exist elsewhere in the project (check `apps/users/urls.py`'s `admin_patterns` pattern and mirror it).

## Docs & tests

- Add OpenAPI/Swagger docs for new endpoints consistent with `apps/users/api/schema.py` (drf-yasg, already wired per `outdoor_backend/schema.py`).
- Tests under `apps/clubs/tests/`, mirroring `apps/users/tests/` style, covering:
  - Required-field validation for all required fields.
  - `ownerId` cannot be set/overridden by the client and is derived from the authenticated user.
  - Social-link "at least one of instagram/facebook/telegram" object-level validation.
  - `taxId` required only for `soleTrader`/`llc`; `ownerIdDocument` required only for `individual`/`informal`.
  - `yearFounded` bounds (1900–current year) and `website` URL validation.
  - A club-owner cannot create a second club once they already have one (if that's confirmed as a one-club-per-owner model).
  - A club-owner cannot read/update another owner's club.
  - `identityVerified`/`paymentVerified` are read-only on the owner-facing create/update endpoint and only settable via the admin verification action, gated by `VERIFY_CLUB`.

## Open questions — ask me, don't guess

- Is it strictly one club per owner (singleton "my club" resource), or can a club-owner user have/manage multiple clubs?
- Is there already a shared `regions`/`activity_types` choices module (e.g. from implementing the Events app) that this should import from instead of redefining?
- Should club suspension (`SUSPEND_CLUB`) be included in this pass, or is it a separate future task?
- Any existing file-upload size/type validation convention in the project to reuse for `logo`/`coverImage`/`ownerIdDocument`.

---

<!-- Paste the full contents of docs/club-fields.md here before sending to Claude -->
