# Orders backend — integration handoff

**Read this before changing anything in the cart, checkout, or order-submission path.**

This document is the running record of the order flow. The front end is being built
by one developer; the Google Apps Script backend will be connected by a different
developer in a later session. This file is the contract between the two.

Last updated: 2026-10-01 · Status: **front end in progress, backend not started**

---

## 1. Current state

| Piece | Status |
|---|---|
| Shared UI primitives (`ui/QtyStepper`, `DateField`, `Chip`, `SelectableCard`) | ✅ done |
| Service registry (`src/data/services.js` + `services.*` i18n keys) | ✅ done |
| Dead code / unused deps removed | ✅ done |
| Global cart context (`CartContext` + `lib/sku.js`, mounted in `layout.tsx`) | ✅ done |
| Cart drawer + floating badge | ✅ done |
| Home wired to cart (activities + vehicles) | ✅ done |
| Spa, Chef, Full Fridge wired to cart | ✅ done |
| Fishing tours wired to cart | ⏸ **deliberately deferred** — keeps `useOrderCart` + `OrderCheckoutForm` alive |
| `/checkout/` page | 🟡 review section done; guest form + submit pending |
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

### 2026-09-28 — phase 1: the cart itself

- **`src/app/context/CartContext.jsx`** — one cart for the whole site, mounted in
  `layout.tsx` inside `I18nProvider`. API: `setLine` (upsert-replace), `addLine`
  (upsert-increment), `updateLine`, `setQty` (0 removes), `removeLine`,
  `clearService`, `clear`; `getLine`/`has`; derived `lines`, `linesByService`,
  `subtotal`, `count`, `lineCount`; `serviceForms` with
  `setServiceForm` (shallow merge) / `replaceServiceForm` / `getServiceForm`;
  plus `isOpen`/`openCart`/`closeCart`/`toggleCart` for the drawer, and `hydrated`.
- **`src/lib/sku.js`** — `slugify`, `skuOf(path, index, field)`, `lineIdOf`.
  `skuOf` resolves the item's **English** name out of `en.json` by dot path (numeric
  segments index arrays) and slugifies it, so an id never depends on the active
  locale and never shifts when an array is reordered. Falls back to
  `<last-path-segment>-<index>` when it can't resolve.

**Guarantees that matter to the backend**, verified against the real code this
session (ad-hoc, not a committed test suite — re-check if you change the context):

- `normalizeLine` is a strict whitelist. A line built from a `tours.activities`
  object keeps only the eight contract fields; `commission`, `contactName`,
  `whatsapp`, `image`, `priceValue` are dropped. Verified that what lands in
  `sessionStorage` has exactly
  `date, lineId, options, qty, service, sku, title, unitPrice`.
- `lineTotal` never exists in stored state — it is recomputed on every read, so a
  persisted cart can't carry a stale total.
- Lines whose `service` is not in `src/data/services.js` are dropped on hydration,
  so renaming a service id retires stale lines instead of leaking an unknown
  service into a payload.
- The persistence effect is gated on `hydrated`, so the empty first render cannot
  overwrite a saved cart. Corrupt or unreadable storage starts empty rather than
  throwing.
- `qty` is coerced to a positive integer and `unitPrice` to a non-negative number;
  invalid lines are rejected outright rather than stored half-formed.
- `linesByService` is ordered by `SERVICE_ORDER`, so the drawer, the checkout page
  and the payload always list services in the same sequence.
- 98 skus across the 13 priced/selectable i18n arrays were checked for collisions:
  all unique.

### 2026-09-29 — phase 2: cart UI

- **`src/components/cart/CartButton.jsx`** — floating pill, bottom-right, appears
  only once the cart has something in it. Deliberately *not* in the navbar: that
  header hides itself on scroll-down, and this button has to stay reachable while
  the guest scrolls a long service page.
- **`src/components/cart/CartDrawer.jsx`** — slide-over panel mounted once in the
  root layout. Grouped by service (colour + icon from the registry), per-line
  quantity stepper and remove, "Preferences saved" chip plus an Edit link per
  service group, estimated total, the estimates disclaimer, and the checkout CTA.
  Escape closes, Tab is trapped inside the panel, focus returns to the opener.
- **`src/app/checkout/page.jsx` + `components/sections/CheckoutPage.jsx`** — the
  order review half of the checkout, so the drawer's CTA has a real destination.
  The guest form and the single submit are still to come.
- **`src/lib/format.js`** — `money`, `formatDateLabel`, `describeLine`.
- Added `cart.*` and `checkout.*` i18n keys (EN + ES), appended as raw text so the
  rest of those files was not reformatted.
- Added `id="experiences"` to the in-house services section, so the empty-state
  CTA has an anchor.

Two integration details future work must respect:

