<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-12 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="eyebrow">Creator Console</p>
            <h1 class="mt-2 text-3xl font-black uppercase tracking-widest md:text-4xl">Music Studio</h1>
            <p class="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">Uploads, review status, catalog, buyers, and revenue</p>
          </div>
          <button class="primary-button w-fit" @click="loadStudio">Refresh</button>
        </div>

        <p v-if="alert.message" class="mb-5 rounded border px-4 py-3 text-sm font-bold" :class="alert.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
          {{ alert.message }}
        </p>

        <div class="mb-6 grid gap-4 md:grid-cols-4">
          <div class="metric revenue"><span>Revenue</span><strong>${{ salesSummary.revenue || 0 }}</strong></div>
          <div class="metric orders"><span>Orders</span><strong>{{ salesSummary.orders || 0 }}</strong></div>
          <div class="metric live"><span>Live Music</span><strong>{{ liveProducts.length }}</strong></div>
          <div class="metric queue"><span>Review Queue</span><strong>{{ pendingSubmissions.length }}</strong></div>
        </div>

        <div class="mb-6 grid gap-6 lg:grid-cols-2">
          <div class="panel">
            <div class="mb-5"><p class="eyebrow">Revenue</p><h2 class="section-title">Monthly Sales</h2></div>
            <RevenueChart :data="studioAnalytics.revenue" />
          </div>
          <div class="panel">
            <div class="mb-5"><p class="eyebrow">Catalog</p><h2 class="section-title">Genres</h2></div>
            <GenreChart :data="studioAnalytics.genres" />
          </div>
          <div class="panel lg:col-span-2">
            <div class="mb-5"><p class="eyebrow">Distribution</p><h2 class="section-title">Sales by Format</h2></div>
            <FormatChart :data="studioAnalytics.formats" />
          </div>
        </div>

        <nav class="studio-tabs mb-6">
          <button v-for="tab in studioTabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </nav>

        <section v-if="activeTab === 'status'" class="panel">
          <div class="mb-5"><p class="eyebrow">Review</p><h2 class="section-title">Submission Status</h2></div>
          <div class="grid gap-3">
            <article v-for="submission in submissions" :key="submission.id" class="admin-card">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><p class="font-black">{{ submission.title }}</p><p class="text-sm text-gray-400">{{ submission.artist }} / {{ submission.format }}</p></div>
                <span class="status-badge" :class="submission.status.toLowerCase()">{{ submission.status }}</span>
              </div>
              <p v-if="submission.adminNote" class="mt-3 text-sm leading-6 text-amber-100">{{ submission.adminNote }}</p>
              <div v-if="submission.status !== 'ACCEPTED'" class="mt-4 flex gap-2">
                <button class="action-button" @click="fillForm(submission)">Edit</button>
                <button class="danger-button" @click="deleteSubmission(submission)">Delete</button>
              </div>
            </article>
            <p v-if="!submissions.length" class="empty">No submissions yet.</p>
          </div>
          <div v-if="submissionsHasMore" class="mt-6 flex justify-center">
            <button class="secondary-button" type="button" @click="loadMoreSubmissions">Load More</button>
          </div>
        </section>

        <section v-else-if="activeTab === 'catalog'" class="panel">
          <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p class="eyebrow">Catalog</p><h2 class="section-title">Accepted Music</h2></div>
            <button class="primary-button w-fit" type="button" @click="openUploadModal">Tambah Produk</button>
          </div>
          <div class="grid gap-4 lg:grid-cols-2">
            <article v-for="product in products" :key="product.id" class="admin-card">
              <div class="flex gap-4">
                <img :src="product.image" class="h-20 w-20 rounded object-cover" :alt="product.title" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0"><p class="truncate font-black">{{ product.title }}</p><p class="truncate text-sm text-gray-400">{{ product.artist }} / ${{ product.price }}</p></div>
                    <span class="status-badge" :class="product.availability?.toLowerCase()">{{ product.availability || 'AVAILABLE' }}</span>
                  </div>
                  <p class="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">{{ product._count?.orders || 0 }} buyers</p>
                </div>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button class="action-button" @click="setAvailability(product, 'AVAILABLE')">Restock</button>
                <button class="action-button" @click="setAvailability(product, 'SOLD_OUT')">Stock Habis</button>
                <button class="danger-button" @click="setAvailability(product, 'WITHDRAWN')">Tarik</button>
              </div>
            </article>
            <p v-if="!products.length" class="empty">Accepted uploads will appear here after admin approval.</p>
          </div>
          <div v-if="catalogHasMore" class="mt-6 flex justify-center">
            <button class="secondary-button" type="button" @click="loadMoreCatalog">Load More</button>
          </div>
        </section>

        <section v-else-if="activeTab === 'design'" class="panel">
          <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="eyebrow">Tape Design</p>
              <h2 class="section-title">Saved Preset</h2>
            </div>
            <button class="primary-button w-fit" type="button" @click="saveDesignToServer">{{ editingDesignId ? 'Update Design' : 'Save Design' }}</button>
          </div>

          <div class="design-workbench">
            <aside class="design-controls">
              <div class="import-box mb-5">
                <label class="form-row">
                  <span class="label">Import Design Link</span>
                  <input v-model="importDesignLink" class="field" placeholder="Paste shared design link or id" />
                </label>
                <button class="secondary-button w-full" type="button" @click="importDesignFromInput">Import</button>
              </div>

              <label class="form-row mb-4">
                <span class="label">Design Name</span>
                <input v-model="designForm.name" class="field" />
              </label>

              <div class="format-switch">
                <button v-for="format in designFormats" :key="format" type="button" class="format-button" :class="{ active: designPreviewFormat === format }" @click="designPreviewFormat = format">
                  {{ format }}
                </button>
              </div>

              <div class="grid gap-3">
                <label class="form-row"><span class="label">Body</span><select v-model="designForm.baseColor" class="field"><option v-for="color in baseColors" :key="color.value" :value="color.value">{{ color.label }}</option></select></label>
                <label class="form-row"><span class="label">Border</span><select v-model="designForm.borderColor" class="field"><option v-for="color in borderColors" :key="color.value" :value="color.value">{{ color.label }}</option></select></label>
                <label class="form-row"><span class="label">Reel</span><select v-model="designForm.discColor" class="field"><option v-for="color in reelColors" :key="color.value" :value="color.value">{{ color.label }}</option></select></label>
                <label class="form-row"><span class="label">Label</span><select v-model="designForm.sideColor" class="field"><option v-for="color in labelColors" :key="color.value" :value="color.value">{{ color.label }}</option></select></label>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-2">
                <button v-for="preset in designPresets" :key="preset.name" type="button" class="preset-button" @click="applyDesignPreset(preset)">
                  <span class="preset-swatch" :style="swatchStyle(preset)"></span>
                  {{ preset.name }}
                </button>
              </div>

              <div class="mt-5 grid gap-2 border-t border-white/10 pt-5">
                <button class="primary-button" type="button" @click="saveDesignToServer">{{ editingDesignId ? 'Update Design' : 'Save New Design' }}</button>
                <button v-if="editingDesignId" class="secondary-button" type="button" @click="newDesignDraft">New Draft</button>
              </div>
            </aside>

            <div class="design-preview">
              <div>
                <p class="label">Live Preview</p>
                <h3 class="mt-2 text-xl font-black uppercase tracking-widest">{{ designPreviewFormat }} Shelf Look</h3>
              </div>
              <div class="preview-stage">
                <CassetteTape
                  v-if="designPreviewFormat === 'Cassette'"
                  title="Studio Draft"
                  artist="Retro Reels"
                  image="/RR.png"
                  :base-color="designForm.baseColor"
                  :border-color="designForm.borderColor"
                  :disc-color="designForm.discColor"
                  :side-color="designForm.sideColor"
                  :active="true"
                />
                <DiscTape
                  v-else
                  title="Studio Draft"
                  artist="Retro Reels"
                  image="/RR.png"
                  width="w-72"
                  height="h-44"
                  tape-rotation="rotate-0"
                  title-background-color="bg-red-500"
                  :base-color="designForm.baseColor"
                  :border-color="designForm.borderColor"
                  :disc-color="designForm.discColor"
                  :side-color="designForm.sideColor"
                  :hover-scale="false"
                />
              </div>
              <p class="text-sm font-bold leading-6 text-gray-500">Design ini otomatis dipakai saat tambah produk baru. Untuk Vinyl, cover upload tetap jadi label tengah.</p>
            </div>
          </div>

          <div class="mt-5 grid gap-3 lg:grid-cols-2">
            <article v-for="design in savedDesigns" :key="design.id" class="saved-design-card">
              <button class="saved-design-main" type="button" @click="editSavedDesign(design)">
                <span class="preset-swatch" :style="swatchStyle(design)"></span>
                <span>
                  <strong>{{ design.name }}</strong>
                  <small>{{ design.isPublic ? 'Shared' : 'Private' }}</small>
                </span>
              </button>
              <div class="flex gap-2">
                <button class="action-button" type="button" @click="shareDesign(design)">Share</button>
                <button class="danger-button" type="button" @click="deleteDesign(design)">Delete</button>
              </div>
            </article>
            <p v-if="!savedDesigns.length" class="empty lg:col-span-2">No saved tape designs yet.</p>
          </div>

          <div v-if="currentShareUrl" class="share-panel mt-5">
            <div>
              <p class="label">Share Link</p>
              <p class="mt-1 text-xs font-bold text-gray-500">Anyone with this link can load the design as a remix draft.</p>
            </div>
            <input class="field" :value="currentShareUrl" readonly @focus="$event.target.select()" />
            <button class="secondary-button w-fit" type="button" @click="copyShareUrl">Copy</button>
          </div>
        </section>

        <section v-else class="panel">
          <div class="mb-5"><p class="eyebrow">Buyers</p><h2 class="section-title">Order History</h2></div>
          <div class="grid gap-4">
            <article v-for="order in sales" :key="order.id" class="invoice-card">
              <div class="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="eyebrow">Invoice</p>
                  <h3 class="mt-1 font-mono text-lg font-black text-white">#{{ shortId(order.id) }}</h3>
                  <p class="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="status-badge accepted">{{ order.status }}</span>
                  <button class="action-button" type="button" @click="openOrderDetail(order)">Detail</button>
                </div>
              </div>

              <div class="grid gap-4 py-4 md:grid-cols-[1fr_14rem]">
                <div class="flex gap-4">
                  <img :src="order.product?.image || '/RR.png'" class="h-20 w-20 rounded object-cover" :alt="order.product?.title || 'Music cover'" />
                  <div class="min-w-0">
                    <p class="truncate font-black text-white">{{ order.product?.title || 'Purchased music' }}</p>
                    <p class="truncate text-sm text-gray-400">{{ order.product?.artist || 'Unknown Artist' }} / {{ order.product?.format || 'Music' }}</p>
                  </div>
                </div>
                <div class="rounded border border-white/10 bg-black/25 p-3">
                  <p class="text-xs font-black uppercase tracking-widest text-gray-500">Buyer</p>
                  <p class="mt-2 truncate font-black text-white">{{ order.user?.name || 'Retro Listener' }}</p>
                  <p class="truncate text-xs text-gray-500">{{ order.user?.email }}</p>
                </div>
              </div>

              <div class="grid gap-2 border-t border-white/10 pt-4 text-sm">
                <div class="invoice-line"><span>Subtotal</span><strong>${{ order.price }}</strong></div>
                <div class="invoice-line total"><span>Total Revenue</span><strong>${{ order.price }}</strong></div>
              </div>
            </article>
            <p v-if="!sales.length" class="empty">No buyers yet.</p>
          </div>
          <div v-if="salesHasMore" class="mt-6 flex justify-center">
            <button class="secondary-button" type="button" @click="loadMoreSales">Load More</button>
          </div>
        </section>
      </div>

      <div v-if="isUploadModalOpen" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-8" @click.self="closeUploadModal">
        <section class="studio-modal">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <p class="eyebrow">Upload</p>
              <h2 class="section-title mt-1">{{ editingSubmissionId ? 'Edit Submission' : 'Tambah Produk' }}</h2>
            </div>
            <button class="secondary-button" type="button" @click="closeUploadModal">Close</button>
          </div>
          <form class="space-y-4" @submit.prevent="submitMusic">
            <label class="form-row"><span class="label">Title</span><input v-model="submissionForm.title" class="field" required /></label>
            <label class="form-row"><span class="label">Artist</span><input v-model="submissionForm.artist" class="field" required /></label>
            <label class="form-row">
              <span class="label">Audio Upload</span>
              <input class="field file-field" type="file" accept="audio/*" :required="!submissionForm.audioUrl" @change="handleFileUpload($event, 'audioUrl')" />
              <span v-if="submissionForm.audioUrl" class="upload-hint">Audio ready</span>
            </label>
            <label class="form-row">
              <span class="label">Cover Upload</span>
              <input class="field file-field" type="file" accept="image/*" @change="handleFileUpload($event, 'coverUrl')" />
              <img v-if="submissionForm.coverUrl" :src="submissionForm.coverUrl" class="upload-preview" alt="Cover preview" />
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="form-row"><span class="label">Genre</span><select v-model="submissionForm.genre" class="field"><option v-for="genre in genres" :key="genre">{{ genre }}</option></select></label>
              <label class="form-row"><span class="label">Format</span><select v-model="submissionForm.format" class="field"><option v-for="format in formats" :key="format">{{ format }}</option></select></label>
            </div>
            <label class="form-row"><span class="label">Price</span><span class="price-field"><span>$</span><input v-model.number="submissionForm.price" type="number" min="1" /></span></label>
            <div class="design-panel">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label class="form-row flex-1">
                  <span class="label">{{ submissionForm.format === 'Vinyl' ? 'Vinyl Center' : 'Tape Design' }}</span>
                  <select v-model="selectedUploadDesignId" class="field" :disabled="submissionForm.format === 'Vinyl'" @change="applyUploadDesign">
                    <option value="">Use current saved preset</option>
                    <option v-for="design in savedDesigns" :key="design.id" :value="design.id">{{ design.name }}</option>
                  </select>
                </label>
                <button class="secondary-button w-fit" type="button" @click="goToDesignTab">Create Design</button>
              </div>
              <p class="mt-2 text-xs font-bold text-gray-500">{{ submissionForm.format === 'Vinyl' ? 'Cover upload will become the vinyl center image.' : 'Choose a saved design or create a new one in Tape Design.' }}</p>
            </div>
            <label class="form-row"><span class="label">Note</span><textarea v-model="submissionForm.note" class="field min-h-24 resize-y"></textarea></label>
            <div class="flex flex-col gap-3 sm:flex-row">
              <button class="primary-button flex-1">{{ editingSubmissionId ? 'Send Revision' : 'Send To Review' }}</button>
              <button v-if="editingSubmissionId" type="button" class="secondary-button" @click="closeUploadModal">Cancel Edit</button>
            </div>
          </form>
        </section>
      </div>

      <div v-if="selectedOrder" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-8" @click.self="closeOrderDetail">
        <section class="invoice-modal">
          <div class="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="eyebrow">Order Invoice</p>
              <h2 class="mt-2 font-mono text-2xl font-black text-white">#{{ shortId(selectedOrder.id) }}</h2>
              <p class="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">{{ formatDate(selectedOrder.createdAt) }}</p>
            </div>
            <span class="status-badge accepted w-fit">{{ selectedOrder.status }}</span>
          </div>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div class="invoice-box">
              <p class="label">Buyer</p>
              <p class="mt-2 font-black text-white">{{ selectedOrder.user?.name || 'Retro Listener' }}</p>
              <p class="text-sm text-gray-500">{{ selectedOrder.user?.email || 'No email' }}</p>
              <p class="mt-3 text-xs font-bold uppercase tracking-widest text-gray-600">Buyer #{{ shortId(selectedOrder.userId) }}</p>
            </div>
            <div class="invoice-box">
              <p class="label">Seller</p>
              <p class="mt-2 font-black text-white">Your Studio</p>
              <p class="text-sm text-gray-500">Retro Reels creator account</p>
              <p class="mt-3 text-xs font-bold uppercase tracking-widest text-gray-600">Product #{{ shortId(selectedOrder.productId) }}</p>
            </div>
          </div>

          <div class="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
            <div class="flex gap-4">
              <img :src="selectedOrder.product?.image || '/RR.png'" class="h-24 w-24 rounded object-cover" :alt="selectedOrder.product?.title || 'Music cover'" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-bold uppercase tracking-widest text-gray-500">{{ selectedOrder.product?.format || 'Music' }}</p>
                <h3 class="mt-1 text-lg font-black text-white">{{ selectedOrder.product?.title || 'Purchased music' }}</h3>
                <p class="text-sm text-gray-400">{{ selectedOrder.product?.artist || 'Unknown Artist' }}</p>
                <p class="mt-3 text-sm leading-6 text-gray-500">{{ selectedOrder.product?.description || 'No product description.' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 grid gap-2 text-sm">
            <div class="invoice-line"><span>Item Price</span><strong>${{ selectedOrder.price }}</strong></div>
            <div class="invoice-line"><span>Platform Fee</span><strong>$0</strong></div>
            <div class="invoice-line total"><span>Total Paid</span><strong>${{ selectedOrder.price }}</strong></div>
          </div>

          <div class="mt-6 flex justify-end">
            <button class="primary-button" type="button" @click="closeOrderDetail">Close Invoice</button>
          </div>
        </section>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import CassetteTape from '@/components/catalog/media/CassetteTape.vue';
import DiscTape from '@/components/catalog/media/DiscTape.vue';
import { resolveTapeColor } from '@/components/catalog/media/tapeColors';
import RevenueChart from '@/components/admin/RevenueChart.vue';
import GenreChart from '@/components/admin/GenreChart.vue';
import FormatChart from '@/components/admin/FormatChart.vue';

const studioTabs = [
  { id: 'catalog', label: 'Catalog' },
  { id: 'design', label: 'Tape Design' },
  { id: 'status', label: 'Status' },
  { id: 'orders', label: 'Orders' },
];
const genres = ['Rock', 'Pop', 'Indo Pop', 'City Pop', 'Lo-fi', 'Jazz', 'Electronic', 'Acoustic', 'Ballad', 'Hip Hop'];
const formats = ['VHS', 'Cassette', 'Vinyl'];
const colorFamilies = ['zinc', 'slate', 'stone', 'neutral', 'gray', 'red', 'rose', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'serenade', 'bay-leaf'];
const colorLabel = (family) => family.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
const colorOptions = (prefix, shade) => colorFamilies.map((family) => ({ label: colorLabel(family), value: `${prefix}-${family}-${shade}` }));
const baseColors = [{ label: 'Black', value: 'bg-black' }, ...colorOptions('bg', 950), ...colorOptions('bg', 900), ...colorOptions('bg', 800)];
const borderColors = [{ label: 'White', value: 'border-white' }, ...colorOptions('border', 200), ...colorOptions('border', 300), ...colorOptions('border', 400)];
const reelColors = [{ label: 'Black', value: 'bg-black' }, { label: 'White', value: 'bg-white' }, ...colorOptions('bg', 200), ...colorOptions('bg', 300), ...colorOptions('bg', 400), ...colorOptions('bg', 500)];
const labelColors = [{ label: 'White', value: 'bg-white' }, ...colorOptions('bg', 100), ...colorOptions('bg', 200), ...colorOptions('bg', 300)];
const designFormats = ['VHS', 'Cassette'];
const designPresets = [
  { name: 'Mono', baseColor: 'bg-zinc-950', borderColor: 'border-zinc-300', discColor: 'bg-zinc-300', sideColor: 'bg-zinc-100' },
  { name: 'Amber', baseColor: 'bg-orange-950', borderColor: 'border-orange-300', discColor: 'bg-amber-300', sideColor: 'bg-orange-100' },
  { name: 'Cherry', baseColor: 'bg-red-950', borderColor: 'border-red-300', discColor: 'bg-rose-300', sideColor: 'bg-pink-100' },
  { name: 'Ocean', baseColor: 'bg-sky-950', borderColor: 'border-sky-300', discColor: 'bg-sky-300', sideColor: 'bg-sky-100' },
  { name: 'Mint', baseColor: 'bg-emerald-950', borderColor: 'border-emerald-300', discColor: 'bg-lime-300', sideColor: 'bg-emerald-100' },
  { name: 'Violet', baseColor: 'bg-purple-950', borderColor: 'border-purple-300', discColor: 'bg-violet-300', sideColor: 'bg-purple-100' },
];
const designStorageKey = 'retro-reels:studio-design';
const defaultDesign = {
  name: 'Studio Tape',
  baseColor: 'bg-zinc-950',
  borderColor: 'border-zinc-300',
  discColor: 'bg-zinc-300',
  sideColor: 'bg-zinc-100',
};
const getSavedDesign = () => {
  try {
    return { ...defaultDesign, ...JSON.parse(localStorage.getItem(designStorageKey) || '{}') };
  } catch {
    return { ...defaultDesign };
  }
};
const createEmptySubmission = () => ({
  title: '',
  artist: '',
  genre: genres[0],
  format: formats[0],
  audioUrl: '',
  coverUrl: '',
  note: '',
  price: 20,
  baseColor: getSavedDesign().baseColor,
  borderColor: getSavedDesign().borderColor,
  discColor: getSavedDesign().discColor,
  sideColor: getSavedDesign().sideColor,
});

const route = useRoute();
const activeTab = ref('catalog');
const products = ref([]);
const submissions = ref([]);
const sales = ref([]);
const savedDesigns = ref([]);
const catalogNextSkip = ref(0);
const submissionsNextSkip = ref(0);
const salesNextSkip = ref(0);
const catalogHasMore = ref(false);
const submissionsHasMore = ref(false);
const salesHasMore = ref(false);
const salesSummary = reactive({ revenue: 0, orders: 0 });
const studioAnalytics = reactive({ revenue: [], genres: [], formats: [] });
const alert = reactive({ message: '', type: 'success' });
const editingSubmissionId = ref('');
const isUploadModalOpen = ref(false);
const selectedOrder = ref(null);
const designPreviewFormat = ref('VHS');
const designForm = reactive(getSavedDesign());
const editingDesignId = ref('');
const selectedUploadDesignId = ref('');
const currentShareUrl = ref('');
const importDesignLink = ref('');
const submissionForm = reactive(createEmptySubmission());

const liveProducts = computed(() => products.value.filter((product) => product.availability === 'AVAILABLE'));
const pendingSubmissions = computed(() => submissions.value.filter((submission) => submission.status === 'PENDING'));

const setAlert = (message, type = 'success') => { alert.message = message; alert.type = type; };
const resetForm = () => { editingSubmissionId.value = ''; Object.assign(submissionForm, createEmptySubmission()); };
const shortId = (value) => String(value || '').slice(0, 8).toUpperCase();
const formatDate = (value) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
const openOrderDetail = (order) => { selectedOrder.value = order; };
const closeOrderDetail = () => { selectedOrder.value = null; };
const openUploadModal = () => { resetForm(); selectedUploadDesignId.value = ''; isUploadModalOpen.value = true; };
const closeUploadModal = () => { resetForm(); isUploadModalOpen.value = false; };
const designPayload = () => ({
  name: designForm.name || 'Studio Tape',
  baseColor: designForm.baseColor,
  borderColor: designForm.borderColor,
  discColor: designForm.discColor,
  sideColor: designForm.sideColor,
});
const syncSubmissionDesign = () => {
  Object.assign(submissionForm, {
    baseColor: designForm.baseColor,
    borderColor: designForm.borderColor,
    discColor: designForm.discColor,
    sideColor: designForm.sideColor,
  });
};
const saveDesignPreset = (showMessage = true) => {
  localStorage.setItem(designStorageKey, JSON.stringify({
    name: designForm.name,
    baseColor: designForm.baseColor,
    borderColor: designForm.borderColor,
    discColor: designForm.discColor,
    sideColor: designForm.sideColor,
  }));
  syncSubmissionDesign();
  if (showMessage) setAlert('Tape colors saved for the next upload.');
};
const applyDesignPreset = (preset) => {
  Object.assign(designForm, {
    name: preset.name || designForm.name,
    baseColor: preset.baseColor,
    borderColor: preset.borderColor,
    discColor: preset.discColor,
    sideColor: preset.sideColor,
  });
};
const newDesignDraft = () => {
  editingDesignId.value = '';
  Object.assign(designForm, { ...defaultDesign, name: 'Studio Tape' });
};
const editSavedDesign = (design) => {
  editingDesignId.value = design.id;
  Object.assign(designForm, {
    name: design.name,
    baseColor: design.baseColor,
    borderColor: design.borderColor,
    discColor: design.discColor,
    sideColor: design.sideColor,
  });
  saveDesignPreset(false);
};
const loadTapeDesigns = async () => {
  const { data } = await customFetch.get('vhs/presets/me', { headers: { 'x-skip-loader': 'true' } });
  savedDesigns.value = data.data || [];
};
const saveDesignToServer = async () => {
  try {
    const payload = designPayload();
    const response = editingDesignId.value
      ? await customFetch.patch(`vhs/presets/${editingDesignId.value}`, payload)
      : await customFetch.post('vhs/presets', payload);
    editingDesignId.value = response.data.data.id;
    saveDesignPreset(false);
    await loadTapeDesigns();
    setAlert('Tape design saved.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to save tape design', 'error');
  }
};
const deleteDesign = async (design) => {
  try {
    await customFetch.delete(`vhs/presets/${design.id}`);
    if (editingDesignId.value === design.id) newDesignDraft();
    await loadTapeDesigns();
    setAlert('Tape design deleted.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to delete tape design', 'error');
  }
};
const shareDesign = async (design) => {
  try {
    const response = await customFetch.post(`vhs/presets/${design.id}/share`);
    await loadTapeDesigns();
    const url = `${window.location.origin}${window.location.pathname}?design=${response.data.data.id}`;
    currentShareUrl.value = url;
    await copyText(url);
    setAlert('Share link ready.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to share tape design', 'error');
  }
};
const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', 'true');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
};
const copyShareUrl = async () => {
  if (!currentShareUrl.value) return;
  try {
    await copyText(currentShareUrl.value);
    setAlert('Share link copied.');
  } catch {
    setAlert('Select the link and copy it manually.', 'error');
  }
};
const parseSharedDesignId = (value) => {
  const text = String(value || '').trim();
  if (!text) return '';
  try {
    const url = new URL(text);
    return url.searchParams.get('design') || url.pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    const queryMatch = text.match(/[?&]design=([^&]+)/);
    return queryMatch ? decodeURIComponent(queryMatch[1]) : text;
  }
};
const loadSharedDesign = async (sharedId) => {
  if (!sharedId) return;
  try {
    const { data } = await customFetch.get(`vhs/shared/${sharedId}`, { headers: { 'x-skip-loader': 'true' } });
    Object.assign(designForm, { ...data.data, name: `${data.data.name} Remix` });
    editingDesignId.value = '';
    activeTab.value = 'design';
    saveDesignPreset(false);
    importDesignLink.value = '';
    setAlert('Shared tape design loaded. Save it to keep a copy.');
  } catch {
    setAlert('Shared tape design is unavailable.', 'error');
  }
};
const importSharedDesign = async () => {
  const sharedId = route.query.design;
  if (!sharedId || Array.isArray(sharedId)) return;
  await loadSharedDesign(sharedId);
};
const importDesignFromInput = async () => {
  const sharedId = parseSharedDesignId(importDesignLink.value);
  if (!sharedId) {
    setAlert('Paste a shared design link first.', 'error');
    return;
  }
  await loadSharedDesign(sharedId);
};
const applyUploadDesign = () => {
  const design = savedDesigns.value.find((item) => item.id === selectedUploadDesignId.value);
  if (!design) {
    syncSubmissionDesign();
    return;
  }
  Object.assign(submissionForm, {
    baseColor: design.baseColor,
    borderColor: design.borderColor,
    discColor: design.discColor,
    sideColor: design.sideColor,
  });
};
const goToDesignTab = () => {
  isUploadModalOpen.value = false;
  activeTab.value = 'design';
};
const swatchStyle = (design) => ({
  backgroundColor: resolveTapeColor(design.baseColor, '#09090b'),
  borderColor: resolveTapeColor(design.borderColor, '#d4d4d8'),
  boxShadow: `inset 0 0 0 4px ${resolveTapeColor(design.discColor, '#d4d4d8')}, inset 0 0 0 8px ${resolveTapeColor(design.sideColor, '#f4f4f5')}`,
});
const handleFileUpload = (event, field) => {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    submissionForm[field] = String(reader.result || '');
  };
  reader.readAsDataURL(file);
};

