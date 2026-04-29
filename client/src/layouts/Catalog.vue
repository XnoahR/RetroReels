<template>
  <section class="relative flex min-h-[calc(100vh-4rem)] flex-col bg-shark-950 text-white">
    <CatalogHighlights :groups="highlightGroups" :active-product-id="activeProduct" @select="togglePreview" />

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
          class="relative max-h-[calc(100vh-5rem)] overflow-hidden border-b border-white/5 bg-white/[0.015] backdrop-blur-2xl p-4 lg:sticky lg:top-[8.25rem] lg:h-[calc(100vh-8.25rem)] lg:max-h-none lg:w-1/4 lg:min-w-72 lg:border-b-0 lg:border-r lg:p-6 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)]"
        >
          <button
            type="button"
            class="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-400 transition hover:border-serenade-500/50 hover:bg-serenade-500/10 hover:text-serenade-300 hover:shadow-[0_0_15px_rgba(242,112,29,0.3)]"
            aria-label="Hide filters"
            @click="showFilters = false"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>

          <div class="filter-scroll max-h-[calc(100vh-7rem)] space-y-8 overflow-y-auto pr-8 lg:h-full lg:max-h-none lg:pb-8">
            <div class="relative group/search">
              <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition group-focus-within/search:text-serenade-400" />
              <input
                v-model="search"
                type="search"
                class="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white shadow-inner outline-none transition placeholder:text-gray-600 focus:border-serenade-500/50 focus:bg-black/40 focus:ring-4 focus:ring-serenade-500/10"
                placeholder="Search artist or title..."
              />
            </div>

            <div>
              <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <span class="h-px w-4 bg-gray-700"></span> Genre
              </p>
              <div class="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <button
                  v-for="genre in genres"
                  :key="genre"
                  type="button"
                  class="rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all"
                  :class="selectedGenre === genre
                    ? 'border-serenade-500/50 bg-serenade-500/20 text-serenade-300 shadow-[0_0_20px_rgba(242,112,29,0.15)]'
                    : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white'"
                  @click="selectedGenre = genre"
                >
                  {{ genre }}
                </button>
              </div>
            </div>

            <div>
              <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <span class="h-px w-4 bg-gray-700"></span> Format
              </p>
              <div class="space-y-3">
                <label
                  v-for="format in formats"
                  :key="format"
                  class="flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all"
                  :class="selectedFormats.includes(format) 
                    ? 'border-serenade-500/40 bg-serenade-500/10 text-white shadow-[0_0_15px_rgba(242,112,29,0.1)]' 
                    : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white'"
                >
                  <span>{{ format }}</span>
                  <div class="relative flex h-5 w-9 items-center rounded-full transition-colors" :class="selectedFormats.includes(format) ? 'bg-serenade-500' : 'bg-gray-700'">
                    <span class="absolute h-4 w-4 rounded-full bg-white transition-transform" :class="selectedFormats.includes(format) ? 'translate-x-4 shadow-[0_0_8px_rgba(0,0,0,0.5)]' : 'translate-x-0.5'"></span>
                  </div>
                  <input v-model="selectedFormats" :value="format" type="checkbox" class="hidden" />
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
          class="sticky top-[8.25rem] z-20 hidden h-[calc(100vh-8.25rem)] w-12 shrink-0 items-start justify-center border-r border-white/5 bg-white/[0.015] backdrop-blur-2xl pt-6 text-gray-500 transition hover:bg-white/[0.04] hover:text-serenade-300 lg:flex shadow-[10px_0_30px_-15px_rgba(0,0,0,0.3)]"
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
          class="m-4 inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md px-4 font-medium text-sm text-gray-300 shadow-lg lg:hidden hover:bg-white/[0.06]"
          @click="showFilters = true"
        >
          <ChevronRight class="h-4 w-4 text-serenade-400" />
          Show Filters
        </button>
      </Transition>

      <main class="flex-1 px-4 py-5 sm:px-6 lg:pl-10">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md px-5 py-4 shadow-lg">
          <div class="flex items-center gap-3 text-sm font-medium text-gray-400">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-serenade-500/10 border border-serenade-500/20 shadow-[0_0_15px_rgba(242,112,29,0.15)]">
              <LayoutGrid class="h-4 w-4 text-serenade-400" />
            </div>
            <span><strong class="text-white">{{ filteredProducts.length }}</strong> tapes in archive</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sort By</span>
            <select
              v-model="sortBy"
              class="h-10 rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-medium text-white shadow-inner outline-none transition focus:border-serenade-500 focus:bg-black hover:border-white/20"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 pb-40 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <template v-if="isLoadingProducts">
            <SkeletonCard v-for="i in 8" :key="i" variant="grid" />
          </template>
          <p v-else-if="!filteredProducts.length" class="col-span-full rounded-xl border border-white/5 bg-black/20 p-8 text-center text-sm font-bold uppercase tracking-widest text-gray-400">
            Catalog is empty. Run the server seed to import products.
          </p>
          <article
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            :ref="(el) => setCardRef(el, product.id)"
            class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] cursor-pointer card-reveal"
            :class="[activeProduct === product.id ? 'is-playing border-serenade-400/50 shadow-[0_0_30px_rgba(242,112,29,0.2)]' : '', visibleCards.has(product.id) ? 'card-visible' : '']"
            @click="goToProduct(product.id)"
          >
            <!-- Media Stage -->
            <div class="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-shark-900 to-black">
              <!-- Ambient Aura -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-serenade-500/10 rounded-full blur-[70px] pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:bg-serenade-500/20 z-0"></div>
              
              <!-- Grid Background -->
              <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] z-0"></div>
              <!-- Vignette -->
              <div class="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] z-10 pointer-events-none"></div>
              
              <!-- Badges -->
              <div class="absolute left-4 top-4 z-20 flex items-center gap-2">
                <span class="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-tiny font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                  {{ product.format }}
                </span>
              </div>
              
              <div
                v-if="activeProduct === product.id"
                class="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-serenade-500/30 bg-serenade-500/20 px-3 py-1 text-tiny font-black uppercase tracking-[0.18em] text-serenade-300 shadow-[0_0_15px_rgba(242,112,29,0.3)] backdrop-blur-md"
              >
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-serenade-400 shadow-[0_0_8px_rgba(242,112,29,0.8)]"></span>
                Playing
              </div>

              <!-- Media Components -->
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
                :border-color="product.borderColor"
                :disc-color="product.discColor"
                :side-color="product.sideColor"
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

            <!-- Content -->
            <div class="relative z-10 space-y-4 p-5">
              <!-- Header: Title, Artist & Price -->
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <p class="mb-1 truncate text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{{ product.artist }}</p>
                  <h3 class="card-title text-lg font-black leading-tight tracking-tight text-white drop-shadow-md">{{ product.title }}</h3>
                </div>
                <div class="shrink-0 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-3 py-1.5 shadow-lg backdrop-blur-md">
                  <span class="text-sm font-black text-white">${{ product.price }}</span>
                </div>
              </div>

              <!-- Tags and Rating -->
              <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em]">
                <span class="neon-tag" :class="genreTagClass(product.genre)">
                  {{ product.genre }}
                  <span v-if="product.subGenre" class="tag-sub">/ {{ product.subGenre }}</span>
                </span>
                <div class="ml-auto flex items-center gap-1 text-serenade-400">
                  <Star v-for="star in product.rating" :key="star" class="h-3.5 w-3.5 fill-current drop-shadow-[0_0_4px_rgba(242,112,29,0.5)]" />
                </div>
              </div>

              <!-- Player Controls -->
              <div class="mt-2 flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-2 shadow-inner">
                <button
                  type="button"
                  class="group/play relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-serenade-500/50 bg-serenade-500/10 text-serenade-400 transition-all hover:scale-105 hover:bg-serenade-500 hover:text-white hover:shadow-[0_0_20px_rgba(242,112,29,0.4)]"
                  :aria-label="`Play ${product.title}`"
                  @click.stop="togglePreview(product)"
                >
                  <Pause v-if="activeProduct === product.id" class="h-4 w-4 fill-current" />
                  <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
                </button>
                
                <div class="min-w-0 flex-1 pr-2">
                  <div class="mb-1.5 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gray-500">
                    <div class="min-w-0 flex-1 overflow-hidden">
                      <div v-if="activeProduct === product.id" class="marquee text-serenade-300 drop-shadow-[0_0_2px_rgba(242,112,29,0.8)]">
                        <span>NOW PLAYING</span>
                      </div>
                      <span v-else>PREVIEW</span>
                    </div>
                    <span>{{ product.duration }}</span>
                  </div>
                  <div class="relative h-1.5 overflow-hidden rounded-full bg-white/10 shadow-inner">
                    <div
                      class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-serenade-600 to-amber-300 transition-all duration-300"
                      :style="{ width: `${progressById[product.id] || 0}%` }"
                    ></div>
                    <div
                      v-if="activeProduct === product.id"
                      class="absolute inset-y-0 left-0 bg-white/20 blur-[2px] transition-all duration-300"
                      :style="{ width: `${progressById[product.id] || 0}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-widest transition"
                  :class="isOwned(product)
                    ? 'cursor-not-allowed border-white/10 bg-white/5 text-gray-500'
                    : 'border-serenade-500/40 bg-serenade-500/10 text-serenade-300 hover:bg-serenade-500 hover:text-black'"
                  :disabled="isOwned(product)"
                  @click.stop="addToCart(product)"
                >
                  {{ isOwned(product) ? 'In Library' : 'Cart' }}
                </button>
                <button
                  v-if="!isOwned(product)"
                  type="button"
                  class="rounded-lg bg-serenade-500 px-3 py-2 text-xs font-black uppercase tracking-widest text-black transition hover:bg-serenade-400"
                  @click.stop="openBuyModal(product)"
                >
                  Buy
                </button>
                <button
                  v-else
                  type="button"
                  class="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-200"
                  @click.stop="router.push({ name: 'Player' })"
                >
                  Owned
                </button>
              </div>
            </div>
          </article>
          <div ref="loadMoreTarget" class="col-span-full h-10"></div>
        </div>
        <div v-if="isLoadingMoreProducts" class="pointer-events-none fixed bottom-28 left-1/2 z-[2147483002] -translate-x-1/2 rounded-full border border-serenade-500/30 bg-black/90 px-5 py-3 text-xs font-black uppercase tracking-widest text-serenade-300 shadow-2xl">
          Loading more tapes...
        </div>
        <p v-else-if="!hasMoreProducts && products.length" class="pb-32 text-center font-mono text-xs uppercase tracking-widest text-gray-600">
          End of catalog
        </p>
      </main>
    </div>

    <div class="hidden" aria-hidden="true">
      <audio
        v-for="product in products"
        :key="`audio-${product.id}`"
        :ref="(el) => setAudioRef(el, product.id)"
        :src="product.audio"
        preload="metadata"
        @ended="handleAudioEnded(product.id)"
        @loadedmetadata="handleAudioLoaded(product.id)"
        @timeupdate="updateProgress(product.id)"
      ></audio>
    </div>

    <div v-if="cartMessage" class="fixed bottom-6 left-1/2 z-[2147483001] -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 px-5 py-3 text-sm font-bold text-white shadow-2xl">
      {{ cartMessage }}
    </div>

    <Teleport to="body">
      <div v-if="pendingPurchase" class="fixed inset-0 z-[2147483600] grid place-items-center bg-black/75 px-4 backdrop-blur-sm" @click.self="closeBuyModal">
        <div class="w-full max-w-md rounded-lg border border-white/10 bg-shark-950 p-5 text-white shadow-2xl">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Confirm Purchase</p>
          <h2 class="mt-2 text-2xl font-black">{{ pendingPurchase.title }}</h2>
          <p class="mt-1 text-sm text-gray-400">{{ pendingPurchase.artist }} / {{ pendingPurchase.format }}</p>
          <div class="mt-5 rounded border border-white/10 bg-black/35 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-400">Price</span>
              <strong class="text-xl text-serenade-300">${{ pendingPurchase.price }}</strong>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-300">Buy product?</p>
          <div class="mt-6 grid grid-cols-2 gap-3">
            <button class="h-11 rounded border border-white/10 bg-white/5 text-sm font-black uppercase tracking-widest text-gray-300 hover:bg-white/10" @click="closeBuyModal">
              Cancel
            </button>
            <button class="h-11 rounded bg-serenade-500 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400" @click="confirmBuy">
              Buy
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import customFetch from '@/api';
import { ChevronLeft, ChevronRight, LayoutGrid, Pause, Play, Search, Star } from 'lucide-vue-next';
import CatalogHighlights from '@/components/catalog/CatalogHighlights.vue';
import CassetteTape from '@/components/catalog/media/CassetteTape.vue';
import VhsTapeBox from '@/components/catalog/media/VhsTapeBox.vue';
import VinylAlbum from '@/components/catalog/media/VinylAlbum.vue';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import { volume as playerVolume, applyVolumeToAudio, loadPlayerVolume } from '@/stores/player';

