<script setup>
import axios from "axios";
import { ref, onMounted,reactive } from "vue";

const employee = reactive([])
const dataEmployee = ref([])
const getEmployees = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/'); //get data from backend 
    console.log(data) 
    dataEmployee.value = data;
    if (dataEmployee.value.length > 0) {
      employee.push(...dataEmployee.value)
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getEmployees();
})
</script>

<template>
  <ol>
    <li v-for="(data, index) in employee" :key="index"> {{ data.name }} and {{ data.credential.email }}</li>  
  </ol>
</template>