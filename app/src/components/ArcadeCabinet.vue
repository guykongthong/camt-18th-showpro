<script setup>
import { ref } from 'vue'

defineProps({
  project: { type: Object, required: true },
})
const emit = defineEmits(['open'])
const screen = ref(null)

function handleOpen() {
  emit('open', screen.value)
}
</script>

<template>
  <article
    class="cabinet"
    style="
      background: linear-gradient(#1a2138, #141a2c);
      border: 1px solid rgba(244, 244, 240, 0.08);
      border-radius: 14px 14px 8px 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition:
        transform 0.22s ease,
        border-color 0.22s ease,
        box-shadow 0.22s ease;
    "
  >
    <div
      style="
        border-radius: 8px;
        padding: 11px 10px;
        text-align: center;
        background: linear-gradient(rgba(255, 210, 63, 0.16), rgba(255, 210, 63, 0.04));
        border: 1px solid rgba(255, 210, 63, 0.3);
      "
    >
      <div
        style="
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          line-height: 1.7;
          color: #ffd23f;
          text-shadow: 0 0 12px rgba(255, 210, 63, 0.7);
        "
      >
        {{ project.name }}
      </div>
    </div>

    <div
      ref="screen"
      class="cabinet-screen"
      :style="{
        position: 'relative',
        aspectRatio: '4 / 3',
        borderRadius: '6px',
        overflow: 'hidden',
        background: project.photo ? undefined : project.photoFallback,
        boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.5)',
      }"
    >
      <img
        v-if="project.photo"
        :src="project.photo"
        :alt="project.name"
        style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover"
      />
      <div
        v-else
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 10px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 9.5px;
          letter-spacing: 0.08em;
          color: rgba(244, 244, 240, 0.62);
        "
      >
        [ project photo ]
      </div>
      <div
        style="
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(rgba(0, 0, 0, 0.3) 0 1px, rgba(0, 0, 0, 0) 1px 3px);
        "
      ></div>
      <div style="position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 44px 14px rgba(5, 7, 12, 0.8)"></div>
    </div>

    <div style="display: flex; align-items: center; gap: 8px">
      <span
        :style="{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: project.zoneColor,
          boxShadow: '0 0 10px ' + project.zoneColor,
        }"
      ></span>
      <span :style="{ fontFamily: '\'Press Start 2P\', monospace', fontSize: '7.5px', color: project.zoneColor }">{{
        project.zoneLabel
      }}</span>
    </div>

    <p style="margin: 0; font-size: 14.5px; line-height: 1.5; color: #f4f4f0; text-wrap: pretty">{{ project.tagline }}</p>

    <div style="font-size: 12px; line-height: 1.7; color: rgba(244, 244, 240, 0.5)">
      <div>{{ project.teamLine }}</div>
      <div>{{ project.advisorLine }}</div>
    </div>

    <button
      class="insert-coin"
      style="
        margin-top: auto;
        font-family: 'Press Start 2P', monospace;
        font-size: 9px;
        padding: 13px 12px;
        width: 100%;
        color: #0a0e17;
        background: #00e5ff;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        transition:
          box-shadow 0.2s ease,
          background 0.2s ease;
      "
      @click="handleOpen"
    >
      INSERT COIN
    </button>
  </article>
</template>

<style scoped>
.cabinet:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 210, 63, 0.35);
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.55);
}
.insert-coin:hover {
  background: #ff2e6c;
  box-shadow: 0 0 26px rgba(255, 46, 108, 0.6);
}
</style>
