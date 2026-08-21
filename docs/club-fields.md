# Club — Fields Reference (for backend/API)

Extracted from the frontend form/validation (`src/pages/clubs/ClubProfile.schema.ts`,
`ClubsPage.data.ts`, `ClubFormFields.tsx`).

## Note on "club owner"

There is **no separate "owner name/email/phone" field** in the current club form.
A club is created/managed by an authenticated **club-owner user account**
(the user who is logged in when creating the club) — i.e. `ownerId`/`ownerUserId`
should be a **mandatory foreign key** on the Club record, pointing to the user
that owns it, set server-side from the authenticated session (not submitted by
the form itself).

The only owner-*related* thing collected in the form itself is `ownerIdDocument`
(a scanned ID document), which is conditionally required — see table below.

## Fields

| Field | Type | Required? | Notes / Validation |
|---|---|---|---|
| `ownerId` (club owner / user account) | FK → User | **Yes** | Not a form field — set server-side to the authenticated user creating the club |
| `name` | string | **Yes** | Club name |
| `logo` | image file | **Yes** | At least 1 image required |
| `coverImage` | image file | No | Optional |
| `about` | string | **Yes** | Min length 50 characters |
| `activityTypeIds` | array of enum string | **Yes** | At least 1 required. See "Activity Types" enum below |
| `baseRegion` | enum string | **Yes** | See "Regions" enum below |
| `yearFounded` | integer | No | If provided: integer, between 1900 and current year |
| `email` | string (email) | **Yes** | Must be a valid email |
| `phone` | string | **Yes** | Required, free text (no format regex currently enforced) |
| `instagram` | string | Conditional | At least **one of** `instagram` / `facebook` / `telegram` must be filled |
| `facebook` | string | Conditional | See above |
| `telegram` | string | Conditional | See above |
| `website` | string (URL) | No | Must be a valid URL if provided |
| `entityType` | enum string | **Yes** | One of: `individual`, `soleTrader`, `llc`, `informal` |
| `taxId` | string | Conditional | **Required** if `entityType` is `soleTrader` or `llc` |
| `ownerIdDocument` | image file | Conditional | **Required** (≥1 file) if `entityType` is `individual` or `informal` |
| `identityVerified` | boolean | System-set | Not part of the create/edit form; set by admin verification flow |
| `paymentVerified` | boolean | System-set | Not part of the create/edit form; set by admin verification flow |

## Enums

### `entityType`
- `individual`
- `soleTrader`
- `llc`
- `informal`

### `baseRegion` (regions of Armenia)
- `yerevan`
- `aragatsotn`
- `ararat`
- `armavir`
- `gegharkunik`
- `kotayk`
- `lori`
- `shirak`
- `syunik`
- `tavush`
- `vayotsDzor`

### `activityTypeIds` (multi-select, at least 1 required)
- `hiking`
- `trailRunning`
- `cycling`
- `climbing`
- `zipline`
- `skydiving`
- `parachuting`
- `paragliding`
- `hangGliding`
- `supBoarding`
- `yachting`
- `surfing`
- `kayaking`
- `rafting`
- `canyoneering`
- `wakeboarding`
- `skiing`
- `snowboarding`

## File uploads
`logo`, `coverImage`, `ownerIdDocument` are all single-file image uploads on the frontend
(`accept="image/*"`, no explicit max size/type restriction currently enforced client-side).
