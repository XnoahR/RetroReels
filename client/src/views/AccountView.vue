<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-8 text-white sm:px-6">
      <div class="mx-auto max-w-3xl">
        <button
          type="button"
          class="mb-4 inline-flex h-10 items-center gap-2 rounded border border-white/10 bg-white/[0.035] px-4 text-xs font-black uppercase tracking-widest text-gray-300 transition hover:border-serenade-500/40 hover:text-white"
          @click="goBack"
        >
          <ArrowLeft class="h-4 w-4" />
          Back
        </button>

        <div class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
          <div class="relative h-44 bg-black">
            <img src="/wallpaper-2.png" alt="" class="h-full w-full object-cover opacity-45" />
            <div class="absolute inset-0 bg-gradient-to-t from-shark-950 via-shark-950/35 to-transparent"></div>
          </div>

          <div class="relative px-5 pb-5 sm:px-6">
            <div class="-mt-12 flex flex-col gap-4">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div class="flex items-end gap-4">
                <div class="h-24 w-24 shrink-0 overflow-hidden rounded-lg border-4 border-shark-950 bg-serenade-500/20">
                  <img v-if="profileUser.avatarUrl" class="h-full w-full object-cover" :src="profileUser.avatarUrl" alt="Profile" />
                  <div v-else class="flex h-full w-full items-center justify-center text-3xl font-black text-serenade-200">
                    {{ initials(profileUser.name || profileUser.email || 'User') }}
                  </div>
                </div>
                <div class="pb-1">
                  <h1 class="text-3xl font-black tracking-tight">{{ profileUser.name || 'Retro Listener' }}</h1>
                  <p class="mt-1 text-sm font-bold text-gray-500">{{ profileUser.email }}</p>
                </div>
                </div>

                <div class="hidden pb-1 text-right sm:block">
                  <p class="text-xs font-black uppercase tracking-widest text-serenade-300">{{ currentUser.role || 'USER' }}</p>
                  <p v-if="isOwnProfile" class="mt-1 text-sm font-bold text-gray-500">${{ profileUser.credits ?? 0 }} Credits</p>
                </div>
              </div>
            </div>

            <p class="mt-5 max-w-2xl text-sm leading-6 text-gray-300">
              {{ profileUser.bio || 'Sharing shelf pulls, uploaded tapes, and favorite listening notes from the Retro Reels archive.' }}
            </p>

            <div class="mt-5 grid grid-cols-3 overflow-hidden rounded border border-white/10 bg-black/25">
              <div class="border-r border-white/10 p-3 text-center">
                <p class="font-mono text-xl font-black">{{ profilePosts.length }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-gray-500">Posts</p>
              </div>
              <div class="border-r border-white/10 p-3 text-center">
                <p class="font-mono text-xl font-black">{{ collection.length }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-gray-500">Collection</p>
              </div>
              <div class="p-3 text-center">
                <p class="font-mono text-xl font-black">{{ profileProducts.length }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-gray-500">Selling</p>
              </div>
            </div>
          </div>

          <nav class="flex border-t border-white/10">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="relative flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 px-2 text-center text-[0.65rem] font-black uppercase tracking-widest transition hover:bg-white/[0.045] sm:text-xs"
              :class="activeTab === tab.id ? 'text-white' : 'text-gray-500'"
              @click="setActiveTab(tab.id)"
            >
              <component :is="tab.icon" class="hidden h-4 w-4 sm:block" />
              {{ tab.label }}
              <span v-if="activeTab === tab.id" class="absolute bottom-0 h-0.5 w-12 rounded-full bg-serenade-500"></span>
            </button>
          </nav>
        </div>

        <p v-if="alert.message" class="mt-5 rounded border px-4 py-3 text-sm font-bold" :class="alert.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
          {{ alert.message }}
        </p>

        <main class="mx-auto mt-5 max-w-2xl space-y-4">
          <section v-if="activeTab === 'posts'" class="space-y-4">
            <ProfilePost v-for="post in profilePosts" :key="post.id" :post="post" :editable="post.user?.id === currentUser.id" @deleted="removePost" @updated="updatePost" />
            <EmptyState v-if="!profilePosts.length" title="No posts yet" description="Listening notes will show up here after this user posts on the social wall." />
          </section>

          <section v-else-if="activeTab === 'collection'" class="grid gap-3 sm:grid-cols-2">
            <RouterLink v-for="item in collection" :key="item.id" :to="`/product/${item.product.id}`" class="music-card">
              <img class="h-20 w-20 rounded object-cover" :src="item.product.image" :alt="`${item.product.title} cover`" />
              <div class="min-w-0">
                <p class="truncate font-black text-white">{{ item.product.title }}</p>
                <p class="truncate text-sm text-gray-400">{{ item.product.artist }}</p>
                <p class="mt-1 text-xs font-bold uppercase tracking-widest text-serenade-300">{{ item.product.format || 'Music' }}</p>
              </div>
            </RouterLink>
            <EmptyState v-if="!collection.length" class="sm:col-span-2" title="No public collection" :description="isOwnProfile ? 'Purchased music will appear in this collection tab.' : 'This profile does not expose a public music collection yet.'" />
          </section>

          <section v-else-if="activeTab === 'selling'" class="space-y-3">
            <RouterLink v-for="product in profileProducts" :key="product.id" :to="`/product/${product.id}`" class="music-card">
              <img class="h-20 w-20 rounded object-cover" :src="product.image" :alt="`${product.title} cover`" />
              <div class="min-w-0 flex-1">
                <p class="truncate font-black text-white">{{ product.title }}</p>
                <p class="truncate text-sm text-gray-400">{{ product.artist }} / {{ product.format || 'Music' }} / ${{ product.price }}</p>
              </div>
            </RouterLink>
            <EmptyState v-if="!profileProducts.length" title="No music for sale" description="Products sold by this user will appear here." />
          </section>

          <section v-else class="space-y-4">
            <ProfilePost v-for="post in likedPosts" :key="post.id" :post="post" :editable="post.user?.id === currentUser.id" @deleted="removePost" @updated="updatePost" />
            <EmptyState v-if="!likedPosts.length" title="No liked posts" description="Posts you like on the social wall will appear here." />
          </section>
        </main>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import { ArrowLeft, Disc3, Heart, Library, MessageCircle, PenLine, Store } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = reactive({
  id: storedUser.id || '',
  name: storedUser.name || '',
  email: storedUser.email || '',
  bio: storedUser.bio || '',
  avatarUrl: storedUser.avatarUrl || '',
  role: storedUser.role || 'USER',
  credits: storedUser.credits ?? 0,
});
const profileUser = reactive({
  id: storedUser.id || '',
  name: storedUser.name || '',
  email: storedUser.email || '',
  bio: storedUser.bio || '',
  avatarUrl: storedUser.avatarUrl || '',
  role: storedUser.role || 'USER',
  credits: storedUser.credits ?? 0,
});

const activeTab = ref('posts');
const orders = ref([]);
const socialPosts = ref([]);
const profileLikedPosts = ref([]);
const publicProducts = ref([]);
const alert = reactive({ message: '', type: 'success' });

const tabs = [
  { id: 'posts', label: 'Posts', icon: PenLine },
  { id: 'collection', label: 'Collection', icon: Library },
  { id: 'selling', label: 'Selling', icon: Store },
  { id: 'liked', label: 'Liked', icon: Heart },
];

const collection = computed(() => orders.value.filter((order) => order.product));
const profilePosts = computed(() => socialPosts.value.filter((post) => post.user?.id === profileUser.id));
const profileProducts = computed(() => publicProducts.value);
const likedPosts = computed(() => profileLikedPosts.value);
const isOwnProfile = computed(() => Boolean(currentUser.id && profileUser.id === currentUser.id));

const initials = (value) => value
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('') || 'U';

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'now';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

const EmptyState = defineComponent({
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => h('div', { ...attrs, class: ['rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center', attrs.class] }, [
      h(Disc3, { class: 'mx-auto mb-3 h-8 w-8 text-serenade-400/70' }),
      h('h2', { class: 'font-black uppercase tracking-widest text-white' }, props.title),
      h('p', { class: 'mt-2 text-sm leading-6 text-gray-400' }, props.description),
    ]);
  },
});

const ProfilePost = defineComponent({
  props: {
    post: { type: Object, required: true },
    editable: { type: Boolean, default: false },
  },
  emits: ['updated', 'deleted'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const isBusy = ref(false);
    const editBody = ref(props.post.body || '');

    const savePost = async () => {
      if (isBusy.value) return;
      isBusy.value = true;

      try {
        const response = await customFetch.patch(`social/posts/${props.post.id}`, {
          body: editBody.value,
          channel: props.post.channel,
          productId: props.post.product?.id || undefined,
          imageUrl: props.post.imageUrl || undefined,
        });
        isEditing.value = false;
        emit('updated', response.data.data);
      } finally {
        isBusy.value = false;
      }
    };

    const deletePost = async () => {
      if (isBusy.value || !window.confirm('Delete this post?')) return;
      isBusy.value = true;

      try {
        await customFetch.delete(`social/posts/${props.post.id}`);
        emit('deleted', props.post.id);
      } finally {
        isBusy.value = false;
      }
    };

    return () => h('article', { class: 'rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5' }, [
      h('div', { class: 'flex gap-3' }, [
        h(RouterLink, { to: `/profile/${props.post.user?.id}`, class: 'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-serenade-500/15 text-sm font-black text-serenade-200' }, {
          default: () => props.post.user?.avatarUrl
            ? h('img', { class: 'h-full w-full object-cover', src: props.post.user.avatarUrl, alt: 'Profile' })
            : initials(props.post.user?.name || props.post.user?.email || 'User'),
        }),
        h('div', { class: 'min-w-0 flex-1' }, [
          h('div', { class: 'flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500' }, [
            h(RouterLink, { to: `/profile/${props.post.user?.id}`, class: 'font-black text-gray-300 hover:text-serenade-300' }, { default: () => props.post.user?.name || props.post.user?.email || 'Retro Listener' }),
            h('span', '/'),
            h('span', props.post.channel),
            h('span', '/'),
            h('span', formatDate(props.post.createdAt)),
          ]),
          props.editable && h('div', { class: 'mt-2 flex gap-2' }, [
            h('button', { class: 'owner-button', onClick: () => { editBody.value = props.post.body || ''; isEditing.value = true; } }, 'Edit'),
            h('button', { class: 'owner-button danger', disabled: isBusy.value, onClick: deletePost }, 'Delete'),
          ]),
          isEditing.value
            ? h('div', { class: 'mt-3 space-y-3 rounded border border-white/10 bg-black/25 p-3' }, [
                h('textarea', {
                  class: 'min-h-20 w-full resize-y rounded border border-white/10 bg-black/35 p-3 text-sm text-white outline-none focus:border-serenade-500/60',
                  value: editBody.value,
                  onInput: (event) => { editBody.value = event.target.value; },
                }),
                h('div', { class: 'flex gap-2' }, [
                  h('button', { class: 'rounded bg-serenade-500 px-3 py-2 text-xs font-black uppercase tracking-widest text-black hover:bg-serenade-400', disabled: isBusy.value, onClick: savePost }, 'Save'),
                  h('button', { class: 'rounded border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white', disabled: isBusy.value, onClick: () => { isEditing.value = false; } }, 'Cancel'),
                ]),
              ])
            : h('p', { class: 'mt-2 whitespace-pre-line text-sm leading-6 text-gray-200' }, props.post.body),
          (props.post.product || props.post.imageUrl) && h('div', { class: 'mx-auto mt-4 w-full max-w-sm space-y-3' }, [
            props.post.product && h(RouterLink, { to: `/product/${props.post.product.id}`, class: 'group flex gap-3 rounded border border-white/10 bg-black/30 p-2 transition hover:border-serenade-500/40' }, {
              default: () => [
                h('img', { class: 'h-12 w-12 rounded object-cover', src: props.post.product.image, alt: `${props.post.product.title} cover` }),
                h('div', { class: 'min-w-0 self-center' }, [
                  h('p', { class: 'truncate text-sm font-black text-white group-hover:text-serenade-300' }, props.post.product.title),
                  h('p', { class: 'truncate text-xs text-gray-500' }, `${props.post.product.artist} / ${props.post.product.format || 'Album'}`),
                ]),
              ],
            }),
            props.post.imageUrl && h('a', { href: props.post.imageUrl, target: '_blank', rel: 'noreferrer', class: 'block overflow-hidden rounded border border-white/10 bg-black/30' }, [
              h('img', { class: 'aspect-[4/3] w-full object-cover', src: props.post.imageUrl, alt: 'Post attachment' }),
            ]),
          ]),
          h('div', { class: 'mt-4 flex gap-4 text-sm font-bold text-gray-500' }, [
            h('span', { class: 'inline-flex items-center gap-1' }, [h(Heart, { class: ['h-4 w-4', props.post.isLiked ? 'fill-serenade-300 text-serenade-300' : ''] }), props.post._count?.likes || 0]),
            h('span', { class: 'inline-flex items-center gap-1' }, [h(MessageCircle, { class: 'h-4 w-4' }), props.post._count?.comments || 0]),
          ]),
        ]),
      ]),
    ]);
  },
});

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  router.replace({ query: { ...route.query, tab: tabId } });
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push('/timeline');
};

const setAlert = (message, type = 'success') => {
  alert.message = message;
  alert.type = type;
  window.setTimeout(() => {
    alert.message = '';
  }, 2600);
};

const loadProfileData = async () => {
  try {
    let meRes = null;
    if (localStorage.getItem('token')) {
      meRes = await customFetch.get('auth/me');
      Object.assign(currentUser, meRes.data.user);
      localStorage.setItem('user', JSON.stringify(meRes.data.user));
    }

    if (!route.params.id) {
      Object.assign(profileUser, meRes.data.user);
    }

    const targetProfileId = route.params.id || meRes?.data.user.id;
    if (!targetProfileId) {
      router.push('/');
      return;
    }
    const [profileRes, ordersRes, postsRes] = await Promise.all([
      customFetch.get(`social/profiles/${targetProfileId}`),
      route.params.id ? Promise.resolve({ data: { data: [] } }) : customFetch.get('orders'),
      customFetch.get('social/posts'),
    ]);

    Object.assign(profileUser, profileRes.data.data.user);
    publicProducts.value = profileRes.data.data.products || [];
    orders.value = ordersRes.data.data || [];
    socialPosts.value = postsRes.data.data || [];
    profileLikedPosts.value = profileRes.data.data.likedPosts || [];
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to load profile data', 'error');
  }
};

const updatePost = (nextPost) => {
  socialPosts.value = socialPosts.value.map((post) => (post.id === nextPost.id ? nextPost : post));
  setAlert('Post updated.');
};

const removePost = (postId) => {
  socialPosts.value = socialPosts.value.filter((post) => post.id !== postId);
  setAlert('Post deleted.');
};

watch(
  () => route.query.tab,
  (tab) => {
    if (typeof tab === 'string' && tabs.some((item) => item.id === tab)) {
      activeTab.value = tab;
    }
  },
  { immediate: true },
);

watch(
  () => route.params.id,
  () => {
    loadProfileData();
  },
);

onMounted(loadProfileData);
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.34);
  padding: 0.75rem 1rem;
  color: white;
  outline: none;
}

.field:focus {
  border-color: rgba(245, 143, 66, 0.7);
  box-shadow: 0 0 0 3px rgba(245, 143, 66, 0.12);
}

.label {
  display: block;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgb(107, 114, 128);
}

.music-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.035);
  padding: 0.75rem;
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.music-card:hover {
  border-color: rgba(245, 143, 66, 0.4);
  background: rgba(255, 255, 255, 0.055);
}

.owner-button {
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(156 163 175);
  transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
}

.owner-button:hover:not(:disabled) {
  border-color: rgba(245, 143, 66, 0.45);
  color: white;
}

.owner-button.danger:hover:not(:disabled) {
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(239, 68, 68, 0.1);
  color: rgb(254, 202, 202);
}

</style>
