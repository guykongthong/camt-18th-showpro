<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { buildProjects, TRACKS } from "../data/projects.js";
import IconChevron from "../components/IconChevron.vue";
import IconPlay from "../components/IconPlay.vue";

const router = useRouter();
const all = buildProjects();
const trackLabels = TRACKS.map((t) => t.label);

const sel = ref(0);
const locked = ref(null);
const toast = ref("");
const query = ref("");
const cat = ref("ALL");
const detailOpen = ref(false);
const wiping = ref(false);
const locking = ref(false);
const mapHover = ref(false);
const prevHover = ref(false);
const nextHover = ref(false);

let toastTimer = null;
let t0 = null;
let t1 = null;
let t2 = null;

function say(msg) {
  clearTimeout(toastTimer);
  toast.value = msg;
  toastTimer = setTimeout(() => (toast.value = ""), 2000);
}

function select(i) {
  if (i === sel.value) return;
  sel.value = i;
}

function hoverSlot(i) {
  if (locked.value === null) select(i);
}

function tap(i) {
  if (locked.value === null) {
    select(i);
    locked.value = i;
  } else if (locked.value === i) {
    locked.value = null;
    say("UNLOCKED — HOVER TO BROWSE");
  } else {
    say("CLICK THE LOCKED SLOT TO UNLOCK FIRST");
  }
}

function launch() {
  if (locked.value === null) {
    say("LOCK IN A PROJECT FIRST — CLICK A SLOT");
    return;
  }
  if (locking.value || wiping.value) return;
  clearTimeout(t0);
  clearTimeout(t1);
  clearTimeout(t2);
  locking.value = true;
  t0 = setTimeout(() => {
    locking.value = false;
    wiping.value = true;
  }, 780);
  t1 = setTimeout(() => (detailOpen.value = true), 780 + 1080);
  t2 = setTimeout(() => (wiping.value = false), 780 + 1700);
}

function closeDetail() {
  document.body.style.overflow = "";
  detailOpen.value = false;
}

function prevProject() {
  select((sel.value - 1 + all.length) % all.length);
}
function nextProject() {
  select((sel.value + 1) % all.length);
}

function onEsc(e) {
  if (e.key === "Escape") closeDetail();
}
onMounted(() => window.addEventListener("keydown", onEsc));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEsc);
  clearTimeout(t0);
  clearTimeout(t1);
  clearTimeout(t2);
  clearTimeout(toastTimer);
  document.body.style.overflow = "";
});

const list = computed(() =>
  all.filter((p) => {
    const q = query.value.trim().toUpperCase();
    return (cat.value === "ALL" || p.category === cat.value) && (!q || p.name.includes(q) || p.num.includes(q));
  })
);

const selected = computed(() => all.find((p) => p.i === sel.value) || all[0]);
const chips = computed(() => ["ALL", ...trackLabels]);
const hint = computed(() =>
  locked.value === null ? "HOVER (OR TAP) A SLOT TO LOCK IN" : "LOCKED — CLICK THE SAME SLOT AGAIN TO UNLOCK"
);

function slotClass(p) {
  const lockedOn = p.i === locked.value;
  const cursorOn = locked.value === null && p.i === sel.value;
  return {
    slot: true,
    "slot-locked": lockedOn,
    "slot-cursor": cursorOn,
  };
}
function isIgniting(p) {
  return p.i === locked.value && locking.value;
}

const BOARD_COLS = 5;
function boardFillers(arr) {
  if (arr.length === 0) return 0;
  const rows = Math.ceil(arr.length / BOARD_COLS);
  return rows * BOARD_COLS - arr.length;
}

const boardGroups = computed(() => {
  const half = Math.ceil(list.value.length / 2);
  const leftList = list.value.slice(0, half);
  const rightList = list.value.slice(half);
  return [
    { side: "left", list: leftList, fillers: boardFillers(leftList) },
    { side: "right", list: rightList, fillers: boardFillers(rightList) },
  ];
});
</script>

