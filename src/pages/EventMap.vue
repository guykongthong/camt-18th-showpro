<script setup>
import { ref } from "vue";
import { PROJECTS, CATEGORIES } from "../data/projects.js";
import IconChevron from "../components/IconChevron.vue";

const tabHover = ref(false);
const BOOTH_COUNT = PROJECTS.length;
const counts = CATEGORIES.map((c, i) => ({
  ...c,
  num: i + 1,
  count: PROJECTS.filter((p) => p.categories.includes(c.label)).length,
}));
// the organizer's own booth zoning, one physical area with no project count
const COMPANY_ZONE = { num: counts.length + 1, label: "Company Booths", color: "#865936" };

const zones = CATEGORIES.map((c) => ({
  ...c,
  projects: PROJECTS.filter((p) => p.categories.includes(c.label)),
}));
</script>

<template>
  <div class="page-shell">
    <div class="page-flash"></div>
    <div class="glow-top"></div>
    <div class="glow-bottom"></div>
    <div class="page-scanlines"></div>

    <div class="wrap">
      <div class="topbar">
        <div class="crumbs">SE'S 18TH SHOWPRO &nbsp;/&nbsp; CAMT BUILDING &nbsp;/&nbsp; 30 SEP 2026</div>
        <div class="stats">
          <div>BOOTHS <span class="accent">{{ String(BOOTH_COUNT).padStart(2, "0") }}</span></div>
        </div>
      </div>

      <div class="arcade-display title">STAGE MAP</div>

      <div class="layout">
        <div class="floorplan">
          <div class="fp-head">
            <div class="fp-title">EVENT FLOOR PLAN</div>
          </div>
          <div class="fp-body">
            <div class="room-card room-camt">
              <img class="room-img" src="/floorplan/camt-112.png" alt="CAMT 112, motion capture room, floor plan" />
            </div>
            <div class="room-card room-lobby">
              <img class="room-img" src="/floorplan/learning-playground.png" alt="Learning Playground lobby floor plan" />
            </div>
          </div>
          <div class="fp-foot">
            <div>{{ BOOTH_COUNT }} PROJECTS &nbsp;&#183;&nbsp; {{ CATEGORIES.length + 1 }} ZONES</div>
          </div>
        </div>

        <div class="side">
          <div class="panel">
            <div class="panel-title">LEGEND</div>
            <div class="legend-list">
              <div v-for="l in counts" :key="l.label" class="legend-row">
                <div class="swatch" :style="{ background: l.color }"></div>
                <div class="legend-label">{{ l.num }}. {{ l.label }}</div>
                <div class="legend-range">{{ l.count }} GRP</div>
              </div>
              <div class="legend-row">
                <div class="swatch" :style="{ background: COMPANY_ZONE.color }"></div>
                <div class="legend-label">{{ COMPANY_ZONE.num }}. {{ COMPANY_ZONE.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel zones-panel">
        <div class="panel-title">PROJECT ZONES</div>
        <div class="zones-grid">
          <div v-for="(z, i) in zones" :key="z.label" class="zone-group">
            <div class="zone-head">
              <div class="swatch" :style="{ background: z.color }"></div>
              <span>{{ i + 1 }}. {{ z.label }} ({{ z.projects.length }})</span>
            </div>
            <router-link v-for="p in z.projects" :key="p.slug" :to="{ path: '/projects', query: { lock: p.slug } }" class="zone-item">{{ p.name }}</router-link>
          </div>
        </div>
      </div>

      <router-link to="/projects" class="m-btn m-primary"><span class="arrow"><IconChevron dir="left" /></span>BROWSE PROJECTS</router-link>

      <div class="footer-panel">
        <div class="stripe"></div>
        <div class="body">
          <div class="col">
            <div class="arcade-display foot-title">SE'S 18TH SHOWPRO</div>
            <div class="foot-text">COLLEGE OF ARTS, MEDIA AND TECHNOLOGY<br />CHIANG MAI UNIVERSITY</div>
          </div>
          <div class="col">
            <div class="foot-label">FOLLOW US</div>
            <a href="https://www.facebook.com/CAMTSEshowpro" target="_blank" rel="noopener" class="foot-link"><img class="social-ico" src="/social/facebook.png" alt="Facebook" />facebook.com/CAMTSEshowpro</a>
            <a href="https://www.instagram.com/camt.seshowpro/" target="_blank" rel="noopener" class="foot-link"><img class="social-ico" src="/social/instagram.png" alt="Instagram" />@camt.seshowpro</a>
          </div>
          <div class="col">
            <div class="foot-label">EVENT</div>
            <div class="foot-text">30 SEP 2026<br />8:00AM &mdash; 12:30PM<br />CAMT BUILDING</div>
          </div>
        </div>
        <div class="legal">&copy; 2026 SE CAMT &mdash; INSERT&nbsp;COIN&nbsp;TO&nbsp;CONTINUE</div>
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
  padding: 14px;
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 14px;
  align-items: start;
  background: repeating-linear-gradient(135deg, #241608 0 8px, #1a1006 8px 16px);
}
@media (max-width: 720px) {
  .fp-body {
    grid-template-columns: 1fr;
  }
}
.room-card {
  position: relative;
  z-index: 10;
  border: 1px solid #4a2e12;
  background: #0d0805;
}
.room-img {
  display: block;
  width: 100%;
  height: auto;
  background: #fff;
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
.zones-panel {
  margin-top: 4px;
}
.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px 24px;
}
.zone-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.zone-head {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 9px;
  letter-spacing: 1px;
  color: #ffc21a;
  margin-bottom: 2px;
}
.zone-item {
  display: block;
  font-size: 9px;
  line-height: 1.9;
  color: #c9b493;
  text-decoration: none;
}
.zone-item:hover {
  color: #f5e2c4;
  text-decoration: underline;
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
.social-ico {
  width: 24px;
  height: 24px;
  border-radius: 6px;
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
@media (max-width: 720px) {
  .side-tab {
    display: none;
  }
  /* keeps the footer clear of the fixed sound and help buttons */
  .footer-panel {
    margin-bottom: 52px;
  }
}
</style>
