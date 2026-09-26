<script setup>
import { muted, toggleMuted } from "../utils/music.js";
</script>

<template>
  <button class="mute" :aria-label="muted ? 'Turn sound on' : 'Turn sound off'" @click="toggleMuted">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display: block">
      <path d="M1 6h3l4-3v10l-4-3H1z" />
      <template v-if="!muted">
        <path d="M10 5.5c1 .7 1.5 1.6 1.5 2.5S11 9.800 10 10.500" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M11.500 3.500C13.200 4.600 14 6.200 14 8s-.8 3.400-2.500 4.500" fill="none" stroke="currentColor" stroke-width="1.6" />
      </template>
      <path v-else d="M10.500 5.500l4 5M14.500 5.500l-4 5" fill="none" stroke="currentColor" stroke-width="1.8" />
    </svg>
  </button>
</template>

<style scoped>
.mute {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 15;
  width: 34px;
  height: 34px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffc21a;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  color: #1c0c04;
  cursor: pointer;
  opacity: 0.85;
}
.mute:hover {
  opacity: 1;
}
</style>
