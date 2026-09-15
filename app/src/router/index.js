import { createRouter, createWebHistory } from 'vue-router'
import TvIntro from '../components/TvIntro.vue'
import ArcadeFloor from '../components/ArcadeFloor.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'tv', component: TvIntro },
    { path: '/hall', name: 'hall', component: ArcadeFloor },
    // Detail renders as an overlay over the hall — same component handles both,
    // reading :slug to decide whether ProjectModal is open.
    { path: '/project/:slug', name: 'project', component: ArcadeFloor, props: true },
  ],
})
