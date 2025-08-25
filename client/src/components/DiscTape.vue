<template>
    <div 
      class="border-8 bg-black border-gray-400 rounded-2xl flex justify-evenly items-center animate-tape-spin hover:scale-110 transition-all duration-200"
      :class="[width, height, baseColor, borderColor, tapeRotation]"
      @mouseover="hovering = true" 
      @mouseleave="hovering = false"
    >
      <!-- Left Disc -->
      <div class="rounded-l-3xl overflow-hidden border-none" :class="[sideColor, sideSize]">
        <div
          class="rounded-full flex items-center justify-center" 
          :class="[discSize, discColor, discMarginLeft, hovering ? 'animate-spin-slow-left' : '']"
        >
          <div class="w-1/2 h-1/2 rounded-full border-2 border-dashed border-white flex items-center justify-center">
            <div class="w-3/4 h-3/4 bg-white rounded-full border-2 border-dashed border-white"></div>
          </div>
        </div>
      </div>
  
      <!-- Center Image -->
      <div class="bg-cover border border-white rounded-xl overflow-hidden" :class="[centerWidth, centerHeight]" :style="{ backgroundImage: `url(${image})` }">
        <div class="w-full h-4 pb-1 rounded-md text-white text-tiny flex justify-center items-center overflow-x-hidden overflow-y-hidden whitespace-nowrap" :class="[titleSize, titleBackgroundColor]">{{ title }}</div>
      </div>
  
      <!-- Right Disc -->
      <div class="rounded-r-3xl overflow-hidden" :class="[sideColor, sideSize]">
        <div 
          class="-z-10 rounded-full flex items-center justify-center" 
          :class="[discSize, discColor, diskMarginRight, hovering ? 'animate-spin-slow-right' : '']"
        >
          <div class="w-1/2 h-1/2 rounded-full border-2 border-dashed border-white flex items-center justify-center">
            <div class="w-3/4 h-3/4 bg-white rounded-full border-2 border-dashed border-white"></div>
          </div>
        </div>
      </div>
    </div>
    
  </template>
  

<script setup>
import { ref, toRefs, defineProps } from 'vue';

// Define props
const props = defineProps({
  title: {type: String, default:'Default-Tape'},
  titleSize: { type: String, default: 'h-4' },
  artist: {type: String, default: 'Unknown'},
  titleBackgroundColor: {type: String, default: 'bg-gray-600'},
  width: { type: String, default: 'w-80' },
  height: { type: String, default: 'h-48' },
  baseColor: { type: String, default: 'bg-black' },
  borderColor: { type: String, default: 'border-gray-400' },
  tapeRotation: { type: String, default: 'rotate-45' },
  centerWidth: { type: String, default: 'w-32' },
  centerHeight: { type: String, default: 'h-20' },
  discSize: { type: String, default: 'w-20 h-20' },
  discColor: { type: String, default: 'bg-black' },
  discMarginLeft: { type: String, default: 'ms-6' },
  diskMarginRight: { type: String, default: '-ms-10' },
  sideColor: { type: String, default: 'bg-gray-700' },
  image: { type: String, default: '/Yoru.jpeg' },
  sideSize: { type: String, default: 'w-16 h-20' }
});

// Extract refs from props
const { width, height, tapeRotation, centerWidth, centerHeight, discSize, sideColor, image } = toRefs(props);

// Hover state
const hovering = ref(false);
</script>


<style scoped>
@keyframes spin-slow-left {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes spin-slow-right {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}

.animate-tape-spin {
    animation: tape-spin 15s linear infinite;
}

.animate-spin-slow-left {
    animation: spin-slow-left 10s linear infinite;
}

.animate-spin-slow-right {
    animation: spin-slow-right 10s linear infinite;
}
</style>