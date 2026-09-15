# SE CAMT ShowPro Arcade — context handoff

## Reference files
- `reference/showpro-arcade.dc.html` + `reference/support.js` — a working design-canvas
  prototype (retro arcade theme) of the capstone showcase site, with real interaction
  logic already built (TV power-on state machine, zone filtering, modal open/close).
- `reference/arcade-asset-sketches.html` — rough draft sketches (not final art) for
  five assets the prototype currently fakes with CSS: CRT static noise, arcade carpet
  background, an illustrated cabinet chassis, 4 pixel-art zone badges, and a pixel
  coin icon. Also published at https://claude.ai/artifact/E5JPfbb6bLjQD2psvqTWZV

## Goal
Rebuild the prototype as a real Vue 3 + Vite app.

## Decided stack/architecture
- Vue 3 + Vite, Composition API / `<script setup>`
- vue-router with routes: `/` (TV intro), `/hall` (arcade floor, `?zone=` query param
  for filter), `/project/:slug` (detail, rendered as overlay over `/hall`)
- Pinia store for the one cross-component state: projects list + selected zone
  (everything else stays local component state)
- GSAP for animation (TV power-on timeline: dot → line → static → title)
- Data: `src/data/projects.js`, flat array — **38 mock projects** (real event is
  "SE CAMT ShowPro", ~38 capstone projects across zones AI/WEB/MOBILE/IOT); mock
  content for now, real content dropped in later without code changes
- Project photos: `<img>` with graceful fallback to the existing CSS gradient-stripe
  placeholder when no photo is set
- Deploy target: **Vercel**

## Components
`TvIntro.vue`, `ArcadeFloor.vue`, `ArcadeCabinet.vue`, `ProjectModal.vue`

## Key interaction (latest decision, not yet in the prototype)
Clicking "INSERT COIN" on a cabinet should **zoom into that cabinet's screen** and
transition into the project detail — not a plain modal fade.

Plan: GSAP Flip plugin — capture the clicked cabinet's screen-bezel rect
(`Flip.getState`), navigate to `/project/:slug`, animate the detail panel scaling up
from that rect to fill/dominate the viewport (`Flip.from`), cross-fading from a
"blank screen / static" look into the actual content (echoing the TV intro's own
visual language). Reverse on close (`Flip.to`) back down to the originating cabinet.
The rect needs to be stashed in the Pinia store before navigating (not serializable
as a route param).

Direct-link visits to `/project/:slug` (no originating cabinet on screen) skip the
Flip-from-cabinet step and just scale up from a small centered rect instead — same
static→content cross-fade at the end for consistency.

## Status
Still in brainstorming (superpowers:brainstorming skill, architectural path). Design
has not yet been written up as a formal spec doc — next step is
`docs/superpowers/specs/YYYY-MM-DD-showpro-arcade-design.md`, then the
`writing-plans` skill for the implementation plan. **No app code has been written
yet** — only the reference prototype and asset sketches above.
