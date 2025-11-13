<template>
  
  <HomeLayout />
  <!-- <Catalog />
  <section class="w-3/4 border border-red-400">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque architecto delectus officiis placeat corporis
    doloremque minus, ipsam iure exercitationem blanditiis iusto mollitia itaque! Alias culpa doloremque nemo nisi. Fuga
    harum delectus eius perspiciatis architecto. Placeat cupiditate voluptas quidem, assumenda tempora inventore ea
    aperiam vero eius amet cumque obcaecati officiis fugiat.
  </section> -->
</template>

<script setup>
import HomeCarousel from '@/components/HomeCarousel.vue';
import Catalog from '@/layouts/Catalog.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
// Sample product data
const products = ref([
  {
    code: 'P001',
    name: 'Product A',
    category: 'Category 1',
    quantity: 100,
  },
  {
    code: 'P002',
    name: 'Product B',
    category: 'Category 2',
    quantity: 150,
  },
  {
    code: 'P003',
    name: 'Product C',
    category: 'Category 1',
    quantity: 200,
  },
  {
    code: 'P004',
    name: 'Product D',
    category: 'Category 3',
    quantity: 50,
  },
]);


</script>