const emit = defineEmits(['player-state']);
const router = useRouter();

const showFilters = ref(true);
const search = ref('');
const selectedGenre = ref('All');
const selectedFormats = ref(['VHS', 'Cassette', 'Vinyl']);
const sortBy = ref('featured');

const products = ref([]);
const homeSections = ref({
  recommended: [],
  popular: [],
  trending: [],
});
const loadMoreTarget = ref(null);
const isLoadingProducts = ref(false);
const isLoadingMoreProducts = ref(false);
const hasMoreProducts = ref(true);
const nextProductSkip = ref(0);
const productPageSize = 12;
const activeProduct = ref(null);
const cartMessage = ref('');
const ownedProductIds = ref(new Set());
const currentUserId = ref('');
const pendingPurchase = ref(null);
const currentProductId = ref('');
const isCurrentAudioPlaying = ref(false);
const currentTime = ref(0);
const audioById = new Map();
const progressById = reactive({});
const durationById = reactive({});
const visibleCards = ref(new Set());
let loadMoreObserver = null;
let cardObserver = null;
const cardRefs = new Map();

const setCardRef = (el, id) => {
  if (el) {
    cardRefs.set(id, el);
    if (cardObserver) cardObserver.observe(el);
  } else {
    cardRefs.delete(id);
  }
};

