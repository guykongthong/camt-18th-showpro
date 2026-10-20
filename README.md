# CAMT ShowPro

The showcase website for the 18th CAMT ShowPro, the Software Engineering capstone exhibition at the College of Arts, Media and Technology, Chiang Mai University. It is dressed up as a retro arcade: visitors power on a CRT cabinet, pick a project like they would pick a game, and open its page.

**Live site:** https://camt-18th-showpro.vercel.app

## What it does

- **Title screen.** A CRT power-on animation with startup sound and music, then a "press start" into the project roster.
- **Project select.** A roster of 27 capstone projects across seven categories (Business, Medical, Sports, Education, Finance, IoT, Social & Community). Each project has a page with its description, key features, tech stack, team, and booth.
- **Media viewer.** Screenshots sit inside browser or phone frames depending on the app, with a carousel and a lightbox. Demo videos play inline.
- **Event map.** The venue floor plan with a zone legend and the projects listed under each zone. Clicking a project jumps to it in the roster.
- **Audio.** Sound effects and music share one registry, so nothing plays twice, and a mute button controls everything.
- **Touch support.** On touch devices the first tap previews a project and the second tap locks it in, since hover does not exist there.

## Tech stack

- Vue 3 (Composition API, `<script setup>`) and Vue Router
- Vite
- Plain CSS for the arcade theme and animations
- Vercel for hosting
- Supabase Storage for demo videos (they are larger than the repo should carry)

## Project structure

```
src/
  pages/          TitleScreen, ProjectSelect, EventMap
  components/     DeviceFrame, ShotCarousel, Lightbox, MediaImg, MuteButton, icons
  data/           projects.js (project content and category colors)
  utils/          sfx.js and music.js (shared audio registry)
public/
  projects/<slug>/   logo, poster, member photos, screenshots (webp)
  sfx/ music/        audio files
  floorplan/         venue maps
```

## Running locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Adding or editing a project

Content lives in `src/data/projects.js` as a flat array. Any media field that is `null` or empty is simply not shown, so a missing asset never breaks a page.

- Images go in `public/projects/<slug>/` as `logo.webp`, `poster.webp`, `member1.webp`, `member2.webp`, and `shot-01.webp`, `shot-02.webp`, and so on.
- Whether a screenshot goes in `media.shots.desktop` or `media.shots.mobile` decides if it is shown in a browser frame or a phone frame. Array order is carousel order.
- Demo videos are MP4 files in a public Supabase Storage bucket, and `media.video` holds the full URL. The free plan caps each file at 50 MB.

## Deployment

The site deploys to Vercel. `vercel.json` rewrites every route to `index.html` so `/projects` and `/map` load on a refresh or a direct link, and serves project images and audio with a one-year immutable cache so repeat visits load instantly.

## Credits

Built by Virawit Kongthong for the 18th CAMT ShowPro. The project descriptions, screenshots, and videos belong to the student teams who made them.
