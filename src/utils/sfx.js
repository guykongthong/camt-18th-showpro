import { muted } from "./music.js";

const SOUNDS = {
  hover: { src: "/sfx/hover.mp3", volume: 0.5 },
  start: { src: "/sfx/start.mp3", volume: 0.7 },
  slot: { src: "/sfx/slot.mp3", volume: 0.3 },
  tvon: { src: "/sfx/tv-on.mp3", volume: 0.7 },
  welcome: { src: "/sfx/welcome.mp3", volume: 0.9 },
  launch: { src: "/sfx/launch.mp3", volume: 0.6 },
  btnhover: { src: "/sfx/button-hover.mp3", volume: 0.5 },
  choose: { src: "/sfx/choose-character.mp3", volume: 0.8 },
  ready: { src: "/sfx/ready.mp3", volume: 0.6 },
};

// same shared registry as the music, so nothing is ever created twice
const G = (window.__showproAudio ??= { els: {}, fades: {}, sfx: {}, lines: {}, cur: null });

function get(name) {
  if (!G.sfx[name]) {
    const a = new Audio(SOUNDS[name].src);
    a.preload = "auto";
    a.volume = SOUNDS[name].volume;
    G.sfx[name] = a;
  }
  return G.sfx[name];
}

function line(slug) {
  if (!G.lines[slug]) {
    const a = new Audio(`/sfx/announcer/${slug}.mp3`);
    a.preload = "auto";
    a.volume = 0.9;
    G.lines[slug] = a;
  }
  return G.lines[slug];
}

// only one effect at a time: a new one cuts off the previous one
function play(a) {
  if (muted.value) return;
  try {
    if (G.cur && G.cur !== a) G.cur.pause();
    G.cur = a;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch (e) {
    // audio is optional, never break the page over it
  }
}

// plays on its own layer (does not cut the other effect) and fades out after a delay
let fadeTimer = 0;
let fadeTick = 0;
export function playSfxFaded(name, delayMs, fadeMs) {
  if (muted.value) return;
  try {
    const a = get(name);
    clearTimeout(fadeTimer);
    clearInterval(fadeTick);
    a.volume = SOUNDS[name].volume;
    a.currentTime = 0;
    a.play().catch(() => {});
    fadeTimer = setTimeout(() => {
      const from = a.volume;
      const t0 = performance.now();
      fadeTick = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / fadeMs);
        a.volume = Math.max(0, from * (1 - k));
        if (k >= 1) {
          clearInterval(fadeTick);
          a.pause();
          a.volume = SOUNDS[name].volume;
        }
      }, 40);
    }, delayMs);
  } catch (e) {
    // ignore
  }
}

// plays on its own layer, so it neither cuts nor is cut by the other effects
export function playSfxLayer(name) {
  if (muted.value) return;
  try {
    const a = get(name);
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch (e) {
    // ignore
  }
}

export function preloadSfx() {
  Object.keys(SOUNDS).forEach(get);
}
export function playSfx(name) {
  play(get(name));
}
export function preloadAnnouncer(slug) {
  try {
    line(slug);
  } catch (e) {
    // ignore
  }
}
export function playAnnouncer(slug) {
  play(line(slug));
}

// set on the title screen so the roster knows it was just entered from there
let chooseArmed = false;
export function armChoose() {
  chooseArmed = true;
}
export function takeChoose() {
  const v = chooseArmed;
  chooseArmed = false;
  return v;
}

