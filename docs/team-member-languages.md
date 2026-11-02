# Team Member / Event `languages` — Backend Update Needed

The frontend's spoken/working-languages list (`src/constants/languages.ts`) was
expanded from 3 codes to 29. The wire shape of the `languages` field is
unchanged — only the set of values it can now contain has grown.

## Where `languages` is used

The same list backs two separate endpoints/fields, both need the update:

| Field | Endpoint |
|---|---|
| Team member working languages | `POST` / `PATCH /api/v1/club/team-members/` (and returned on `GET`) |
| Event guide working languages | Event create/update endpoints |

Sent as a multipart field repeated once per selected value
(`languages=en&languages=fr&languages=ka`), or as a JSON array if the endpoint
accepts JSON — same field name, just more possible values now.

## Confirmed error (live, on team-member create/update)

Only `en`, `hy`, `ru` are currently accepted — every other code in the list
below 400s with this shape (DRF's standard `ChoiceField`/`MultipleChoiceField`
rejection, one entry per invalid index):

```json
{
  "error": {
    "code": "invalid",
    "message": "Invalid input.",
    "details": {
      "languages": {
        "0": ["\"de\" is not a valid choice."],
        "1": ["\"es\" is not a valid choice."]
      }
    }
  }
}
```

This confirms the fix is exactly widening the `choices=` (or equivalent) on
the `languages` field — nothing else about the request shape or validation
needs to change.

## Full accepted code list (ISO 639-1)

```
en, hy, ru, fr, de, es, it, pt, nl, pl, tr, ar, fa, he, ka, el, zh, ja, ko, hi,
uk, ro, bg, cs, sv, fi, da, hu, az
```

## What to change on the backend

1. **Widen the accepted values** for `languages` on both the team-member and
   event serializers/models from the old 3-code set to all 29 above — update
   `choices=` on the model field, the serializer's `ChoiceField` /
   `MultipleChoiceField`, or seed a lookup table if `languages` is FK-based
   rather than a plain choice/array field.
2. **Validation shape is otherwise unchanged** — still an optional list, 0 or
   more values, each one of the allowed codes; a code outside the list should
   still return `400`.
3. Codes are lower-case 2-letter ISO 639-1 (`ka`, not `KA`) — confirm the
   validation isn't case-sensitive in a way that would reject them.
4. Any downstream language-name lookup driven by the same enum (e.g.
   notification emails, PDF exports) should get the new codes too, though
   that's not blocking for the form to work.

No frontend follow-up is needed — the picker, validation, and display names
for all 29 codes are already wired in for both the team-member form and the
event form, in all three locale files (`en`, `hy`, `ru`).
