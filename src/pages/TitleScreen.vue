<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import IconPlay from "../components/IconPlay.vue";

const router = useRouter();
const started = ref(false);
let timer = null;

function start() {
  if (started.value) return;
  started.value = true;
  timer = setTimeout(() => router.push("/projects"), 2820);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="cabinet-wrap">
    <div class="cabinet">
      <div class="screen">
        <div class="glow-a"></div>
        <div class="glow-b"></div>
        <div class="glow-band"></div>
        <div class="glow-streak"></div>

        <div class="content">
          <div class="school">
            College of Arts, Media and Technology, Chiang Mai University
          </div>

          <div class="logo-block">
            <div class="wordmark">
              <div class="s-letter arcade-display">S</div>
              <div class="wordmark-lines">
                <div class="arcade-display line-small">SE's 18th</div>
                <div class="arcade-display line-big">HOWPRO</div>
              </div>
            </div>
            <div class="tag-senior">SENIOR PROJECT: 2026</div>
            <div class="tag-date">SEPTEMBER 30TH &nbsp;8:00AM - 12:30PM</div>
            <div class="tag-venue">CAMT BUILDING</div>
          </div>

          <div class="cta" :class="{ blink: !started }" @click="start">
            <span class="arrow"><IconPlay dir="right" /></span>
            <span class="cta-label">{{ started ? "LOADING..." : "TAP TO START" }}</span>
            <span class="arrow"><IconPlay dir="left" /></span>
          </div>
        </div>

        <div class="scanlines"></div>
        <div class="rgb-mask"></div>
        <div class="vignette"></div>
        <div class="boot">
          <div class="boot-roll boot-roll-a"></div>
          <div class="boot-roll boot-roll-b"></div>
        </div>

        <transition name="fade">
          <div v-if="started" class="entering">
            <div class="fuzz"></div>
            <div class="band band-top">
              <div class="marq marq-l">
                <span v-for="n in 2" :key="'a' + n">ENTERING &#9670; ENTERING &#9670; ENTERING &#9670; ENTERING &#9670;</span>
              </div>
            </div>
            <div class="band band-mid">
              <div class="marq marq-l slow">
                <span v-for="n in 2" :key="'b' + n">PLAYER ONE IS READY &#9670; PLAYER ONE IS READY &#9670;</span>
              </div>
            </div>
            <div class="band band-bottom">
              <div class="marq marq-r">
                <span v-for="n in 2" :key="'c' + n">SE 18TH SHOWPRO &#9670; SE 18TH SHOWPRO &#9670; SE 18TH SHOWPRO &#9670;</span>
              </div>
            </div>
            <div class="flash"></div>
            <div class="shut shut-t"></div>
            <div class="shut shut-b"></div>
            <div class="line"></div>
          </div>
        </transition>
      </div>

      <div class="bezel-foot">
        <div class="badge">
          <span class="label">SHOWPRO&nbsp;CRT-26</span>
          <span class="led"></span>
        </div>
        <div class="knobs">
          <div class="knob"></div>
          <div class="knob"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cabinet-wrap {
  width: 100vw;
  height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0908;
  overflow: hidden;
}

.cabinet {
  position: relative;
  box-sizing: border-box;
  /* capped by both viewport width and viewport height (via the 1.55 buffer,
     which leaves room for the cabinet padding + foot below the glass) so
     cqw-based type keeps the same scale as the design regardless of window
     shape, instead of blowing up on wide/short viewports */
  width: min(100%, 100dvh * 1.55);
  padding: 3.1cqw 3.1cqw 4.6cqw;
  border-radius: 4.2cqw / 5.4cqw;
  background: linear-gradient(170deg, #2e2c2a 0%, #1d1b1a 46%, #121110 100%);
  box-shadow: inset 0 2px 2px rgba(255, 255, 255, 0.14), inset 0 -6px 14px rgba(0, 0, 0, 0.6),
    0 40px 90px -30px rgba(0, 0, 0, 0.9);
}
@media (max-width: 640px) {
  .cabinet-wrap {
    display: block;
  }
  .cabinet {
    width: 100vw;
    min-height: 100dvh;
    padding: 0;
    border-radius: 0;
    background: #000;
    box-shadow: none;
  }
  .bezel-foot {
    display: none;
  }
}

.screen {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  container-type: inline-size;
  container-name: crt;
  border-radius: 3.2cqw / 4.6cqw;
  overflow: hidden;
  background: radial-gradient(130% 120% at 50% 45%, #0b0a09 0%, #000 62%, #000 100%);
  box-shadow: inset 0 0 0 0.5cqw #2b2620, inset 0 0 3.4cqw 1.2cqw rgba(0, 0, 0, 0.95);
}
@media (max-width: 640px) {
  .screen {
    aspect-ratio: auto;
    min-height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }
}

.glow-a {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 120, 0, 0.05) 0%,
    rgba(255, 120, 0, 0.3) 14%,
    rgba(220, 90, 0, 0.2) 28%,
    rgba(140, 70, 10, 0.1) 46%,
    transparent 62%
  );
  animation: crtExpandPic 3.4s cubic-bezier(0.25, 0.9, 0.2, 1) both;
}
.glow-b {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    0deg,
    rgba(255, 124, 0, 0.46) 0%,
    rgba(240, 110, 0, 0.34) 12%,
    rgba(230, 120, 10, 0.24) 26%,
    rgba(120, 50, 70, 0.1) 44%,
    transparent 62%
  );
  animation: crtExpandPic 3.4s cubic-bezier(0.25, 0.9, 0.2, 1) both;
}
.glow-band {
  position: absolute;
  left: 0;
  right: 0;
  top: 36%;
  height: 34%;
  background: radial-gradient(
    60% 50% at 50% 50%,
    rgba(255, 110, 0, 0.45) 0%,
    rgba(255, 150, 0, 0.22) 36%,
    rgba(255, 185, 60, 0.07) 60%,
    transparent 76%
  );
  filter: blur(1.4cqw);
}
.glow-streak {
  position: absolute;
  left: 0;
  right: 0;
  top: 41%;
  height: 9%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 110, 0, 0.32) 20%,
    rgba(255, 165, 20, 0.5) 50%,
    rgba(255, 110, 0, 0.32) 80%,
    transparent
  );
  filter: blur(1.1cqw);
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.6cqw 4cqw 0;
  box-sizing: border-box;
  animation: crtSettle 3.4s ease-out both, crtExpandPic 3.4s cubic-bezier(0.25, 0.9, 0.2, 1) both,
    flick 7s 3.4s infinite steps(1, end);
}

