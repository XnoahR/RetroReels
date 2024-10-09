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
<Header/>
  <main>
    <RouterView />
    <strong>Current route path:</strong> {{ $route.fullPath }}
    <RouterLink :to="$route.fullPath === '/' ? '/about' : '/'">Go To {{ $route.fullPath === '/' ? 'About' : 'Home' }}
    </RouterLink>
  </main>

</template>
