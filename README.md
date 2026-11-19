# Infinite Engineering Service and Technology Pvt. Ltd. website

Marketing site for a laser scanning → CAD/BIM → GIS engineering company.
Design: "Survey Noir". Dark by default (void `#0A0E0D`) with paper bands
(`data-theme="paper"`) for Proof and FAQ. Stage colours are data only:
red = scan `#FF5A36`, cyan = model `#3ECFD2`, yellow = map/gas `#F4C430`
(also the CTA). Frosted, softly rounded glass panels sit over the 3D film
(solid tint on phones). Fonts: Space Grotesk, Inter, JetBrains Mono (data only).
Tokens live in `app/globals.css`; shadcn/ui names are aliased to them.

The homepage is a scroll-driven 3D film (`components/three/film/`): the
simulated laser scan of a gas station is classified, becomes a Revit-style
model, flattens to a plan, and its ground points travel onto the city gas
network, landing on a georeferenced GIS render. Native scroll, no scroll
hijacking; the point cloud is generated in a Web Worker; phones without the
power, reduced-motion users and browsers without JS get poster frames with a
laser wipe and real HTML text for every chapter.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Edit content (no design work needed)

| What | Where |
|---|---|
| Company name, phone, WhatsApp, email, address, CIN, GSTIN | `config/site.ts` |
| Promises (reply time, NDA), CTA wording, free-pilot caps, data handling, pricing models, time zones | `config/site.ts` |
| Services (6) | `content/services.ts` |
| Case studies | `content/projects.ts` |
| Industries, testimonials, FAQ, process steps | `content/misc.ts` |
| Stock photo credits | `content/photos.ts` |

Sample content is marked `PLACEHOLDER` / `placeholder: true` and shows a red
badge in development. List everything still to replace:

```bash
npm run check:placeholders            # report
npm run check:placeholders -- --strict  # fail (for CI) if any remain
```

## Quote form email

Copy `.env.example` to `.env.local` and set **one** provider:

- `RESEND_API_KEY` (+ `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`), recommended, or
- `WEB3FORMS_KEY`

Without a key, development logs requests to the terminal, and production
shows visitors a "please WhatsApp / call us" message, so leads are never
silently lost. Spam protection: honeypot field, 3-second time trap, and a
limit of 5 requests per IP per hour.

## Images

| Images | Where they come from | Regenerate |
|---|---|---|
| `public/photos/*.webp` (Unsplash stock: scanner, surveyor, pipeline, plant, engineers, cities) | `scripts/photo-src/*.jpg`, credited in `content/photos.ts` and the footer. Atmosphere only, never captioned as client work | `npm run photos` |
| `public/renders/*.webp` (station scan, BIM models, façade, GIS maps) | Our own 3D scenes (`components/three/scenes.ts`) and GIS layers on the real OpenStreetMap basemap, rendered in the dev-only studio at `/studio?scene=…` | Start `npx next dev -p 3200`, then `npm run capture` (or `node scripts/capture-studio.mjs <scene>`) |
| `public/art/plan-*.svg` (field sketch and CAD plan) | `scripts/build-art.mjs` | `npm run art` |
| `public/geo/*.geojson` (demo gas network) | `scripts/build-geo.mjs` (turf); synthetic, labelled as such on the map | `npm run geo` |

`public/vendor/maplibre-gl-worker.mjs` is copied automatically before `dev` and `build`.

The hero render, the "Scan → BIM" comparison and the services bento all show the same
station, so the scan and the model always match. Replace any image with a real,
NDA-cleared project screenshot by changing the mapping in `components/sections/project-art.tsx`
or the `media` field in `content/services.ts`.

## Content that is deliberately not published

- **Testimonials** marked `placeholder: true` never render. The section appears once real quotes are added to `content/misc.ts`.
- **Projects** are labelled "Representative project" and worded as typical scopes, not past jobs. Replace them with real case studies in `content/projects.ts`.
- **No track-record numbers, client logos or certifications** are shown until real ones exist. The pilot caps and data-handling commitments in `config/site.ts` are marked PLACEHOLDER for the owner to confirm.

## Motion

- Scroll reveals: add `data-reveal` (a one-shot 500 ms blur-fade); `RevealObserver` plays each once. Stagger with `style={stagger(n)}` from `components/brand/primitives`.
- Page transitions: every page wraps its content in `<PageTransition>` (React `<ViewTransition>`); project images morph between card and case study.
- Everything is disabled under `prefers-reduced-motion`.

## Deploy (Vercel recommended)

1. Push to GitHub, then import the repo at vercel.com.
2. Add the email env vars, and choose the Mumbai region (`bom1`) for the functions.
3. Point your domain, and update `site.url` in `config/site.ts`.
4. Vercel Analytics and Speed Insights work automatically once deployed.
   Tracked events: `whatsapp_click`, `call_click`, `quote_submit`, `quote_cta_click`, `map_toggle`.

## Components

- `components/ui/*`: shadcn/ui (new-york-v4) button, navigation-menu, sheet, accordion, tabs, badge, card, input, textarea, label; Magic UI (also listed on 21st.dev) marquee, bento-grid, grid-pattern. Fetched from the authors' free registries, imports adjusted, no `shadcn init`.
- Header based on shadcnblocks Navbar 1, footer on Footer 7, FAQ layout on FAQ 5.
- 21st.dev-only components (Tailark hero, how-it-works, contact card) need an API key; equivalents are hand-built in the same style. Swap them in later if you get a key.
- The 3D code (`components/three/*`) is parked: only the dev studio uses it.

## Stack

Next.js 16 (App Router, Cache Components, Turbopack) · React 19 · Tailwind CSS v4 ·
shadcn/ui + Radix · Magic UI · MapLibre + react-map-gl
(OpenFreeMap tiles, no API key) · react-hook-form + zod (two-step form) · Resend · tw-animate-css.

Performance notes: the homepage ships ~187 KB of its own JS. The map (~300 KB gz)
loads only when its tab is opened; the homepage form loads on approach.
Reveals only hide content once JavaScript is running, so nothing is ever hidden without it.
