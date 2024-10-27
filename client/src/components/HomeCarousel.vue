<template>
    <main class="container">
      <Swiper 
        :spaceBetween="10" 
        :slidesPerView="1"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false
        }"
        :pagination="{
          clickable: true
        }"
        :navigation="true"
        :modules="[Autoplay, Pagination, Navigation]" 
        class="w-screen overflow-x-hidden h-80 -z-20">
        <swiper-slide 
          v-for="(pict, index) in pictures" 
          :key="index" 
          class="w-full h-full">
          <img 
            :src="`/${pict}`" 
            class="w-full h-full border border-red-500 object-cover object-center" 
            alt="" 
          />
        </swiper-slide>
      </Swiper>
    </main>
  </template>
  
  <script setup>
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Autoplay, Pagination, Navigation } from 'swiper/modules';
  
  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/navigation';
  import 'swiper/css/autoplay';
  
  const pictures = ['ht.png', 'Yoru.jpeg', 'RR.png'];
  </script>
  