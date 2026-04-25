<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950">
      <HomeCarousel />
      <Catalog ref="catalogRef" @player-state="updatePlayerState" />

      <Teleport to="body">
        <aside class="mini-player" aria-label="Audio player">
          <div class="mini-main">
            <div class="mini-screen">
              <div class="mini-track">
                <span>{{ player.isPlaying ? 'Now Playing' : 'Ready' }} / {{ displayedProduct.artist }} - {{ displayedProduct.title }}</span>
              </div>
              <div class="mini-time">{{ formatTime(player.currentTime) }} / {{ displayedProduct.duration }}</div>
            </div>

            <div class="mini-progress">
              <div :style="{ width: `${player.progress}%` }"></div>
            </div>

            <div class="mini-controls">
              <button type="button" class="mini-button primary" :aria-label="player.isPlaying ? 'Pause' : 'Play'" @click="toggleCurrent">
                <Pause v-if="player.isPlaying" class="h-4 w-4 fill-current" />
                <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
              </button>
              <button type="button" class="mini-button" aria-label="Stop" @click="stopCurrent">
                <Square class="h-4 w-4 fill-current" />
              </button>
            </div>
          </div>

          <img class="mini-cover" :src="displayedProduct.image" :alt="`${displayedProduct.title} cover`" />
        </aside>
      </Teleport>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import HomeCarousel from '@/components/HomeCarousel.vue';
import Catalog from '@/layouts/Catalog.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import { Pause, Play, Square } from 'lucide-vue-next';

const catalogRef = ref(null);
const fallbackProduct = {
  id: 1,
  title: 'Retro Reels Player',
  artist: 'Select a tape',
  image: '/Yoru.jpeg',
  duration: '0:00',
};

const player = reactive({
  product: null,
  isPlaying: false,
  currentTime: 0,
  progress: 0,
});

const displayedProduct = computed(() => player.product || fallbackProduct);

const updatePlayerState = (state) => {
  player.product = state.product;
  player.isPlaying = state.isPlaying;
  player.currentTime = state.currentTime;
  player.progress = state.progress;
};

const toggleCurrent = () => {
  if (!player.product) return;
  catalogRef.value?.togglePreview(player.product);
};

const stopCurrent = () => {
  catalogRef.value?.stopPreview();
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};
</script>

<style scoped>
.mini-player {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 2147483647;
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
  grid-template-rows: auto auto 1fr;
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

.mini-progress {
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: #333;
}

.mini-progress div {
  height: 100%;
  border-radius: inherit;
  background: #00ff41;
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.55);
  transition: width 0.15s ease;
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
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

</style>