- **`LenisProvider` now depends on the cart.** It reads `isOpen` and calls
  `lenis.stop()` / `.start()`, otherwise the page keeps gliding behind the open
  overlay. It also force-clears `document.body.style.pointerEvents`: Lenis sets
  that to `"none"` on every scroll and clears it 150ms later, so a drawer opened
  mid-scroll would otherwise be completely unclickable with no further scroll
  event coming to release it. That is also why `CartButton` sets
  `pointer-events-auto` explicitly — without it the button is dead to clicks for
  most of the time the guest is scrolling.
- **`options` values must read as labels on their own.** `describeLine` joins the
  *values* and never shows keys, so `{ days: 3 }` renders as a bare "3". Use
  `{ days: "3 days" }`, `{ duration: "90 min" }`, `{ guests: "6 guests" }`.

**Regression introduced and fixed in this phase — worth knowing about.** The drawer
overlay shipped with `pointer-events-auto` in the static part of its class list and
`pointer-events-none` in the ternary. Tailwind emits `.pointer-events-auto` *after*
`.pointer-events-none`, so with both classes present auto wins no matter what order
they appear in the attribute. The result was an invisible full-screen `z-[600]`
layer that swallowed every click on the site — navigation included. The same latent
conflict was in `CartButton`'s wrapper and the panel itself.

Rule that follows: **never split a Tailwind utility family across the static and
conditional halves of a `className`.** Emit exactly one class of a given family from
the ternary. This is silent — it type-checks, it builds, and the JSX reads as if it
works.

Verified: production build and `tsc --noEmit` clean; the prerendered HTML carries
`role="dialog"`, `aria-modal`, `inert` on the closed panel, `data-lenis-prevent` on
the scroll container, and no empty-state flash on `/checkout/`. `money`,
`formatDateLabel` and `describeLine` unit-checked (20 assertions) under
`TZ=America/Costa_Rica` — including proof that `new Date("2026-10-04")` formats as
"Oct 3" locally while `formatDateLabel` gives "Oct 4". Click-through interaction
(open/close, stepper, remove) was **not** machine-verified: no browser automation
was available in that session.

### 2026-09-29 — phase 3a: UX corrections + home page wired

The product owner clarified the intended flow, which **corrected two of my earlier
decisions**. Recorded here because both are easy to get wrong again:

1. **The cart button belongs at the top, always visible.** It was a floating
   bottom-right pill that only appeared once the cart had items. It is now a fixed
   top-right control (`z-450`, left of the hamburger) that is always present. It is
   still not *inside* `<Navbar>`'s header, because that header retracts on
   scroll-down and this must not disappear; it collapses to icon + count below `md`
   so it keeps the hamburger's footprint.
2. **The cart is the committed order, not the working state.** My earlier note in
   `CLAUDE.md` told future readers to mirror cart state directly from components.
   That is wrong for this product: each surface holds a local draft and commits on
   an explicit action. See the corrected section in `CLAUDE.md`.

Also: the drawer footer now has the two buttons the flow calls for — "Keep adding
experiences" (returns to `/#experiences` without clearing anything) and "Proceed
with my order" (`/checkout/`). `/checkout/` stays the only place guest details are
collected and the only place the order is submitted.

Wired this pass:

- **`ui/ActivityCard.jsx`** (home activities) — was completely orphaned, with local
  state and no cart at all. Now: quantity + optional date as a draft, one commit,
  then the card shows "In your order" / "Update order" / remove. Reads only
  whitelisted fields off the activity object, so `commission` / `contactName` /
  `whatsapp` never enter a line.
- **`sections/MulaRentalSection.jsx`** (home vehicles) — dropped its local `Set` +
  `configs` cart and the inline `OrderCheckoutForm`. `qty` is the number of
  **vehicles**; the day count is folded into `unitPrice` (`days × dailyRate`) and
  carried as `options.days`. That way the drawer's stepper means "two of this
  vehicle" instead of silently changing the rental length.
- Both replaced their bespoke steppers and date inputs with `QtyStepper` /
  `DateField`.

`OrderCheckoutForm.jsx` now has exactly one remaining consumer,
`FishingToursPage.jsx`; it gets deleted when that page is wired.

Verified: build and `tsc --noEmit` clean; utility-conflict scan clean across 13
files; 18 "Add to cart" controls present in the prerendered home page (12 activities
+ 6 vehicles); the transport section no longer renders an inline order form;
`inert` confirmed to serialise correctly (omitted when false, `inert=""` when true).
Click-through still unverified — no browser automation available.

### 2026-09-29 — phase 3b: spa, chef and full fridge wired

Fishing tours is **deliberately left unconnected** at the product owner's request.
It still uses the old `useOrderCart` hook and still renders `OrderCheckoutForm`,
which is why both of those files survive. Don't delete either until fishing is
migrated.

**`src/hooks/useDraft.js`** is the new shared page-local selection store. Unlike
`useOrderCart` it never stores labels and never folds quantity into a price — the
commit builds those from the i18n data. Nothing in it is persisted.

