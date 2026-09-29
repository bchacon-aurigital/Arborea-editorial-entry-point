# Orders backend — integration handoff

**Read this before changing anything in the cart, checkout, or order-submission path.**

This document is the running record of the order flow. The front end is being built
by one developer; the Google Apps Script backend will be connected by a different
developer in a later session. This file is the contract between the two.

Last updated: 2026-09-28 · Status: **front end in progress, backend not started**

---

## 1. Current state

| Piece | Status |
|---|---|
| Shared UI primitives (`ui/QtyStepper`, `DateField`, `Chip`, `SelectableCard`) | ✅ done |
| Service registry (`src/data/services.js` + `services.*` i18n keys) | ✅ done |
| Dead code / unused deps removed | ✅ done |
| Global cart context | 🔜 pending |
| Cart drawer + badge | 🔜 pending |
| Six service pages wired to cart | 🔜 pending |
| `/checkout/` page | 🔜 pending |
| Payload builder (`buildOrderPayload`) | 🔜 pending |
| **Mock submit (front end works end-to-end)** | 🔜 pending |
| **Real Apps Script `doPost`** | ❌ **not started — this is the handoff** |
| Google Sheet + Drive folder provisioned | ❌ not started |
| `.env` values set in build environment | ❌ not started |

Progress log is at the bottom of this file. Update it as work lands.

## 2. Why the browser posts straight to Apps Script

`next.config.ts` sets `output: "export"`. The site is static HTML on a CDN — there
is **no server, no API route, no server action**. There is nowhere to put a secret
or a proxy. So the only option is: browser `fetch` → Apps Script Web App.

Two consequences to accept up front:

- `orderApi.js` posts with `Content-Type: text/plain` **on purpose** — it avoids the
  CORS preflight that Apps Script cannot answer. Do not "fix" this to
  `application/json`; the request will start failing. Apps Script still receives the
  body and `JSON.parse`s it in `doPost`.
- The shared secret is a `NEXT_PUBLIC_*` value, so it is **visible in the JS
  bundle**. It is anti-noise, not authentication. Don't design anything around it
  being private. Real auth would need a proxy (Cloudflare Worker), which is out of
  scope and was consciously deferred.

## 3. The seam: where to plug in

Everything the backend needs flows through one file: **`src/lib/orderApi.js`**.

It exports `submitOrder(payload)` and returns `{ ok: true, submissionId }` or
`{ ok: false, error }`. It currently resolves against a **mock** that waits ~1.2s
and returns success, so the whole UI can be demoed without a backend.

To go live:

1. Provision the Sheet + Drive folder, deploy the Apps Script Web App
   ("Execute as: me", "Who has access: Anyone").
2. Set `NEXT_PUBLIC_ORDERS_BACKEND_URL` and `NEXT_PUBLIC_ORDERS_SHARED_SECRET` in
   the **build** environment (they are inlined at build time — setting them only in
   a local `.env.local` will not affect the deployed site).
3. Flip the mock off. The switch is a single constant at the top of `orderApi.js`;
   the real `fetch` path is already written next to the mock.

**No UI file needs to change to connect the backend.** If you find yourself editing
a component under `src/components/sections/` to make the backend work, something has
gone wrong — the payload builder is the only thing that should need adjusting.

## 4. Payload contract

`buildOrderPayload()` in `src/lib/orderPayload.js` produces exactly this. Treat it
as frozen; if the Apps Script needs a different shape, change it in the builder and
update this section in the same commit.

