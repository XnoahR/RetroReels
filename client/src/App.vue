<script setup>
import { defineAsyncComponent, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppLoadingOverlay from '@/components/app/AppLoadingOverlay.vue';
import { appLoading, appLoadingMessage } from '@/stores/loading';

const route = useRoute();

const PlayerView = defineAsyncComponent(() => import('@/views/PlayerView.vue'));

const hiddenPlayerRoutes = new Set(['Login', 'Landing Page']);

const shouldMountPersistentPlayer = computed(() => {
  return Boolean(localStorage.getItem('token')) && !hiddenPlayerRoutes.has(route.name);
});
</script>

<template>
  <main class="min-h-screen w-full -z-20 bg-shark-950">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" v-if="route.name !== 'Player'" :key="route.path" />
      </Transition>
    </RouterView>
    <PlayerView v-if="shouldMountPersistentPlayer" />
    <AppLoadingOverlay :visible="appLoading" :message="appLoadingMessage" />
  </main>
</template>
