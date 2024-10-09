<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
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
  <ButtonVx />
  <Header></Header>
  <h1 class="bg-red-500">Joe</h1>
</template>