const setAudioRef = (el, id) => {
  if (el) {
    applyVolumeToAudio(el);
    audioById.set(id, el);
  } else {
    audioById.delete(id);
  }
};

const normalizeProduct = (product) => ({
  ...product,
  baseColor: product.vhsDesign?.baseColor || 'bg-zinc-950',
  borderColor: product.vhsDesign?.borderColor || 'border-zinc-500',
  discColor: product.vhsDesign?.discColor || 'bg-zinc-300',
  sideColor: product.vhsDesign?.sideColor || 'bg-zinc-100',
  audio: product.track?.audioUrl || product.previewUrl || '',
});

const fetchProductPage = async (skip) => {
  const { data } = await customFetch.get('products', {
    params: {
      skip,
      take: productPageSize,
    },
  });

  return data;
};

const loadProducts = async () => {
  isLoadingProducts.value = true;

  try {
    const data = await fetchProductPage(0);
    products.value = (data.data || []).map(normalizeProduct);
    nextProductSkip.value = data.pagination?.nextSkip ?? products.value.length;
    hasMoreProducts.value = Boolean(data.pagination?.hasMore);
    if (!currentProductId.value && products.value[0]) {
      currentProductId.value = products.value[0].id;
    }
  } catch (error) {
    showCartMessage(error.response?.data?.message || 'Could not load catalog.');
  } finally {
    isLoadingProducts.value = false;
    await nextTick();
    setupLoadMoreObserver();
  }
};

