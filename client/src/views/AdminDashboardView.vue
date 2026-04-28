<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-16 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl pt-8">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="eyebrow">Admin Control</p>
            <h1 class="mt-2 text-3xl font-black uppercase tracking-widest md:text-4xl">Retro Reels Dashboard</h1>
            <p class="mt-2 text-sm font-bold uppercase tracking-widest text-gray-400">Carousel, exclusive music, and upload review</p>
          </div>
          <button class="primary-button w-fit" @click="loadDashboard">
            <RefreshCw class="h-4 w-4" />
            Refresh
          </button>
        </div>

        <p v-if="alert.message" class="mb-6 rounded border px-4 py-3 text-sm font-bold" :class="alert.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
          {{ alert.message }}
        </p>

        <div class="mb-6 grid gap-4 md:grid-cols-3">
          <div class="metric"><Images class="h-5 w-5 text-sky-300" /><span>Slides</span><strong>{{ slides.length }}</strong></div>
          <div class="metric"><Star class="h-5 w-5 text-serenade-300" /><span>Exclusive</span><strong>{{ exclusiveFeatures.length }}</strong></div>
          <div class="metric"><UploadCloud class="h-5 w-5 text-violet-300" /><span>Pending</span><strong>{{ pendingSubmissions }}</strong></div>
        </div>

        <nav class="mb-6 flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-black/25 p-2">
          <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
        </nav>

        <section v-if="activeTab === 'carousel'" class="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <div class="panel">
            <div class="mb-5"><p class="eyebrow">Carousel</p><h2 class="section-title">Slides</h2></div>
            <div class="grid gap-4 md:grid-cols-2">
              <article v-for="slide in slides" :key="slide.id" class="admin-card">
                <img :src="slide.image" :alt="slide.title" class="h-40 w-full rounded object-cover" />
                <div class="mt-4 flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate font-black">{{ slide.title }}</p>
                    <p class="mt-1 text-xs font-bold text-serenade-300">Position {{ slide.position }}</p>
                  </div>
                  <StatusBadge :active="slide.isPublished" active-label="Live" inactive-label="Hidden" />
                </div>
                <div class="mt-4 flex gap-2">
                  <button class="action-button" @click="editSlide(slide)">Edit</button>
                  <button class="action-button" @click="toggleSlide(slide)">{{ slide.isPublished ? 'Hide' : 'Publish' }}</button>
                  <button class="danger-button ml-auto" @click="deleteSlide(slide.id)"><Trash2 class="h-4 w-4" /></button>
                </div>
              </article>
            </div>
          </div>
          <section class="panel h-fit">
            <p class="eyebrow">Carousel</p>
            <h2 class="section-title mb-5">New Slide</h2>
            <form class="space-y-4" @submit.prevent="createSlide">
              <label class="form-row"><span class="label">Title</span><input v-model="createSlideForm.title" class="field" required /></label>
              <label class="form-row">
                <span class="label">Image Upload</span>
                <input class="field file-field" type="file" accept="image/*" @change="(event) => handleSlideImageUpload(event, createSlideForm)" />
                <input v-model="createSlideForm.image" class="field" placeholder="/wallpaper-1.png or uploaded image data" required />
              </label>
              <label class="form-row"><span class="label">Position</span><input v-model.number="createSlideForm.position" class="field" type="number" /></label>
              <label class="flex items-center gap-3 text-sm font-bold text-gray-300"><input v-model="createSlideForm.isPublished" type="checkbox" /> Published</label>
              <button class="primary-button w-full"><Plus class="h-4 w-4" /> Add Slide</button>
              <button type="button" class="secondary-button w-full" @click="resetCreateSlideForm">Reset</button>
            </form>
          </section>
        </section>

        <div v-if="editingSlideId" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-8" @click.self="closeSlideEditor">
          <section class="modal-panel">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <p class="eyebrow">Carousel</p>
                <h2 class="section-title mt-1">Edit Slide</h2>
              </div>
              <button class="secondary-button" type="button" @click="closeSlideEditor">Close</button>
            </div>
            <form class="space-y-4" @submit.prevent="updateSlide">
              <label class="form-row"><span class="label">Title</span><input v-model="editSlideForm.title" class="field" required /></label>
              <label class="form-row">
                <span class="label">Image Upload</span>
                <input class="field file-field" type="file" accept="image/*" @change="(event) => handleSlideImageUpload(event, editSlideForm)" />
                <input v-model="editSlideForm.image" class="field" required />
              </label>
              <label class="form-row"><span class="label">Position</span><input v-model.number="editSlideForm.position" class="field" type="number" /></label>
              <label class="flex items-center gap-3 text-sm font-bold text-gray-300"><input v-model="editSlideForm.isPublished" type="checkbox" /> Published</label>
              <button class="primary-button w-full">Save Slide</button>
            </form>
          </section>
        </div>

        <section v-else-if="activeTab === 'exclusive'" class="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <div class="panel">
            <div class="mb-5"><p class="eyebrow">Exclusive Music</p><h2 class="section-title">Premiere Slots</h2></div>
            <div class="grid gap-4 md:grid-cols-2">
              <article v-for="feature in exclusiveFeatures" :key="feature.id" class="admin-card">
                <img :src="feature.product?.image" :alt="feature.product?.title" class="h-44 w-full rounded object-cover" />
                <div class="mt-4">
                  <div class="flex items-start justify-between gap-3">
                    <div><p class="font-black">{{ feature.product?.title }}</p><p class="text-sm text-gray-400">{{ feature.product?.artist }}</p></div>
                    <StatusBadge :active="feature.isActive" active-label="Active" inactive-label="Idle" />
                  </div>
                  <p class="mt-3 text-sm leading-6 text-gray-400">{{ feature.description || 'No description.' }}</p>
                </div>
                <div class="mt-4 flex gap-2">
                  <button class="action-button" @click="editExclusive(feature)">Edit</button>
                  <button class="action-button" @click="activateExclusive(feature)" :disabled="feature.isActive">Activate</button>
                  <button class="danger-button ml-auto" @click="deleteExclusive(feature.id)"><Trash2 class="h-4 w-4" /></button>
                </div>
              </article>
            </div>
          </div>
          <section class="panel h-fit">
            <p class="eyebrow">Set Feature</p>
            <h2 class="section-title mb-5">{{ editingExclusiveId ? 'Edit Exclusive' : 'New Exclusive' }}</h2>
            <form class="space-y-4" @submit.prevent="saveExclusive">
              <label><span class="label">Product</span><select v-model="exclusiveForm.productId" class="field" required><option value="" disabled>Select product</option><option v-for="product in products" :key="product.id" :value="product.id">{{ product.title }} - {{ product.artist }}</option></select></label>
              <label><span class="label">Label</span><input v-model="exclusiveForm.label" class="field" /></label>
              <label><span class="label">Description</span><textarea v-model="exclusiveForm.description" class="field min-h-28 resize-y"></textarea></label>
              <label class="flex items-center gap-3 text-sm font-bold text-gray-300"><input v-model="exclusiveForm.isActive" type="checkbox" /> Active on Home</label>
              <button class="primary-button w-full"><Star class="h-4 w-4" /> Save Exclusive</button>
              <button type="button" class="secondary-button w-full" @click="resetExclusiveForm">Reset</button>
            </form>
          </section>
        </section>

        <section v-else-if="activeTab === 'submissions'" class="panel">
          <div class="mb-5"><p class="eyebrow">Upload Monitoring</p><h2 class="section-title">Pending Submissions</h2></div>
          <div class="grid gap-4 lg:grid-cols-2">
            <article v-for="submission in submissions" :key="submission.id" class="admin-card">
              <div class="flex gap-4">
                <img :src="submission.coverUrl || submission.product?.image || '/RR.png'" class="h-24 w-24 rounded object-cover" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0"><p class="truncate font-black">{{ submission.title }}</p><p class="truncate text-sm text-gray-400">{{ submission.artist }} / {{ submission.format || 'Music' }}</p></div>
                    <SubmissionBadge :status="submission.status" />
                  </div>
                  <p class="mt-2 text-xs text-gray-500">By {{ submission.user?.name || submission.user?.email }}</p>
                </div>
              </div>
              <p class="mt-4 text-sm leading-6 text-gray-300">{{ submission.note || 'No user note.' }}</p>
              <textarea v-model="submission.adminDraft" class="field mt-4 min-h-20 resize-y" placeholder="Admin note for revision/reject..."></textarea>
              <div class="mt-4 flex flex-wrap gap-2">
                <button class="action-button" @click="reviewSubmission(submission, 'ACCEPTED')">Accept</button>
                <button class="action-button" @click="reviewSubmission(submission, 'REVISION')">Revision</button>
                <button class="danger-button" @click="reviewSubmission(submission, 'REJECTED')">Reject</button>
              </div>
            </article>
          </div>
          <div v-if="submissionsHasMore" class="mt-6 flex justify-center">
            <button class="secondary-button" type="button" @click="loadMoreSubmissions">Load More</button>
          </div>
        </section>

      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import { Images, Plus, RefreshCw, Star, Trash2, UploadCloud } from 'lucide-vue-next';

