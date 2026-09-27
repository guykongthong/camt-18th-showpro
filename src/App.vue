<script setup>
import { watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import MuteButton from "./components/MuteButton.vue";
import { setScene } from "./utils/music.js";
import { playSfx, playSfxLayer, preloadSfx } from "./utils/sfx.js";

const route = useRoute();
// title track on the title screen, the other one everywhere else
watch(
  () => route.name,
  (name) => {
    if (name) setScene(name === "title" ? "title" : "main");
  },
  { immediate: true }
);

// one click sound for the ordinary buttons (the start, power, slot and view buttons have their own)
const BUTTONS = ".btn, .detail-tab, .chip, .bottom-nav a, .m-btn, .map-tab, .title-tab, .side-tab, .foot-link, .lb-close, .lb-nav, .dot";
function onClick(e) {
  if (e.target.closest && e.target.closest(BUTTONS)) playSfx("start");
}

// hover sound for the back, stage map, browse projects, prev/next, mute and help buttons, mouse only (touch has no hover), once per entry into a button
const HOVERABLE = ".btn, .map-tab, .title-tab, .side-tab, .detail-tab, .mute, .help-btn";
function onOver(e) {
  if (e.pointerType && e.pointerType !== "mouse") return;
  const el = e.target.closest && e.target.closest(HOVERABLE);
  if (!el || el.disabled) return;
  // moving between children of the same button does not count
  if (e.relatedTarget && el.contains(e.relatedTarget)) return;
  playSfxLayer("btnhover");
}

onMounted(() => {
  preloadSfx();
  document.addEventListener("click", onClick, true);
  document.addEventListener("pointerover", onOver, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onClick, true);
  document.removeEventListener("pointerover", onOver, true);
});
</script>

<template>
  <router-view />
  <MuteButton />
</template>