const loadHomeSections = async () => {
  try {
    const { data } = await customFetch.get('products/discover');
    const sections = data.data || {};
    const normalize = (p) => ({
      ...p,
      baseColor: p.vhsDesign?.baseColor || 'bg-zinc-950',
      borderColor: p.vhsDesign?.borderColor || 'border-zinc-500',
      discColor: p.vhsDesign?.discColor || 'bg-zinc-300',
      sideColor: p.vhsDesign?.sideColor || 'bg-zinc-100',
      audio: p.track?.audioUrl || p.previewUrl || '',
    });
    homeSections.value = {
      recommended: (sections.recommended || []).map(normalize),
      popular: (sections.popular || []).map(normalize),
      trending: (sections.trending || []).map(normalize),
    };
  } catch {
    // Silent fail: computed fallback will use the regular catalog
  }
};

const loadMoreProducts = async () => {
  if (isLoadingProducts.value || isLoadingMoreProducts.value || !hasMoreProducts.value) return;
  isLoadingMoreProducts.value = true;

  try {
    const data = await fetchProductPage(nextProductSkip.value);
    const nextProducts = (data.data || []).map(normalizeProduct);
    const seen = new Set(products.value.map((product) => product.id));
    products.value = [
      ...products.value,
      ...nextProducts.filter((product) => !seen.has(product.id)),
    ];
    nextProductSkip.value = data.pagination?.nextSkip ?? products.value.length;
    hasMoreProducts.value = Boolean(data.pagination?.hasMore);
  } catch (error) {
    showCartMessage(error.response?.data?.message || 'Could not load more catalog.');
  } finally {
    isLoadingMoreProducts.value = false;
  }
};

