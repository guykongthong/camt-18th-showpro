<script setup>
defineProps({
  dir: { type: String, default: "left" }, // "left" | "right"
});
</script>

<template>
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" style="display:block">
    <path
      v-if="dir === 'left'"
      d="M9 1.5L3 7l6 5.5"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="square"
    />
    <path
      v-else
      d="M2 1.5L8 7l-6 5.5"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="square"
    />
  </svg>
</template>
