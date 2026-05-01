<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950">
      <HomeCarousel />
      <ExclusiveMusic
        :product="exclusiveProduct"
        :current-label="exclusiveCurrentLabel"
        :duration-label="exclusiveDurationLabel"
        :is-active="isExclusiveActive"
        :is-playing="player.isPlaying"
        :progress="isExclusiveActive ? player.progress : 0"
        @seek="seekCurrent"
        @toggle="toggleExclusive"
      />
      <Catalog ref="catalogRef" @player-state="updatePlayerState" />

      <Teleport to="body">
        <button v-if="isHomePlayerHidden" type="button" class="mini-show" aria-label="Show audio player" @click="isHomePlayerHidden = false">
          <Maximize2 class="h-4 w-4" />
          <span>{{ player.isPlaying ? 'Now Playing' : 'Player' }}</span>
        </button>
        <aside v-else class="mini-player" aria-label="Audio player">
          <button type="button" class="mini-hide" aria-label="Hide audio player" @click="isHomePlayerHidden = true">
            <Minimize2 class="h-3.5 w-3.5" />
          </button>
          <div class="mini-main">
            <div class="mini-screen">
              <div class="mini-track">
                <span>{{ player.isPlaying ? 'Now Playing' : 'Ready' }} / {{ displayedProduct.artist }} - {{ displayedProduct.title }}</span>
              </div>
              <div class="mini-time">{{ formatTime(player.currentTime) }} / {{ displayedDuration }}</div>
            </div>

            <input
              class="mini-range mini-seek"
              type="range"
              min="0"
              max="100"
              step="0.1"
              :value="player.progress"
              :style="{ '--range-fill': `${player.progress}%` }"
              :disabled="!player.product"
              aria-label="Seek audio"
              @input="seekCurrent"
            />

            <div class="mini-controls">
              <button type="button" class="mini-button primary" :aria-label="player.isPlaying ? 'Pause' : 'Play'" @click="toggleCurrent">
                <Pause v-if="player.isPlaying" class="h-4 w-4 fill-current" />
                <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
              </button>
              <button type="button" class="mini-button" aria-label="Stop" @click="stopCurrent">
                <Square class="h-4 w-4 fill-current" />
              </button>
              <div class="mini-volume">
                <Volume2 class="h-4 w-4" />
                <button
                  ref="volumeKnobRef"
                  type="button"
                  class="mini-knob"
                  role="slider"
                  aria-label="Volume"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuenow="volumePercent"
                  :style="{ '--knob-angle': `${volumeKnobAngle}deg` }"
                  @keydown="handleVolumeKeydown"
                  @pointerdown="startVolumeDrag"
                  @pointermove="dragVolume"
                  @pointerup="stopVolumeDrag"
                  @pointercancel="stopVolumeDrag"
                  @lostpointercapture="stopVolumeDrag"
                >
                  <span></span>
                </button>
                <span class="mini-volume-value">{{ volumePercent }}</span>
              </div>
            </div>
          </div>

          <img class="mini-cover" :src="displayedProduct.image" :alt="`${displayedProduct.title} cover`" />
        </aside>
      </Teleport>

    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import ExclusiveMusic from '@/components/home/ExclusiveMusic.vue';
import HomeCarousel from '@/components/home/HomeCarousel.vue';
import Catalog from '@/layouts/Catalog.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import { Maximize2, Minimize2, Pause, Play, Square, Volume2 } from 'lucide-vue-next';
import { volume as playerVolume, applyVolumeToAudio, loadPlayerVolume } from '@/stores/player';

const catalogRef = ref(null);
const volumeKnobRef = ref(null);
const isVolumeDragging = ref(false);
const isHomePlayerHidden = ref(false);
const fallbackProduct = {
  id: 1,
  title: 'Retro Reels Player',
  artist: 'Select a tape',
  image: '/Yoru.jpeg',
  duration: '0:00',
};
const exclusiveProduct = ref({
  id: 19,
  title: 'No. 1 Party Anthem',
  artist: 'Arctic Monkeys',
  genre: 'Rock',
  subGenre: 'Indie Rock',
  format: 'Vinyl',
  image: '/no1partyanthem.png',
  duration: '4:03',
});

const player = reactive({
  product: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  progress: 0,
});

const displayedProduct = computed(() => player.product || fallbackProduct);
const isExclusiveActive = computed(() => player.product?.id === exclusiveProduct.value.id);
const exclusiveCurrentLabel = computed(() => (isExclusiveActive.value ? formatTime(player.currentTime) : '0:00'));
const exclusiveDurationLabel = computed(() => {
  if (isExclusiveActive.value && player.duration) return formatTime(player.duration);
  return exclusiveProduct.value.duration;
});
const volumePercent = computed(() => Math.round(playerVolume.value * 100));
const volumeKnobAngle = computed(() => -135 + playerVolume.value * 270);

