<script setup>
import MediaImg from "./MediaImg.vue";

defineProps({
  type: { type: String, default: "desktop" }, // "phone" | "desktop"
  src: { type: String, default: null },
  alt: { type: String, default: "" },
  label: { type: String, default: "SCREENSHOT" },
  ratio: { type: String, default: "16 / 10" }, // desktop screen shape, from the group's images
});
</script>

<template>
  <div class="frame" :class="type">
    <div v-if="type === 'desktop'" class="bar">
      <span></span><span></span><span></span>
    </div>
    <div class="screen" :style="type === 'desktop' ? { aspectRatio: ratio } : null">
      <MediaImg :src="src" :alt="alt" :fit="type === 'desktop' ? 'contain' : 'cover'" position="top">
        <template #fallback>
          <div class="ph mono">
            <div>{{ label }}</div>
            <div class="soon">coming soon</div>
          </div>
        </template>
      </MediaImg>
    </div>
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  width: 100%;
  background: #0d0805;
}
.desktop {
  border: 2px solid #6a4418;
}
.bar {
  height: 18px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 7px;
  background: #1a1006;
  border-bottom: 2px solid #6a4418;
}
.bar span {
  width: 6px;
  height: 6px;
  background: #ff9500;
}
.bar span:nth-child(2) {
  background: #ffc21a;
}
.bar span:nth-child(3) {
  background: #3f8fd0;
}
.desktop .screen {
  aspect-ratio: 16 / 10;
  background: #0d0805;
}
.phone {
  aspect-ratio: 9 / 19.5;
  border: 6px solid #1a1006;
  border-radius: 22px;
  outline: 2px solid #6a4418;
  overflow: hidden;
}
.phone .screen {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
}
.screen {
  overflow: hidden;
}
.ph {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  font-size: 10px;
  color: #b08a5a;
  background: repeating-linear-gradient(135deg, #2a1a0a 0 8px, #1c1108 8px 16px);
}
.soon {
  font-size: 9px;
  color: #8a6a4a;
}
</style>
