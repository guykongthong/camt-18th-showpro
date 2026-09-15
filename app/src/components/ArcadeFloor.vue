<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArcadeStore } from '../stores/arcade'
import { ZONES } from '../data/zones'
import ArcadeCabinet from './ArcadeCabinet.vue'
import ProjectModal from './ProjectModal.vue'

const route = useRoute()
const router = useRouter()
const store = useArcadeStore()

const activeProject = computed(() => (route.params.slug ? store.projectBySlug(route.params.slug) : null))

// ?zone= query param drives the store's zone filter, and vice versa.
watch(
  () => route.query.zone,
  (z) => store.setZone(typeof z === 'string' ? z : 'ALL'),
  { immediate: true },
)

function selectZone(key) {
  router.push({ path: '/hall', query: key === 'ALL' ? {} : { zone: key } })
}

function openProject(slug, screenEl) {
  if (screenEl) store.setOriginRect(screenEl.getBoundingClientRect())
  router.push(`/project/${slug}`)
}

function closeProject() {
  store.clearOriginRect()
  router.push({ path: '/hall', query: route.query })
}

function backToTv() {
  router.push('/')
}
</script>

<template>
  <div
    style="
      min-height: 100vh;
      padding: 34px clamp(20px, 4vw, 56px) 80px;
      background: radial-gradient(90% 60% at 50% -10%, #141b2e 0%, #0a0e17 60%);
    "
  >
    <header
      style="
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        align-items: flex-end;
        justify-content: space-between;
        max-width: 1440px;
        margin: 0 auto 26px;
      "
    >
      <div>
        <div
          style="
            font-family: 'Press Start 2P', monospace;
            font-size: clamp(14px, 2vw, 20px);
            color: #ffd23f;
            text-shadow: 0 0 16px rgba(255, 210, 63, 0.6);
          "
        >
          ARCADE HALL
        </div>
        <div style="margin-top: 12px; font-size: 14px; color: rgba(244, 244, 240, 0.62); max-width: 48ch">
          Thirty-eight senior capstone projects from SE CAMT. Pick a cabinet, insert a coin, meet the team.
        </div>
      </div>
      <button
        class="tv-btn"
        style="
          font-family: 'Press Start 2P', monospace;
          font-size: 9px;
          padding: 11px 14px;
          color: #00e5ff;
          background: transparent;
          border: 1px solid rgba(0, 229, 255, 0.45);
          border-radius: 4px;
          cursor: pointer;
          transition:
            background 0.2s ease,
            box-shadow 0.2s ease;
        "
        @click="backToTv"
      >
        &lt; TV INTRO
      </button>
    </header>

    <nav
      style="
        max-width: 1440px;
        margin: 0 auto 34px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding-bottom: 22px;
        border-bottom: 1px solid rgba(244, 244, 240, 0.08);
      "
    >
      <button
        v-for="z in ZONES"
        :key="z.key"
        class="zone-btn"
        :style="{
          fontFamily: '\'Press Start 2P\', monospace',
          fontSize: '9px',
          lineHeight: '1.4',
          padding: '12px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          background: store.zone === z.key ? z.color : 'transparent',
          color: store.zone === z.key ? '#0a0e17' : z.color,
          border: '1px solid ' + z.color,
          boxShadow: store.zone === z.key ? '0 0 24px ' + z.color : 'none',
          transition: 'box-shadow .2s ease,background .2s ease',
        }"
        @click="selectZone(z.key)"
      >
        {{ z.label }}
      </button>
    </nav>

    <div
      style="
        max-width: 1440px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
      "
    >
      <ArcadeCabinet
        v-for="p in store.visibleProjects"
        :key="p.id"
        :project="p"
        @open="(screenEl) => openProject(p.slug, screenEl)"
      />
    </div>

    <ProjectModal v-if="activeProject" :project="activeProject" @close="closeProject" />
  </div>
</template>

<style scoped>
.tv-btn:hover {
  background: rgba(0, 229, 255, 0.1);
  box-shadow: 0 0 22px rgba(0, 229, 255, 0.3);
}
.zone-btn:hover {
  background: rgba(244, 244, 240, 0.06);
}
</style>
