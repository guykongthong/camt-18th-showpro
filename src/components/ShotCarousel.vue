<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import DeviceFrame from "./DeviceFrame.vue";
import Lightbox from "./Lightbox.vue";

const props = defineProps({
  items: { type: Array, required: true }, // src strings, or null for placeholders
  type: { type: String, default: "desktop" },
  title: { type: String, default: "" },
});

const track = ref(null);
const active = ref(0);
const overflow = ref(false);
const pages = ref(1);
const ratio = ref("16 / 10");
const viewer = ref(-1);
const moved = ref(false);
let raf = 0;

function step() {
  const kids = track.value.children;
  if (kids.length < 2) return kids[0] ? kids[0].offsetWidth : 1;
  return kids[1].offsetLeft - kids[0].offsetLeft;
}

function measure() {
  const el = track.value;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  overflow.value = max > 2;
  // one dot per position you can actually scroll to
  pages.value = overflow.value ? Math.min(props.items.length, Math.ceil(max / step() - 0.05) + 1) : 1;
  const atEnd = el.scrollLeft >= max - 2;
  active.value = atEnd ? pages.value - 1 : Math.min(pages.value - 1, Math.max(0, Math.round(el.scrollLeft / step())));
}

function onScroll() {
  // shown at the first screenshot, hidden once you scroll away from it
  if (track.value) moved.value = track.value.scrollLeft > 12;
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(measure);
}

function go(i) {
  const n = Math.min(pages.value - 1, Math.max(0, i));
  const kid = track.value.children[n];
  track.value.scrollTo({ left: kid.offsetLeft - track.value.offsetLeft, behavior: "smooth" });
}

// mouse drag to scroll on desktop (touch already swipes natively)
let drag = null;
let dragged = false;
function onDown(e) {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  drag = { x: e.clientX, left: track.value.scrollLeft, moved: false };
}
function onMove(e) {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (!drag.moved && Math.abs(dx) > 5) {
    drag.moved = true;
    track.value.classList.add("dragging");
    track.value.setPointerCapture(e.pointerId);
  }
  if (drag.moved) track.value.scrollLeft = drag.left - dx;
}
function onUp() {
  if (!drag) return;
  const { moved, left } = drag;
  drag = null;
  if (!moved) return;
  dragged = true;
  setTimeout(() => (dragged = false), 0);
  const el = track.value;
  const s = step();
  const from = Math.round(left / s);
  const delta = el.scrollLeft - left;
  // a short flick is enough to move one page
  go(Math.abs(delta) > s * 0.15 ? from + Math.sign(delta) : from);
  // keep snapping off until the smooth scroll lands, otherwise it snaps back
  setTimeout(() => el.classList.remove("dragging"), 500);
}

function onKey(e) {
  if (e.key === "ArrowRight") go(active.value + 1);
  else if (e.key === "ArrowLeft") go(active.value - 1);
}

onMounted(() => {
  const first = props.items.find(Boolean);
  if (props.type === "desktop" && first) {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) ratio.value = `${img.naturalWidth} / ${img.naturalHeight}`;
      nextTick(measure);
    };
    img.src = first;
  }
  nextTick(measure);
  window.addEventListener("resize", measure);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", measure);
});
</script>

<template>
  <div class="carousel" :class="type" aria-roledescription="carousel">
    <div v-if="title" class="group-title">{{ title }}</div>
    <div class="wrap">
      <div
        ref="track"
        class="track"
        tabindex="0"
        @scroll.passive="onScroll"
        @keydown="onKey"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
        @dragstart.prevent
      >
        <div v-for="(src, i) in items" :key="i" class="item" :class="{ zoomable: src }" @click="src && !dragged && (viewer = i)">
          <DeviceFrame
            :type="type"
            :ratio="ratio"
            :src="src"
            :alt="`${title || 'Project'} screenshot ${i + 1}`"
            :label="'SCREENSHOT ' + String(i + 1).padStart(2, '0')"
          />
        </div>
      </div>
    </div>
    <Lightbox :open="viewer >= 0" :items="items.filter(Boolean)" :start="viewer" @close="viewer = -1" />
    <div v-if="overflow" class="swipe-hint" :class="{ gone: moved }" aria-hidden="true">
      <span class="touch-text">SWIPE FOR MORE</span>
      <span class="mouse-text">DRAG FOR MORE</span>
      <span class="hint-arrows">&#9654;&#9654;</span>
    </div>
    <div v-if="overflow" class="dots">
      <button
        v-for="i in pages"
        :key="i"
        class="dot"
        :class="{ on: i - 1 === active }"
        :aria-label="`Go to page ${i}`"
        @click="go(i - 1)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.group-title {
  font-size: 8.5px;
  letter-spacing: 2px;
  color: #c08a4a;
  margin-bottom: 10px;
}
.wrap {
  position: relative;
}
.track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  padding: 4px 2px;
  outline: none;
}
.track::-webkit-scrollbar {
  display: none;
}
.track.dragging {
  scroll-snap-type: none;
  user-select: none;
}
@media (hover: hover) and (pointer: fine) {
  .track,
  .item.zoomable {
    cursor: ew-resize;
  }
}
.item {
  flex: 0 0 88%;
  scroll-snap-align: center;
}
.phone .item {
  flex: 0 0 62%;
  max-width: 240px;
}
.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 8px;
  letter-spacing: 2px;
  color: #ffc21a;
  transition: opacity 0.4s ease, max-height 0.4s ease;
  max-height: 20px;
}
.swipe-hint.gone {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  overflow: hidden;
}
.mouse-text {
  display: none;
}
@media (hover: hover) and (pointer: fine) {
  .touch-text {
    display: none;
  }
  .mouse-text {
    display: inline;
  }
}
.hint-arrows {
  font-size: 7px;
  animation: nudge 1.1s ease-in-out infinite;
}
@keyframes nudge {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(5px);
    opacity: 1;
  }
}
.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}
.dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 2px solid #6a4418;
  background: #0d0805;
  cursor: pointer;
}
.dot.on {
  background: #ffc21a;
  border-color: #ffc21a;
}
@media (min-width: 721px) {
  .item {
    flex: 0 0 76%;
    scroll-snap-align: start;
  }
  .phone .item {
    flex: 0 0 calc((100% - 42px) / 4);
  }
}
</style>
