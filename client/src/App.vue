<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import Button from 'primevue/button';
import Header from "./components/Header.vue";
import ButtonVx from "./components/ButtonVx.vue";

</script>




<template>
 <ButtonVx />
  <Header></Header>
  <h1 class="bg-red-500">Joe</h1>
</template>