<template>
  <div class="page-shell">
    <div class="page-flash"></div>
    <div class="glow-top"></div>
    <div class="glow-left"></div>
    <div class="glow-bottom"></div>
    <div class="page-scanlines"></div>

    <div class="wrap">
      <div class="topbar">
        <div class="crumbs">SE'S 18TH SHOWPRO &nbsp;/&nbsp; CAMT BUILDING &nbsp;/&nbsp; 30 SEP 2026</div>
        <div class="stats">
          <div>PROJECTS <span class="accent">{{ String(all.length).padStart(2, "0") }}</span></div>
          <div>CREDIT <span class="accent">FREE&nbsp;PLAY</span></div>
        </div>
      </div>

      <div class="arcade-display title">PROJECTS</div>

      <div class="stage">
        <div class="grid-overlay"></div>

        <transition name="ignite">
          <div v-if="locking" class="ignite-fx">
            <div class="sweep sweep-top"></div>
            <div class="sweep sweep-bottom"></div>
            <div class="flame"></div>
          </div>
        </transition>

        <div class="preview">
          <div class="shot" :key="'shot' + selected.i">
            <div class="shot-label mono">project shot — portrait</div>
            <div class="shot-num">{{ selected.num }}</div>
          </div>
          <div class="info" :key="'info' + selected.i">
            <div class="meta">{{ selected.category }} &nbsp;&#183;&nbsp; BOOTH {{ selected.booth }}</div>
            <div class="arcade-display name">{{ selected.name }}</div>
            <div class="pair">
              <div>TEAM<br /><span class="fg">{{ selected.team }}</span></div>
              <div>ADVISOR<br /><span class="fg">{{ selected.advisor }}</span></div>
            </div>
            <div class="tags">
              <div v-for="t in selected.tags" :key="t" class="tag-chip">{{ t }}</div>
            </div>
          </div>
        </div>

        <div class="view-btn" :class="{ hot: locked !== null }" @click="launch">VIEW PROJECT</div>
      </div>

      <div class="filters">
        <div class="search">
          <span class="search-ico"><IconPlay dir="right" /></span>
          <input type="text" v-model="query" placeholder="SEARCH BY NAME" />
        </div>
        <div class="chips">
          <div
            v-for="c in chips"
            :key="c"
            class="chip"
            :class="{ active: cat === c }"
            @click="cat = c"
          >
            {{ c }}
          </div>
        </div>
      </div>

      <div class="hint">{{ hint }}</div>

      <div v-if="list.length === 0" class="empty">NO MATCH — TRY ANOTHER NAME</div>
      <div v-else class="board">
        <template v-for="(group, gi) in boardGroups" :key="group.side">
          <div class="board-box">
            <div
              v-for="p in group.list"
              :key="p.i"
              :class="slotClass(p)"
              @click="tap(p.i)"
              @mouseenter="hoverSlot(p.i)"
            >
              <div class="slot-bg"></div>
              <div class="slot-body">
                <div class="slot-num">{{ p.num }}</div>
                <div class="slot-short">{{ p.short }}</div>
              </div>
              <div v-if="p.i === locked" class="slot-badge">LOCKED</div>
              <transition name="ignite">
                <div v-if="isIgniting(p)" class="slot-ignite"></div>
              </transition>
              <div class="slot-bar"></div>
            </div>
            <div v-for="n in group.fillers" :key="group.side + '-f-' + n" class="slot slot-filler"></div>
          </div>
          <div v-if="gi === 0" class="board-divider"></div>
        </template>
      </div>

      <div class="footer-panel">
        <div class="stripe"></div>
        <div class="body">
          <div class="col">
            <div class="arcade-display foot-title">SE'S 18TH SHOWPRO</div>
            <div class="foot-text">COLLEGE OF ARTS, MEDIA AND TECHNOLOGY<br />CHIANG MAI UNIVERSITY</div>
          </div>
          <div class="col">
            <div class="foot-label">FOLLOW US</div>
            <a href="#" class="foot-link"><span class="ico">FB</span>facebook.com/placeholder</a>
            <a href="#" class="foot-link"><span class="ico round">IG</span>@placeholder_handle</a>
          </div>
          <div class="col">
            <div class="foot-label">EVENT</div>
            <div class="foot-text">30 SEP 2026<br />8:00AM &mdash; 12:30PM<br />CAMT BUILDING</div>
          </div>
          <div class="col">
            <div class="foot-label">CONTACT</div>
            <div class="foot-text">placeholder@cmu.ac.th<br />+66 00 000 0000</div>
          </div>
        </div>
        <div class="legal">&copy; 2026 SE CAMT &mdash; INSERT&nbsp;COIN&nbsp;TO&nbsp;CONTINUE</div>
      </div>

      <div class="bottom-nav">
        <router-link to="/"><span class="arrow"><IconChevron dir="left" /></span>TITLE SCREEN</router-link>
      </div>
    </div>

    <router-link
      to="/map"
      class="map-tab"
      :class="{ hover: mapHover }"
      @mouseenter="mapHover = true"
      @mouseleave="mapHover = false"
    >
      <span class="map-label">STAGE MAP</span>
      <span class="arrow"><IconChevron dir="right" /></span>
    </router-link>

    <transition name="toast">
      <div v-if="toast" class="toast-layer">
        <div class="toast">
          <div class="dot"></div>
          <div class="toast-text">{{ toast }}</div>
        </div>
      </div>
    </transition>

    <transition name="wipe">
      <div v-if="wiping" class="wipe-layer">
        <div class="bar bar-l"></div>
        <div class="bar bar-r"></div>
        <div class="flash-out"></div>
        <div class="stamp arcade-display">READY!</div>
      </div>
    </transition>

    <transition name="detail">
      <div v-if="detailOpen" class="detail">
        <div class="detail-inner">
          <div class="detail-top">
            <div class="crumbs">SLOT {{ selected.num }} &nbsp;&#183;&nbsp; {{ selected.category }} &nbsp;&#183;&nbsp; BOOTH {{ selected.booth }}</div>
            <div class="btn btn-primary" @click="closeDetail"><span class="arrow"><IconChevron dir="left" /></span>BACK</div>
          </div>

          <div class="arcade-display detail-name">{{ selected.name }}</div>

          <div class="media-grid">
            <div class="hero mono">demo video / hero shot — 16:9</div>
            <div class="shot-sm mono">screenshot 01</div>
            <div class="shot-sm mono">screenshot 02</div>
            <div class="shot-sm mono">screenshot 03</div>
            <div class="shot-sm mono">screenshot 04</div>
          </div>

          <div class="detail-cols">
            <div class="panel">
              <div class="panel-title">MEMBERS</div>
              <div class="players">
                <div v-for="s in selected.students" :key="s.name" class="player">
                  <div class="avatar mono">student photo</div>
                  <div class="pname">{{ s.name }}</div>
                  <div class="prole">{{ s.role }}</div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-title">ADVISOR</div>
              <div class="players">
                <div class="player">
                  <div class="avatar mono">advisor photo</div>
                  <div class="pname">{{ selected.advisor }}</div>
                  <div class="prole">DEPT. OF SOFTWARE ENGINEERING</div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">TECH STACK &amp; TECHNOLOGIES</div>
            <div class="tags">
              <div v-for="t in selected.tags" :key="t" class="tag-chip">{{ t }}</div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">ABOUT</div>
            <div class="about mono">
              project summary goes here — one short paragraph per team: the problem, the approach, and what a visitor can try at the booth.
            </div>
          </div>
        </div>

        <div
          class="detail-tab detail-tab-prev"
          :class="{ hover: prevHover }"
          @mouseenter="prevHover = true"
          @mouseleave="prevHover = false"
          @click="prevProject"
        >
          <span class="arrow"><IconChevron dir="left" /></span>
          <span class="detail-tab-label">PREV</span>
        </div>
        <div
          class="detail-tab detail-tab-next"
          :class="{ hover: nextHover }"
          @mouseenter="nextHover = true"
          @mouseleave="nextHover = false"
          @click="nextProject"
        >
          <span class="detail-tab-label">NEXT</span>
          <span class="arrow"><IconChevron dir="right" /></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.glow-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 240px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 120, 0, 0.2), transparent 78%);
}
.glow-left {
  position: absolute;
  left: 0;
  top: 0;
  width: 58%;
  height: 440px;
  pointer-events: none;
  background: radial-gradient(70% 100% at 0% 0%, rgba(63, 143, 208, 0.3), rgba(63, 143, 208, 0.08) 45%, transparent 72%);
}
.glow-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 260px;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(255, 124, 0, 0.16), transparent 80%);
}

