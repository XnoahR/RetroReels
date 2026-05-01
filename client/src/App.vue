<script setup>
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLoadingOverlay from '@/components/app/AppLoadingOverlay.vue';
import PlayerView from '@/views/PlayerView.vue';
import { appLoading, appLoadingMessage } from '@/stores/loading';

const route = useRoute();

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
