import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';
import CategoryView from '@/views/CategoryView.vue';
import LoginView from '@/views/LoginView.vue';
import LandingPageView from '@/views/LandingPageView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing Page',
      component: LandingPageView,
    },
    {
      path: '/home',
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
      path: '/categories',
      name: 'Category',
      component: CategoryView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
  ],
});

export default router;
