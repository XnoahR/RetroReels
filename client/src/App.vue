<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import Button from 'primevue/button';
import Header from "./components/Header.vue";
</script>




<template>
  <div class="card flex justify-center">
    <Button label="Primary" text raised />
    <Button label="Secondary" severity="secondary" text raised />
    <Button label="Success" severity="success" text raised />
    <Button label="Info" severity="info" text raised />
    <Button label="Warn" severity="warn" text raised />
    <Button label="Help" severity="help" text raised />
    <Button label="Danger" severity="danger" text raised />
    <Button label="Plain" plain text raised />
  </div>
  <Header />
</template>
