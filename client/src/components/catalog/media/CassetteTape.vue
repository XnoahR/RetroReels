<template>
  <div class="cassette-stage" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div
      ref="cassetteRef"
      class="cassette-shell"
      :class="baseColor"
      :style="shellStyle"
    >
      <div class="absolute inset-3 rounded-lg border border-white/25 bg-black/20"></div>

      <div class="absolute left-5 right-5 top-5 rounded-md border border-white/25 bg-white/90 px-4 py-3 text-center text-black">
        <p class="truncate text-xs font-black uppercase tracking-[0.2em]">{{ title }}</p>
        <p class="truncate text-tiny font-bold uppercase tracking-[0.18em] text-gray-600">{{ artist }}</p>
      </div>

      <div class="absolute inset-x-4 bottom-5 flex items-center justify-between rounded-full border-2 border-black/50 bg-black/40 px-3 py-2">
        <div class="cassette-reel" :class="{ 'cassette-reel-active': active }">
          <div></div>
        </div>
        <div class="h-3 w-10 shrink-0 rounded-full bg-black/70"></div>
        <div class="cassette-reel" :class="{ 'cassette-reel-active': active }">
          <div></div>
        </div>
      </div>

      <div class="absolute bottom-2 left-1/2 h-3 w-20 -translate-x-1/2 rounded-t-lg border-x-2 border-t-2 border-black/60 bg-black/20"></div>
    </div>

    <div class="cassette-case" :style="caseStyle">
      <img :src="coverImage" :alt="`${title} cassette cover`" @error="handleImageError" />
      <div class="case-spine">
        <span>Cassette</span>
      </div>
      <div class="case-copy">
        <p :class="titleClass">{{ title }}</p>
        <span>{{ artist }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { resolveTapeColor } from './tapeColors';

const props = defineProps({
  title: { type: String, default: 'Untitled' },
  artist: { type: String, default: 'Unknown' },
  image: { type: String, default: '/Yoru.jpeg' },
  baseColor: { type: String, default: 'bg-serenade-700' },
  active: { type: Boolean, default: false },
});

const fallbackImage = '/RR.png';
const imageFailed = ref(false);
const coverImage = computed(() => (imageFailed.value ? fallbackImage : props.image));

const handleImageError = () => {
  imageFailed.value = true;
};

const titleClass = computed(() => {
  if (props.title.length > 32) return 'cover-title cover-title-xs';
  if (props.title.length > 22) return 'cover-title cover-title-sm';
  return 'cover-title';
});

const cassetteRef = ref(null);
const isHovering = ref(false);
let animation = null;

const caseStyle = computed(() => ({
  transform: isHovering.value ? 'translateX(-0.5rem)' : 'translateX(0)',
}));

const shellStyle = computed(() => ({
  backgroundColor: resolveTapeColor(props.baseColor, '#792d15'),
}));

const handleMouseEnter = () => {
  isHovering.value = true;
  if (!cassetteRef.value) return;

  if (!animation) {
    animation = cassetteRef.value.animate([
      { zIndex: 1, transform: 'translateX(0.35rem)' },
      { zIndex: 1, transform: 'translateX(5.4rem)', offset: 0.5 },
      { zIndex: 4, transform: 'translateX(5.4rem)', offset: 0.51 },
      { zIndex: 4, transform: 'translateX(2.65rem)' }
    ], {
      duration: 600,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  } else {
    animation.playbackRate = 1;
    animation.play();
  }
};

const handleMouseLeave = () => {
  isHovering.value = false;
  if (animation) {
    animation.playbackRate = -1;
    animation.play();
  }
};
</script>

<style scoped>
.cassette-stage {
  position: relative;
  height: 12.5rem;
  width: 17rem;
}

.cassette-case {
  position: absolute;
  left: 1.35rem;
  top: 0.25rem;
  z-index: 3;
  height: 12rem;
  width: 8.25rem;
  overflow: hidden;
  border-radius: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: #111;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s ease-out;
}

.cassette-case img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.case-spine {
  position: absolute;
  inset-block: 0;
  left: 0;
  display: flex;
  width: 1.35rem;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.78);
  opacity: 0.78;
  overflow: hidden;
}

.case-spine span {
  display: block;
  transform: rotate(-90deg);
  transform-origin: center;
  color: white;
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
}

.case-copy {
  position: absolute;
  inset-x: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0.62) 66%, transparent);
  padding: 1.65rem 0.75rem 0.65rem 1.75rem;
  color: white;
}

.case-copy span {
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

.case-copy span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cassette-shell {
  position: absolute;
  right: 0.75rem;
  top: 2.8rem;
  z-index: 1;
  height: 7.9rem;
  width: 12.7rem;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 4px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 22px 45px rgba(0, 0, 0, 0.48);
  transform: translateX(0.35rem);
}

.cassette-reel {
  display: grid;
  flex: 0 0 2.45rem;
  height: 2.45rem;
  width: 2.45rem;
  min-height: 2.45rem;
  min-width: 2.45rem;
  aspect-ratio: 1 / 1;
  place-items: center;
  border-radius: 9999px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  background: #111;
}

.cassette-reel > div {
  flex: 0 0 1.35rem;
  height: 1.35rem;
  width: 1.35rem;
  min-height: 1.35rem;
  min-width: 1.35rem;
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  border: 2px dashed rgba(255, 255, 255, 0.8);
}

.cassette-reel-active,
.group:hover .cassette-reel {
  animation: cassette-spin 1.6s linear infinite;
}

@keyframes cassette-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
