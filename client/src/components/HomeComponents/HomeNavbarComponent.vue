<template>
  <nav class="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white backdrop-blur">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6">
      <RouterLink to="/home" class="flex items-center gap-3">
        <img class="h-7 w-44 object-contain sm:w-56" src="../../../public/nav-title.png" alt="Retro Reels" />
        <span class="hidden rounded-sm border border-serenade-400/40 px-2 py-1 text-tiny font-bold uppercase tracking-[0.22em] text-serenade-300 lg:inline">
          Archive
        </span>
      </RouterLink>

      <div class="hidden items-center rounded-md border border-white/10 bg-white/10 p-1 md:flex">
        <RouterLink
          v-for="route in routes"
          :key="route.to"
          :to="route.to"
          class="flex h-9 items-center gap-2 rounded px-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
          active-class="bg-serenade-500 text-white shadow-[0_0_18px_rgba(242,112,29,0.35)]"
        >
          <component :is="route.icon" class="h-4 w-4" />
          <span>{{ route.label }}</span>
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <a
          href="#"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/10 transition hover:border-serenade-300 hover:text-serenade-200"
          aria-label="GitHub"
        >
          <Github class="h-5 w-5" />
        </a>
        <RouterLink
          to="/login"
          class="hidden h-10 items-center rounded-md bg-serenade-500 px-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-serenade-400 sm:inline-flex"
        >
          Account
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Github, Home, ListMusic, Radio, UserRound } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const routes = [
  { label: 'Home', to: '/home', icon: Home },
  { label: 'Category', to: '/categories', icon: ListMusic },
  { label: 'Player', to: '/home', icon: Radio },
  { label: 'Account', to: '/login', icon: UserRound },
];
</script>
