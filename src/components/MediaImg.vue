<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: "" },
  fit: { type: String, default: "cover" },
  position: { type: String, default: "center" },
});

const failed = ref(false);
watch(() => props.src, () => (failed.value = false));
</script>

<template>
  <img
    v-if="src && !failed"
    class="media-img"
    :src="src"
    :alt="alt"
    :style="{ objectFit: fit, objectPosition: position }"
    loading="lazy"
    decoding="async"
    @error="failed = true"
  />
  <slot v-else name="fallback">
    <div class="media-fallback"></div>
  </slot>
</template>

<style scoped>
.media-img {
  display: block;
  width: 100%;
  height: 100%;
}
.media-fallback {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(135deg, #2a1a0a 0 8px, #1c1108 8px 16px);
}
</style>
