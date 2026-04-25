<template>
  <section class="relative h-[64vh] min-h-[420px] overflow-hidden border-b border-white/10 bg-black lg:h-[70vh]">
    <Swiper
      :spaceBetween="0"
      :slidesPerView="1"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      :navigation="true"
      :modules="[Autoplay, Pagination, Navigation]"
      class="h-full w-full"
    >
      <swiper-slide v-for="(pict, index) in pictures" :key="index" class="h-full w-full">
        <img :src="`/${pict}`" class="h-full w-full object-cover object-center" alt="" />
      </swiper-slide>
    </Swiper>

    <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-shark-950 to-transparent"></div>

    <div class="pointer-events-none absolute left-4 top-1/2 z-20 max-w-2xl -translate-y-1/2 sm:left-8 lg:left-12">
      <p class="text-tiny font-bold uppercase tracking-[0.3em] text-serenade-300">Featured shelf</p>
      <h1 class="mt-2 text-4xl font-black uppercase text-white sm:text-6xl lg:text-7xl">Retro Reels</h1>
      <p class="mt-3 max-w-lg text-sm text-gray-300 sm:text-base lg:text-lg">
        Browse tapes, tracks, and cassette-inspired releases from the archive.
      </p>
    </div>

    <div class="absolute bottom-5 left-4 z-20 flex items-center gap-3 rounded-md border border-white/15 bg-black/55 px-4 py-3 text-white backdrop-blur sm:left-8 lg:left-12">
      <span class="h-2 w-2 rounded-full bg-serenade-400 shadow-[0_0_12px_#f58f42]"></span>
      <span class="text-xs font-bold uppercase tracking-[0.22em] text-gray-200">Scroll for catalog</span>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const pictures = ['wallpaper-1.png', 'wallpaper-2.png', 'wallpaper-3.png'];
</script>