const setupLoadMoreObserver = () => {
  loadMoreObserver?.disconnect();
  if (!loadMoreTarget.value) return;

  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      loadMoreProducts();
    }
  }, { rootMargin: '520px 0px' });

  loadMoreObserver.observe(loadMoreTarget.value);
};

const loadOwnedProducts = async () => {
  if (!localStorage.getItem('token')) {
    ownedProductIds.value = new Set();
    currentUserId.value = '';
    return;
  }

  try {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    currentUserId.value = cachedUser.id || '';
    const { data } = await customFetch.get('orders/library');
    ownedProductIds.value = new Set((data.data || []).map((item) => item.product?.id).filter(Boolean));
  } catch {
    ownedProductIds.value = new Set();
  }
};

const isOwned = (product) => ownedProductIds.value.has(product.id) || Boolean(currentUserId.value && product.userId === currentUserId.value);

const goToProduct = (id) => {
  sessionStorage.setItem('homeScroll', String(window.scrollY));
  router.push({ name: 'ProductDetail', params: { id } });
};

const requireLogin = () => {
  if (localStorage.getItem('token')) return true;
  router.push({ name: 'Login' });
  return false;
};

const showCartMessage = (message) => {
  cartMessage.value = message;
  window.setTimeout(() => {
    if (cartMessage.value === message) cartMessage.value = '';
  }, 2400);
};

const addToCart = async (product) => {
  if (!requireLogin()) return;
  if (isOwned(product)) {
    showCartMessage(`${product.title} is already in your library.`);
    return;
  }

  try {
    await customFetch.post(`cart/${product.id}`);
    showCartMessage(`${product.title} added to cart.`);
  } catch (error) {
    showCartMessage(error.response?.data?.message || 'Could not add to cart.');
  }
};

const openBuyModal = (product) => {
  if (!requireLogin()) return;
  if (isOwned(product)) {
    showCartMessage(`${product.title} is already in your library.`);
    return;
  }
  pendingPurchase.value = product;
};

const closeBuyModal = () => {
  pendingPurchase.value = null;
};

const confirmBuy = async () => {
  if (!pendingPurchase.value) return;
  const product = pendingPurchase.value;

  try {
    const { data } = await customFetch.post(`orders/buy/${product.id}`);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new CustomEvent('retro-reels:user-updated', { detail: { user: data.user } }));
    window.dispatchEvent(new CustomEvent('retro-reels:library-updated', { detail: { productId: product.id } }));
    ownedProductIds.value = new Set([...ownedProductIds.value, product.id]);
    showCartMessage(`${product.title} purchased.`);
    closeBuyModal();
  } catch (error) {
    showCartMessage(error.response?.data?.message || 'Could not buy this music.');
  }
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
  applyVolumeToAudio(audio);

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

const handleAudioLoaded = (id) => {
  const audio = audioById.get(id);
  if (!audio || !Number.isFinite(audio.duration)) return;

  durationById[id] = audio.duration;
  emitPlayerState();
};

const updateProgress = (id) => {
  const audio = audioById.get(id);
  if (!audio || !audio.duration) return;

  durationById[id] = audio.duration;
  progressById[id] = Math.min(100, (audio.currentTime / audio.duration) * 100);
  if (currentProductId.value === id) {
    currentTime.value = audio.currentTime;
    isCurrentAudioPlaying.value = !audio.paused;
    emitPlayerState();
  }
};

const seekCurrent = (progress) => {
  const audio = audioById.get(currentProductId.value);
  const nextProgress = Number(progress);

  if (!audio || !audio.duration || !Number.isFinite(nextProgress)) return;

  audio.currentTime = Math.min(100, Math.max(0, nextProgress)) / 100 * audio.duration;
  currentTime.value = audio.currentTime;
  progressById[currentProductId.value] = Math.min(100, Math.max(0, nextProgress));
  emitPlayerState();
};

