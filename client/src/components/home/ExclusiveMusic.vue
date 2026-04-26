<template>
  <section class="exclusive-music">
    <div class="exclusive-inner relative z-10">
      <div class="exclusive-copy">
        <div class="inline-flex items-center gap-3 mb-4 rounded-full border border-serenade-500/30 bg-serenade-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(242,112,29,0.15)]">
          <span class="h-2 w-2 animate-pulse rounded-full bg-serenade-400 shadow-[0_0_8px_rgba(242,112,29,0.8)]"></span>
          <p class="exclusive-eyebrow m-0">Exclusive Premiere</p>
        </div>
        <h2 class="drop-shadow-xl">{{ product.title }}</h2>
        <p class="exclusive-desc text-lg">
          A limited shelf feature for late-night listening, warm headphones, and one more rewind before the catalog opens.
        </p>

        <div class="exclusive-player relative overflow-hidden">
          <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30"></div>
          
          <button
            type="button"
            class="exclusive-play relative z-10"
            :aria-label="isActive && isPlaying ? 'Pause exclusive music' : 'Play exclusive music'"
            @click="$emit('toggle')"
          >
            <Pause v-if="isActive && isPlaying" class="h-6 w-6 fill-current" />
            <Play v-else class="ml-1 h-6 w-6 fill-current" />
          </button>

          <div class="min-w-0 flex-1 relative z-10">
            <div class="mb-3 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.2em]">
              <span class="truncate text-white drop-shadow-md">{{ product.artist }}</span>
              <span class="shrink-0 text-serenade-300 drop-shadow-[0_0_4px_rgba(242,112,29,0.6)]">{{ currentLabel }} <span class="text-white/30 mx-1">/</span> {{ durationLabel }}</span>
            </div>
            
            <div class="relative h-2 rounded-full bg-white/5 shadow-inner backdrop-blur-sm group">
              <input
                class="exclusive-seek absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                type="range"
                min="0"
                max="100"
                step="0.1"
                :value="isActive ? progress : 0"
                aria-label="Seek exclusive music"
                @input="$emit('seek', $event)"
              />
              <div class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-serenade-600 to-amber-300 pointer-events-none transition-all duration-300 ease-out" :style="{ width: `${isActive ? progress : 0}%` }">
                <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-4 rounded-full bg-white shadow-[0_0_10px_rgba(242,112,29,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="absolute inset-y-0 left-0 rounded-full bg-serenade-400 blur-sm opacity-50 pointer-events-none transition-all duration-300 ease-out" :style="{ width: `${isActive ? progress : 0}%` }"></div>
            </div>
          </div>
        </div>

        <div class="exclusive-tags mt-8">
          <span class="shadow-[0_0_15px_rgba(242,112,29,0.15)]">{{ product.genre }} / {{ product.subGenre }}</span>
          <span class="shadow-[0_0_15px_rgba(242,112,29,0.15)]">{{ product.format }}</span>
        </div>
      </div>

      <div class="exclusive-art" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-serenade-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="record-wrap relative z-10">
          <VinylAlbum
            :title="product.title"
            :artist="product.artist"
            :image="product.image"
            :active="isActive && isPlaying"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Pause, Play } from 'lucide-vue-next';
import VinylAlbum from '@/components/catalog/media/VinylAlbum.vue';

defineProps({
  product: { type: Object, required: true },
  currentLabel: { type: String, default: '0:00' },
  durationLabel: { type: String, default: '0:00' },
  isActive: { type: Boolean, default: false },
  isPlaying: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
});

defineEmits(['seek', 'toggle']);
</script>

<style scoped>
.exclusive-music {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background:
    linear-gradient(135deg, #0a0a0c, #151a20 56%, #050607);
}

.exclusive-inner {
  display: grid;
  min-height: 34rem;
  max-width: 1800px;
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  padding: 4.25rem 1rem;
}

.exclusive-copy {
  position: relative;
  z-index: 2;
  max-width: 44rem;
}

.exclusive-eyebrow {
  color: #f58f42;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(245, 143, 66, 0.5);
}

.exclusive-copy h2 {
  margin-top: 0.5rem;
  color: white;
  font-size: clamp(2.5rem, 7vw, 5.75rem);
  font-weight: 950;
  line-height: 0.92;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.exclusive-desc {
  margin-top: 1.25rem;
  max-width: 36rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 400;
  line-height: 1.7;
}

.exclusive-player {
  margin-top: 2.5rem;
  display: flex;
  max-width: 40rem;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(24px);
  padding: 1.5rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 30px 60px -15px rgba(0, 0, 0, 0.6);
}

.exclusive-play {
  display: inline-flex;
  height: 4rem;
  width: 4rem;
  shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8d4e, #ff762b);
  color: white;
  box-shadow: 0 0 30px rgba(255, 118, 43, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.exclusive-play:hover {
  transform: scale(1.08);
  box-shadow: 0 0 40px rgba(255, 118, 43, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

.exclusive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.exclusive-tags span {
  border: 1px solid rgba(245, 143, 66, 0.3);
  border-radius: 999px;
  background: rgba(245, 143, 66, 0.1);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  color: #ffc18e;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.exclusive-art {
  position: relative;
  display: flex;
  min-height: 26rem;
  align-items: center;
  justify-content: center;
  margin-left: -1.5rem;
}

.record-wrap {
  transform: perspective(900px) rotate(5deg) skewY(4deg) scale(1.72);
  filter: drop-shadow(0 40px 50px rgba(0, 0, 0, 0.6));
}

@media (min-width: 1024px) {
  .exclusive-inner {
    grid-template-columns: minmax(0, 0.9fr) minmax(30rem, 0.8fr);
    min-height: 46rem;
    padding: 6rem 3rem;
  }

  .exclusive-art {
    justify-content: center;
    margin-left: -5rem;
  }

  .record-wrap {
    transform: perspective(900px) rotate(6deg) skewY(5deg) scale(2.22);
  }
}
</style>
