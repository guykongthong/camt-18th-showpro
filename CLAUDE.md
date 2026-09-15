# SE CAMT ShowPro Arcade

Capstone showcase site for SE CAMT's 18th-year ShowPro event (~38 senior capstone
projects across zones AI / WEB / MOBILE / IOT), themed as a retro arcade hall.

## Status

App scaffold in `app/` is a real Vue 3 + Vite build of the reference prototype in
`reference/`. Content is mock data (`app/src/data/projects.js`, 38 fake projects) —
real project data drops in later without code changes.

The **Flip zoom-into-cabinet transition** (see below) is designed but not yet
implemented — that's the next substantial piece of work.

## Reference material — do not edit, read for behavior/visual spec only

- `reference/showpro-arcade.dc.html` + `reference/support.js` — a design-canvas
  prototype with the real interaction logic (TV power-on state machine, zone
  filtering, modal open/close) and all real CSS values (colors, gradients, fonts,
  shadows) already tuned. `support.js` is a generated runtime bundle, not
  hand-written — never edit it or model new code on its patterns. Copy pixel values
  and state-transition logic out of the `.dc.html`, not architecture.
- `reference/arcade-asset-sketches.html` — rough (non-final) sketches for five assets
  the prototype currently fakes with CSS gradients: CRT static noise, arcade carpet
  background, illustrated cabinet chassis, 4 pixel-art zone badges, pixel coin icon.
  Also at https://claude.ai/artifact/E5JPfbb6bLjQD2psvqTWZV
- `docs/handoff-notes.md` — original brainstorming handoff this project started from.

## Stack

- Vue 3 + Vite, Composition API / `<script setup>` only (no Options API)
- vue-router: `/` (TV intro), `/hall` (arcade floor, `?zone=` query param for
  filter), `/project/:slug` (detail, rendered as an overlay over `/hall`)
- Pinia store for the one piece of cross-component state: projects list + selected
  zone. Everything else (TV power-on phase, modal-open animation state, etc.) stays
  local component state — don't reach for Pinia by default.
- GSAP for animation: the TV power-on timeline (dot → line → static → title) and the
  cabinet-to-detail Flip transition (below)
- Deploy target: Vercel

## Visual language (pull exact values from `reference/showpro-arcade.dc.html`)

- Palette: near-black background `#0a0e17`, panel `#141a2c`/`#1a2138`, cyan
  `#00e5ff`, magenta `#ff2e6c`, yellow `#ffd23f`, off-white text `#f4f4f0`
- Fonts: `Press Start 2P` for arcade/marquee text, `Space Grotesk` for body copy
- Zone colors: ALL `#f4f4f0`, AI `#ff2e6c`, WEB `#00e5ff`, MOBILE `#ffd23f`, IOT
  `oklch(0.82 0.16 155)`
- Project photos: real `<img>` when a project has one, else fall back to the
  existing diagonal-stripe CSS gradient (`stripes()` helper in the prototype, keyed
  by zone tint)

## Components

`TvIntro.vue`, `ArcadeFloor.vue`, `ArcadeCabinet.vue`, `ProjectModal.vue` — one file
per concept, no further splitting unless a component genuinely grows unwieldy.

## The cabinet → detail transition (key interaction, not yet built)

Clicking "INSERT COIN" must **zoom into that cabinet's screen** and transition into
the project detail — not a plain modal fade. Plan (per `docs/handoff-notes.md`):

1. GSAP Flip plugin captures the clicked cabinet's screen-bezel rect
   (`Flip.getState`)
2. Navigate to `/project/:slug`
3. Animate the detail panel scaling up from that rect to fill/dominate the viewport
   (`Flip.from`), cross-fading from a "blank screen / static" look into real content
   — echoing the TV intro's own dot→line→static→title visual language
4. Reverse on close (`Flip.to`) back down to the originating cabinet
5. The originating rect must be stashed in the Pinia store before navigating (GSAP
   Flip state isn't serializable as a route param)
6. Direct-link visits to `/project/:slug` (no cabinet on screen to Flip from) skip
   step 1 and instead scale up from a small centered rect — same static→content
   cross-fade at the end, for visual consistency with the cabinet-originated path

## Development workflow

- Branch model: `main` (production, deploys to Vercel prod) ← `dev` (integration
  branch) ← `feature/*` branches. Do new feature work on a `feature/*` branch cut
  from `dev`, open a PR back into `dev`, and periodically PR `dev` into `main` to
  ship.
- CI (`.github/workflows/ci.yml`) runs on every push and PR targeting `main` or
  `dev`: lint (`npm run lint` — ESLint + Prettier via `eslint-plugin-vue`),
  typecheck (`npm run typecheck` — `vue-tsc` checking the `.js`/`.vue` sources
  against `tsconfig.json`, no TS conversion needed), then build. All three run
  `cd app` first (see `working-directory: app` in the workflow).
- Run `npm run lint -- --fix`, `npm run typecheck`, and `npm run build` locally in
  `app/` before opening a PR — CI will fail the same way, just slower to find out.
- Deploys: Vercel is expected to be connected to this GitHub repo (root directory
  `app/`) for automatic preview deploys on PRs and production deploys on `main`.
  That connection is set up in the Vercel dashboard, not in this repo.

## Working conventions

- Mock data lives only in `src/data/projects.js` as a flat array — don't invent a
  second data source or an API layer; real content replaces this file's contents
  later with the same shape.
- Don't hand-roll new CSS values for colors/fonts/shadows already established in the
  reference prototype — copy them exactly so the rebuild matches the approved design.