.school {
  font-size: 1.08cqw;
  letter-spacing: 0.12cqw;
  text-align: center;
  color: #eef4fa;
  text-shadow: 0 0.14cqw 0 #1c0c04, 0.12cqw 0 0 #1c0c04, -0.12cqw 0 0 #1c0c04, 0 0 1.2cqw rgba(0, 0, 0, 0.9);
}

.logo-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -1cqw;
  width: 100%;
}
.wordmark {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.s-letter {
  font-size: 26cqw;
}
.wordmark-lines {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: -1.5cqw;
}
.line-small {
  font-size: 6.4cqw;
  margin-left: 2.6cqw;
  margin-bottom: 0.5cqw;
}
.line-big {
  font-size: 14.4cqw;
  letter-spacing: -0.5cqw;
}
.tag-senior {
  margin-top: 2.1cqw;
  font-size: 1.28cqw;
  letter-spacing: 0.24cqw;
  color: #f5e2c4;
  text-shadow: 0 0.16cqw 0 #000;
}
.tag-date {
  margin-top: 1.1cqw;
  font-size: 1.1cqw;
  letter-spacing: 0.2cqw;
  color: #ff9500;
  text-shadow: 0 0.14cqw 0 #000;
}
.tag-venue {
  margin-top: 0.75cqw;
  font-size: 1.02cqw;
  letter-spacing: 0.2cqw;
  color: #f5e2c4;
  text-shadow: 0 0.14cqw 0 #000;
}

.cta {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.4cqw;
  margin-bottom: 4cqw;
  position: relative;
  z-index: 3;
  user-select: none;
}
.cta.blink {
  animation: ctaBlink 1.15s steps(1, end) infinite;
}
.cta .arrow {
  display: flex;
  color: #ff9500;
  filter: drop-shadow(0 0 1.4cqw rgba(255, 149, 0, 0.85));
}
.cta .arrow svg {
  width: 1.5cqw;
  height: auto;
}
.cta-label {
  font-size: 1.72cqw;
  letter-spacing: 0.42cqw;
  color: #ff9500;
  text-shadow: 0 0.2cqw 0 #1c0c04, 0.16cqw 0 0 #1c0c04, -0.16cqw 0 0 #1c0c04, 0 -0.16cqw 0 #1c0c04,
    0 0 1.8cqw rgba(0, 0, 0, 0.9);
}

.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.42) 0 1px, transparent 1px 3px);
  mix-blend-mode: multiply;
  opacity: 0.85;
}
.rgb-mask {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.05) 0 1px, rgba(0, 255, 0, 0.04) 1px 2px, rgba(0, 80, 255, 0.05) 2px 3px);
}
.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(115% 108% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 85%, rgba(0, 0, 0, 0.95) 100%);
}

