<template>
  <div class="vhs-stage" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div
      class="vhs-tape"
      :class="{
        'vhs-tape-hovering': hoverState === 'hovering',
        'vhs-tape-leaving': hoverState === 'leaving',
      }"
    >
      <DiscTape
      :title="title"
      :image="image"
      :base-color="baseColor"
      :border-color="borderColor"
      :disc-color="discColor"
      :side-color="sideColor"
      width="w-64"
      height="h-40"
      center-width="w-24"
      center-height="h-16"
      disc-size="w-16 h-16"
      side-size="w-12 h-16"
      tape-rotation="rotate-0"
      :hover-scale="false"
        class="scale-75 drop-shadow-2xl"
      />
    </div>

    <div class="vhs-box">
      <img :src="image" :alt="`${title} VHS cover`" />
      <div class="vhs-spine">
        <span>{{ formatLabel }}</span>
      </div>
      <div class="vhs-copy">
        <p :class="titleClass">{{ title }}</p>
        <span>{{ artist }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import DiscTape from './DiscTape.vue';

const props = defineProps({
  title: { type: String, default: 'Untitled' },
  artist: { type: String, default: 'Unknown' },
  image: { type: String, default: '/Yoru.jpeg' },
  baseColor: { type: String, default: 'bg-black' },
  borderColor: { type: String, default: 'border-gray-400' },
  discColor: { type: String, default: 'bg-black' },
  sideColor: { type: String, default: 'bg-gray-700' },
  formatLabel: { type: String, default: 'VHS' },
});

const titleClass = computed(() => {
  if (props.title.length > 32) return 'cover-title cover-title-xs';
  if (props.title.length > 22) return 'cover-title cover-title-sm';
  return 'cover-title';
});

const hoverState = ref('idle');
let leaveTimer;

const handleMouseEnter = () => {
  window.clearTimeout(leaveTimer);
  hoverState.value = 'hovering';
};

const handleMouseLeave = () => {
  hoverState.value = 'leaving';
  leaveTimer = window.setTimeout(() => {
    hoverState.value = 'idle';
  }, 620);
};
</script>

<style scoped>
.vhs-stage {
  position: relative;
  height: 12.5rem;
  width: 17rem;
}

.vhs-box {
  position: absolute;
  left: 1.35rem;
  top: 0.25rem;
  z-index: 3;
  height: 12rem;
  width: 8.35rem;
  overflow: hidden;
  border-radius: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: #111;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.5);
  transition: transform 0.35s ease;
}

.vhs-box img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.vhs-spine {
  position: absolute;
  inset-block: 0;
  left: 0;
  display: grid;
  width: 1.4rem;
  place-items: center;
  background: rgba(0, 0, 0, 0.78);
  color: white;
  opacity: 0.78;
}

.vhs-spine span {
  rotate: -90deg;
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.22em;
}

.vhs-copy {
  position: absolute;
  inset-x: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 2.75rem 0.75rem 0.75rem 1.8rem;
  color: white;
}

.vhs-copy span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cover-title {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  font-size: 0.76rem;
  font-weight: 900;
  line-height: 1.08;
  overflow-wrap: anywhere;
}

.cover-title-sm {
  font-size: 0.64rem;
}

.cover-title-xs {
  font-size: 0.54rem;
  line-height: 1.05;
}

.vhs-copy span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.vhs-tape {
  position: absolute;
  right: 0;
  top: 2.55rem;
  z-index: 1;
  transform: translateX(0.25rem);
}

.group:hover .vhs-box {
  transform: translateX(-0.25rem);
}

.vhs-tape-hovering {
  z-index: 4;
  animation: vhs-hover-out 0.62s ease forwards;
}

.vhs-tape-leaving {
  z-index: 4;
  animation: vhs-hover-back 0.62s ease forwards;
}

@keyframes vhs-hover-out {
  0% {
    z-index: 1;
    transform: translateX(0.25rem);
  }

  52% {
    z-index: 1;
    transform: translateX(4.9rem);
  }

  53% {
    z-index: 4;
    transform: translateX(4.9rem);
  }

  100% {
    z-index: 4;
    transform: translateX(2.75rem);
  }
}

@keyframes vhs-hover-back {
  0% {
    z-index: 4;
    transform: translateX(2.75rem);
  }

  48% {
    z-index: 4;
    transform: translateX(4.9rem);
  }

  49% {
    z-index: 1;
    transform: translateX(4.9rem);
  }

  100% {
    z-index: 1;
    transform: translateX(0.25rem);
  }
}
</style>