const StatusBadge = defineComponent({
  props: { active: Boolean, activeLabel: String, inactiveLabel: String },
  setup: (props) => () => h('span', { class: ['status-badge', props.active ? 'ok' : 'muted'] }, props.active ? props.activeLabel : props.inactiveLabel),
});

const SubmissionBadge = defineComponent({
  props: { status: String },
  setup: (props) => () => h('span', { class: ['status-badge', String(props.status).toLowerCase()] }, props.status),
});

const tabs = [
  { id: 'carousel', label: 'Carousel', icon: Images },
  { id: 'exclusive', label: 'Exclusive', icon: Star },
  { id: 'submissions', label: 'Upload Review', icon: UploadCloud },
];

const activeTab = ref('carousel');
const products = ref([]);
const slides = ref([]);
const exclusiveFeatures = ref([]);
const submissions = ref([]);
const submissionsNextSkip = ref(0);
const submissionsHasMore = ref(false);
const editingSlideId = ref('');
const editingExclusiveId = ref('');
const alert = reactive({ message: '', type: 'success' });
const createSlideForm = reactive({ title: '', image: '/wallpaper-1.png', position: 0, isPublished: true });
const editSlideForm = reactive({ title: '', image: '/wallpaper-1.png', position: 0, isPublished: true });
const exclusiveForm = reactive({ productId: '', label: 'Exclusive Premiere', description: '', isActive: true });

