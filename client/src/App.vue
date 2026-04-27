<script setup>
import { RouterView } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppLoadingOverlay from '@/components/app/AppLoadingOverlay.vue';
import PlayerView from '@/views/PlayerView.vue';
import { appLoading, appLoadingMessage } from '@/stores/loading';

const route = useRoute();
const hasMountedPlayer = ref(false);

watch(
  () => route.name,
  (routeName) => {
    if (routeName === 'Player' && localStorage.getItem('token')) {
      hasMountedPlayer.value = true;
    }
  },
  { immediate: true },
);

const shouldMountPersistentPlayer = computed(() => {
  route.name;
  return hasMountedPlayer.value && Boolean(localStorage.getItem('token'));
});
</script>

<template>
  <main class="-z-20 bg-shark-950">
    <RouterView v-slot="{ Component }">
      <component v-if="route.name !== 'Player'" :is="Component" />
    </RouterView>
    <PlayerView v-if="shouldMountPersistentPlayer" v-show="route.name === 'Player'" />
    <AppLoadingOverlay :visible="appLoading" :message="appLoadingMessage" />
  </main>
</template>
