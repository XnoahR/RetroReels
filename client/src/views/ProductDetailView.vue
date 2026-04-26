<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden overflow-x-hidden">
      
      <!-- Stage 1: Intro sliding media -->
      <transition name="slide-intro" appear>
         <div v-if="isAnimatingIn && product" class="fixed z-[100] top-1/2 left-1/2 w-64 h-64 lg:w-96 lg:h-96 pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] intro-media">
            
            <!-- Vinyl Disc -->
            <div v-if="product.format === 'Vinyl'" class="w-full h-full rounded-full bg-[#050505] flex items-center justify-center shadow-inner relative border-2 border-gray-800 animate-[spin_1.5s_linear_infinite]">
               <div class="absolute inset-4 rounded-full border border-white/10"></div>
               <div class="absolute inset-10 rounded-full border border-white/10"></div>
               <div class="absolute inset-16 rounded-full border border-white/10"></div>
               <div class="w-32 h-32 rounded-full bg-orange-100 overflow-hidden relative border border-white/20">
                  <img :src="product.image" class="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div>
               </div>
            </div>

            <!-- Generic Tape for Cassette/VHS -->
            <div v-else class="w-full h-64 bg-shark-900 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
               <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
               <div class="w-3/4 h-32 bg-black rounded-lg border border-white/5 flex items-center justify-between px-8">
                 <div class="w-12 h-12 rounded-full bg-shark-900 animate-[spin_2s_linear_infinite] border border-white/10 flex items-center justify-center"><div class="w-4 h-4 bg-black rounded-full"></div></div>
                 <div class="w-12 h-12 rounded-full bg-shark-900 animate-[spin_2s_linear_infinite] border border-white/10 flex items-center justify-center"><div class="w-4 h-4 bg-black rounded-full"></div></div>
               </div>
               <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-8 bg-black/50 rounded flex items-center justify-center text-xs text-white/50 tracking-widest font-bold">{{ product.format }}</div>
            </div>

         </div>
      </transition>

      <!-- Stage 2: Full Product Detail -->
      <transition name="slide-page" appear>
        <div v-if="showDetails && product" :key="route.fullPath" class="max-w-7xl mx-auto relative z-10">
          
          <button @click="$router.back()" class="mb-6 flex items-center gap-2 text-gray-400 hover:text-serenade-400 transition-colors uppercase tracking-widest text-xs font-bold w-fit">
            <ChevronLeft class="w-4 h-4" /> Back to Catalog
          </button>

          <!-- Main Detail Container -->
          <div class="w-full bg-shark-900/40 border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row mb-20 backdrop-blur-xl">
             
             <!-- Left Side: Media Image -->
             <div class="w-full lg:w-1/2 bg-black relative flex items-center justify-center p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/5 shrink-0 min-h-[400px]">
                 <div class="absolute inset-0 opacity-20 blur-3xl overflow-hidden pointer-events-none">
                    <img :src="product.image" class="w-full h-full object-cover scale-150" />
                 </div>
                 
                 <!-- Use HomeView Media Components -->
                 <div class="relative z-10 scale-125 md:scale-150 drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] group transition-transform duration-700 hover:scale-[1.6]">
                    <VinylAlbum
                      v-if="product.format === 'Vinyl'"
                      :title="product.title"
                      :artist="product.artist"
                      :image="product.image"
                      :active="false"
                    />
                    <CassetteTape
                      v-else-if="product.format === 'Cassette'"
                      :title="product.title"
                      :artist="product.artist"
                      :image="product.image"
                      :base-color="product.baseColor"
                      :active="false"
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
              </div>

              <!-- Right Side: Shopee-like details -->
              <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-gradient-to-br from-shark-900 to-shark-950">
                 <div class="mb-4 flex items-center gap-3">
                    <span class="px-3 py-1 rounded bg-serenade-500/20 border border-serenade-500/50 text-serenade-400 text-xs font-bold uppercase tracking-widest">{{ product.format }}</span>
                    <span class="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest">{{ product.genre }}</span>
                 </div>
                 
                 <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-2 drop-shadow-md">{{ product.title }}</h2>
                 <p class="text-lg text-gray-400 font-bold tracking-widest uppercase mb-6">{{ product.artist }}</p>
                 
                 <div class="flex items-center gap-4 mb-8">
                    <div class="flex items-center text-serenade-400">
                       <Star v-for="i in 5" :key="i" class="w-5 h-5 drop-shadow-[0_0_5px_rgba(245,143,66,0.5)]" :class="i <= (product.rating || 5) ? 'fill-current' : 'text-gray-600'" />
                    </div>
                    <div class="h-5 w-px bg-white/20"></div>
                    <span class="text-sm font-bold text-gray-400">{{ (product.rating * 2.4).toFixed(1) }}k Ratings</span>
                    <div class="h-5 w-px bg-white/20"></div>
                    <span class="text-sm font-bold text-gray-400">{{ (product.rating * 5.7).toFixed(1) }}k Sold</span>
                 </div>

                 <div class="bg-black/60 border border-white/5 rounded-2xl p-6 lg:p-8 mb-8 flex items-end gap-4 shadow-inner relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-48 h-48 bg-serenade-500/10 blur-[60px] pointer-events-none"></div>
                    <span class="text-serenade-400 font-bold text-2xl relative z-10">$</span>
                    <span class="text-6xl font-black text-serenade-400 leading-none relative z-10 drop-shadow-[0_0_10px_rgba(245,143,66,0.3)]">{{ product.price }}</span>
                 </div>

                 <!-- Details section -->
                 <div class="space-y-6 mb-10 flex-1">
                    <div class="grid grid-cols-[120px_1fr] items-center text-sm lg:text-base">
                       <span class="text-gray-500 font-bold uppercase tracking-widest">Duration</span>
                       <span class="text-white font-mono font-bold">{{ product.duration }}</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-center text-sm lg:text-base">
                       <span class="text-gray-500 font-bold uppercase tracking-widest">Condition</span>
                       <span class="text-serenade-400 font-bold">Mint / Factory Sealed</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-center text-sm lg:text-base">
                       <span class="text-gray-500 font-bold uppercase tracking-widest">Stock</span>
                       <span class="text-white">In Stock (Ships from Retro Warehouse)</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-start text-sm lg:text-base">
                       <span class="text-gray-500 font-bold uppercase tracking-widest mt-1">Details</span>
                       <p class="text-gray-300 leading-relaxed text-sm">
                          An absolute classic. The original analog master tapes were used to produce this high-fidelity physical copy. 
                          Experience the warmth and depth that only vintage hardware formats can deliver. 
                          Includes full original packaging, authenticated catalog metadata, and pristine liner notes.
                       </p>
                    </div>
                 </div>

                 <!-- Bottom Actions -->
                 <div class="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-white/10 mt-auto">
                    <button class="w-full sm:flex-1 flex items-center justify-center gap-3 h-14 rounded-xl border border-serenade-500/50 bg-serenade-500/10 text-serenade-400 font-bold uppercase tracking-widest text-sm hover:bg-serenade-500 hover:text-black transition-colors shadow-[0_0_20px_rgba(245,143,66,0.1)]">
                       <ShoppingCart class="w-6 h-6" /> Add to Cart
                    </button>
                    <button class="w-full sm:flex-1 flex items-center justify-center h-14 rounded-xl bg-serenade-500 text-black font-black uppercase tracking-widest text-sm hover:bg-serenade-400 transition-colors shadow-[0_0_30px_rgba(245,143,66,0.3)] hover:shadow-[0_0_40px_rgba(245,143,66,0.5)]">
                       Buy Now
                    </button>
                 </div>
              </div>
          </div>

          <!-- Recommendations Section -->
          <div>
            <h2 class="text-xl lg:text-3xl font-black text-white mb-8 uppercase tracking-widest border-b border-white/10 pb-4">You Might Also Like</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
               <div 
                 v-for="rec in recommendations" :key="rec.id"
                 @click="goToProduct(rec.id)"
                 class="group relative overflow-hidden rounded-xl border border-white/5 bg-shark-900 transition-all hover:-translate-y-2 hover:border-serenade-500/50 hover:shadow-xl hover:shadow-serenade-500/10 cursor-pointer"
               >
                 <div class="aspect-square overflow-hidden bg-shark-950">
                    <img :src="rec.image" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                 </div>
                 <div class="p-4">
                   <h3 class="font-bold text-white text-sm leading-tight truncate group-hover:text-serenade-400 transition-colors mb-1">{{ rec.title }}</h3>
                   <p class="text-xs text-gray-400 truncate">{{ rec.artist }}</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </transition>

    </section>
  </HomeLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import { products } from '@/data/catalogProducts';
