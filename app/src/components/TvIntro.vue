<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()

// off -> bloom -> line -> static -> title, timed to match the reference prototype's
// power-on sequence (reference/showpro-arcade.dc.html Component.seq()).
const phase = ref('off')
let timeline = null

function powerOn() {
  if (phase.value !== 'off') return
  timeline?.kill()
  timeline = gsap.timeline()
  timeline
    .call(() => (phase.value = 'bloom'), [], 0)
    .call(() => (phase.value = 'line'), [], 0.23)
    .call(() => (phase.value = 'static'), [], 0.47)
    .call(() => (phase.value = 'title'), [], 1.15)
}

onBeforeUnmount(() => timeline?.kill())

function enterHall(e) {
  e.stopPropagation()
  router.push('/hall')
}

const dotSize = computed(() => (phase.value === 'bloom' ? '18px' : phase.value === 'off' ? '0px' : '4px'))
const dotOpacity = computed(() => (phase.value === 'bloom' ? 1 : 0))
const lineWidth = computed(() => (phase.value === 'line' || phase.value === 'static' ? '100%' : '0%'))
const lineOpacity = computed(() => (phase.value === 'line' ? 1 : phase.value === 'static' ? 0.35 : 0))
const staticOpacity = computed(() => (phase.value === 'static' ? 1 : 0))
const titleOpacity = computed(() => (phase.value === 'title' ? 1 : 0))
const promptOpacity = computed(() => (phase.value === 'off' ? 1 : 0))
const ledColor = computed(() => (phase.value === 'off' ? 'rgba(244,244,240,.14)' : '#ff2e6c'))
</script>

<template>
  <div
    class="tv-wrap"
    style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 22px;
      padding: 24px;
      cursor: pointer;
      background: radial-gradient(60% 60% at 50% 45%, #11172a 0%, #0a0e17 70%);
    "
    @click="powerOn"
  >
    <div
      style="
        width: min(660px, 92vw, 86vh);
        background: linear-gradient(#1f2742, #151b2e);
        border-radius: 30px;
        padding: 26px 26px 22px;
        box-shadow:
          0 40px 90px rgba(0, 0, 0, 0.7),
          inset 0 2px 0 rgba(244, 244, 240, 0.09);
      "
    >
      <div style="display: flex; gap: 22px; align-items: stretch">
        <div
          style="
            flex: 1;
            min-width: 0;
            background: #05070c;
            border-radius: 22px;
            padding: 14px;
            box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.6);
          "
        >
          <div
            style="
              position: relative;
              aspect-ratio: 4 / 3;
              border-radius: 16px;
              overflow: hidden;
              background: #04060a;
              box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.9);
            "
          >
            <div
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 0 30px 10px rgba(255,255,255,.55)',
                transition: 'width .16s ease,height .16s ease,opacity .16s ease',
                width: dotSize,
                height: dotSize,
                opacity: dotOpacity,
              }"
            ></div>

            <div
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                height: '3px',
                background: '#fff',
                boxShadow: '0 0 24px 6px rgba(255,255,255,.6)',
                transition: 'width .22s ease,opacity .2s ease',
                width: lineWidth,
                opacity: lineOpacity,
              }"
            ></div>

            <div :style="{ position: 'absolute', inset: 0, transition: 'opacity .18s linear', opacity: staticOpacity }">
              <div
                style="
                  position: absolute;
                  inset: 0;
                  animation: sp-static 0.28s steps(3) infinite;
                  background-image:
                    repeating-conic-gradient(from 0deg, rgba(244, 244, 240, 0.55) 0deg 2deg, rgba(10, 14, 23, 0.9) 2deg 4deg),
                    repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.35) 0 2px, rgba(0, 0, 0, 0.5) 2px 5px);
                  background-size:
                    140px 140px,
                    90px 90px;
                "
              ></div>
            </div>

            <div
              :style="{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                padding: '24px',
                textAlign: 'center',
                transition: 'opacity .5s ease',
                opacity: titleOpacity,
              }"
            >
              <div
                style="
                  font-family: 'Press Start 2P', monospace;
                  font-size: clamp(13px, 2.5vw, 22px);
                  line-height: 1.7;
                  color: #ffd23f;
                  text-shadow:
                    0 0 14px rgba(255, 210, 63, 0.75),
                    0 0 40px rgba(255, 46, 108, 0.35);
                  animation: sp-marquee-hum 5s infinite;
                "
              >
                SE CAMT<br />
                SHOWPRO 2026
              </div>
              <div style="font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #00e5ff">
                30 capstone projects · one arcade hall
              </div>
              <button
                class="press-start"
                style="
                  margin-top: 6px;
                  font-family: 'Press Start 2P', monospace;
                  font-size: 12px;
                  padding: 14px 22px;
                  color: #0a0e17;
                  background: #ff2e6c;
                  border: 0;
                  border-radius: 4px;
                  cursor: pointer;
                  box-shadow: 0 0 24px rgba(255, 46, 108, 0.6);
                  transition:
                    box-shadow 0.2s ease,
                    transform 0.2s ease;
                "
                @click="enterHall"
              >
                PRESS START
              </button>
            </div>

            <div
              style="
                position: absolute;
                inset: 0;
                pointer-events: none;
                background-image: repeating-linear-gradient(rgba(0, 0, 0, 0.34) 0 1px, rgba(0, 0, 0, 0) 1px 3px);
              "
            ></div>
            <div
              style="
                position: absolute;
                inset: 0;
                pointer-events: none;
                box-shadow: inset 0 0 90px 30px rgba(0, 0, 0, 0.85);
                border-radius: 16px;
              "
            ></div>
          </div>
        </div>

        <div
          style="
            width: 76px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
          "
        >
          <div style="display: flex; flex-direction: column; gap: 18px">
            <div
              style="
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: radial-gradient(circle at 34% 30%, #39456b, #10162a);
                box-shadow:
                  inset 0 2px 4px rgba(244, 244, 240, 0.14),
                  0 6px 14px rgba(0, 0, 0, 0.6);
              "
            ></div>
            <div
              style="
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: radial-gradient(circle at 34% 30%, #39456b, #10162a);
                box-shadow:
                  inset 0 2px 4px rgba(244, 244, 240, 0.14),
                  0 6px 14px rgba(0, 0, 0, 0.6);
              "
            ></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; align-items: center">
            <div
              :style="{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: ledColor,
                boxShadow: '0 0 12px ' + ledColor,
              }"
            ></div>
            <div style="width: 36px; height: 3px; border-radius: 2px; background: rgba(244, 244, 240, 0.12)"></div>
            <div style="width: 36px; height: 3px; border-radius: 2px; background: rgba(244, 244, 240, 0.12)"></div>
            <div style="width: 36px; height: 3px; border-radius: 2px; background: rgba(244, 244, 240, 0.12)"></div>
          </div>
        </div>
      </div>
      <div
        style="
          margin-top: 18px;
          height: 10px;
          border-radius: 0 0 18px 18px;
          background: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0));
        "
      ></div>
    </div>

    <div style="height: 22px; display: flex; align-items: center">
      <div :style="{ transition: 'opacity .3s ease', opacity: promptOpacity }">
        <div
          style="
            font-size: 11px;
            letter-spacing: 0.34em;
            text-transform: uppercase;
            color: #f4f4f0;
            animation: sp-prompt 2.2s ease-in-out infinite;
          "
        >
          tap to power on
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.press-start:hover {
  box-shadow: 0 0 42px rgba(255, 46, 108, 0.95);
  transform: translateY(-2px);
}
</style>