const applyCatalogPage = (response, append = false) => {
  products.value = append ? [...products.value, ...(response.data.data || [])] : response.data.data || [];
  catalogNextSkip.value = response.data.pagination?.nextSkip || products.value.length;
  catalogHasMore.value = Boolean(response.data.pagination?.hasMore);
};

const applySubmissionsPage = (response, append = false) => {
  submissions.value = append ? [...submissions.value, ...(response.data.data || [])] : response.data.data || [];
  submissionsNextSkip.value = response.data.pagination?.nextSkip || submissions.value.length;
  submissionsHasMore.value = Boolean(response.data.pagination?.hasMore);
};

const applySalesPage = (response, append = false) => {
  sales.value = append ? [...sales.value, ...(response.data.data || [])] : response.data.data || [];
  salesNextSkip.value = response.data.pagination?.nextSkip || sales.value.length;
  salesHasMore.value = Boolean(response.data.pagination?.hasMore);
  Object.assign(salesSummary, response.data.summary || { revenue: 0, orders: sales.value.length });
};

const loadStudio = async () => {
  try {
    const [catalogRes, submissionsRes, salesRes, designsRes, analyticsRes] = await Promise.all([
      customFetch.get('products/me/catalog', { params: { skip: 0, take: 12 } }),
      customFetch.get('music-submissions/me', { params: { skip: 0, take: 12 } }),
      customFetch.get('products/me/sales', { params: { skip: 0, take: 10 } }),
      customFetch.get('vhs/presets/me', { headers: { 'x-skip-loader': 'true' } }),
      customFetch.get('products/me/analytics', { headers: { 'x-skip-loader': 'true' } }),
    ]);
    applyCatalogPage(catalogRes);
    applySubmissionsPage(submissionsRes);
    applySalesPage(salesRes);
    savedDesigns.value = designsRes.data.data || [];
    const analytics = analyticsRes.data.data || {};
    studioAnalytics.revenue = analytics.revenue || [];
    studioAnalytics.genres = analytics.genres || [];
    studioAnalytics.formats = analytics.formats || [];
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to load studio', 'error');
  }
};

