<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-16 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl pt-8">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Admin Control</p>
            <h1 class="mt-2 text-3xl font-black uppercase tracking-widest md:text-4xl">Retro Reels Dashboard</h1>
            <p class="mt-2 text-sm font-bold uppercase tracking-widest text-gray-400">Catalog, carousel, and sales operations</p>
          </div>
          <button class="inline-flex h-11 w-fit items-center gap-2 rounded bg-serenade-500 px-4 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400" @click="loadDashboard">
            <RefreshCw class="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div v-if="alert.message" class="mb-6 rounded border px-4 py-3 text-sm font-bold" :class="alert.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
          {{ alert.message }}
        </div>

        <div class="mb-6 grid gap-4 md:grid-cols-4">
          <div class="metric">
            <Package class="h-5 w-5 text-serenade-300" />
            <span>Products</span>
            <strong>{{ products.length }}</strong>
          </div>
          <div class="metric">
            <Receipt class="h-5 w-5 text-emerald-300" />
            <span>Orders</span>
            <strong>{{ orders.length }}</strong>
          </div>
          <div class="metric">
            <Banknote class="h-5 w-5 text-amber-300" />
            <span>Sales</span>
            <strong>${{ totalSales }}</strong>
          </div>
          <div class="metric">
            <Images class="h-5 w-5 text-sky-300" />
            <span>Slides</span>
            <strong>{{ slides.length }}</strong>
          </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <main class="space-y-6">
            <section class="panel">
              <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="eyebrow">Catalog</p>
                  <h2 class="section-title">Music Products</h2>
                </div>
                <select v-model="productFilter" class="field w-full sm:w-52">
                  <option value="all">All Products</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full min-w-[44rem] text-left text-sm">
                  <thead class="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                    <tr>
                      <th class="py-3">Title</th>
                      <th>Seller</th>
                      <th>Format</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th class="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="product in filteredProducts" :key="product.id">
                      <td class="py-4">
                        <p class="font-black text-white">{{ product.title }}</p>
                        <p class="text-xs text-gray-500">{{ product.artist }}</p>
                      </td>
                      <td class="text-gray-300">{{ product.user?.name || product.user?.email || 'Unknown' }}</td>
                      <td class="text-gray-300">{{ product.format || 'Music' }}</td>
                      <td class="font-black text-serenade-300">${{ product.price }}</td>
                      <td>
                        <span class="rounded border px-2 py-1 text-xs font-black uppercase tracking-widest" :class="product.isPublished ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' : 'border-gray-400/30 bg-white/5 text-gray-300'">
                          {{ product.isPublished ? 'Live' : 'Draft' }}
                        </span>
                      </td>
                      <td class="text-right">
                        <button class="action-button" @click="toggleProduct(product)">
                          {{ product.isPublished ? 'Unpublish' : 'Publish' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="panel">
              <div class="mb-5">
                <p class="eyebrow">Commerce</p>
                <h2 class="section-title">Recent Orders</h2>
              </div>
              <div class="grid gap-3">
                <article v-for="order in orders" :key="order.id" class="flex flex-col gap-2 rounded border border-white/5 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="font-black">{{ order.product?.title || 'Purchased music' }}</p>
                    <p class="text-xs uppercase tracking-widest text-gray-500">{{ order.status }} / {{ new Date(order.createdAt).toLocaleDateString() }}</p>
                  </div>
                  <strong class="text-serenade-300">${{ order.price }}</strong>
                </article>
                <p v-if="!orders.length" class="rounded border border-white/5 bg-black/20 p-5 text-sm text-gray-400">No orders yet.</p>
              </div>
            </section>
          </main>

          <aside class="space-y-6">
            <section class="panel">
              <p class="eyebrow">Carousel</p>
              <h2 class="section-title mb-5">New Slide</h2>
              <form class="space-y-4" @submit.prevent="createSlide">
                <label class="space-y-2">
                  <span class="label">Title</span>
                  <input v-model="slideForm.title" class="field" required />
                </label>
                <label class="space-y-2">
                  <span class="label">Subtitle</span>
                  <input v-model="slideForm.subtitle" class="field" />
                </label>
                <label class="space-y-2">
                  <span class="label">Image URL</span>
                  <input v-model="slideForm.image" class="field" required />
                </label>
                <label class="space-y-2">
                  <span class="label">CTA Link</span>
                  <input v-model="slideForm.ctaHref" class="field" />
                </label>
                <label class="space-y-2">
                  <span class="label">Position</span>
                  <input v-model.number="slideForm.position" class="field" type="number" />
                </label>
                <button class="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-serenade-500 px-4 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400">
                  <Plus class="h-4 w-4" />
                  Add Slide
                </button>
              </form>
            </section>

            <section class="panel">
              <p class="eyebrow">Published Queue</p>
              <h2 class="section-title mb-5">Carousel Slides</h2>
              <div class="space-y-3">
                <article v-for="slide in slides" :key="slide.id" class="rounded border border-white/5 bg-black/25 p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-black">{{ slide.title }}</p>
                      <p class="text-xs text-gray-500">{{ slide.subtitle || 'No subtitle' }}</p>
                    </div>
                    <button class="rounded border border-red-400/30 p-2 text-red-200 hover:bg-red-500/10" aria-label="Delete slide" @click="deleteSlide(slide.id)">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </article>
                <p v-if="!slides.length" class="rounded border border-white/5 bg-black/20 p-5 text-sm text-gray-400">No carousel slides yet.</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import { Banknote, Images, Package, Plus, Receipt, RefreshCw, Trash2 } from 'lucide-vue-next';

const products = ref([]);
const orders = ref([]);
const slides = ref([]);
const productFilter = ref('all');
const alert = reactive({ message: '', type: 'success' });
const slideForm = reactive({
  title: '',
  subtitle: '',
  image: '/wallpaper-1.png',
  ctaLabel: 'Explore',
  ctaHref: '/home',
  position: 0,
  isPublished: true,
});

const filteredProducts = computed(() => {
  if (productFilter.value === 'published') return products.value.filter((product) => product.isPublished);
  if (productFilter.value === 'draft') return products.value.filter((product) => !product.isPublished);
  return products.value;
});

const totalSales = computed(() => orders.value.reduce((sum, order) => sum + Number(order.price || 0), 0));

const setAlert = (message, type = 'success') => {
  alert.message = message;
  alert.type = type;
};

const loadDashboard = async () => {
  try {
    const [productsRes, ordersRes, slidesRes] = await Promise.all([
      customFetch.get('products?includeUnpublished=true'),
      customFetch.get('orders'),
      customFetch.get('carousel?includeUnpublished=true'),
    ]);

    products.value = productsRes.data.data || [];
    orders.value = ordersRes.data.data || [];
    slides.value = slidesRes.data.data || [];
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to load dashboard', 'error');
  }
};

const toggleProduct = async (product) => {
  try {
    await customFetch.patch(`products/${product.id}`, { isPublished: !product.isPublished });
    await loadDashboard();
    setAlert('Product status updated.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to update product', 'error');
  }
};

const resetSlideForm = () => {
  Object.assign(slideForm, {
    title: '',
    subtitle: '',
    image: '/wallpaper-1.png',
    ctaLabel: 'Explore',
    ctaHref: '/home',
    position: 0,
    isPublished: true,
  });
};

const createSlide = async () => {
  try {
    await customFetch.post('carousel', slideForm);
    resetSlideForm();
    await loadDashboard();
    setAlert('Carousel slide created.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to create slide', 'error');
  }
};

const deleteSlide = async (id) => {
  try {
    await customFetch.delete(`carousel/${id}`);
    await loadDashboard();
    setAlert('Carousel slide deleted.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to delete slide', 'error');
  }
};

onMounted(loadDashboard);
</script>

<style scoped>
.panel {
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.03);
  padding: 1.25rem;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.metric {
  display: grid;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
}

.metric span,
.eyebrow,
.label {
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgb(107, 114, 128);
}

.metric strong {
  font-size: 1.8rem;
  line-height: 1;
}

.eyebrow {
  color: rgb(245, 143, 66);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.field {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.34);
  padding: 0.7rem 0.9rem;
  color: white;
  outline: none;
}

.field:focus {
  border-color: rgba(245, 143, 66, 0.7);
  box-shadow: 0 0 0 3px rgba(245, 143, 66, 0.12);
}

.action-button {
  height: 2.25rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(245, 143, 66, 0.35);
  padding: 0 0.75rem;
  color: rgb(252, 211, 77);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.action-button:hover {
  background: rgba(245, 143, 66, 0.1);
}
</style>