import { ChevronLeft, Star, ShoppingCart } from 'lucide-vue-next';
import CassetteTape from '@/components/catalog/media/CassetteTape.vue';
import VhsTapeBox from '@/components/catalog/media/VhsTapeBox.vue';
import VinylAlbum from '@/components/catalog/media/VinylAlbum.vue';

const route = useRoute();
const router = useRouter();

const isAnimatingIn = ref(true);
const showDetails = ref(false);

const product = computed(() => {
  return products.find(p => p.id === Number(route.params.id)) || products[0];
});

const recommendations = computed(() => {
  return products.filter(p => p.id !== product.value.id).sort(() => 0.5 - Math.random()).slice(0, 4);
});

const goToProduct = (id) => {
  router.replace({ name: 'ProductDetail', params: { id } });
};

const triggerAnimation = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  isAnimatingIn.value = true;
  showDetails.value = false;
  
  setTimeout(() => {
    isAnimatingIn.value = false;
    showDetails.value = true;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, 1200);
};

watch(() => route.params.id, (newId) => {
  if (newId) {
    triggerAnimation();
  }
});

onMounted(() => {
  triggerAnimation();
});
</script>

<style scoped>
.intro-media {
  transform: translate(-50%, -50%);
}

.slide-intro-enter-active {
  transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease;
}
.slide-intro-leave-active {
  transition: opacity 0.3s ease;
}
.slide-intro-enter-from {
  transform: translate(100vw, -50%);
  opacity: 0;
}
.slide-intro-enter-to {
  transform: translate(-50%, -50%);
  opacity: 1;
}
.slide-intro-leave-to {
  transform: translate(-50%, -50%);
  opacity: 0;
}

.slide-page-enter-active {
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
}
.slide-page-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-page-enter-from {
  transform: translateX(100vw);
  opacity: 0;
}
.slide-page-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-page-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>
