import { ref } from "vue";

const TRACKS = {
  title: { src: "/music/title.mp3", volume: 0.22 },
  main: { src: "/music/main.mp3", volume: 0.2 },
};

function readMuted() {
  try {
    return localStorage.getItem("showpro-muted") === "1";
  } catch (e) {
    return false;
  }
}

export const muted = ref(readMuted());
// true when the browser refused to start the title music before any click
export const soundBlocked = ref(false);

// one shared registry on window, so a hot reload can never leave a second copy of a track playing
const G = (window.__showproAudio ??= { els: {}, fades: {}, sfx: {}, lines: {}, cur: null });
const els = G.els;
const fades = G.fades;
let scene = null;
// a fresh module instance (page load or hot reload) starts from silence
Object.values(fades).forEach(clearInterval);
Object.values(els).forEach((a) => a.pause());
let titleReady = false;
let ducked = false;

function el(name) {
  if (!els[name]) {
    const a = new Audio(TRACKS[name].src);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    els[name] = a;
  }
  return els[name];
}

function fade(name, to, ms = 900) {
  const a = el(name);
  clearInterval(fades[name]);
  const from = a.volume;
  const t0 = performance.now();
  fades[name] = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k >= 1) {
      clearInterval(fades[name]);
      if (to === 0) a.pause();
    }
  }, 40);
}

function start(name) {
  const a = el(name);
  if (a.paused) a.play().catch(() => {});
  fade(name, muted.value || ducked ? 0 : TRACKS[name].volume);
}

// browsers block audio until the visitor does something, so retry on the first input
let armed = false;
function armUnlock() {
  if (armed) return;
  armed = true;
  const go = () => {
    window.removeEventListener("pointerdown", go, true);
    window.removeEventListener("keydown", go, true);
    if (scene && scene !== "title" && !muted.value) start(scene);
  };
  window.addEventListener("pointerdown", go, true);
  window.addEventListener("keydown", go, true);
}

export function setScene(next) {
  if (next === scene) return;
  const prev = scene;
  scene = next;
  if (prev) fade(prev, 0);
  soundBlocked.value = false;
  // the title track is started by the title screen itself once its CRT animation is done
  if (!next || next === "title") return;
  if (muted.value) {
    el(next);
    return;
  }
  const a = el(next);
  // a slow fade-in when coming from the title screen
  const ms = prev === "title" ? 3200 : 900;
  a.play()
    .then(() => {
      if (muted.value) a.pause();
      else fade(next, ducked ? 0 : TRACKS[next].volume, ms);
    })
    .catch(() => armUnlock());
}

export function toggleMuted() {
  muted.value = !muted.value;
  try {
    localStorage.setItem("showpro-muted", muted.value ? "1" : "0");
  } catch (e) {
    // fine, just not remembered
  }
  if (muted.value) {
    Object.keys(els).forEach((n) => fade(n, 0, 250));
  } else if (scene === "title") {
    soundBlocked.value = false;
    if (titleReady) start("title");
  } else if (scene) {
    start(scene);
  }
}

function armTitleUnlock() {
  const go = (e) => {
    window.removeEventListener("pointerdown", go, true);
    window.removeEventListener("keydown", go, true);
    window.removeEventListener("touchstart", go, true);
    // the start button has its own handling
    if (e.target && e.target.closest && e.target.closest(".cta")) {
      soundBlocked.value = false;
      return;
    }
    if (scene === "title" && titleReady && !muted.value) playTitle();
  };
  window.addEventListener("pointerdown", go, true);
  window.addEventListener("keydown", go, true);
  window.addEventListener("touchstart", go, true);
}

export function playTitle() {
  titleReady = true;
  if (scene !== "title" || muted.value) return;
  const a = el("title");
  a.volume = 0;
  a.play()
    .then(() => {
      soundBlocked.value = false;
      if (muted.value) a.pause();
      else fade("title", TRACKS.title.volume, 1800);
    })
    .catch(() => {
      soundBlocked.value = true;
      armTitleUnlock();
    });
}

export function fadeOutTitle(ms = 2400) {
  soundBlocked.value = false;
  if (!titleReady || muted.value) return;
  const a = el("title");
  // if the browser blocked it earlier, the tap allows it, so let it play and fade out
  if (a.paused) {
    a.volume = TRACKS.title.volume;
    a.play().catch(() => {});
  }
  fade("title", 0, ms);
}

// silence the background music while a demo video is playing
export function duckMusic(on) {
  if (ducked === on) return;
  ducked = on;
  if (!scene || scene === "title" || muted.value) return;
  const a = el(scene);
  if (on) fade(scene, 0, 400);
  else {
    if (a.paused) a.play().catch(() => {});
    fade(scene, TRACKS[scene].volume, 800);
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    Object.values(fades).forEach(clearInterval);
    Object.values(els).forEach((a) => a.pause());
  });
}
