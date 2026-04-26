<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-24 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        <div class="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Shopping Cart</p>
            <h1 class="mt-2 text-3xl font-black uppercase tracking-widest">Keranjang</h1>
          </div>
          <div class="rounded border border-serenade-500/40 bg-serenade-500/10 px-4 py-3 text-right">
            <p class="text-xs font-black uppercase tracking-widest text-gray-400">Total</p>
            <p class="text-2xl font-black text-serenade-300">${{ cartTotal }}</p>
          </div>
        </div>

        <div v-if="message.text" class="mb-6 rounded border px-4 py-3 text-sm font-bold" :class="message.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
          {{ message.text }}
        </div>

        <div class="grid gap-3">
          <article v-for="item in cartItems" :key="item.id" class="flex flex-col gap-4 rounded-lg border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
            <img :src="item.product.image" class="h-20 w-20 rounded object-cover" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-lg font-black text-white">{{ item.product.title }}</p>
              <p class="truncate text-sm text-gray-400">{{ item.product.artist }} / {{ item.product.format || 'Music' }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">Qty {{ item.quantity }}</p>
            </div>
            <strong class="text-xl text-serenade-300">${{ item.product.price * item.quantity }}</strong>
            <button class="h-10 rounded border border-red-400/30 px-4 text-xs font-black uppercase tracking-widest text-red-200 hover:bg-red-500/10" @click="removeCartItem(item.productId)">
              Remove
            </button>
          </article>

          <div v-if="!cartItems.length && !isLoading" class="rounded-lg border border-white/5 bg-black/20 p-10 text-center">
            <p class="font-black uppercase tracking-widest text-gray-400">Keranjang masih kosong.</p>
            <RouterLink to="/Home" class="mt-5 inline-flex h-11 items-center rounded bg-serenade-500 px-5 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400">
              Browse Catalog
            </RouterLink>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm font-bold text-gray-400">Checkout will spend your credits and unlock tracks in Player.</p>
          <button class="h-12 rounded bg-serenade-500 px-6 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400 disabled:opacity-50" :disabled="!cartItems.length || isLoading" @click="checkoutCart">
            Checkout With Credits
          </button>
        </div>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';

const cartItems = ref([]);
const cartTotal = ref(0);
const isLoading = ref(false);
const message = reactive({ text: '', type: 'success' });

const setMessage = (text, type = 'success') => {
  message.text = text;
  message.type = type;
};

const loadCart = async () => {
  isLoading.value = true;
  try {
    const { data } = await customFetch.get('cart');
    cartItems.value = data.data || [];
    cartTotal.value = data.total || 0;
  } catch (error) {
    setMessage(error.response?.data?.message || 'Failed to load cart.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const removeCartItem = async (productId) => {
  try {
    await customFetch.delete(`cart/${productId}`);
    await loadCart();
    setMessage('Removed from cart.');
  } catch (error) {
    setMessage(error.response?.data?.message || 'Failed to remove item.', 'error');
  }
};

const checkoutCart = async () => {
  try {
    const { data } = await customFetch.post('cart/checkout');
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    await loadCart();
    setMessage('Checkout completed. Your music is now in Player.');
  } catch (error) {
    setMessage(error.response?.data?.message || 'Checkout failed.', 'error');
  }
};

onMounted(loadCart);
</script>
