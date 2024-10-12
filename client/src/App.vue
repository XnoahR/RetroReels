<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import { RouterView } from 'vue-router'
import Header from "./layouts/Header.vue";
import ButtonVx from "./components/ButtonVx.vue";
import customFetch from "./api.js";

const getData = async () => {
  const res = await customFetch.get('/test')
  console.log(res);
}


onMounted(() => {
  getData()
})
</script>

<template>
  <Header />
  <main>
    <RouterView />
    <br>
    <strong class="">Current route path: " {{ $route.fullPath }} " </strong> 
    <RouterLink :to="$route.fullPath === '/' ? '/about' : '/'"
      class="bg-blue-500 py-2 px-3 hover:bg-blue-600 hover:text-gray-200 rounded-lg text-center">{{ $route.fullPath ===
        '/' ? 'About' : 'Home' }}
    </RouterLink>
  </main>

</template>
