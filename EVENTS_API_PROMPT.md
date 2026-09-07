Implement the Events API in the `outdoor-backend` Django project, matching the field spec in `EVENTS_API_SPEC.md` (attached/pasted below) exactly — same field names, types, enum values, and required/optional rules, since the admin frontend already codes against this contract.

Follow the existing project conventions (look at `apps/users/` as the reference implementation before writing code):

- New app: `apps/events/` with the standard layout used by `apps/users/`:
  - `models.py`
  - `api/serializers.py`, `api/views.py`, `api/permissions.py` (`api/__init__.py`)
  - `urls.py`
  - `admin.py`
  - `tests/` (mirror the style in `apps/users/tests/`)
- Register the app in `outdoor_backend/settings.py` `INSTALLED_APPS` and wire its URLs into `api_v1_patterns` in `outdoor_backend/urls.py` (e.g. `path("", include("apps.events.urls"))`), under a `events/` prefix — final paths should be `/api/v1/events/...`.
- Model: inherit `apps.common.models.UUIDTimeStampedModel` (UUID `id`, `created_at`, `updated_at`) — do not hand-roll these fields.
- Pagination: use `apps.common.pagination.DefaultPagination` for the list endpoint.
- Auth/permissions: reuse the existing JWT auth (`rest_framework_simplejwt`) and the project's role/capability system from `apps.users.services.authorization` / `apps.users.api.permissions` — club-scoped users should only manage their own club's events; add whatever capability check matches how other club-scoped resources are protected (check how `apps/users/api/permissions.py` or any existing club-scoped viewset does it; if no club-scoped resource exists yet, ask me rather than guessing).
- Enums: implement as Django `TextChoices` on the model (`category`, `region`, `durationType`, `priceType`, `status`, `cancellationReason`, and the `languageIds`/`difficultyIds` item enums) using the exact string values from the spec (they are also i18n keys on the frontend — do not rename or translate them).
- `languageIds` and `difficultyIds` are multi-select — model as `ArrayField` of the enum (if Postgres) or a related M2M/through table, whichever matches how similar multi-value fields are already handled elsewhere in the codebase; otherwise use Postgres `ArrayField` with `choices`.
- `guideId` / `sweepGuideId`: FK to the user/guide model (`sweepGuideId` nullable). Confirm the correct target model by checking `apps/users/models.py`.
- `coverImage` / `galleryImages`: file/image fields; `POST`/`PATCH` must accept `multipart/form-data`. `galleryImages` is a set of images tied to the event (separate model with FK + ordering, or an image field array — pick whichever pattern fits Django/DRF idioms; note there is no gallery-image example elsewhere in this codebase, so use a small related model `EventGalleryImage(event, image, order)`).
- Conditional validation (must be enforced in the serializer, not just the DB):
  - `endDate` required only when `durationType == "multi"`.
  - `price` required only when `priceType == "paid"`; null/blank when `"free"`.
  - `languageIds` min length 1, `difficultyIds` min length 1.
- `status` and `soldCount` are server-managed — not writable via the create/update serializer.
- Add a dedicated action/endpoint to cancel an event (`POST /api/v1/events/{id}/cancel/`) accepting `{ reason, reasonOther? }`, setting `status = cancelled` and storing the reason (`reasonOther` only relevant/stored when `reason == "other"`).
- Add OpenAPI/Swagger docs for the new endpoints consistent with how `apps/users/api/schema.py` documents its views (the project already exposes `/api/swagger/` via drf-yasg per `outdoor_backend/schema.py`).
- Write tests under `apps/events/tests/` covering: required-field validation, the `durationType`/`endDate` and `priceType`/`price` conditional rules, list/filter (by `status`, `category`, `region`), create/update with multipart file upload, and the cancel action — following the structure/style of `apps/users/tests/test_auth_api.py` and `test_admin_users_api.py`.
- Run the project's test suite and linters before finishing (check `outdoor-backend`'s README/CI config for the exact commands, e.g. `pytest`, `ruff`/`flake8`, `mypy` if configured).

Do not invent new field names or enum values beyond what's in the spec below — the frontend already sends/expects these exact keys. If something is ambiguous or missing (e.g. how club-scoping/ownership of events should work, or where the Guide model lives), stop and ask instead of guessing.

---

<!-- Paste the full contents of EVENTS_API_SPEC.md here before sending to Claude -->