Each of the three pages now follows the same shape: the whole page is a draft, it
renders its own end-of-page summary, and one "Add to cart" commits. Every commit
does `clearService(id)` **then** adds the lines, so deselecting something and
re-committing cannot leave an orphan line behind. Verified that this sequence works
as intended (React applies the functional updaters in order) and that it leaves other
services' lines and `serviceForms` untouched.

- **`WellnessSpaPage`** — `SpaCheckout` (which used to POST directly) became
  `SpaSummary`. Massage duration becomes the `lineId` variant, so "Deep Tissue
  60 min" and "90 min" are distinct lines. The enhancements gate is now scoped to
  this page's draft: checking the global cart would have let a rental car unlock
  facial add-ons.
- **`FullFridgePage`** — the "Add to cart" button had no `onClick` at all and the
  questionnaire was never submitted anywhere; both now work. `updatePackageCart`
  is gone (it existed only to keep the old local cart in sync on every click).
  Produce selections switched from translated `"Category::Item"` strings to stable
  `category:item` ids derived from the English labels, matching the payload
  contract. Beverages became quantities instead of toggles.
  The package tier is the *nearest* match to the requested guests/days, so the exact
  numbers asked for are preserved in `options.requested`.
- **`PrivateChefPage`** — `ChefCheckout` became `ChefSummary`; the dietary form
  stays local and is handed up as structured data on commit, landing in
  `serviceForms["private-chef"]` instead of being flattened into zero-price lines.
  `changeDishQty` no longer does double duty: desserts/bakery are priced quantities,
  and the copy it used to write into `dishes` was never read back. Guest counts go in
  `options.guests`, never concatenated into the title.
  Dish picks stay in the guest's own language — they are prose for the chef, not ids.

Known remaining inconsistency: `PrivateChefPage` still has 5 hand-rolled steppers
and 2 one-off date inputs rather than `QtyStepper` / `DateField`. The other three
surfaces are fully migrated. Left alone because it is a purely visual change that
could not be verified in a browser this session.

Verified: `tsc --noEmit` and the production build clean, all 11 routes generated;
utility-conflict scan clean; each of the three pages renders exactly one "Add to
cart" and no longer renders the old "Submit order" form, while `/fishing-tours/`
still renders it; 32 chef skus and all spa skus unique. Click-through still not
machine-verified.

### 2026-10-01 — preference forms made visible, and a round-trip bug fixed

Prompted by the product owner asking whether the spa's allergies field was actually
being saved. It was — but there was no way to see it, and checking turned up a real
data-loss bug next to it.

**Preferences are now shown, not just acknowledged.** The drawer used to render a
bare "Preferences saved" chip. `src/lib/serviceForm.js` (`describeServiceForm`) turns
a `serviceForms[serviceId]` blob into ordered label/value rows, rendered in a
collapsed `<details>` in the drawer and expanded on `/checkout/`. The formatter is
shape-driven rather than key-driven, so it handles all three services without
special-casing: strings pass through, arrays join, `{option: count}` becomes
"Vegetarian (2)", and `{meal: [dishes]}` becomes "Breakfast: A, B". `produce` is
shown as a count — it is a list of 40+ slugs, which would be noise. Labels live in
`cart.formLabels.*` in both locales.

**Bug found and fixed: returning to a service page wiped the previous commit.** None
of the three in-house pages seeded their draft from the cart, so the drawer's "Edit"
link landed the guest on a blank page. Because every commit calls `clearService()`
first, selecting one new item there and pressing "Add to cart" silently dropped the
lines *and* the preferences already committed — the guest thinks they are adding a
third massage and ends up with only the new one.

Fixed with `useSeedDraftFromCart` in `src/hooks/useDraft.js` plus per-page restore:

- **Spa** — a `sku -> draft key` map, the exact inverse of `buildLines()`. Verified
  that every sku the commit can produce resolves back to the right draft key, with
  full coverage and no mismatches.
- **Full Fridge** — almost everything comes back from `serviceForms` (counts, produce
  ids, every questionnaire answer); only beverage quantities are read off the lines.
- **Chef** — each committed line is matched back to the control that made it; guest
  counts are recovered by parsing `options.guests` ("6 guests" -> 6).

All three guard on `hydrated` with a ref so they fire once and cannot overwrite edits
in progress — the same pattern as the home-page cards.

Also confirmed while testing: `serviceForms` survive navigation and rehydration, and
the `clearService`-before-`setServiceForm` ordering means a cleared allergies field
does not leave a stale value behind (a previously typed allergy really does
disappear if the guest empties the field and re-commits).

Noted: `FullFridgePage`'s `form.dietaryPreferences` is dead state — declared and read
in the `answered` derivation but never bound to any input. It is deliberately absent
from the committed payload.