const pendingSubmissions = computed(() => submissions.value.filter((item) => item.status === 'PENDING').length);

const setAlert = (message, type = 'success') => { alert.message = message; alert.type = type; };
const withDrafts = (items) => items.map((item) => ({ ...item, adminDraft: item.adminNote || '' }));

const loadSubmissions = async () => {
  const { data } = await customFetch.get('admin/music-submissions', { params: { skip: 0, take: 12 } });
  submissions.value = withDrafts(data.data || []);
  submissionsNextSkip.value = data.pagination?.nextSkip || submissions.value.length;
  submissionsHasMore.value = Boolean(data.pagination?.hasMore);
};

const loadMoreSubmissions = async () => {
  const { data } = await customFetch.get('admin/music-submissions', { params: { skip: submissionsNextSkip.value, take: 12 } });
  submissions.value = [...submissions.value, ...withDrafts(data.data || [])];
  submissionsNextSkip.value = data.pagination?.nextSkip || submissions.value.length;
  submissionsHasMore.value = Boolean(data.pagination?.hasMore);
};

const loadDashboard = async () => {
  try {
    const [productsRes, slidesRes, exclusiveRes] = await Promise.all([
      customFetch.get('products?includeUnpublished=true'),
      customFetch.get('carousel?includeUnpublished=true'),
      customFetch.get('admin/exclusive'),
    ]);
    products.value = productsRes.data.data || [];
    slides.value = slidesRes.data.data || [];
    exclusiveFeatures.value = exclusiveRes.data.data || [];
    await loadSubmissions();
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to load dashboard', 'error');
  }
};

