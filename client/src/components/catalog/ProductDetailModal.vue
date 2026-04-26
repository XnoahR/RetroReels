<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[2147483006] flex items-center justify-center p-4 sm:p-6" @click.self="close">
        
        <!-- Backdrop Blur -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none"></div>
        
        <!-- The Sliding Vinyl Animation Element -->
        <transition name="slide-roll">
           <div v-if="isAnimatingIn && product" class="absolute z-20 pointer-events-none w-64 h-64 lg:w-96 lg:h-96">
              <div class="w-full h-full rounded-full bg-[#050505] flex items-center justify-center shadow-2xl relative border-2 border-gray-800 animate-[spin_2s_linear_infinite]">
                 <!-- Vinyl Grooves -->
                 <div class="absolute inset-2 rounded-full border border-white/10"></div>
                 <div class="absolute inset-6 rounded-full border border-white/10"></div>
                 <div class="absolute inset-10 rounded-full border border-white/10"></div>
                 <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-orange-100 overflow-hidden relative border border-white/20">
                    <img :src="product.image" class="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full"></div>
                 </div>
              </div>
           </div>
        </transition>

        <!-- Product Information Card -->
        <transition name="fade-up">
           <div v-if="showDetails && product" class="relative z-30 w-full max-w-5xl bg-shark-950 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              
              <button @click="close" class="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-black/80 transition-colors border border-white/10 shadow-lg">
                 <X class="w-5 h-5" />
              </button>

              <!-- Left Side: Media Image -->
              <div class="w-full md:w-2/5 lg:w-1/2 bg-black relative flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/10 shrink-0 min-h-[300px]">
                 <div class="absolute inset-0 opacity-20 blur-3xl overflow-hidden pointer-events-none">
                    <img :src="product.image" class="w-full h-full object-cover scale-150" />
                 </div>
                 
                 <div class="relative w-full aspect-square max-w-[300px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden border border-white/10 group">
                    <img :src="product.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <!-- Format specific peeking element -->
                    <div v-if="product.format === 'Vinyl'" class="absolute -right-1/2 top-0 h-full aspect-square rounded-full bg-[#050505] flex items-center justify-center shadow-inner relative border-2 border-gray-800 -z-10 transition-transform duration-700 pointer-events-none">
                       <div class="absolute inset-2 rounded-full border border-white/10"></div>
                    </div>
                 </div>
              </div>

              <!-- Right Side: Shopee-like details -->
              <div class="w-full md:w-3/5 lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto custom-scrollbar bg-gradient-to-br from-shark-900 to-shark-950">
                 <div class="mb-3 flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-serenade-500/20 border border-serenade-500/50 text-serenade-400 text-[10px] font-bold uppercase tracking-widest">{{ product.format }}</span>
                    <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-widest">{{ product.genre }}</span>
                 </div>
                 
                 <h2 class="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-1">{{ product.title }}</h2>
                 <p class="text-base text-gray-400 font-bold tracking-widest uppercase mb-4">{{ product.artist }}</p>
                 
                 <div class="flex items-center gap-4 mb-6">
                    <div class="flex items-center text-serenade-400">
                       <Star v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= (product.rating || 5) ? 'fill-current' : 'text-gray-600'" />
                    </div>
                    <div class="h-4 w-px bg-white/20"></div>
                    <span class="text-sm text-gray-400">{{ (product.rating * 2.4).toFixed(1) }}k Ratings</span>
                    <div class="h-4 w-px bg-white/20"></div>
                    <span class="text-sm text-gray-400">{{ (product.rating * 5.7).toFixed(1) }}k Sold</span>
                 </div>

                 <div class="bg-black/40 border border-white/5 rounded-xl p-6 mb-8 flex items-end gap-4 shadow-inner relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-serenade-500/10 blur-[50px]"></div>
                    <span class="text-serenade-400 font-bold text-xl relative z-10">$</span>
                    <span class="text-5xl font-black text-serenade-400 leading-none relative z-10">{{ product.price }}</span>
                 </div>

                 <!-- Details section -->
                 <div class="space-y-4 mb-8 flex-1">
                    <div class="grid grid-cols-[100px_1fr] items-center text-sm">
                       <span class="text-gray-500 font-bold uppercase tracking-widest">Duration</span>
                       <span class="text-white font-mono">{{ product.duration }}</span>
                    </div>
                    <div class="grid grid-cols-[100px_1fr] items-center text-sm">
                       <span class="text-gray-500 font-bold uppercase tracking-widest">Stock</span>
                       <span class="text-white">In Stock (Ships from Retro Warehouse)</span>
                    </div>
                    <div class="grid grid-cols-[100px_1fr] items-start text-sm">
                       <span class="text-gray-500 font-bold uppercase tracking-widest mt-1">Details</span>
                       <p class="text-gray-300 leading-relaxed text-xs">
                          An absolute classic. The original analog master tapes were used to produce this high-fidelity physical copy. 
                          Experience the warmth and depth that only vintage hardware formats can deliver. 
                          Includes full original packaging, authenticated catalog metadata, and pristine liner notes.
                       </p>
                    </div>
                 </div>

                 <!-- Bottom Actions -->
                 <div class="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10 mt-auto">
                    <button class="w-full sm:flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-serenade-500/50 bg-serenade-500/10 text-serenade-400 font-bold uppercase tracking-widest text-sm hover:bg-serenade-500 hover:text-black transition-colors shadow-[0_0_20px_rgba(245,143,66,0.1)]">
                       <ShoppingCart class="w-5 h-5" /> Add to Cart
                    </button>
                    <button class="w-full sm:flex-1 flex items-center justify-center h-12 rounded-lg bg-serenade-500 text-black font-black uppercase tracking-widest text-sm hover:bg-serenade-400 transition-colors shadow-[0_0_20px_rgba(245,143,66,0.3)]">
                       Buy Now
                    </button>
                 </div>
              </div>

           </div>
        </transition>

      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X, Star, ShoppingCart } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  product: Object
});

const emit = defineEmits(['close']);

const isAnimatingIn = ref(false);
const showDetails = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    isAnimatingIn.value = true;
    showDetails.value = false;
    
    // Explicitly transition after 1s animation completes
    setTimeout(() => {
      if (props.isOpen) {
        isAnimatingIn.value = false;
        showDetails.value = true;
      }
    }, 1000);
  } else {
    isAnimatingIn.value = false;
    showDetails.value = false;
  }
});

const close = () => {
  isAnimatingIn.value = false;
  showDetails.value = false;
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-roll-enter-active {
  transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease;
}
.slide-roll-leave-active {
  transition: opacity 0.2s ease;
}
.slide-roll-enter-from {
  transform: translateX(100vw) rotate(360deg);
  opacity: 0;
}
.slide-roll-enter-to {
  transform: translateX(0) rotate(0deg);
  opacity: 1;
}
.slide-roll-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(245, 143, 66, 0.3);
  border-radius: 10px;
}
</style>