```jsonc
{
  "submissionId": "9f2c…",        // uuid, generated ONCE per checkout attempt
  "createdAt":    "2026-09-28T18:52:00.000Z",
  "locale":       "en",           // "en" | "es"
  "currency":     "USD",
  "secret":       "…",            // injected by submitOrder, not by the builder

  "guest": {                      // all five REQUIRED, validated in the UI
    "firstName": "Ana",
    "lastName":  "Rodríguez",
    "email":     "ana@example.com",
    "phone":     "+506 8888 8888",
    "casa":      "casa-mango"     // slug from src/data/properties.js
  },

  "cart": [
    {
      "lineId":    "wellness-spa:massage-deep-tissue:90-min",
      "service":   "wellness-spa", // id from src/data/services.js
      "sku":       "massage-deep-tissue",
      "title":     "Deep Tissue Massage",
      "qty":       2,
      "unitPrice": 130,
      "lineTotal": 260,            // qty * unitPrice, precomputed
      "date":      "2026-10-04",   // optional preferred date, "" if unset
      "options":   { "duration": "90 min" }
    }
  ],

  "serviceForms": {               // free-form preferences, only present services appear
    "private-chef": {
      "dishes":       { "breakfast": ["Gallo Pinto"], "dinner": ["Whole Fish"] },
      "restrictions": { "Vegetarian": 2, "Gluten-Free": 1 },
      "restrictionOther": "low sodium",
      "allergies":    "severe peanut allergy",
      "preferences":  "no cilantro"
    },
    "full-fridge": {
      "adults": 4, "children": 2, "days": 5,
      "produce": ["dairy:milk", "fruits:mango"],
      "cooking": "…", "groceries": "…", "snacksFor": ["kids"], "preferredSnacks": "…"
    },
    "wellness-spa": { "allergies": "…" }
  },

  "totals": { "itemCount": 5, "subtotal": 1240, "total": 1240 },
  "notes":  "Arriving late on the 3rd."
}
```

Notes on the shape:

- **One submission per order.** A guest who booked chef + spa + a car sends *one*
  POST containing all of it. The previous design sent one POST per service page;
  that is gone by design. Do not re-introduce per-service submissions.
- `lineTotal` and `totals` are precomputed so the Sheet doesn't need formulas.
- **All prices are estimates.** The checkout states this explicitly to the guest
  ("estimated, subject to change"). Don't treat `total` as a binding amount, and
  don't add payment logic — no money is collected anywhere in this product.
- `serviceForms` keys are the same service ids as `cart[].service`. Services with no
  preference form (transport, tours, fishing) simply don't appear.
- `produce` uses stable `category:item` keys, not translated labels.

## 5. What the Apps Script must do

The existing `apps-script/Code.gs` was written for the **old flat payload**
(`{ service, name, casa, dateNeeded, items: [{label, price}] }`) and needs a rewrite.
Keep from it: the `json()` helper, the `LockService` lock, and the `Log`-tab dedupe
by `submissionId`.

Target behaviour:

1. **`Orders` tab** — one row per order: timestamp, `submissionId`, guest name,
   email, phone, casa, list of services, item count, total, notes, link to the Drive
   file.
2. **`OrderItems` tab** — one row per cart line, joined to the order by
   `submissionId`: service, sku, title, qty, unitPrice, lineTotal, date,
   `JSON.stringify(options)`. This is what makes the order queryable per item while
   still being one order.
3. **Drive** — write the entire payload verbatim as
   `<submissionId>.json` into a dedicated folder. This is the guarantee that
   *nothing* is lost even when the Sheet has no column for it (explicit
   requirement: "TODA la información"). Put the file URL in the `Orders` row.
4. **Notification email** — grouped by service, with the guest's contact details and
   the preference forms rendered readably.

### Bugs in the current `Code.gs` to fix while rewriting

- It **requires** `payload.name`, `payload.casa`, `payload.dateNeeded` and returns
  `Missing required fields` otherwise. The new payload has no top-level `name` or
  `dateNeeded` at all. Validate `guest.firstName` / `guest.lastName` /
  `guest.email` / `guest.phone` / `guest.casa` and `cart.length > 0` instead.
- Consider accepting the old flat shape as a fallback for one release. The site is
  static and CDN-cached, so a stale bundle can post the old schema after you deploy.
- **Apps Script Web Apps need a new deployment version** for code edits to take
  effect. Editing the script and saving is not enough.

## 6. Do not change

These were deliberate decisions. Changing them silently will cost the other
developer real time.

1. **Don't refactor UI components to make the backend work.** The seam is
   `orderApi.js` + `orderPayload.js`. Nothing under `src/components/sections/`
   should need to change.
2. **Don't switch `Content-Type` to `application/json`** in `orderApi.js` (§2).
3. **Don't re-introduce per-service submissions** or per-page submit buttons. Pages
   add to the cart; only `/checkout/` submits.
