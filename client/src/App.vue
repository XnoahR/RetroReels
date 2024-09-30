<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const dataEmployee = ref(null)
const getEmployees = async () => {
  try {
    const res = await axios.get('http://localhost:3000/');
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getEmployees();
})
</script>

<template>
  <h1>Hello Vue</h1>
</template>