const loadMoreCatalog = async () => {
  const response = await customFetch.get('products/me/catalog', { params: { skip: catalogNextSkip.value, take: 12 } });
  applyCatalogPage(response, true);
};

const loadMoreSubmissions = async () => {
  const response = await customFetch.get('music-submissions/me', { params: { skip: submissionsNextSkip.value, take: 12 } });
  applySubmissionsPage(response, true);
};

const loadMoreSales = async () => {
  const response = await customFetch.get('products/me/sales', { params: { skip: salesNextSkip.value, take: 10 } });
  applySalesPage(response, true);
};

const submitMusic = async () => {
  try {
    selectedUploadDesignId.value ? applyUploadDesign() : syncSubmissionDesign();
    saveDesignPreset(false);
    editingSubmissionId.value
      ? await customFetch.patch(`music-submissions/${editingSubmissionId.value}`, submissionForm)
      : await customFetch.post('music-submissions', submissionForm);
    resetForm();
    activeTab.value = 'status';
    isUploadModalOpen.value = false;
    await loadStudio();
    setAlert('Music sent to review.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to submit music', 'error');
  }
};

const fillForm = (submission) => {
  editingSubmissionId.value = submission.id;
  selectedUploadDesignId.value = '';
  const savedDesign = getSavedDesign();
  Object.assign(submissionForm, {
    title: submission.title,
    artist: submission.artist,
    genre: submission.genre || genres[0],
    format: formats.includes(submission.format) ? submission.format : formats[0],
    audioUrl: submission.audioUrl,
    coverUrl: submission.coverUrl || '',
    note: submission.note || '',
    price: submission.price || 20,
    baseColor: submission.baseColor || savedDesign.baseColor,
    borderColor: submission.borderColor || savedDesign.borderColor,
    discColor: submission.discColor || savedDesign.discColor,
    sideColor: submission.sideColor || savedDesign.sideColor,
  });
  Object.assign(designForm, {
    name: savedDesign.name || 'Studio Tape',
    baseColor: submissionForm.baseColor,
    borderColor: submissionForm.borderColor,
    discColor: submissionForm.discColor,
    sideColor: submissionForm.sideColor,
  });
  isUploadModalOpen.value = true;
};