4. **Don't move prices out of the i18n files** as part of this work. It is a known
   good follow-up (the 74 numeric values are currently in sync between `en`/`es`, so
   it's a latent risk, not a live bug), but it is a ~65-entry migration touching both
   locale files and it can break live prices. Separate task, separate review.
5. **Don't add payment/checkout-session logic.** There is no payment in this
   product by design.
6. **Don't change cart persistence to `localStorage`.** Session-only is a product
   decision.
7. **Don't put `commission` / `contactName` / `whatsapp` from `tours.activities`
   into the payload.** They're internal margin data that happens to sit in the i18n
   file. Cart lines whitelist fields for this reason.
8. **Generate `submissionId` once per checkout attempt and reuse it on retry.** The
   old code called `crypto.randomUUID()` inside the submit handler, so a retry after
   a network error produced a new id and defeated the dedupe, creating duplicate
   orders.

## 7. Progress log

Append an entry per session. Newest last.

### 2026-09-28 — analysis + docs
- Audited the whole order path. Findings: six independent page-local carts, two
  dead-end flows (Full Fridge's "Add to cart" button had no `onClick`; the tours
  `ActivityCard` had no cart at all), **no `.env` anywhere** so `submitOrder` was
  returning `missing-backend-url` and nothing had ever reached Google, and Chef/Spa
  were posting empty `name`/`casa`/`dateNeeded` which the Apps Script would have
  rejected regardless.
- Decisions taken with the product owner: one order per checkout; guest first name,
  last name, email, phone and casa all required at checkout; all prices shown as
  estimates subject to change; cart is session-only; backend deferred to a later
  session behind a mock.
- Wrote `CLAUDE.md` and this file.

### 2026-09-28 — phase 0.5: groundwork before the cart
Refactor limited to what the cart work actually needs. Build and `tsc --noEmit`
both clean afterwards.

- **Added `src/components/ui/`**: `QtyStepper`, `DateField`, `Chip`,
  `SelectableCard`. These replace 13 hand-rolled −/+ steppers, 6 one-off
  `type="date"` inputs and 15 duplicated local components (`Stepper` ×2,
  `RadioPill` ×2, `PackageCard` ×2, and five variants of the same text field).
  The old ones clamped inconsistently (some at 0, some at 1, chef's guest counter
  at 2) — `min`/`max` are now explicit props.
  - `DateField` also fixes a real bug shared by all six previous date inputs: they
    used `new Date().toISOString()` for `min`, which is UTC, so in Costa Rica
    (UTC-6) the minimum selectable date rolled over to tomorrow at 6pm local and
    blocked same-day requests. `todayLocal()` in that file is the fix.
- **Added `src/data/services.js`** — the six-service registry (`id`, `labelKey`,
  colour, `href`, icon). `id` is what the payload uses for `cart[].service` and the
  `serviceForms` keys, so treat the ids as part of the contract in §4.
  Added matching `services.*.label` keys to both locale files (EN + ES).
- **Deleted** `src/components/AOSInit.jsx` and `src/components/SplashScreen.jsx` —
  neither was imported anywhere (a previous commit removed the usage but left the
  files). Removed 6 dependencies with zero imports: `aos`, `gsap`,
  `framer-motion`, `lucide`, `date-fns`, `@hookform/resolvers`.
  - Kept `react-hook-form`: it was also unused, but the new checkout has five
    required fields with email/phone validation, which is exactly its job. Note
    `@hookform/resolvers` was dropped because no schema library (zod/yup) is
    installed — use RHF's built-in validation rules, not a resolver.
- **Deliberately not done:** the 54 inert `data-aos` attributes still in the JSX do
  nothing now that AOS is gone, but stripping them would add a large mechanical
  diff to files that are mid-edit. They get removed in phase 3 as those files are
  rewritten anyway.
- Left `OrderCheckoutForm.jsx`, `ChefCheckout`, `SpaCheckout` and Full Fridge's
  inline summary untouched on purpose — roughly 600 lines that get deleted in
  phases 3–4. Don't invest in cleaning them.
