<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import IconChevron from "./IconChevron.vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  start: { type: Number, default: 0 },
  open: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);

const index = ref(0);
const zoomed = ref(false);
const stage = ref(null);

function onKey(e) {
  if (e.key === "Escape") emit("close");
  else if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
  else return;
  e.stopPropagation();
  e.preventDefault();
}

function step(d) {
  const n = index.value + d;
  if (n < 0 || n >= props.items.length) return;
  index.value = n;
  zoomed.value = false;
}

function toggleZoom() {
  zoomed.value = !zoomed.value;
  nextTick(() => {
    const el = stage.value;
    if (el && zoomed.value) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = 0;
    }
  });
}

watch(
  () => props.open,
  (o) => {
    if (o) {
      index.value = Math.min(props.items.length - 1, Math.max(0, props.start));
      zoomed.value = false;
      window.addEventListener("keydown", onKey, true);
    } else {
      window.removeEventListener("keydown", onKey, true);
    }
  }
);
onBeforeUnmount(() => window.removeEventListener("keydown", onKey, true));
</script>

<template>
  <Teleport to="body">
    <div v-if="open && items.length" class="lb" role="dialog" aria-modal="true" @click.self="emit('close')">
      <div class="lb-top">
        <div v-if="items.length > 1" class="lb-count">{{ index + 1 }} / {{ items.length }}</div>
        <button class="lb-close" aria-label="Close" @click="emit('close')">CLOSE</button>
      </div>
      <div ref="stage" class="lb-stage" :class="{ zoomed }" @click.self="emit('close')">
        <img
          :key="items[index]"
          :src="items[index]"
          alt=""
          :class="{ zoomed }"
          :title="zoomed ? 'Click to zoom out' : 'Click to zoom in'"
          @click="toggleZoom"
        />
      </div>
      <button v-if="index > 0" class="lb-nav lb-prev" aria-label="Previous" @click="step(-1)">
        <IconChevron dir="left" />
      </button>
      <button v-if="index < items.length - 1" class="lb-nav lb-next" aria-label="Next" @click="step(1)">
        <IconChevron dir="right" />
      </button>
      <div class="lb-hint">{{ zoomed ? "CLICK TO ZOOM OUT" : "CLICK IMAGE TO ZOOM" }}</div>
    </div>
  </Teleport>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(3, 2, 1, 0.94);
  display: flex;
  flex-direction: column;
}
.lb-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  min-height: 24px;
}
.lb-count {
  font-size: 10px;
  letter-spacing: 2px;
  color: #8fb6d6;
}
.lb-close {
  margin-left: auto;
  padding: 10px 14px;
  border: 2px solid #ffc21a;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  color: #1c0c04;
  font: inherit;
  font-size: 10px;
  letter-spacing: 2px;
  cursor: pointer;
}
.lb-stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px 14px;
  overflow: hidden;
}
.lb-stage.zoomed {
  display: block;
  overflow: auto;
  align-items: flex-start;
}
.lb-stage img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
  background: #fff;
}
.lb-stage img.zoomed {
  max-width: none;
  max-height: none;
  width: 190%;
  margin: 0 auto;
  cursor: zoom-out;
}
.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 52px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffc21a;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  color: #1c0c04;
  cursor: pointer;
}
.lb-prev {
  left: 8px;
}
.lb-next {
  right: 8px;
}
.lb-hint {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 7.5px;
  letter-spacing: 2px;
  color: #6f8ba3;
  pointer-events: none;
}
</style>