const updatePlayerState = (state) => {
  player.product = state.product;
  player.isPlaying = state.isPlaying;
  player.currentTime = state.currentTime;
  player.duration = state.duration;
  player.progress = state.progress;
};

const toggleCurrent = () => {
  if (!player.product) return;
  catalogRef.value?.togglePreview(player.product);
};

const toggleExclusive = () => {
  catalogRef.value?.togglePreview(exclusiveProduct.value);
};

const stopCurrent = () => {
  catalogRef.value?.stopPreview();
};

const seekCurrent = (event) => {
  catalogRef.value?.seekCurrent(event.target.value);
};

const setVolumeValue = (value) => {
  playerVolume.value = Math.min(1, Math.max(0, Number(value)));
};

const updateVolumeFromPointer = (event) => {
  const rect = volumeKnobRef.value?.getBoundingClientRect();
  if (!rect) return;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  let rawAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI) + 90;
  if (rawAngle > 180) rawAngle -= 360;
  if (rawAngle < -180) rawAngle += 360;

  const angle = Math.min(135, Math.max(-135, rawAngle));

  setVolumeValue((angle + 135) / 270);
};

const startVolumeDrag = (event) => {
  event.preventDefault();
  isVolumeDragging.value = true;
  event.currentTarget.setPointerCapture(event.pointerId);
  updateVolumeFromPointer(event);
};

const dragVolume = (event) => {
  if (!isVolumeDragging.value) return;
  updateVolumeFromPointer(event);
};

const stopVolumeDrag = () => {
  isVolumeDragging.value = false;
};

