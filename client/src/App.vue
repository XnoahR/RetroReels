<script setup>
import axios from "axios";
import { ref, onMounted, reactive, watch } from "vue";
import { RouterView, useRoute } from 'vue-router'
import Header from "./layouts/Header.vue";
import ButtonVx from "./components/ButtonVx.vue";
import customFetch from "./api.js";

const route = useRoute()
const disableHeader = ref(false)

const getData = async () => {
  const res = await customFetch.get('/test')
  console.log(res);
}

const toggleHeader = () =>{
  if (route.fullPath === '/login' || route.fullPath === '/') {
    disableHeader.value = true
  } else {
    disableHeader.value = false
  }
}

onMounted(() => {
  getData()
  toggleHeader()
})

// jalankan lagi setiap route berubah
watch(
  () => route.fullPath,
  () => {
    toggleHeader()
  }
)

</script>

<template>
  
  <main class="-z-20 bg-shark-950" :class="route.fullPath !== '/login' ? '' : ''">
    <RouterView />
    
  </main>
</template>