const emptySlideForm = () => ({ title: '', image: '/wallpaper-1.png', position: 0, isPublished: true });
const normalizeSlidePayload = (form) => ({ title: form.title, image: form.image, position: form.position || 0, isPublished: form.isPublished, productId: null, subtitle: null, ctaLabel: null, ctaHref: null });
const resetCreateSlideForm = () => { Object.assign(createSlideForm, emptySlideForm()); };
const editSlide = (slide) => {
  editingSlideId.value = slide.id;
  Object.assign(editSlideForm, { title: slide.title, image: slide.image, position: slide.position || 0, isPublished: slide.isPublished });
};
const closeSlideEditor = () => { editingSlideId.value = ''; Object.assign(editSlideForm, emptySlideForm()); };
const handleSlideImageUpload = (event, targetForm) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { targetForm.image = String(reader.result || targetForm.image); };
  reader.readAsDataURL(file);
};
const createSlide = async () => {
  await customFetch.post('carousel', normalizeSlidePayload(createSlideForm));
  resetCreateSlideForm();
  await loadDashboard();
  setAlert('Carousel slide added.');
};
const updateSlide = async () => {
  await customFetch.patch(`carousel/${editingSlideId.value}`, normalizeSlidePayload(editSlideForm));
  closeSlideEditor();
  await loadDashboard();
  setAlert('Carousel slide updated.');
};
const toggleSlide = async (slide) => { await customFetch.patch(`carousel/${slide.id}`, { isPublished: !slide.isPublished }); await loadDashboard(); setAlert('Carousel slide updated.'); };
const deleteSlide = async (id) => { await customFetch.delete(`carousel/${id}`); await loadDashboard(); setAlert('Carousel slide deleted.'); };
const resetExclusiveForm = () => { editingExclusiveId.value = ''; Object.assign(exclusiveForm, { productId: '', label: 'Exclusive Premiere', description: '', isActive: true }); };
const editExclusive = (feature) => { editingExclusiveId.value = feature.id; Object.assign(exclusiveForm, { productId: feature.productId, label: feature.label, description: feature.description || '', isActive: feature.isActive }); };
const saveExclusive = async () => { editingExclusiveId.value ? await customFetch.patch(`admin/exclusive/${editingExclusiveId.value}`, exclusiveForm) : await customFetch.post('admin/exclusive', exclusiveForm); resetExclusiveForm(); await loadDashboard(); setAlert('Exclusive music saved.'); };
const activateExclusive = async (feature) => { await customFetch.patch(`admin/exclusive/${feature.id}`, { isActive: true }); await loadDashboard(); setAlert('Exclusive activated.'); };
const deleteExclusive = async (id) => { await customFetch.delete(`admin/exclusive/${id}`); await loadDashboard(); setAlert('Exclusive deleted.'); };
const reviewSubmission = async (submission, status) => { await customFetch.patch(`admin/music-submissions/${submission.id}`, { status, adminNote: submission.adminDraft }); await loadDashboard(); setAlert(`Submission marked ${status.toLowerCase()}.`); };

onMounted(loadDashboard);
</script>

<style scoped>
.panel,.admin-card,.metric{border-radius:.5rem;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);padding:1.25rem;box-shadow:0 18px 40px rgba(0,0,0,.28)}
.metric{display:grid;gap:.5rem;background:rgba(0,0,0,.3)}
.metric span,.eyebrow,.label{font-size:.7rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:rgb(107 114 128)}
.metric strong{font-size:1.8rem;line-height:1}.eyebrow{color:rgb(245 143 66)}.section-title{font-size:1.25rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.form-row{display:grid;gap:.45rem}.field{width:100%;border-radius:.375rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.34);padding:.7rem .9rem;color:white;outline:none}.file-field{padding:.55rem .7rem}.field:focus{border-color:rgba(245,143,66,.7);box-shadow:0 0 0 3px rgba(245,143,66,.12)}
.primary-button,.secondary-button,.tab-button{display:inline-flex;height:2.75rem;align-items:center;justify-content:center;gap:.5rem;border-radius:.375rem;padding:0 1rem;font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.primary-button{background:#f2701d;color:#050505}.primary-button:hover{background:#f58f42}.secondary-button,.tab-button{border:1px solid rgba(255,255,255,.1);color:rgb(209 213 219)}.tab-button.active{border-color:rgba(245,143,66,.55);background:rgba(245,143,66,.15);color:#ffd7b0}
.action-button,.danger-button{height:2.25rem;border-radius:.25rem;border:1px solid rgba(245,143,66,.35);padding:0 .75rem;color:rgb(252 211 77);font-size:.68rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.action-button:hover{background:rgba(245,143,66,.1)}.danger-button{display:inline-flex;align-items:center;color:rgb(254 202 202);border-color:rgba(248,113,113,.35)}.danger-button:hover{background:rgba(239,68,68,.12)}
.modal-panel{max-height:calc(100vh - 4rem);width:100%;max-width:32rem;overflow:auto;border-radius:.75rem;border:1px solid rgba(255,255,255,.12);background:#1d2229;padding:1.25rem;box-shadow:0 28px 80px rgba(0,0,0,.55)}
.status-badge{display:inline-flex;border-radius:.25rem;border:1px solid rgba(255,255,255,.14);padding:.25rem .45rem;font-size:.62rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.status-badge.ok,.status-badge.accepted{border-color:rgba(52,211,153,.35);background:rgba(16,185,129,.1);color:#bbf7d0}.status-badge.muted,.status-badge.pending{color:#d1d5db;background:rgba(255,255,255,.06)}.status-badge.revision{border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.1);color:#fde68a}.status-badge.rejected{border-color:rgba(248,113,113,.4);background:rgba(239,68,68,.1);color:#fecaca}
</style>