const handleVolumeKeydown = (event) => {
  const step = event.shiftKey ? 0.1 : 0.05;
  let nextVolume = playerVolume.value;

  if (event.key === 'ArrowUp' || event.key === 'ArrowRight') nextVolume += step;
  else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') nextVolume -= step;
  else if (event.key === 'Home') nextVolume = 0;
  else if (event.key === 'End') nextVolume = 1;
  else return;

  event.preventDefault();
  setVolumeValue(Math.min(1, Math.max(0, nextVolume)));
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const displayedDuration = computed(() => {
  if (player.duration) return formatTime(player.duration);
  return displayedProduct.value.duration;
});

const normalizeProduct = (product) => ({
  ...product,
  audio: product.track?.audioUrl || product.previewUrl || '',
  baseColor: product.vhsDesign?.baseColor || 'bg-zinc-950',
  borderColor: product.vhsDesign?.borderColor || 'border-zinc-500',
  discColor: product.vhsDesign?.discColor || 'bg-zinc-300',
  sideColor: product.vhsDesign?.sideColor || 'bg-zinc-100',
});

const loadExclusive = async () => {
  try {
    const { data } = await customFetch.get('admin/exclusive/current');
    if (data.data?.product) {
      exclusiveProduct.value = normalizeProduct(data.data.product);
    }
  } catch {
    // Home can still render with the baked-in fallback exclusive.
  }
};

onMounted(async () => {
  await loadPlayerVolume();
  loadExclusive();
});

onBeforeRouteLeave((to) => {
  if (to.name === 'ProductDetail') {
    sessionStorage.setItem('homeScroll', String(window.scrollY));
  }
});
</script>

<style scoped>
.mini-player {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 2147483000;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 7.25rem;
  gap: 1rem;
  width: min(30rem, calc(100vw - 2rem));
  align-items: stretch;
  border: 2px solid #404040;
  border-radius: 8px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 1rem;
  color: #ccc;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  isolation: isolate;
  font-family: "Courier New", monospace;
}

.mini-hide,
.mini-show {
  border: 1px solid #555;
  border-radius: 4px;
  background: linear-gradient(145deg, #404040, #2a2a2a);
  color: #ccc;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition: border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.mini-hide:hover,
.mini-show:hover {
  border-color: #ff6b35;
  color: #fff;
  transform: translateY(-1px);
}

.mini-hide {
  position: absolute;
  right: 0.55rem;
  top: 0.55rem;
  z-index: 2;
  display: inline-flex;
  height: 1.75rem;
  width: 1.75rem;
  align-items: center;
  justify-content: center;
}

.mini-show {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 2147483000;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.mini-cover {
  display: block;
  height: 7.25rem;
  width: 7.25rem;
  overflow: hidden;
  border-radius: 4px;
  border: 2px inset #333;
  background: #111;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  object-fit: cover;
}

.mini-main {
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 0.75rem;
  min-width: 0;
}

.mini-screen {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  min-height: 3.5rem;
  border: 2px inset #333;
  border-radius: 4px;
  background: #0a0a0a;
  padding: 0.75rem;
}

.mini-track {
  overflow: hidden;
  white-space: nowrap;
}

.mini-track span {
  display: inline-block;
  padding-left: 100%;
  color: #00ff41;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 8px #00ff41;
  text-transform: uppercase;
  animation: player-marquee 8s linear infinite;
}

.mini-time {
  color: #ff6b35;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 6px #ff6b35;
  white-space: nowrap;
}

.mini-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mini-volume {
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: 0.45rem;
  color: #00ff41;
}

.mini-knob {
  position: relative;
  display: grid;
  height: 2.5rem;
  width: 2.5rem;
  touch-action: none;
  place-items: center;
  border: 1px solid #555;
  border-radius: 999px;
  background:
    radial-gradient(circle at 38% 32%, rgba(255, 255, 255, 0.28), transparent 24%),
    linear-gradient(145deg, #4c4c4c, #171717);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.22),
    inset 0 -4px 8px rgba(0, 0, 0, 0.55),
    0 0 0 2px rgba(0, 0, 0, 0.45);
  cursor: grab;
}

.mini-knob:active {
  cursor: grabbing;
}

.mini-knob:focus-visible {
  outline: 2px solid #00ff41;
  outline-offset: 3px;
}

.mini-knob::before {
  content: "";
  position: absolute;
  inset: 0.35rem;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle, #292929 0 34%, #111 35% 100%);
}

.mini-knob span {
  position: absolute;
  top: 0.34rem;
  left: 50%;
  z-index: 1;
  height: 0.65rem;
  width: 0.16rem;
  transform: translateX(-50%) rotate(var(--knob-angle));
  transform-origin: 50% 0.9rem;
  border-radius: 999px;
  background: #ff6b35;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.85);
}

.mini-volume-value {
  min-width: 1.6rem;
  color: #ff6b35;
  font-size: 0.65rem;
  font-weight: 800;
  text-align: right;
  text-shadow: 0 0 6px rgba(255, 107, 53, 0.75);
}

.mini-range {
  width: 100%;
  height: 0.45rem;
  cursor: pointer;
  appearance: none;
  border: 1px solid #222;
  border-radius: 999px;
  background:
    linear-gradient(90deg, #00ff41, #00ff41) 0 / var(--range-fill, 0%) 100% no-repeat,
    #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7);
}

.mini-range:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.mini-range::-webkit-slider-thumb {
  height: 1rem;
  width: 1rem;
  appearance: none;
  border: 2px solid #101010;
  border-radius: 999px;
  background: #ff6b35;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.45);
}

.mini-range::-moz-range-thumb {
  height: 0.8rem;
  width: 0.8rem;
  border: 2px solid #101010;
  border-radius: 999px;
  background: #ff6b35;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.45);
}

.mini-button {
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #555;
  background: linear-gradient(145deg, #404040, #2a2a2a);
  color: #ccc;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.mini-button:hover {
  border-color: #666;
  background: linear-gradient(145deg, #505050, #3a3a3a);
  color: #fff;
}

.mini-button.primary {
  height: 2.75rem;
  width: 2.75rem;
  border-color: #ff6b35;
  background: linear-gradient(145deg, #ff6b35, #e55a2b);
  color: white;
}

.mini-button.primary:hover {
  background: linear-gradient(145deg, #ff7849, #f06439);
  box-shadow: 0 0 12px rgba(255, 107, 53, 0.4);
}

@keyframes player-marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}

@media (max-width: 640px) {
  .mini-player {
    right: 0.5rem;
    bottom: 0.5rem;
    width: calc(100vw - 1rem);
    grid-template-columns: minmax(0, 1fr) 5rem;
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .mini-cover {
    height: 5rem;
    width: 5rem;
  }

  .mini-screen {
    min-height: 2.5rem;
    padding: 0.5rem;
  }

  .mini-track span {
    font-size: 0.7rem;
  }

  .mini-controls {
    gap: 0.35rem;
  }

  .mini-button {
    height: 1.85rem;
    width: 1.85rem;
  }

  .mini-button.primary {
    height: 2.25rem;
    width: 2.25rem;
  }

  .mini-show {
    right: 0.5rem;
    bottom: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.65rem;
  }
}
</style>
