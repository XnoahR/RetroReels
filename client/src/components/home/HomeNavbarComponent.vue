<template>
  <nav class="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white backdrop-blur">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6">
      <RouterLink to="/Home" class="flex items-center gap-3">
        <img class="h-7 w-44 object-contain sm:w-56" src="../../../public/nav-title.png" alt="Retro Reels" />
        <span class="hidden rounded-sm border border-serenade-400/40 px-2 py-1 text-tiny font-bold uppercase tracking-[0.22em] text-serenade-300 lg:inline">
          Archive
        </span>
      </RouterLink>

      <div class="hidden items-center rounded-md border border-white/10 bg-white/10 p-1 md:flex">
        <RouterLink
          v-for="route in visibleRoutes"
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
        <div
          v-if="isLoggedIn"
          class="group relative hidden h-10 items-center rounded-md border border-white/10 bg-white/10 px-3 text-sm font-black text-serenade-300 sm:inline-flex"
        >
          <Coins class="mr-2 h-4 w-4" />
          ${{ currentUser.credits ?? 0 }}
          <button
            type="button"
            class="absolute right-0 top-11 hidden whitespace-nowrap rounded-md border border-serenade-500/40 bg-black px-3 py-2 text-xs font-black uppercase tracking-widest text-serenade-300 shadow-2xl group-hover:block"
            @click="handleTopUp"
          >
            Top Up
          </button>
        </div>
        <RouterLink
          v-if="isLoggedIn"
          to="/cart"
          class="inline-flex h-10 items-center gap-2 rounded-md bg-serenade-500 px-4 text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:bg-serenade-400"
        >
          <ShoppingCart class="h-4 w-4" />
          Cart
        </RouterLink>
        <div v-if="isLoggedIn" ref="accountMenuRef" class="relative">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-serenade-500/20 text-sm font-black text-serenade-200 transition hover:border-serenade-500/50 hover:bg-serenade-500/30"
            aria-label="Account menu"
            :aria-expanded="isAccountMenuOpen"
            @click="isAccountMenuOpen = !isAccountMenuOpen"
          >
            <img v-if="currentUser.avatarUrl" class="h-full w-full rounded-full object-cover" :src="currentUser.avatarUrl" alt="Profile" />
            <span v-else>{{ userInitials }}</span>
          </button>
          <div v-if="isAccountMenuOpen" class="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
            <RouterLink class="menu-item" to="/account" @click="isAccountMenuOpen = false">
              <UserRound class="h-4 w-4" />
              Profile
            </RouterLink>
            <RouterLink class="menu-item" to="/settings" @click="isAccountMenuOpen = false">
              <Settings class="h-4 w-4" />
              Settings
            </RouterLink>
            <button type="button" class="menu-item w-full text-left text-red-200" @click="handleLogout">
              <LogOut class="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
        <RouterLink
          v-else
          to="/login"
          class="hidden h-10 items-center rounded-md bg-serenade-500 px-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-serenade-400 sm:inline-flex"
        >
          Login
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import customFetch from '@/api';
import { Coins, Gauge, Home, LogOut, Radio, Settings, ShoppingCart, UsersRound, UserRound } from 'lucide-vue-next';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = reactive({
  name: storedUser.name || '',
  email: storedUser.email || '',
  avatarUrl: storedUser.avatarUrl || '',
  credits: storedUser.credits ?? 0,
  role: storedUser.role || 'USER',
});
const accountMenuRef = ref<HTMLElement | null>(null);
const isAccountMenuOpen = ref(false);
const isLoggedIn = computed(() => Boolean(localStorage.getItem('token')));
const isAdmin = computed(() => currentUser.role === 'ADMIN');
const userInitials = computed(() => {
  const value = currentUser.name || currentUser.email || 'User';
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
});

const loadCurrentUser = async () => {
  if (!isLoggedIn.value) return;

  try {
    const { data } = await customFetch.get('auth/me');
    Object.assign(currentUser, data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  } catch {
    // Navbar can still render with the cached user when offline/expired.
  }
};

const handleTopUp = () => {
  window.alert('Top Up coming soon.');
};

const handleLogout = async () => {
  isAccountMenuOpen.value = false;

  try {
    await customFetch.post('auth/logout');
  } catch {
    // Local logout still clears browser state if the token is expired.
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/');
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!isAccountMenuOpen.value) return;
  const target = event.target as Node | null;
  if (target && accountMenuRef.value?.contains(target)) return;
  isAccountMenuOpen.value = false;
};

const routes = [
  { label: 'Home', to: '/Home', icon: Home },
  { label: 'Social', to: '/timeline', icon: UsersRound },
];

const visibleRoutes = computed(() => {
  const authedRoutes = isLoggedIn.value
    ? [...routes, { label: 'Player', to: '/player', icon: Radio }]
    : routes;

  if (!isAdmin.value) return authedRoutes;
  return [...authedRoutes, { label: 'Admin', to: '/admin', icon: Gauge }];
});

onMounted(() => {
  loadCurrentUser();
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(209 213 219);
  transition: background-color 0.18s ease, color 0.18s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}
</style>
