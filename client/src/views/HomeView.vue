<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950">
      <HomeCarousel />
      <Catalog />
    </section>
  </HomeLayout>
</template>

<script setup>
import HomeCarousel from '@/components/HomeCarousel.vue';
import Catalog from '@/layouts/Catalog.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
</script>
