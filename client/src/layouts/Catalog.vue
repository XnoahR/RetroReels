<template>
  <section class="relative flex min-h-[calc(100vh-4rem)] flex-col bg-shark-950 text-white">
    <div class="border-b border-white/10 bg-shark-950/95 px-4 py-5 sm:px-6 lg:sticky lg:top-16 lg:z-30">
      <div>
        <p class="text-tiny font-semibold uppercase tracking-[0.24em] text-serenade-300">Now browsing</p>
        <h2 class="text-xl font-bold sm:text-2xl">Retro Catalog</h2>
      </div>
    </div>

    <div class="flex flex-1 flex-col lg:flex-row">
      <Transition name="filter-panel">
        <aside
          v-if="showFilters"
          class="relative border-b border-white/10 bg-black/35 p-4 lg:sticky lg:top-[8.25rem] lg:h-[calc(100vh-8.25rem)] lg:w-1/4 lg:min-w-72 lg:border-b-0 lg:border-r lg:p-6"
        >
          <button
            type="button"
            class="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/10 text-gray-300 transition hover:border-serenade-300 hover:text-serenade-200"
            aria-label="Hide filters"
            @click="showFilters = false"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>

          <div class="space-y-6 pr-8">
            <div class="relative">
              <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-serenade-200" />
              <input
                v-model="search"
                type="search"
                class="h-11 w-full rounded-md border border-white/10 bg-shark-900 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-serenade-300 focus:ring-2 focus:ring-serenade-400/20"
                placeholder="Search artist or title"
              />
            </div>

            <div>
              <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Genre</p>
              <div class="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <button
                  v-for="genre in genres"
                  :key="genre"
                  type="button"
                  class="rounded-md border px-3 py-2 text-left text-sm transition"
                  :class="selectedGenre === genre
                    ? 'border-serenade-300 bg-serenade-500/20 text-serenade-100'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:text-white'"
                  @click="selectedGenre = genre"
                >
                  {{ genre }}
                </button>
              </div>
            </div>

            <div>
              <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Format</p>
              <div class="space-y-2">
                <label
                  v-for="format in formats"
                  :key="format"
                  class="flex cursor-pointer items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                >
                  <span>{{ format }}</span>
                  <input v-model="selectedFormats" :value="format" type="checkbox" class="h-4 w-4 accent-serenade-500" />
                </label>
              </div>
            </div>
          </div>
        </aside>
      </Transition>

      <Transition name="filter-rail">
        <button
          v-if="!showFilters"
          type="button"
          class="sticky top-[8.25rem] z-20 hidden h-[calc(100vh-8.25rem)] w-12 shrink-0 items-start justify-center border-r border-white/10 bg-black/35 pt-6 text-gray-300 transition hover:bg-black/50 hover:text-serenade-200 lg:flex"
          aria-label="Show filters"
          @click="showFilters = true"
        >
          <ChevronRight class="h-5 w-5" />
        </button>
      </Transition>

      <Transition name="filter-mobile">
        <button
          v-if="!showFilters"
          type="button"
          class="m-4 inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 text-sm text-gray-200 lg:hidden"
          @click="showFilters = true"
        >
          <ChevronRight class="h-4 w-4" />
          Filters
        </button>
      </Transition>

      <main class="flex-1 px-4 py-5 sm:px-6">
        <div class="mb-5 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <LayoutGrid class="h-4 w-4 text-serenade-300" />
            <span>{{ filteredProducts.length }} tapes found</span>
          </div>
          <select
            v-model="sortBy"
            class="h-10 rounded-md border border-white/10 bg-shark-900 px-3 text-sm text-white outline-none focus:border-serenade-300"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price low</option>
            <option value="price-high">Price high</option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-5 pb-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="group overflow-hidden rounded-lg border border-white/10 bg-[#171b20] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-serenade-300/70"
            :class="activeProduct === product.id ? 'is-playing border-serenade-300 shadow-[0_0_28px_rgba(242,112,29,0.32)] ring-1 ring-serenade-300/50' : ''"
          >
            <div class="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-shark-800 via-black to-shark-900">
              <div class="absolute left-4 top-4 rounded bg-black/45 px-2 py-1 text-tiny font-bold uppercase tracking-[0.2em] text-serenade-200">
                {{ product.format }}
              </div>
              <div
                v-if="activeProduct === product.id"
                class="absolute right-4 top-4 z-20 flex items-center gap-2 rounded bg-serenade-500 px-2 py-1 text-tiny font-black uppercase tracking-[0.18em] text-white shadow-[0_0_18px_rgba(242,112,29,0.45)]"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
                Playing
              </div>
              <VinylAlbum
                v-if="product.format === 'Vinyl'"
                :title="product.title"
                :artist="product.artist"
                :image="product.image"
                :active="activeProduct === product.id"
                class="scale-90"
              />
              <CassetteTape
                v-else-if="product.format === 'Cassette'"
                :title="product.title"
                :artist="product.artist"
                :image="product.image"
                :base-color="product.baseColor"
                :active="activeProduct === product.id"
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

            <div class="space-y-3 p-4">
              <audio
                :ref="(el) => setAudioRef(el, product.id)"
                :src="product.audio"
                preload="metadata"
                @ended="handleAudioEnded(product.id)"
                @timeupdate="updateProgress(product.id)"
              ></audio>

              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="card-title text-base font-bold leading-tight text-white">{{ product.title }}</h3>
                  <p class="truncate text-sm text-gray-400">{{ product.artist }}</p>
                </div>
                <span class="shrink-0 rounded-md bg-serenade-500 px-2 py-1 text-xs font-bold text-white">
                  ${{ product.price }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-gray-500">
                <span>{{ product.genre }}</span>
                <span>{{ product.format }}</span>
              </div>

              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-1 text-serenade-300">
                  <Star v-for="star in product.rating" :key="star" class="h-3.5 w-3.5 fill-current" />
                </div>
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-serenade-500 text-white transition hover:bg-serenade-400"
                  :aria-label="`Play ${product.title}`"
                  @click="togglePreview(product)"
                >
                  <Pause v-if="activeProduct === product.id" class="h-4 w-4 fill-current" />
                  <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
                </button>
              </div>

              <div class="rounded-md border border-white/10 bg-black/30 p-2">
                <div class="mb-2 flex items-center justify-between text-tiny uppercase tracking-[0.18em] text-gray-500">
                  <div class="min-w-0 flex-1 overflow-hidden">
                    <div v-if="activeProduct === product.id" class="marquee text-serenade-200">
                      <span>Currently Playing - {{ product.artist }} - {{ product.title }}</span>
                    </div>
                    <span v-else>Preview</span>
                  </div>
                  <span>{{ product.duration }}</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full bg-serenade-400 transition-all"
                    :style="{ width: `${progressById[product.id] || 0}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { ChevronLeft, ChevronRight, LayoutGrid, Pause, Play, Search, Star } from 'lucide-vue-next';
import CassetteTape from '../components/CassetteTape.vue';
import VhsTapeBox from '../components/VhsTapeBox.vue';
import VinylAlbum from '../components/VinylAlbum.vue';

const showFilters = ref(true);
const search = ref('');
const selectedGenre = ref('All');
const selectedFormats = ref(['VHS', 'Cassette', 'Vinyl']);
const sortBy = ref('featured');
const activeProduct = ref(null);
const audioById = new Map();
const progressById = reactive({});

const setAudioRef = (el, id) => {
  if (el) audioById.set(id, el);
};

const pauseProduct = (id) => {
  const audio = audioById.get(id);
  if (!audio) return;

  audio.pause();
};

const togglePreview = async (product) => {
  const audio = audioById.get(product.id);
  if (!audio) return;

  if (activeProduct.value === product.id) {
    audio.pause();
    activeProduct.value = null;
    return;
  }

  if (activeProduct.value) {
    pauseProduct(activeProduct.value);
  }

  activeProduct.value = product.id;

  try {
    await audio.play();
  } catch (error) {
    activeProduct.value = null;
  }
};

const handleAudioEnded = (id) => {
  if (activeProduct.value === id) {
    activeProduct.value = null;
  }
  progressById[id] = 0;
};

const updateProgress = (id) => {
  const audio = audioById.get(id);
  if (!audio || !audio.duration) return;

  progressById[id] = Math.min(100, (audio.currentTime / audio.duration) * 100);
};

const products = [
  {
    id: 1,
    title: 'Moechakka Fire',
    artist: 'Ellen Joe',
    genre: 'J-Pop',
    format: 'VHS',
    price: 22,
    rating: 5,
    duration: '2:48',
    audio: '/music/【ゼンゼロ】モエチャッカファイア   エレン・ジョー（CV：若山詩音）cover - 128.mp3',
    image: '/ejm3.jpg',
    baseColor: 'bg-black',
    borderColor: 'border-white',
    discColor: 'bg-red-500',
    sideColor: 'bg-gray-500',
  },
  {
    id: 2,
    title: 'Put Your Head on My Shoulder',
    artist: 'Hu Tao',
    genre: 'Lo-fi',
    format: 'Cassette',
    price: 18,
    rating: 4,
    duration: '3:12',
    audio: '/music/Hu Tao - Put Your Head on My Shoulder.mp3',
    image: '/ht.png',
    baseColor: 'bg-red-800',
    borderColor: 'border-red-400',
    discColor: 'bg-red-300',
    sideColor: 'bg-red-100',
  },
  {
    id: 3,
    title: 'Liquid-Formed Sadness',
    artist: 'Lime',
    genre: 'City Pop',
    format: 'VHS',
    price: 26,
    rating: 5,
    duration: '3:40',
    audio: '/music/ChiliChill - My Sadness is Liquid-Formed  Japanese Cover - 128.mp3',
    image: '/pasan.jpg',
    baseColor: 'bg-purple-800',
    borderColor: 'border-purple-400',
    discColor: 'bg-purple-300',
    sideColor: 'bg-purple-100',
  },
  {
    id: 4,
    title: "I Can't Stop The Loneliness",
    artist: 'ANRI',
    genre: 'City Pop',
    format: 'Vinyl',
    price: 32,
    rating: 5,
    duration: '4:18',
    audio: "/music/ANRI - I Can't Stop The Loneliness - 128-1.mp3",
    image: '/her.jpg',
    baseColor: 'bg-sky-800',
    borderColor: 'border-sky-400',
    discColor: 'bg-sky-300',
    sideColor: 'bg-sky-100',
  },
  {
    id: 5,
    title: 'Wanderlust',
    artist: 'Metric',
    genre: 'Indie',
    format: 'Cassette',
    price: 20,
    rating: 4,
    duration: '3:31',
    audio: '/music/[Metric] - Wanderlust - 128.mp3',
    image: '/skizo.jpg',
    baseColor: 'bg-gray-800',
    borderColor: 'border-gray-400',
    discColor: 'bg-black',
    sideColor: 'bg-gray-100',
  },
  {
    id: 6,
    title: 'Yoru Tape',
    artist: 'Night Archive',
    genre: 'Lo-fi',
    format: 'VHS',
    price: 16,
    rating: 4,
    duration: '2:56',
    audio: '/music/Hu Tao - Put Your Head on My Shoulder.mp3',
    image: '/Yoru.jpeg',
    baseColor: 'bg-bay-leaf-900',
    borderColor: 'border-bay-leaf-300',
    discColor: 'bg-bay-leaf-500',
    sideColor: 'bg-bay-leaf-700',
  },
];

const genres = computed(() => ['All', ...new Set(products.map((product) => product.genre))]);
const formats = computed(() => [...new Set(products.map((product) => product.format))]);

const filteredProducts = computed(() => {
  const query = search.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesSearch = [product.title, product.artist].some((value) => value.toLowerCase().includes(query));
    const matchesGenre = selectedGenre.value === 'All' || product.genre === selectedGenre.value;
    const matchesFormat = selectedFormats.value.length === 0 || selectedFormats.value.includes(product.format);

    return matchesSearch && matchesGenre && matchesFormat;
  });

  return [...filtered].sort((first, second) => {
    if (sortBy.value === 'price-low') return first.price - second.price;
    if (sortBy.value === 'price-high') return second.price - first.price;
    return first.id - second.id;
  });
});
</script>

