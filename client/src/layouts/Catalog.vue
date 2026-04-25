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

        <div class="grid grid-cols-1 gap-5 pb-40 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

              <div class="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.16em]">
                <span class="neon-tag" :class="genreTagClass(product.genre)">{{ product.genre }}</span>
                <span class="neon-tag" :class="formatTagClass(product.format)">{{ product.format }}</span>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { ChevronLeft, ChevronRight, LayoutGrid, Pause, Play, Search, Star } from 'lucide-vue-next';
import CassetteTape from '../components/CassetteTape.vue';
import VhsTapeBox from '../components/VhsTapeBox.vue';
import VinylAlbum from '../components/VinylAlbum.vue';

const emit = defineEmits(['player-state']);

const showFilters = ref(true);
const search = ref('');
const selectedGenre = ref('All');
const selectedFormats = ref(['VHS', 'Cassette', 'Vinyl']);
const sortBy = ref('featured');
const activeProduct = ref(null);
const currentProductId = ref(1);
const isCurrentAudioPlaying = ref(false);
const currentTime = ref(0);
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
  currentProductId.value = product.id;
  emitPlayerState();

  const audio = audioById.get(product.id);
  if (!audio) return;

  if (activeProduct.value === product.id) {
    audio.pause();
    activeProduct.value = null;
    isCurrentAudioPlaying.value = false;
    emitPlayerState();
    return;
  }

  if (activeProduct.value) {
    pauseProduct(activeProduct.value);
  }

  activeProduct.value = product.id;

  try {
    await audio.play();
    isCurrentAudioPlaying.value = true;
    emitPlayerState();
  } catch (error) {
    activeProduct.value = null;
    isCurrentAudioPlaying.value = false;
    emitPlayerState();
  }
};

const stopPreview = () => {
  if (!currentProductId.value) return;

  const audio = audioById.get(currentProductId.value);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  progressById[currentProductId.value] = 0;
  currentTime.value = 0;
  activeProduct.value = null;
  isCurrentAudioPlaying.value = false;
  emitPlayerState();
};

const handleAudioEnded = (id) => {
  if (activeProduct.value === id) {
    activeProduct.value = null;
  }
  if (currentProductId.value === id) {
    isCurrentAudioPlaying.value = false;
    currentTime.value = 0;
  }
  progressById[id] = 0;
  emitPlayerState();
};

const updateProgress = (id) => {
  const audio = audioById.get(id);
  if (!audio || !audio.duration) return;

  progressById[id] = Math.min(100, (audio.currentTime / audio.duration) * 100);
  if (currentProductId.value === id) {
    currentTime.value = audio.currentTime;
    isCurrentAudioPlaying.value = !audio.paused;
    emitPlayerState();
  }
};

