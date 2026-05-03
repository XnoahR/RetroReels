import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';
import SocialView from '@/views/SocialView.vue';
import LandingPageView from '@/views/LandingPageView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.name === 'Social' && sessionStorage.getItem('socialFeedState')) {
      return false;
    }

    if ((to.name === 'Profile' || to.name === 'Account') && sessionStorage.getItem('accountProfileScroll')) {
      return false;
    }

    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
  routes: [
    {
      path: '/',
      name: 'Landing Page',
      component: LandingPageView,
    },
    {
      path: '/Home',
      alias: '/home',
      name: 'Home',
      component: HomeView,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
    },
    {
      path: '/timeline',
      alias: '/categories',
      name: 'Social',
      component: SocialView,
    },
    {
      path: '/posts/:id',
      name: 'PostDetail',
      component: () => import('../views/PostDetailView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/player',
      name: 'Player',
      component: () => import('../views/PlayerView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/top-up',
      name: 'TopUp',
      component: () => import('../views/TopUpView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('../views/AccountView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: () => import('../views/AccountView.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/studio',
      name: 'MusicStudio',
      component: () => import('../views/MusicStudioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

import { isLoggedIn, isAdmin } from '@/stores/auth';

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'Login' };
  }

  if (to.meta.requiresAdmin && !isAdmin.value) {
    return { name: 'Account' };
  }
});

export default router;
