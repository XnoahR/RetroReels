<script setup>
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLoadingOverlay from '@/components/app/AppLoadingOverlay.vue';
import PlayerView from '@/views/PlayerView.vue';
import { appLoading, appLoadingMessage } from '@/stores/loading';

const route = useRoute();

const shouldMountPersistentPlayer = computed(() => {
  route.name;
  return Boolean(localStorage.getItem('token'));
});
</script>

<template>
  <main class="-z-20 bg-shark-950">
    <RouterView v-slot="{ Component }">
      <component :is="Component" v-if="route.name !== 'Player'" />
    </RouterView>
    <PlayerView v-if="shouldMountPersistentPlayer" />
    <AppLoadingOverlay :visible="appLoading" :message="appLoadingMessage" />
  </main>
</template>