.wrap {
  position: relative;
  max-width: 1420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 10px;
  letter-spacing: 2px;
  color: #8fb6d6;
}
.stats {
  display: flex;
  gap: 20px;
}
.accent {
  color: #ff9500;
}

.title {
  font-size: clamp(30px, 4.8vw, 66px);
}

.stage {
  position: relative;
  border: 2px solid #4a2e12;
  background: linear-gradient(180deg, #140c06, #0b0705 70%);
  box-shadow: inset 0 0 0 2px #0d0805;
  overflow: hidden;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: gridPulse 4.6s ease-in-out infinite;
  background: repeating-linear-gradient(90deg, rgba(63, 143, 208, 0.07) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(180deg, rgba(255, 120, 0, 0.06) 0 1px, transparent 1px 46px);
}
.ignite-fx {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
  animation: igniteBox 0.78s cubic-bezier(0.4, 0.1, 0.6, 1) both;
}
.sweep {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #fff3d0 45%, #ff9500 60%, transparent);
  animation: sweepX 0.42s linear 2;
}
.sweep-top {
  top: 0;
}
.sweep-bottom {
  bottom: 0;
  animation-direction: reverse;
}
.flame {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 46%;
  transform-origin: bottom;
  background: linear-gradient(0deg, rgba(255, 240, 200, 0.75), rgba(255, 150, 0, 0.5) 38%, transparent);
  filter: blur(6px);
  animation: flameUp 0.3s ease-in-out infinite alternate;
}

.preview {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 24px;
  align-items: end;
  min-height: 330px;
  padding: 22px 26px 0;
}
@media (max-width: 720px) {
  .preview {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 14px 14px 0;
  }
}
.shot {
  position: relative;
  aspect-ratio: 3 / 4;
  max-height: 300px;
  background: repeating-linear-gradient(135deg, #2a1a0a 0 8px, #1c1108 8px 16px);
  border: 2px solid #6a4418;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideL 0.4s cubic-bezier(0.16, 0.9, 0.3, 1) both;
}
.shot-label {
  font-size: 10px;
  letter-spacing: 1px;
  color: #b08a5a;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 10px;
}
.shot-num {
  position: absolute;
  left: -2px;
  bottom: -2px;
  padding: 5px 9px;
  background: #ff7300;
  font-size: 9px;
  color: #1c0c04;
}
.info {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  animation: slideR 0.46s cubic-bezier(0.16, 0.9, 0.3, 1) both;
  padding: 10px 0 24px;
}
.meta {
  font-size: 10px;
  letter-spacing: 2px;
  color: #8fb6d6;
}
.name {
  font-size: clamp(34px, 5.2vw, 74px);
}
.pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  font-size: 8.5px;
  line-height: 1.7;
  color: #8fb6d6;
}
.fg {
  color: #f5e2c4;
}
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag-chip {
  padding: 5px 8px;
  border: 1px solid #6a4418;
  font-size: 8px;
  color: #ffc21a;
}

.view-btn {
  position: relative;
  cursor: pointer;
  margin-top: 18px;
  padding: 16px 26px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 4px;
  color: #f5e2c4;
  background: linear-gradient(90deg, transparent, rgba(255, 115, 0, 0.5), rgba(255, 194, 26, 0.42), transparent);
  text-shadow: 0 2px 0 #1c0c04;
  animation: blinkc 1.2s steps(1, end) infinite;
}
.view-btn.hot:hover {
  color: #1c0c04;
  background: linear-gradient(90deg, rgba(255, 149, 0, 0.9), #ffc21a, rgba(255, 149, 0, 0.9));
  animation: none;
}

.filters {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 14px;
  border: 2px solid #3a2410;
  background: rgba(20, 12, 6, 0.82);
}
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 2px solid #4a2e12;
  background: #0d0805;
}
.search-ico {
  display: flex;
  color: #ff7300;
}
.search-ico svg {
  width: 11px;
  height: 13px;
}
.search input {
  border: 0;
  outline: 0;
  background: transparent;
  font-family: "Press Start 2P", monospace;
  font-size: 10px;
  color: #f5e2c4;
  width: 170px;
  letter-spacing: 1px;
}
.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  cursor: pointer;
  padding: 8px 11px;
  border: 2px solid #4a2e12;
  background: #0d0805;
  font-size: 9px;
  letter-spacing: 1px;
  color: #c08a4a;
}
.chip.active {
  border-color: #ffc21a;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  color: #1c0c04;
}

.hint {
  font-size: 8.5px;
  letter-spacing: 1.5px;
  color: #8fb6d6;
  margin-top: -6px;
}

.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.board-box {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 460px;
}
.board-divider {
  width: 100%;
  max-width: 460px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 149, 0, 0.6), transparent);
}
@media (min-width: 900px) {
  .board {
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: 32px;
  }
  .board-box {
    grid-template-columns: repeat(5, 84px);
    width: auto;
    max-width: none;
    align-content: start;
  }
  .board-divider {
    width: 2px;
    max-width: none;
    height: auto;
    align-self: stretch;
    background: linear-gradient(180deg, transparent, rgba(255, 149, 0, 0.6), transparent);
  }
}
.slot {
  cursor: pointer;
  position: relative;
  aspect-ratio: 3 / 4;
  border: 2px solid #2e3c4a;
  background: #120b06;
  overflow: hidden;
}
.slot:hover {
  border-color: #ff9500;
}
.slot-filler {
  cursor: default;
  pointer-events: none;
  border: 2px dashed #241608;
  background: transparent;
}
.slot-cursor {
  border-color: #ff9500;
}
.slot-locked {
  border-color: #ffc21a;
  animation: cursorPulse 1.1s ease-in-out infinite;
}
.slot-bg {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(135deg, #241608 0 6px, #1a1006 6px 12px);
  opacity: 0.9;
}
.slot-locked .slot-bg {
  background: linear-gradient(180deg, rgba(255, 149, 0, 0.22), rgba(212, 60, 0, 0.3)),
    repeating-linear-gradient(135deg, #241608 0 6px, #1a1006 6px 12px);
}
.slot-body {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;
}
.slot-num {
  font-size: 8px;
  color: #8fb6d6;
}
.slot-locked .slot-num {
  color: #ffc21a;
}
.slot-short {
  font-size: 6.5px;
  line-height: 1.5;
  color: #9fb6c8;
  text-shadow: 0 1px 0 #000;
}
.slot-locked .slot-short {
  color: #fff3d0;
}
.slot-badge {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 5px;
  background: #ffc21a;
  font-size: 6.5px;
  color: #1c0c04;
}
.slot-ignite {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  animation: igniteBox 0.78s cubic-bezier(0.4, 0.1, 0.6, 1) both;
}
.slot-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #22303c;
}
.slot-locked .slot-bar {
  background: linear-gradient(90deg, #ffc21a, #ff7300);
}
.slot-cursor .slot-bar {
  background: #ff7300;
}
.empty {
  padding: 36px;
  text-align: center;
  font-size: 11px;
  color: #8a6a4a;
  border: 2px dashed #3a2410;
}

.foot-title {
  font-size: 20px;
  color: #ffc21a;
  text-shadow: 2px 2px 0 #2a1206;
}
.foot-label {
  font-size: 8.5px;
  letter-spacing: 2px;
  color: #8fb6d6;
}
.foot-text {
  font-size: 8px;
  line-height: 1.8;
  color: #c9b493;
}
.foot-link {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 8.5px;
  color: #f5e2c4;
}
.ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid #ff9500;
  background: #1a1006;
  font-size: 8px;
  color: #ff9500;
}
.ico.round {
  border-radius: 7px;
}

.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 14px;
  font-size: 10px;
  letter-spacing: 2px;
  color: #8fb6d6;
}
.bottom-nav a {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}
.arrow {
  display: flex;
  color: currentColor;
}
.arrow svg {
  width: 11px;
  height: 14px;
}