const setVolume = (value) => {
  playerVolume.value = Math.min(1, Math.max(0, Number(value)));
  audioById.forEach((audio) => {
    applyVolumeToAudio(audio);
  });
  emitPlayerState();
};

watch([search, selectedGenre, selectedFormats, sortBy], () => {
  nextTick(setupLoadMoreObserver);
}, { deep: true });

watch(products, async () => {
  await nextTick();
  cardRefs.forEach((el, id) => {
    if (el && !el.dataset.cardId) {
      el.dataset.cardId = id;
      cardObserver?.observe(el);
    }
  });
}, { deep: true });

const currentProduct = computed(() => products.value.find((product) => product.id === currentProductId.value));

const genres = computed(() => ['All', ...new Set(products.value.map((product) => product.genre).filter(Boolean))]);
const formats = computed(() => [...new Set(products.value.map((product) => product.format).filter(Boolean))]);
const highlightGroups = computed(() => [
  {
    title: 'Recommended Music',
    caption: homeSections.value.recommended.length
      ? 'Curated just for your vibe'
      : 'Easy starts for the archive mood',
    icon: 'headphones',
    items: homeSections.value.recommended.length
      ? homeSections.value.recommended
      : products.value.slice(0, 4),
  },
  {
    title: 'Popular Picks',
    caption: 'Most loved tapes on the shelf',
    icon: 'flame',
    items: homeSections.value.popular.length
      ? homeSections.value.popular
      : products.value.filter((product) => product.rating >= 5).slice(0, 5),
  },
  {
    title: 'Trending Musics',
    caption: 'What the crowd is spinning right now',
    icon: 'sparkles',
    items: homeSections.value.trending.length
      ? homeSections.value.trending
      : products.value.slice(0, 4),
  },
]);

const filteredProducts = computed(() => {
  const query = search.value.trim().toLowerCase();

  const filtered = products.value.filter((product) => {
    const matchesSearch = [product.title, product.artist, product.genre, product.subGenre]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
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
  const product = currentProduct.value || products.value[0];
  if (!product) return;

  emit('player-state', {
    product,
    isPlaying: isCurrentAudioPlaying.value,
    currentTime: currentTime.value,
    duration: durationById[product.id] || 0,
    progress: progressById[product.id] || 0,
    volume: playerVolume.value,
    activeProductId: activeProduct.value,
  });
};

onMounted(async () => {
  await loadPlayerVolume();
  await loadProducts();
  await loadHomeSections();
  await loadOwnedProducts();
  emitPlayerState();

  const savedScroll = sessionStorage.getItem('homeScroll');
  if (savedScroll) {
    await nextTick();
    window.scrollTo({ top: Number(savedScroll), behavior: 'instant' });
    sessionStorage.removeItem('homeScroll');
  }

  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.dataset.cardId;
        if (id) visibleCards.value.add(id);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  await nextTick();
  cardRefs.forEach((el, id) => {
    el.dataset.cardId = id;
    cardObserver.observe(el);
  });
});

onBeforeUnmount(() => {
  loadMoreObserver?.disconnect();
  cardObserver?.disconnect();
});

defineExpose({
  seekCurrent,
  setVolume,
  togglePreview,
  stopPreview,
});

const genreTagClass = (genre) => {
  const classes = {
    Pop: 'neon-pink',
    Chill: 'neon-green',
    Rock: 'neon-violet',
    Ballad: 'neon-red',
    Electronic: 'neon-indigo',
    Acoustic: 'neon-stone',
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

.filter-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 143, 66, 0.7) rgba(255, 255, 255, 0.08);
}

.filter-scroll::-webkit-scrollbar {
  width: 0.4rem;
}

.filter-scroll::-webkit-scrollbar-track {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.filter-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(245, 143, 66, 0.72);
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
  max-width: 64%;
  align-items: center;
  gap: 0.25rem;
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

.tag-sub {
  min-width: 0;
  overflow: hidden;
  opacity: 0.72;
  text-overflow: ellipsis;
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
  padding-left: 100%;
  animation: marquee 7s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
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

.card-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>

