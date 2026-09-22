<script setup>
import { ref } from "vue";
import { TRACKS } from "../data/projects.js";
import IconChevron from "../components/IconChevron.vue";

const tabHover = ref(false);
const BOOTH_COUNT = 38;
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
          <div>BOOTHS <span class="accent">{{ String(BOOTH_COUNT).padStart(2, "0") }}</span></div>
          <div>FLOORS <span class="accent">02</span></div>
        </div>
      </div>

      <div class="arcade-display title">STAGE MAP</div>

      <div class="layout">
        <div class="floorplan">
          <div class="fp-head">
            <div class="fp-title">EVENT FLOOR PLAN</div>
            <div class="fp-scale">SCALE 1:200</div>
          </div>
          <div class="fp-body">
            <div class="fp-grid"></div>
            <div class="fp-placeholder mono">
              <div>event floor plan &mdash; drop image here</div>
              <div class="sub">landscape, 16:10, booth numbers legible at 100%</div>
            </div>
          </div>
          <div class="fp-foot">
            <div>ENTRANCE &mdash; NORTH SIDE</div>
            <div>36 BOOTHS &nbsp;&#183;&nbsp; 6 TRACKS</div>
          </div>
        </div>

        <div class="side">
          <div class="panel">
            <div class="panel-title">LEGEND</div>
            <div class="legend-list">
              <div v-for="l in TRACKS" :key="l.label" class="legend-row">
                <div class="swatch" :style="{ background: l.color }"></div>
                <div class="legend-label">{{ l.label }}</div>
                <div class="legend-range">{{ l.range }}</div>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">AMENITIES</div>
            <div class="amenities">
              <div>REGISTRATION &mdash; <span class="accent2">LOBBY</span></div>
              <div>OPENING CEREMONY &mdash; <span class="accent2">HALL A</span></div>
              <div>JUDGING DESK &mdash; <span class="accent2">CENTRE</span></div>
              <div>REFRESHMENTS &mdash; <span class="accent2">EAST WING</span></div>
            </div>
          </div>
        </div>
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
        <router-link to="/projects">PROJECT SELECT</router-link>
      </div>
    </div>

    <router-link
      to="/projects"
      class="side-tab"
      :class="{ hover: tabHover }"
      @mouseenter="tabHover = true"
      @mouseleave="tabHover = false"
    >
      <span class="arrow"><IconChevron dir="left" /></span>
      <span class="tab-label">BROWSE PROJECTS</span>
    </router-link>
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
.accent2 {
  color: #ffc21a;
}
.title {
  font-size: clamp(30px, 4.8vw, 66px);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 300px);
  gap: 20px;
  align-items: start;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.floorplan {
  position: relative;
  border: 2px solid #4a2e12;
  background: #0d0805;
}
.fp-head,
.fp-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  background: #140c06;
  font-size: 8px;
  letter-spacing: 1px;
  color: #8fb6d6;
}
.fp-head {
  border-bottom: 2px solid #4a2e12;
  font-size: 9px;
  letter-spacing: 2px;
}
.fp-title {
  color: #ffc21a;
}
.fp-foot {
  border-top: 2px solid #4a2e12;
}
.fp-body {
  position: relative;
  aspect-ratio: 16 / 10;
  background: repeating-linear-gradient(135deg, #241608 0 8px, #1a1006 8px 16px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fp-grid {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, rgba(63, 143, 208, 0.08) 0 1px, transparent 1px 52px),
    repeating-linear-gradient(180deg, rgba(255, 120, 0, 0.07) 0 1px, transparent 1px 52px);
}
.fp-placeholder {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.66);
  border: 1px dashed #6a4418;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  color: #c9a06a;
}
.fp-placeholder .sub {
  font-size: 10px;
  color: #8a6a4a;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.panel-title {
  font-size: 9px;
  letter-spacing: 2px;
  color: #8fb6d6;
  margin-bottom: 14px;
}
.legend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.swatch {
  width: 14px;
  height: 14px;
  flex: none;
  border: 1px solid #1c0c04;
}
.legend-label {
  font-size: 8.5px;
  line-height: 1.6;
  color: #f5e2c4;
}
.legend-range {
  margin-left: auto;
  font-size: 8px;
  color: #8fb6d6;
}
.amenities {
  display: flex;
  flex-direction: column;
  gap: 9px;
  font-size: 8px;
  line-height: 1.7;
  color: #c9b493;
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
}
.arrow svg {
  width: 11px;
  height: 14px;
}

.side-tab {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 16px 14px;
  border: 2px solid #ffc21a;
  border-left: 0;
  background: linear-gradient(180deg, #ff9500, #d43c00);
  opacity: 0.42;
  transition: opacity 0.22s ease;
  font-size: 10px;
  letter-spacing: 2px;
  color: #1c0c04;
}
.side-tab.hover {
  opacity: 1;
  box-shadow: 6px 0 24px rgba(255, 140, 0, 0.5);
}
.tab-label {
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;
  transition: max-width 0.26s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.2s ease;
}
.side-tab.hover .tab-label {
  max-width: 210px;
  opacity: 1;
}
</style>
