<script setup>
defineProps({
  project: { type: Object, required: true },
})
const emit = defineEmits(['close'])

function stop(e) {
  e.stopPropagation()
}
</script>

<template>
  <div
    style="
      position: fixed;
      inset: 0;
      z-index: 40;
      background: rgba(5, 7, 12, 0.86);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    "
    @click="emit('close')"
  >
    <div
      style="
        width: min(720px, 100%);
        max-height: 86vh;
        overflow: auto;
        background: linear-gradient(#1a2138, #12182a);
        border: 1px solid rgba(244, 244, 240, 0.12);
        border-radius: 14px;
        padding: clamp(22px, 3vw, 36px);
        animation: sp-rise 0.26s ease both;
      "
      @click="stop"
    >
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 18px">
        <div>
          <div
            :style="{
              fontFamily: '\'Press Start 2P\', monospace',
              fontSize: '7.5px',
              color: project.zoneColor,
              marginBottom: '12px',
            }"
          >
            {{ project.zoneLabel }}
          </div>
          <div
            style="
              font-family: 'Press Start 2P', monospace;
              font-size: 13px;
              line-height: 1.7;
              color: #ffd23f;
              text-shadow: 0 0 14px rgba(255, 210, 63, 0.6);
            "
          >
            {{ project.name }}
          </div>
        </div>
        <button
          class="close-btn"
          style="
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            padding: 9px 11px;
            color: #f4f4f0;
            background: transparent;
            border: 1px solid rgba(244, 244, 240, 0.2);
            border-radius: 4px;
            cursor: pointer;
          "
          @click="emit('close')"
        >
          X
        </button>
      </div>

      <div
        :style="{
          position: 'relative',
          margin: '24px 0',
          aspectRatio: '16 / 9',
          borderRadius: '8px',
          overflow: 'hidden',
          background: project.photo ? undefined : project.photoFallback,
        }"
      >
        <img
          v-if="project.photo"
          :src="project.photo"
          :alt="project.name"
          style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover"
        />
        <div
          v-else
          style="
            position: absolute;
            inset: 0;
            display: flex;
            align-items: flex-end;
            padding: 14px;
            font-family: ui-monospace, Menlo, monospace;
            font-size: 10px;
            color: rgba(244, 244, 240, 0.6);
          "
        >
          [ project photo ]
        </div>
        <div
          style="
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(rgba(0, 0, 0, 0.28) 0 1px, rgba(0, 0, 0, 0) 1px 3px);
          "
        ></div>
      </div>

      <p style="margin: 0 0 24px; font-size: 15.5px; line-height: 1.65; color: rgba(244, 244, 240, 0.85); text-wrap: pretty">
        {{ project.description }}
      </p>

      <div style="display: grid; gap: 22px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))">
        <div>
          <div
            style="
              font-size: 11px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: rgba(244, 244, 240, 0.45);
              margin-bottom: 12px;
            "
          >
            Tech stack
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <span
              v-for="t in project.stack"
              :key="t"
              style="
                font-size: 12.5px;
                padding: 6px 10px;
                border-radius: 4px;
                background: rgba(0, 229, 255, 0.1);
                border: 1px solid rgba(0, 229, 255, 0.3);
                color: #00e5ff;
              "
            >
              {{ t }}
            </span>
          </div>
        </div>
        <div>
          <div
            style="
              font-size: 11px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: rgba(244, 244, 240, 0.45);
              margin-bottom: 12px;
            "
          >
            Team
          </div>
          <div style="font-size: 13.5px; line-height: 1.8; color: rgba(244, 244, 240, 0.75)">
            <div>{{ project.teamLine }}</div>
            <div>{{ project.advisorLine }}</div>
          </div>
        </div>
      </div>

      <div
        style="
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid rgba(244, 244, 240, 0.1);
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        "
      >
        <a
          v-for="l in project.links"
          :key="l.label"
          :href="l.href"
          class="modal-link"
          style="
            font-family: 'Press Start 2P', monospace;
            font-size: 9px;
            padding: 12px 14px;
            border-radius: 4px;
            text-decoration: none;
            color: #0a0e17;
            background: #ffd23f;
            transition: box-shadow 0.2s ease;
          "
        >
          {{ l.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.close-btn:hover {
  border-color: #ff2e6c;
  color: #ff2e6c;
}
.modal-link:hover {
  box-shadow: 0 0 24px rgba(255, 210, 63, 0.6);
}
</style>
