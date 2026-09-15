import { defineStore } from 'pinia'
import { PROJECTS } from '../data/projects'

export const useArcadeStore = defineStore('arcade', {
  state: () => ({
    projects: PROJECTS,
    zone: 'ALL',
    // Bezel rect of the cabinet the last "INSERT COIN" click originated from,
    // stashed here (not a route param) so ProjectModal's Flip-in animates from it.
    originRect: null,
  }),
  getters: {
    visibleProjects: (state) => (state.zone === 'ALL' ? state.projects : state.projects.filter((p) => p.zone === state.zone)),
    projectBySlug: (state) => (slug) => state.projects.find((p) => p.slug === slug) || null,
  },
  actions: {
    setZone(zone) {
      this.zone = zone
    },
    setOriginRect(rect) {
      this.originRect = rect
    },
    clearOriginRect() {
      this.originRect = null
    },
  },
})