<style scoped>
.filter-panel-enter-active,
.filter-panel-leave-active {
  transition:
    opacity 0.38s ease,
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    flex-basis 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    min-width 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.42s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
  will-change: transform, opacity, flex-basis;
}

.filter-panel-enter-from,
.filter-panel-leave-to {
  flex-basis: 0;
  min-width: 0;
  opacity: 0;
  padding-left: 0;
  padding-right: 0;
  transform: translateX(-1.4rem);
}

.filter-panel-enter-to,
.filter-panel-leave-from {
  flex-basis: 25%;
  opacity: 1;
  transform: translateX(0);
}

.filter-rail-enter-active,
.filter-rail-leave-active,
.filter-mobile-enter-active,
.filter-mobile-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.filter-rail-enter-from,
.filter-rail-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}

.filter-mobile-enter-from,
.filter-mobile-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.card-title {
  display: -webkit-box;
  min-height: 2.25rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow-wrap: anywhere;
}

.is-playing {
  background:
    linear-gradient(180deg, rgba(242, 112, 29, 0.12), transparent 42%),
    #171b20;
}

.is-playing :deep(.vinyl-disc),
.is-playing :deep(.cassette-shell),
.is-playing :deep(.vhs-tape) {
  filter: drop-shadow(0 0 14px rgba(242, 112, 29, 0.42));
}

.marquee {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}

.marquee span {
  display: inline-block;
  min-width: 100%;
  animation: marquee 7s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

@media (max-width: 1023px) {
  .filter-panel-enter-to,
  .filter-panel-leave-from {
    flex-basis: auto;
  }
}
</style>
