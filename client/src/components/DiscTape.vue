<template>
  <div
    class="vhs-shell"
    :class="[width, height, baseColor, borderColor, tapeRotation, hoverScale ? 'hover:scale-110' : '']"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="vhs-side vhs-side-left" :class="sideColor"></div>
    <div class="vhs-side vhs-side-right" :class="sideColor"></div>

    <div class="vhs-top-ridge"></div>
    <div class="vhs-bottom-ridge"></div>

    <div class="vhs-reel vhs-reel-left" :class="[discColor, hovering ? 'spin-left' : '']">
      <div class="vhs-reel-ring"></div>
      <div class="vhs-reel-core"></div>
    </div>

    <div class="vhs-reel vhs-reel-right" :class="[discColor, hovering ? 'spin-right' : '']">
      <div class="vhs-reel-ring"></div>
      <div class="vhs-reel-core"></div>
    </div>

    <div class="vhs-window">
      <div class="vhs-tape-line"></div>
    </div>

    <div class="vhs-label" :style="{ backgroundImage: `url(${image})` }">
      <div class="vhs-label-shade"></div>
      <div class="vhs-title-strip" :class="[titleSize, titleBackgroundColor]">
        <span :class="titleClass">{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Default-Tape' },
  titleSize: { type: String, default: 'h-5' },
  artist: { type: String, default: 'Unknown' },
  titleBackgroundColor: { type: String, default: 'bg-gray-600' },
  width: { type: String, default: 'w-80' },
  height: { type: String, default: 'h-48' },
  baseColor: { type: String, default: 'bg-black' },
  borderColor: { type: String, default: 'border-gray-400' },
  tapeRotation: { type: String, default: 'rotate-45' },
  centerWidth: { type: String, default: 'w-32' },
  centerHeight: { type: String, default: 'h-20' },
  discSize: { type: String, default: 'w-20 h-20' },
  discColor: { type: String, default: 'bg-black' },
  discMarginLeft: { type: String, default: 'ms-6' },
  diskMarginRight: { type: String, default: '-ms-10' },
  sideColor: { type: String, default: 'bg-gray-700' },
  image: { type: String, default: '/Yoru.jpeg' },
  sideSize: { type: String, default: 'w-16 h-20' },
  hoverScale: { type: Boolean, default: true },
});

const hovering = ref(false);

const titleClass = computed(() => {
  if (props.title.length > 30) return 'vhs-title vhs-title-xs';
  if (props.title.length > 20) return 'vhs-title vhs-title-sm';
  return 'vhs-title';
});
</script>

<style scoped>
.vhs-shell {
  position: relative;
  overflow: hidden;
  border-width: 0.45rem;
  border-style: solid;
  border-radius: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 -10px 18px rgba(0, 0, 0, 0.28),
    0 18px 34px rgba(0, 0, 0, 0.36);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vhs-shell::before {
  content: "";
  position: absolute;
  inset: 0.45rem;
  border-radius: 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  pointer-events: none;
}

.vhs-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(110deg, rgba(255, 255, 255, 0.16), transparent 18%, transparent 70%, rgba(255, 255, 255, 0.08)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 8px);
  pointer-events: none;
}

.vhs-side {
  position: absolute;
  top: 22%;
  z-index: 1;
  bottom: 22%;
  width: 15%;
  opacity: 0.92;
  box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.25);
}

.vhs-side-left {
  left: 3%;
  border-radius: 0.65rem 0.25rem 0.25rem 0.65rem;
}

.vhs-side-right {
  right: 3%;
  border-radius: 0.25rem 0.65rem 0.65rem 0.25rem;
}

.vhs-top-ridge,
.vhs-bottom-ridge {
  position: absolute;
  left: 1.2rem;
  right: 1.2rem;
  z-index: 2;
  height: 0.55rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.25);
}

.vhs-top-ridge {
  top: 0.8rem;
}

.vhs-bottom-ridge {
  bottom: 0.8rem;
}

.vhs-reel {
  position: absolute;
  top: 50%;
  z-index: 3;
  display: grid;
  width: 24%;
  place-items: center;
  aspect-ratio: 1 / 1;
  transform: translateY(-50%);
  border-radius: 9999px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    inset 0 0 0 0.5rem rgba(0, 0, 0, 0.18),
    0 0 12px rgba(0, 0, 0, 0.25);
}

.vhs-reel-left {
  left: 11%;
}

.vhs-reel-right {
  right: 11%;
}

.vhs-reel-ring {
  position: absolute;
  inset: 22%;
  border-radius: 9999px;
  border: 2px dashed rgba(255, 255, 255, 0.72);
}

.vhs-reel-core {
  height: 22%;
  width: 22%;
  border-radius: 9999px;
  background: white;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.2);
}

.vhs-window {
  position: absolute;
  left: 28%;
  right: 28%;
  top: 50%;
  z-index: 2;
  height: 1.1rem;
  transform: translateY(-50%);
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.62);
}

.vhs-tape-line {
  height: 100%;
  width: 140%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.26), transparent);
  transform: translateX(-20%);
}

.vhs-label {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 4;
  width: 38%;
  height: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  border-radius: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background-position: center;
  background-size: cover;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.2);
}

.vhs-label-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.45));
}

.vhs-title-strip {
  position: absolute;
  inset-x: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 0.25rem;
  color: white;
}

.vhs-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 0.62rem;
  font-weight: 900;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.vhs-title-sm {
  font-size: 0.52rem;
}

.vhs-title-xs {
  -webkit-line-clamp: 2;
  font-size: 0.45rem;
  line-height: 1.05;
}

.spin-left {
  animation: spin-left 5s linear infinite;
}

.spin-right {
  animation: spin-right 5s linear infinite;
}

@keyframes spin-left {
  from {
    transform: translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

@keyframes spin-right {
  from {
    transform: translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateY(-50%) rotate(-360deg);
  }
}
</style>