.map-tab {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  border: 2px solid #ffc21a;
  border-right: 0;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  opacity: 0.42;
  transition: opacity 0.22s ease;
  font-size: 10px;
  letter-spacing: 2px;
  color: #1c0c04;
}
.map-tab.hover {
  opacity: 1;
  box-shadow: -6px 0 24px rgba(255, 140, 0, 0.5);
}
.map-label {
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;
  transition: max-width 0.26s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.2s ease;
}
.map-tab.hover .map-label {
  max-width: 140px;
  opacity: 1;
}

.toast-layer {
  position: fixed;
  inset: 0;
  z-index: 14;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast {
  animation: toastPop 2s cubic-bezier(0.2, 0.9, 0.3, 1) both;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 26px;
  border: 2px solid #ffc21a;
  background: linear-gradient(180deg, #1a1006, #0d0805);
  box-shadow: 0 0 0 2px #2a1206, 0 0 46px rgba(255, 150, 0, 0.35);
}
.toast .dot {
  width: 10px;
  height: 10px;
  background: #ff7300;
  box-shadow: 0 0 12px #ff7300;
}
.toast-text {
  font-size: 11px;
  letter-spacing: 2px;
  line-height: 1.7;
  color: #ffc21a;
  text-shadow: 0 2px 0 #1c0c04;
}

.wipe-layer {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  overflow: hidden;
}
.bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
}
.bar-l {
  top: 0;
  background: linear-gradient(180deg, #d43c00, #ff9500);
  animation: barL 1.7s cubic-bezier(0.6, 0, 0.4, 1) both;
}
.bar-r {
  bottom: 0;
  background: linear-gradient(0deg, #d43c00, #ff9500);
  animation: barR 1.7s cubic-bezier(0.6, 0, 0.4, 1) both;
}
.flash-out {
  position: absolute;
  inset: 0;
  background: #fff;
  animation: flashOut 1.7s steps(1, end) both;
}
.stamp {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(44px, 9vw, 132px);
  color: #1c0c04;
  text-shadow: 6px 6px 0 #fff;
  animation: stampIn 1.7s cubic-bezier(0.2, 1.5, 0.4, 1) both;
}

.detail {
  position: fixed;
  inset: 0;
  z-index: 12;
  background: #060403;
  overflow-y: auto;
  padding: 26px;
  box-sizing: border-box;
}
.detail-inner {
  max-width: 1180px;
  margin: 0 auto;
  animation: detailIn 0.34s cubic-bezier(0.16, 0.9, 0.3, 1) both;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.crumbs {
  font-size: 10px;
  letter-spacing: 2px;
  color: #8fb6d6;
}
.detail-name {
  font-size: clamp(34px, 6vw, 84px);
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}
.hero {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 9;
  border: 2px solid #6a4418;
  background: repeating-linear-gradient(135deg, #2a1a0a 0 8px, #1c1108 8px 16px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #b08a5a;
}
.shot-sm {
  aspect-ratio: 16 / 10;
  border: 2px solid #3a2410;
  background: repeating-linear-gradient(135deg, #241608 0 6px, #1a1006 6px 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #b08a5a;
}
.detail-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}
.panel-title {
  font-size: 9px;
  letter-spacing: 2px;
  color: #8fb6d6;
  margin-bottom: 14px;
}
.players {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.player {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.avatar {
  aspect-ratio: 1 / 1;
  border: 2px solid #6a4418;
  background: repeating-linear-gradient(135deg, #2a1a0a 0 6px, #1c1108 6px 12px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  font-size: 9px;
  color: #b08a5a;
}
.pname {
  font-size: 8px;
  line-height: 1.6;
  color: #f5e2c4;
}
.prole {
  font-size: 7.5px;
  color: #8fb6d6;
}
.about {
  font-size: 12px;
  line-height: 1.7;
  color: #c9b493;
  max-width: 76ch;
}
.detail-tab {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 13;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  border: 2px solid #ffc21a;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  opacity: 0.42;
  transition: opacity 0.22s ease;
  cursor: pointer;
  font-family: "Press Start 2P", monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: #1c0c04;
}
.detail-tab.hover {
  opacity: 1;
}
.detail-tab-prev {
  left: 0;
  border-left: 0;
  box-shadow: 6px 0 24px rgba(255, 140, 0, 0);
}
.detail-tab-prev.hover {
  box-shadow: 6px 0 24px rgba(255, 140, 0, 0.5);
}
.detail-tab-next {
  right: 0;
  border-right: 0;
  box-shadow: -6px 0 24px rgba(255, 140, 0, 0);
}
.detail-tab-next.hover {
  box-shadow: -6px 0 24px rgba(255, 140, 0, 0.5);
}
.detail-tab-label {
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;
  transition: max-width 0.26s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.2s ease;
}
.detail-tab.hover .detail-tab-label {
  max-width: 100px;
  opacity: 1;
}
@media (max-width: 640px) {
  .detail-tab {
    padding: 12px 8px;
    font-size: 8px;
  }
}

.toast-enter-active,
.toast-leave-active,
.wipe-enter-active,
.detail-enter-active {
  transition: opacity 0.15s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