const deleteSubmission = async (submission) => {
  try {
    await customFetch.delete(`music-submissions/${submission.id}`);
    await loadStudio();
    setAlert('Submission deleted.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to delete submission', 'error');
  }
};

const setAvailability = async (product, availability) => {
  try {
    await customFetch.patch(`products/${product.id}/availability`, { availability });
    await loadStudio();
    setAlert('Catalog status updated.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to update catalog', 'error');
  }
};

onMounted(async () => {
  await loadStudio();
  await importSharedDesign();
});
</script>

<style scoped>
.panel,.admin-card,.metric{border-radius:.5rem;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);padding:1.25rem;box-shadow:0 18px 40px rgba(0,0,0,.28)}
.metric{display:grid;gap:.5rem;background:rgba(0,0,0,.3)}.metric span,.eyebrow,.label{font-size:.7rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:rgb(107 114 128)}.metric strong{font-size:1.8rem;line-height:1}.metric.revenue strong{color:#fbbf24}.metric.orders strong{color:#67e8f9}.metric.live strong{color:#86efac}.metric.queue strong{color:#c4b5fd}.eyebrow{color:rgb(245 143 66)}.section-title{font-size:1.25rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.form-row{display:grid;gap:.45rem}.field{width:100%;border-radius:.375rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.34);padding:.7rem .9rem;color:white;outline:none}.field:focus{border-color:rgba(245,143,66,.7);box-shadow:0 0 0 3px rgba(245,143,66,.12)}
.file-field{color:rgb(156 163 175)}.file-field::file-selector-button{margin-right:.75rem;border:0;border-radius:.25rem;background:#f2701d;padding:.45rem .75rem;font-size:.68rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#050505}.upload-hint{font-size:.75rem;font-weight:800;color:#86efac}.upload-preview{height:7rem;width:7rem;border-radius:.5rem;border:1px solid rgba(255,255,255,.12);object-fit:cover}.price-field{display:flex;align-items:center;border-radius:.375rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.34);color:#ffc18e}.price-field span{padding-left:.9rem;font-weight:900}.price-field input{min-width:0;flex:1;background:transparent;padding:.7rem .9rem;color:white;outline:none}.price-field:focus-within{border-color:rgba(245,143,66,.7);box-shadow:0 0 0 3px rgba(245,143,66,.12)}.design-panel{border-radius:.5rem;border:1px solid rgba(245,143,66,.16);background:rgba(245,143,66,.06);padding:1rem}
.design-workbench{display:grid;gap:1rem}@media (min-width:1024px){.design-workbench{grid-template-columns:minmax(17rem,22rem) 1fr}}.design-controls,.design-preview{border-radius:.6rem;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.22);padding:1rem}.import-box{display:grid;gap:.75rem;border-radius:.5rem;border:1px solid rgba(52,211,153,.16);background:rgba(16,185,129,.06);padding:.85rem}.format-switch{margin-bottom:1rem;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.format-button,.preset-button{border-radius:.35rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);padding:.75rem;font-size:.72rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:rgb(156 163 175)}.format-button.active{border-color:rgba(245,143,66,.75);background:rgba(245,143,66,.14);color:#ffd7b0}.preset-button{display:flex;align-items:center;gap:.5rem;text-align:left}.preset-button:hover{border-color:rgba(245,143,66,.45);color:white}.preset-swatch{height:1.25rem;width:1.25rem;flex:0 0 1.25rem;border-radius:.25rem;border-width:2px;border-style:solid}.preview-stage{margin:1rem 0;display:grid;min-height:20rem;place-items:center;overflow:hidden;border-radius:.65rem;border:1px solid rgba(255,255,255,.08);background:radial-gradient(circle at center,rgba(245,143,66,.12),transparent 54%),rgba(0,0,0,.28);padding:2rem}.saved-design-card{display:flex;align-items:center;justify-content:space-between;gap:1rem;border-radius:.5rem;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.22);padding:1rem}.saved-design-main{display:flex;min-width:0;align-items:center;gap:.75rem;text-align:left}.saved-design-main strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:900;color:white}.saved-design-main small{display:block;font-size:.68rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:rgb(107 114 128)}.share-panel{display:grid;gap:.75rem;border-radius:.6rem;border:1px solid rgba(52,211,153,.2);background:rgba(16,185,129,.08);padding:1rem}@media (min-width:768px){.share-panel{grid-template-columns:1fr minmax(16rem,2fr) auto;align-items:end}}
.primary-button,.secondary-button,.tab-button{display:inline-flex;height:2.75rem;align-items:center;justify-content:center;border-radius:.375rem;padding:0 1rem;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.primary-button{background:#f2701d;color:#050505}.primary-button:hover{background:#f58f42}.secondary-button{border:1px solid rgba(255,255,255,.1);color:rgb(209 213 219)}
.studio-tabs{display:flex;gap:.5rem;overflow-x:auto;border-radius:.65rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.28);padding:.5rem;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
.tab-button{min-width:9rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);color:rgb(156 163 175);transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease}
.tab-button:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:white}.tab-button.active{border-color:rgba(245,143,66,.7);background:linear-gradient(180deg,rgba(245,143,66,.24),rgba(245,143,66,.1));color:#ffd7b0;box-shadow:0 0 0 1px rgba(245,143,66,.08),0 10px 24px rgba(0,0,0,.22)}
.action-button,.danger-button{height:2.25rem;border-radius:.25rem;border:1px solid rgba(245,143,66,.35);padding:0 .75rem;color:rgb(252 211 77);font-size:.68rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.danger-button{color:rgb(254 202 202);border-color:rgba(248,113,113,.35)}
.status-badge{display:inline-flex;border-radius:.25rem;border:1px solid rgba(255,255,255,.14);padding:.25rem .45rem;font-size:.62rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.status-badge.available,.status-badge.accepted{border-color:rgba(52,211,153,.35);background:rgba(16,185,129,.1);color:#bbf7d0}.status-badge.sold_out,.status-badge.pending{color:#d1d5db;background:rgba(255,255,255,.06)}.status-badge.withdrawn,.status-badge.rejected{border-color:rgba(248,113,113,.4);background:rgba(239,68,68,.1);color:#fecaca}.status-badge.revision{border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.1);color:#fde68a}
.studio-modal{max-height:calc(100vh - 4rem);width:100%;max-width:42rem;overflow:auto;border-radius:.75rem;border:1px solid rgba(255,255,255,.12);background:#1d2229;padding:1.25rem;box-shadow:0 28px 80px rgba(0,0,0,.55)}
.invoice-card{border-radius:.6rem;border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(0,0,0,.18));padding:1rem;box-shadow:0 18px 45px rgba(0,0,0,.25)}.invoice-modal{max-height:calc(100vh - 4rem);width:100%;max-width:48rem;overflow:auto;border-radius:.75rem;border:1px solid rgba(255,255,255,.12);background:#1d2229;padding:1.25rem;box-shadow:0 28px 80px rgba(0,0,0,.55)}.invoice-box{border-radius:.5rem;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.22);padding:1rem}.invoice-line{display:flex;align-items:center;justify-content:space-between;border-radius:.35rem;background:rgba(0,0,0,.18);padding:.65rem .75rem;color:rgb(156 163 175)}.invoice-line strong{color:white}.invoice-line.total{background:rgba(245,143,66,.12);color:#ffd7b0}.invoice-line.total strong{color:#ffc18e}
.empty{border-radius:.5rem;border:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.25);padding:1rem;text-align:center;font-size:.85rem;font-weight:800;color:rgb(107 114 128)}
</style>
