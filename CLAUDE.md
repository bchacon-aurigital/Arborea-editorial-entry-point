# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server
npm run build    # static export -> out/
npm run lint     # next lint
npx tsc --noEmit # typecheck (passes clean; keep it that way)
```

There is no test suite.

## What this is

Guest-facing "welcome" microsite for Arbórea Experiences, a set of rental houses in
the Osa Peninsula, Costa Rica. Guests browse in-house services (private chef, full
fridge, spa, fishing), third-party tours, and vehicle rentals, and submit a single
concierge order. **No payment is ever taken** — an order is a request that
operations confirms by WhatsApp/email.

Next.js 16 App Router, React 19, Tailwind 3, JS/JSX for everything except
`layout.tsx`, `page.tsx`, `JsonLd.tsx` and `ui/select.tsx`.

## Hard constraints

**`output: "export"` in `next.config.ts` — this is a static site.** No API routes,
no server actions, no middleware, no `revalidate`, no runtime env vars. Every page
is prerendered HTML. Anything that needs a backend must be a `fetch` from the
browser to an external endpoint. `NEXT_PUBLIC_*` values are inlined at build time,
so they must be set in the build environment, not just locally.

`trailingSlash: true` — routes resolve as `/checkout/`, not `/checkout`.

Because HTML is prerendered, **never read `sessionStorage`/`localStorage` or
`window` during render** — hydrate in `useEffect` or the prerendered markup and the
first client render disagree.

## Architecture

### i18n is the content database, not just copy

`src/i18n/en.json` and `es.json` (~2180 lines each) hold the site's structured
business data, not only translations: prices (`priceValue`, `basePrice`,
`extraPersonPrice`, `priceValues[]`), menu items, package contents, guest-count
tiers, and third-party operator details.

`t("path.to.key")` in [src/app/context/I18nContext.jsx](src/app/context/I18nContext.jsx)
walks the JSON by dot notation and returns **whatever node it lands on** — a string,
an object, or an array. This is why callers are full of `Array.isArray(x) && x.map(...)`
guards; keep them, the JSON is the schema.

Consequences that bite:

- **Both locale files must stay structurally identical.** Array lengths and numeric
  values are load-bearing. Adding an item to `en.json` only will silently break the
  Spanish UI. The 74 numeric price/quantity keys are currently in sync — verify
  before and after touching either file.
- Prices reach the cart through `t()`, so they are read from the *active locale*.
  Extracting prices to a single non-i18n source is a known desirable follow-up
  (see the handoff doc), deliberately not done yet.
- `tours.activities` also carries **internal-only** fields (`commission`,
  `contactName`, `whatsapp`). These ship in the client bundle. Never copy an
  activity object wholesale into a cart line or an outbound payload — whitelist
  fields explicitly.

### Cart

> **Under construction.** The shared primitives and the service registry are in
> place; the context, drawer and `/checkout/` are not built yet. See the status
> table in [docs/ORDERS-BACKEND.md](docs/ORDERS-BACKEND.md) for what actually
> exists right now, and don't assume a section below is already wired.

Single session-scoped cart in `src/app/context/CartContext.jsx`, mounted in
`layout.tsx` inside `I18nProvider`. Every service page adds lines to it; the drawer
and `/checkout/` are the only places an order is reviewed or submitted.

- One line shape for all services: `{ lineId, service, sku, title, qty, unitPrice, date, options }`.
- `lineTotal` is **derived** (`qty * unitPrice`) in the context. Do not bake
  quantity into a price or into a display label — earlier code did both and it was
  the source of persistent desync bugs.
- `sku` is a stable slug derived from the **English** title, so an id never changes
  when the user switches language.
- Per-service free-form preference blobs (chef dietary form, fridge questionnaire,
  spa allergies) live in `serviceForms`, keyed by service id — not as fake
  zero-price cart lines.
- Persistence is `sessionStorage` only, by decision. It is not meant to survive a
  closed browser.

`src/data/services.js` is the registry of the six services (`id`, label, color,
route, icon). The drawer and checkout group lines by it; it is the single source of
per-service identity.

### Routing

`/` composes the home sections. `/private-chef/`, `/full-fridge/`,
`/wellness-spa/`, `/fishing-tours/` are the service pages — each is a thin
`app/*/page.jsx` wrapper around a big component in `src/components/sections/`.
`/[slug]/` renders a property page for each key in
[src/data/properties.js](src/data/properties.js), with copy under
`properties.<i18nKey>` in the locale files.

### Styling conventions

The brand palette is **hardcoded hex in JSX**, not Tailwind theme tokens. The
shadcn/HSL tokens in `tailwind.config.ts` and `globals.css` exist but are only used
by `ui/select.tsx`; don't migrate the pages to them incidentally.

Core palette: `#213B2F` forest green, `#D8DDB8` pale sage, `#EDE5D8` bone,
`#222E2C` near-black, `#E0D4C4` sand. Per-service accents: spa `#8B5A3C`, fridge
`#5C3324`, chef `#213B2F`, gold detail `#C9974F`.

Display serif is GT Alpina, applied as `style={{ fontFamily: "var(--font-alpina)" }}`
(declared in `globals.css`, *not* in the Tailwind `fontFamily.display` slot, which
points at an unused Playfair variable). Body font is Inter via `font-sans`.

Icons are `react-icons/tb` (Tabler) throughout.

Shared primitives live in `src/components/ui/`: `QtyStepper`, `DateField`, `Chip`,
`SelectableCard`. Use them — these replaced 13 hand-rolled quantity steppers and 6
one-off date inputs, and re-introducing a bespoke one re-opens that inconsistency.

## Orders backend

The order submission path is **built but not connected**. `src/lib/orderApi.js`
runs against a mock. Read
[docs/ORDERS-BACKEND.md](docs/ORDERS-BACKEND.md) before touching anything in the
order/checkout path — it holds the payload contract, the integration steps, and an
explicit list of what not to change.