const currentProduct = computed(() => products.find((product) => product.id === currentProductId.value));

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
  {
    id: 7,
    title: "It's You",
    artist: 'Hu Tao',
    genre: 'Dream Pop',
    format: 'Vinyl',
    price: 30,
    rating: 5,
    duration: '3:34',
    audio: "/music/Ali Gatie - It's You  cover by Hu Tao (AI Cover) - 128.mp3",
    image: '/download (1).jpeg',
    baseColor: 'bg-rose-950',
    borderColor: 'border-rose-300',
    discColor: 'bg-rose-400',
    sideColor: 'bg-pink-100',
  },
  {
    id: 8,
    title: 'As The World Caves In',
    artist: 'Hu Tao',
    genre: 'Ballad',
    format: 'VHS',
    price: 24,
    rating: 5,
    duration: '3:38',
    audio: '/music/As The World Caves In - Matt Maltese - Cover Hu Tao - Sub Español - 256.mp3',
    image: '/download (11).jpg',
    baseColor: 'bg-zinc-950',
    borderColor: 'border-red-300',
    discColor: 'bg-red-400',
    sideColor: 'bg-stone-200',
  },
  {
    id: 9,
    title: 'Falling',
    artist: 'Hu Tao',
    genre: 'Ballad',
    format: 'Cassette',
    price: 21,
    rating: 4,
    duration: '3:57',
    audio: '/music/Harry Styles - Falling cover by Hu Tao (AI Cover).mp3',
    image: '/htlast.jpg',
    baseColor: 'bg-orange-950',
    borderColor: 'border-orange-300',
    discColor: 'bg-amber-300',
    sideColor: 'bg-orange-100',
  },
  {
    id: 10,
    title: '505',
    artist: 'Hu Tao',
    genre: 'Alt Rock',
    format: 'Vinyl',
    price: 28,
    rating: 5,
    duration: '4:13',
    audio: '/music/hu tao - 505 (voice ai) - 128.mp3',
    image: '/kyomoto.jpg',
    baseColor: 'bg-slate-950',
    borderColor: 'border-emerald-300',
    discColor: 'bg-emerald-400',
    sideColor: 'bg-slate-200',
  },
  {
    id: 11,
    title: 'Kukatakan Dengan Indah',
    artist: 'Hu Tao',
    genre: 'Indo Pop',
    format: 'VHS',
    price: 23,
    rating: 4,
    duration: '4:45',
    audio: '/music/Hu Tao - Kukatakan Dengan Indah (Ai Cover) - 128.mp3',
    image: '/oguri.jpeg',
    baseColor: 'bg-teal-950',
    borderColor: 'border-teal-300',
    discColor: 'bg-cyan-300',
    sideColor: 'bg-teal-100',
  },
  {
    id: 12,
    title: 'Semua Tentangmu',
    artist: 'Hu Tao',
    genre: 'Indo Pop',
    format: 'Cassette',
    price: 19,
    rating: 4,
    duration: '4:22',
    audio: '/music/Hu Tao - Semua Tentangmu (Ai Cover) - 128.mp3',
    image: '/subaruhoshino.jpeg',
    baseColor: 'bg-fuchsia-950',
    borderColor: 'border-fuchsia-300',
    discColor: 'bg-pink-300',
    sideColor: 'bg-fuchsia-100',
  },
  {
    id: 13,
    title: 'Separuh Aku',
    artist: 'Hu Tao',
    genre: 'Indo Rock',
    format: 'Vinyl',
    price: 27,
    rating: 5,
    duration: '4:20',
    audio: '/music/Hu Tao - Separuh Aku (Ai Cover) - 128.mp3',
    image: '/download (11).jpeg',
    baseColor: 'bg-neutral-950',
    borderColor: 'border-yellow-300',
    discColor: 'bg-yellow-400',
    sideColor: 'bg-neutral-100',
  },
  {
    id: 14,
    title: 'Lebih Dari Bintang',
    artist: 'Hu Tao',
    genre: 'Synth Pop',
    format: 'VHS',
    price: 25,
    rating: 4,
    duration: '3:52',
    audio: '/music/Lebih Dari Bintang - Hu tao ( Ai Genshin).mp3',
    image: '/download (12).jpg',
    baseColor: 'bg-indigo-950',
    borderColor: 'border-indigo-300',
    discColor: 'bg-violet-300',
    sideColor: 'bg-indigo-100',
  },
  {
    id: 15,
    title: 'Mariposa',
    artist: 'Hu Tao',
    genre: 'Dream Pop',
    format: 'Cassette',
    price: 22,
    rating: 5,
    duration: '3:30',
    audio: '/music/Mariposa - Peach Tree Rascals  cover by Hu Tao (AI Cover) - 128.mp3',
    image: '/d96e88a4-ce32-4e49-8f13-257aa58e4d0b.jpg',
    baseColor: 'bg-pink-950',
    borderColor: 'border-pink-300',
    discColor: 'bg-lime-300',
    sideColor: 'bg-pink-100',
  },
  {
    id: 16,
    title: 'Monokrom',
    artist: 'Hu Tao',
    genre: 'Acoustic',
    format: 'Vinyl',
    price: 29,
    rating: 5,
    duration: '3:35',
    audio: '/music/monokrom - Hu Tao Ai Cover.mp3',
    image: '/download (11).jpg',
    baseColor: 'bg-stone-950',
    borderColor: 'border-stone-200',
    discColor: 'bg-stone-400',
    sideColor: 'bg-stone-100',
  },
  {
    id: 17,
    title: 'December',
    artist: 'Raiden',
    genre: 'Winter Pop',
    format: 'Cassette',
    price: 20,
    rating: 4,
    duration: '4:05',
    audio: '/music/Raiden - December (Ai Cover) - 128.mp3',
    image: '/her.jpg',
    baseColor: 'bg-cyan-950',
    borderColor: 'border-cyan-200',
    discColor: 'bg-sky-300',
    sideColor: 'bg-cyan-100',
  },
  {
    id: 18,
    title: 'Somewhere Only We Know',
    artist: 'Hu Tao',
    genre: 'Acoustic',
    format: 'VHS',
    price: 24,
    rating: 5,
    duration: '3:49',
    audio: '/music/Somewhere Only We Know-Keane-Cover IA Hu Tao-Sub español - 128.mp3',
    image: '/Yoru.jpeg',
    baseColor: 'bg-emerald-950',
    borderColor: 'border-emerald-300',
    discColor: 'bg-emerald-400',
    sideColor: 'bg-green-100',
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

const emitPlayerState = () => {
  const product = currentProduct.value || products[0];

  emit('player-state', {
    product,
    isPlaying: isCurrentAudioPlaying.value,
    currentTime: currentTime.value,
    progress: progressById[product.id] || 0,
    activeProductId: activeProduct.value,
  });
};

onMounted(() => {
  emitPlayerState();
});

defineExpose({
  togglePreview,
  stopPreview,
});

const genreTagClass = (genre) => {
  const classes = {
    'J-Pop': 'neon-pink',
    'Lo-fi': 'neon-green',
    'City Pop': 'neon-cyan',
    Indie: 'neon-violet',
    'Dream Pop': 'neon-rose',
    Ballad: 'neon-red',
    'Alt Rock': 'neon-emerald',
    'Indo Pop': 'neon-teal',
    'Indo Rock': 'neon-gold',
    'Synth Pop': 'neon-indigo',
    Acoustic: 'neon-stone',
    'Winter Pop': 'neon-ice',
  };

  return classes[genre] || 'neon-amber';
};

const formatTagClass = (format) => {
  const classes = {
    VHS: 'neon-orange',
    Cassette: 'neon-blue',
    Vinyl: 'neon-lime',
  };

  return classes[format] || 'neon-amber';
};
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

.neon-tag {
  display: inline-flex;
  max-width: 50%;
  align-items: center;
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid currentColor;
  padding: 0.25rem 0.5rem;
  background: color-mix(in srgb, currentColor 14%, transparent);
  font-size: 0.6rem;
  font-weight: 900;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 0 12px color-mix(in srgb, currentColor 26%, transparent);
}

.neon-pink {
  color: #ff5bbd;
}

.neon-green {
  color: #00ff88;
}

.neon-cyan {
  color: #4de7ff;
}

.neon-violet {
  color: #b68cff;
}

.neon-rose {
  color: #ff7aa8;
}

.neon-red {
  color: #ff5d5d;
}

.neon-emerald {
  color: #37f5a6;
}

.neon-teal {
  color: #2fffd2;
}

.neon-gold {
  color: #ffd43b;
}

.neon-indigo {
  color: #8ea2ff;
}

.neon-stone {
  color: #d6d3d1;
}

.neon-ice {
  color: #9ee7ff;
}

.neon-orange {
  color: #ff8a3d;
}

.neon-blue {
  color: #6ea8ff;
}

.neon-lime {
  color: #d6ff62;
}

.neon-amber {
  color: #ffd166;
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
