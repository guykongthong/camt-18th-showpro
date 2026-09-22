<script setup>
defineProps({
  dir: { type: String, default: "right" }, // "right" | "left"
});
</script>

<template>
  <svg v-if="dir === 'right'" width="13" height="15" viewBox="0 0 13 15" style="display:block">
    <path d="M2 1l9 6.5L2 14z" fill="currentColor" />
  </svg>
  <svg v-else width="13" height="15" viewBox="0 0 13 15" style="display:block">
    <path d="M11 1L2 7.5 11 14z" fill="currentColor" />
  </svg>
</template>