.boot {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  overflow: hidden;
  background-color: #1a1a1a;
  background-image: repeating-linear-gradient(37deg, rgba(255, 255, 255, 0.55) 0 1px, rgba(0, 0, 0, 0.6) 1px 2px, rgba(255, 255, 255, 0.25) 2px 3px, transparent 3px 5px),
    repeating-linear-gradient(118deg, rgba(255, 255, 255, 0.4) 0 1px, rgba(0, 0, 0, 0.55) 1px 3px);
  animation: crtFuzz 3.4s ease-out both, crtExpandFuzz 3.4s cubic-bezier(0.3, 0.9, 0.2, 1) both, fuzzJitter 0.28s steps(6, end) infinite;
}
.boot-roll {
  position: absolute;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.12), transparent);
}
.boot-roll-a {
  height: 9%;
  animation: hroll 0.62s linear infinite, hflicker 0.3s steps(3, end) infinite;
}
.boot-roll-b {
  height: 3%;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: hroll 0.41s linear infinite reverse, hflicker 0.22s steps(3, end) infinite;
}

.entering {
  position: absolute;
  inset: 0;
  z-index: 9;
  pointer-events: none;
  overflow: hidden;
}
.fuzz {
  position: absolute;
  inset: 0;
  background-color: #1a1a1a;
  background-image: repeating-linear-gradient(37deg, rgba(255, 255, 255, 0.55) 0 1px, rgba(0, 0, 0, 0.6) 1px 2px, rgba(255, 255, 255, 0.25) 2px 3px, transparent 3px 5px);
  animation: offFuzz 2.9s ease-in both, fuzzJitter 0.22s steps(6, end) infinite;
}
.band {
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  animation: bandIn 2.9s ease-out both;
}
.band-top {
  top: 12%;
}
.band-mid {
  top: 22%;
}
.band-bottom {
  bottom: 12%;
  animation-name: bandInB;
}
.marq {
  display: flex;
  width: max-content;
  animation: marqL 5.4s linear both;
  font-size: 3.4cqw;
  letter-spacing: 0.5cqw;
  color: #fff;
  text-shadow: 0 0.24cqw 0 #1c0c04, 0 0 2cqw rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}
.marq.slow {
  animation-duration: 9s;
  font-size: 1.7cqw;
  letter-spacing: 0.3cqw;
}
.band-bottom .marq {
  animation-name: marqR;
}
.marq span {
  padding-right: 2cqw;
}
.flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(70% 60% at 50% 50%, rgba(255, 255, 255, 0.95), rgba(255, 190, 110, 0.5) 55%, transparent 82%);
  animation: offFlash 2.9s ease-out both;
}
.shut {
  position: absolute;
  left: 0;
  right: 0;
  height: 50.2%;
  background: #000;
  animation: offShutT 2.9s cubic-bezier(0.5, 0.1, 0.3, 1) both;
}
.shut-t {
  top: 0;
  transform-origin: top;
}
.shut-b {
  bottom: 0;
  transform-origin: bottom;
  animation-name: offShutB;
}
.line {
  position: absolute;
  left: 3%;
  right: 3%;
  top: calc(50% - 0.14cqw);
  height: 0.28cqw;
  background: #fff;
  box-shadow: 0 0 3cqw 1.2cqw rgba(255, 245, 220, 0.9);
  animation: offLine 2.9s ease-in-out both;
}

.fade-enter-active {
  transition: opacity 0.1s;
}
.fade-enter-from {
  opacity: 0;
}

.bezel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px 0;
}
.badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9px;
  letter-spacing: 1px;
  color: #6f6a63;
}
.led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7fdc4a;
  box-shadow: 0 0 9px 1px rgba(127, 220, 74, 0.9);
}
.knobs {
  display: flex;
  gap: 8px;
}
.knob {
  width: 30px;
  height: 5px;
  border-radius: 3px;
  background: #3a3734;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
