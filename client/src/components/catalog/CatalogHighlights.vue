<template>
  <section class="catalog-highlights">
    <div class="mx-auto max-w-[1800px] space-y-6 px-4 py-6 sm:px-6">
      <div>
        <p class="text-tiny font-bold uppercase tracking-[0.28em] text-serenade-300">Selected archive</p>
        <h2 class="mt-1 text-2xl font-black text-white">Listen First</h2>
      </div>

      <div class="space-y-5">
        <section v-for="group in groups" :key="group.title" class="highlight-group">
          <div class="highlight-heading">
            <div class="flex min-w-0 items-center gap-3">
              <span class="highlight-icon">
                <component :is="icons[group.icon]" class="h-5 w-5" />
              </span>
              <div class="min-w-0">
                <h3 class="truncate text-lg font-black text-white">{{ group.title }}</h3>
                <p class="truncate text-sm text-gray-400">{{ group.caption }}</p>
              </div>
            </div>
          </div>

          <div class="highlight-cards">
            <article
              v-for="product in group.items"
              :key="product.id"
              class="highlight-card group"
              :class="activeProductId === product.id ? 'highlight-card-active' : ''"
            >
              <div class="highlight-visual">
                <!-- Ambient Aura -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-serenade-500/10 rounded-full blur-[70px] pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:bg-serenade-500/20 z-0"></div>

                <!-- Grid Background -->
                <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] z-0"></div>
                <!-- Vignette -->
                <div class="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] z-10 pointer-events-none"></div>

                <div class="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-tiny font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                  {{ product.format }}
                </div>
                <div
                  v-if="activeProductId === product.id"
                  class="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-serenade-500/30 bg-serenade-500/20 px-3 py-1 text-tiny font-black uppercase tracking-[0.18em] text-serenade-300 shadow-[0_0_15px_rgba(242,112,29,0.3)] backdrop-blur-md"
                >
                  <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-serenade-400 shadow-[0_0_8px_rgba(242,112,29,0.8)]"></span>
                  Playing
                </div>

                <VinylAlbum
                  v-if="product.format === 'Vinyl'"
                  :title="product.title"
                  :artist="product.artist"
                  :image="product.image"
                  :active="activeProductId === product.id"
                  class="scale-90"
                />
                <CassetteTape
                  v-else-if="product.format === 'Cassette'"
                  :title="product.title"
                  :artist="product.artist"
                  :image="product.image"
                  :base-color="product.baseColor"
                  :active="activeProductId === product.id"
                />
                <VhsTapeBox
                  v-else
                  :title="product.title"
                  :artist="product.artist"
                  :image="product.image"
                  :base-color="product.baseColor"
                  :border-color="product.borderColor"
                  :disc-color="product.discColor"
                  :side-color="product.sideColor"
                />
              </div>

              <div class="highlight-body relative z-10 p-5">
                <div class="min-w-0 mb-3">
                  <p class="mb-1 truncate text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{{ product.artist }}</p>
                  <h4 class="highlight-title text-lg font-black leading-tight tracking-tight text-white drop-shadow-md">{{ product.title }}</h4>
                </div>

                <div class="highlight-meta mb-4">
                  <span>{{ product.genre }}<template v-if="product.subGenre"> / {{ product.subGenre }}</template></span>
                </div>

                <div class="mt-2 flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-2 shadow-inner">
                  <button
                    type="button"
                    class="highlight-play relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-serenade-500/50 bg-serenade-500/10 text-serenade-400 transition-all hover:scale-105 hover:bg-serenade-500 hover:text-white hover:shadow-[0_0_20px_rgba(242,112,29,0.4)]"
                    :aria-label="`${activeProductId === product.id ? 'Pause' : 'Play'} ${product.title}`"
                    @click="$emit('select', product)"
                  >
                    <Pause v-if="activeProductId === product.id" class="h-4 w-4 fill-current" />
                    <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
                  </button>
                  <p class="pr-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{{ product.duration }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Flame, Headphones, Pause, Play, Sparkles } from 'lucide-vue-next';
import CassetteTape from './media/CassetteTape.vue';
import VhsTapeBox from './media/VhsTapeBox.vue';
import VinylAlbum from './media/VinylAlbum.vue';

defineProps({
  groups: { type: Array, default: () => [] },
  activeProductId: { type: Number, default: null },
});

defineEmits(['select']);

const icons = {
  flame: Flame,
  headphones: Headphones,
  sparkles: Sparkles,
};
</script>

<style scoped>
.catalog-highlights {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background:
    linear-gradient(120deg, rgba(245, 143, 66, 0.12), transparent 36%),
    linear-gradient(180deg, #151a20, #0a0a0c);
}

.highlight-group {
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
}

.highlight-heading {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.highlight-icon {
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(245, 143, 66, 0.34);
  background: rgba(245, 143, 66, 0.12);
  color: #f58f42;
  box-shadow: 0 0 20px rgba(245, 143, 66, 0.2);
}

.highlight-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
}

.highlight-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(24px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  transition: all 0.5s ease;
}

.highlight-card:hover,
.highlight-card-active {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-8px);
}

.highlight-card-active {
  border-color: rgba(245, 143, 66, 0.5);
  box-shadow: 0 0 30px rgba(245, 143, 66, 0.2);
}

.highlight-visual {
  position: relative;
  display: flex;
  aspect-ratio: 4 / 3;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1b2027, #050607 50%, #12161a);
}

.highlight-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow-wrap: anywhere;
}

.highlight-meta {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}

.highlight-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 80%;
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid rgba(245, 143, 66, 0.46);
  background: rgba(245, 143, 66, 0.1);
  padding: 0.25rem 0.6rem;
  color: #ffc18e;
  font-size: 0.6rem;
  font-weight: 900;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  box-shadow: 0 0 12px rgba(245, 143, 66, 0.2);
}
</style>
