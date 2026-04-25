<template>
  <div class="vinyl-stage" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div
      class="vinyl-record"
      :class="{
        'vinyl-record-hovering': hoverState === 'hovering',
        'vinyl-record-leaving': hoverState === 'leaving',
      }"
    >
      <div class="vinyl-disc" :class="{ 'vinyl-disc-active': active }">
        <div class="vinyl-groove vinyl-groove-1"></div>
        <div class="vinyl-groove vinyl-groove-2"></div>
        <div class="vinyl-label" :style="{ backgroundImage: `url(${image})` }">
          <span></span>
        </div>
      </div>
    </div>

    <div class="album-cover">
      <img :src="image" :alt="`${title} album cover`" />
      <div class="album-shine"></div>
      <div class="album-copy">
        <p :class="titleClass">{{ title }}</p>
        <span>{{ artist }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Untitled' },
  artist: { type: String, default: 'Unknown' },
  image: { type: String, default: '/Yoru.jpeg' },
  active: { type: Boolean, default: false },
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
.vinyl-stage {
  position: relative;
  height: 12.5rem;
  width: 17rem;
}

.album-cover {
  position: absolute;
  left: 1.25rem;
  top: 0.65rem;
  z-index: 2;
  height: 11rem;
  width: 11rem;
  overflow: hidden;
  border-radius: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: #111;
  box-shadow: 0 22px 45px rgba(0, 0, 0, 0.5);
}

.album-cover img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.album-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.28), transparent 35%, rgba(0, 0, 0, 0.4));
}

.album-copy {
  position: absolute;
  inset-x: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.82), transparent);
  padding: 2.75rem 0.75rem 0.75rem;
  color: white;
}

.album-copy span {
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
  -webkit-line-clamp: 3;
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.08;
  overflow-wrap: anywhere;
}

.cover-title-sm {
  font-size: 0.68rem;
}

.cover-title-xs {
  font-size: 0.58rem;
  line-height: 1.05;
}

.album-copy span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.vinyl-record {
  position: absolute;
  right: 1.2rem;
  top: 1rem;
  z-index: 1;
  height: 10.6rem;
  width: 10.6rem;
  transform: translateX(2.5rem) rotate(0deg);
}

.vinyl-disc {
  position: relative;
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;
  border-radius: 9999px;
  background:
    radial-gradient(circle at center, #181818 0 10%, #050505 11% 34%, #191919 35% 36%, #050505 37% 100%);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
}

.vinyl-record-hovering {
  z-index: 3;
  animation: vinyl-hover-out 0.62s ease forwards;
}

.vinyl-record-leaving {
  z-index: 3;
  animation: vinyl-hover-back 0.62s ease forwards;
}

.vinyl-disc-active {
  animation: vinyl-spin 6s linear infinite;
}

.vinyl-groove {
  position: absolute;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.vinyl-groove-1 {
  inset: 1.4rem;
}

.vinyl-groove-2 {
  inset: 2.45rem;
}

.vinyl-label {
  z-index: 2;
  display: grid;
  height: 3.6rem;
  width: 3.6rem;
  place-items: center;
  border-radius: 9999px;
  background-position: center;
  background-size: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.vinyl-label span {
  height: 0.65rem;
  width: 0.65rem;
  border-radius: 9999px;
  background: white;
}

@keyframes vinyl-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes vinyl-hover-out {
  0% {
    z-index: 1;
    transform: translateX(2.5rem) rotate(0deg);
  }

  52% {
    z-index: 1;
    transform: translateX(5.8rem) rotate(18deg);
  }

  53% {
    z-index: 3;
    transform: translateX(5.8rem) rotate(18deg);
  }

  100% {
    z-index: 3;
    transform: translateX(3.7rem) rotate(24deg);
  }
}

@keyframes vinyl-hover-back {
  0% {
    z-index: 3;
    transform: translateX(3.7rem) rotate(24deg);
  }

  48% {
    z-index: 3;
    transform: translateX(5.8rem) rotate(18deg);
  }

  49% {
    z-index: 1;
    transform: translateX(5.8rem) rotate(18deg);
  }

  100% {
    z-index: 1;
    transform: translateX(2.5rem) rotate(0deg);
  }
}
</style>
