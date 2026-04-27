<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-28 pt-6 text-white sm:px-6">
      <main class="mx-auto max-w-2xl">
        <header class="sticky top-0 z-10 -mx-4 mb-4 border-b border-white/10 bg-shark-950/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/10 hover:text-white"
              @click="goBack"
            >
              <ArrowLeft class="h-5 w-5" />
            </button>
            <div>
              <h1 class="text-xl font-black">Post</h1>
              <p class="text-xs font-bold text-gray-500">Retro Reels social detail</p>
            </div>
          </div>
        </header>

        <p v-if="error" class="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {{ error }}
        </p>

        <article v-else-if="post" class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
          <section class="p-4 sm:p-5">
            <div class="flex gap-3">
              <RouterLink :to="`/profile/${post.user?.id}`" class="h-12 w-12 shrink-0 overflow-hidden rounded bg-serenade-500/15 text-sm font-black text-serenade-200">
                <img v-if="post.user?.avatarUrl" class="h-full w-full object-cover" :src="post.user.avatarUrl" alt="Profile" />
                <span v-else class="flex h-full w-full items-center justify-center">{{ initials(post.user?.name || post.user?.email || 'User') }}</span>
              </RouterLink>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                  <RouterLink :to="`/profile/${post.user?.id}`" class="font-black text-gray-200 hover:text-serenade-300">
                    {{ post.user?.name || post.user?.email || 'Retro Listener' }}
                  </RouterLink>
                  <span>/</span>
                  <span>{{ post.channel }}</span>
                  <span>/</span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>

                <div v-if="canManagePost" class="mt-2 flex gap-2">
                  <button type="button" class="owner-button" @click="startEditPost">Edit</button>
                  <button type="button" class="owner-button danger" :disabled="isBusy" @click="isDeleteModalOpen = true">Delete</button>
                </div>
              </div>
            </div>

            <div v-if="isEditing" class="mt-4 space-y-3 rounded border border-white/10 bg-black/25 p-3">
              <textarea v-model="editDraft.body" class="min-h-28 w-full resize-y rounded border border-white/10 bg-black/35 p-3 text-sm text-white outline-none focus:border-serenade-500/60"></textarea>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="rounded bg-serenade-500 px-3 py-2 text-xs font-black uppercase tracking-widest text-black hover:bg-serenade-400" :disabled="isBusy" @click="saveEditedPost">Save</button>
                <button type="button" class="rounded border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white" :disabled="isBusy" @click="isEditing = false">Cancel</button>
              </div>
            </div>

            <p v-else class="mt-4 whitespace-pre-line text-base leading-7 text-gray-100">{{ post.body }}</p>

            <div v-if="post.product || post.imageUrl" class="mx-auto mt-5 w-full max-w-lg space-y-3">
              <RouterLink v-if="post.product" :to="`/product/${post.product.id}`" class="group flex gap-3 rounded border border-white/10 bg-black/30 p-3 transition hover:border-serenade-500/40">
                <img class="h-14 w-14 rounded object-cover" :src="post.product.image" :alt="`${post.product.title} cover`" />
                <div class="min-w-0 self-center">
                  <p class="truncate text-base font-black text-white group-hover:text-serenade-300">{{ post.product.title }}</p>
                  <p class="truncate text-sm text-gray-500">{{ post.product.artist }} / {{ post.product.format || 'Album' }}</p>
                </div>
              </RouterLink>

              <a v-if="post.imageUrl" :href="post.imageUrl" target="_blank" rel="noreferrer" class="block overflow-hidden rounded border border-white/10 bg-black/30">
                <img class="max-h-[34rem] w-full object-contain" :src="post.imageUrl" alt="Post attachment" />
              </a>
            </div>
          </section>

          <section class="border-y border-white/10 px-4 py-2 sm:px-5">
            <div class="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>{{ post._count?.likes || 0 }} likes</span>
              <span>{{ post._count?.comments || post.comments?.length || 0 }} comments</span>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-2">
              <button type="button" class="detail-action" :disabled="!isLoggedIn || isBusy" @click="toggleLike">
                <Heart class="h-4 w-4" :class="{ 'fill-serenade-300 text-serenade-300': post.isLiked }" />
                Like
              </button>
              <button type="button" class="detail-action" @click="focusComment">
                <MessageCircle class="h-4 w-4" />
                Comment
              </button>
            </div>
          </section>

          <section class="space-y-4 p-4 sm:p-5">
            <div v-if="!post.comments?.length" class="rounded border border-white/10 bg-black/20 p-4 text-center text-sm font-bold text-gray-500">
              No comments yet.
            </div>

            <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
              <RouterLink :to="`/profile/${comment.user?.id}`" class="h-9 w-9 shrink-0 overflow-hidden rounded bg-white/10 text-xs font-black text-gray-300 transition hover:ring-2 hover:ring-serenade-500/40">
                <img v-if="comment.user?.avatarUrl" class="h-full w-full object-cover" :src="comment.user.avatarUrl" alt="Profile" />
                <span v-else class="flex h-full w-full items-center justify-center">{{ initials(comment.user?.name || comment.user?.email || 'User') }}</span>
              </RouterLink>
              <div class="min-w-0 rounded-lg bg-black/30 px-3 py-2">
                <RouterLink :to="`/profile/${comment.user?.id}`" class="text-xs font-black text-gray-300 hover:text-serenade-300">
                  {{ comment.user?.name || comment.user?.email || 'Retro Listener' }}
                </RouterLink>
                <p class="mt-1 text-sm leading-5 text-gray-200">{{ comment.body }}</p>
              </div>
            </div>

            <form class="flex gap-2 border-t border-white/10 pt-4" @submit.prevent="addComment">
              <input
                ref="commentInput"
                v-model="commentDraft"
                class="h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-serenade-500/60"
                :placeholder="isLoggedIn ? 'Write a comment...' : 'Login to comment'"
                :disabled="!isLoggedIn || isBusy"
              />
              <button type="submit" class="inline-flex h-11 items-center justify-center rounded-full bg-serenade-500 px-5 text-xs font-black uppercase tracking-widest text-black hover:bg-serenade-400 disabled:opacity-50" :disabled="!isLoggedIn || isBusy || !commentDraft.trim()">
                Send
              </button>
            </form>
          </section>
        </article>

        <div v-else class="rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center font-mono text-xs uppercase tracking-widest text-gray-500">
          Loading post...
        </div>
      </main>

      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" @click.self="cancelDeletePost">
        <section class="w-full max-w-sm rounded-lg border border-white/10 bg-shark-900 p-5 shadow-2xl shadow-black/50">
          <h2 class="text-lg font-black text-white">Delete post?</h2>
          <p class="mt-2 text-sm leading-6 text-gray-400">This post will be removed from the social wall and profile pages.</p>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white" :disabled="isBusy" @click="cancelDeletePost">Cancel</button>
            <button type="button" class="rounded bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-red-400 disabled:opacity-50" :disabled="isBusy" @click="confirmDeletePost">Delete</button>
          </div>
        </section>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-vue-next';
import customFetch from '@/api';
import HomeLayout from '@/layouts/HomeLayout.vue';
import { writePostUpdate } from '@/utils/socialPostUpdates';

const route = useRoute();
const router = useRouter();
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

const post = ref(null);
const currentUserId = ref(storedUser.id || '');
const isBusy = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const error = ref('');
const commentDraft = ref('');
const commentInput = ref(null);
const editDraft = reactive({ body: '' });

const isLoggedIn = computed(() => Boolean(localStorage.getItem('token')));
const canManagePost = computed(() => Boolean(currentUserId.value && post.value?.user?.id === currentUserId.value));

const initials = (value) => value
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('') || 'U';

const formatDate = (value) => {
  if (!value) return 'now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'now';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const loadCurrentUser = async () => {
  if (!isLoggedIn.value) return;

  try {
    const response = await customFetch.get('auth/me');
    currentUserId.value = response.data.user?.id || currentUserId.value;
    localStorage.setItem('user', JSON.stringify(response.data.user));
  } catch {
    // Post detail can still render without owner controls if session refresh fails.
  }
};

const loadPost = async () => {
  error.value = '';

  try {
    const response = await customFetch.get(`social/posts/${route.params.id}`);
    post.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load post.';
  }
};

const cachePostUpdate = () => {
  if (!post.value) return;
  writePostUpdate(post.value);
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push('/timeline');
};

const focusComment = async () => {
  await nextTick();
  commentInput.value?.focus();
};

const startEditPost = () => {
  editDraft.body = post.value?.body || '';
  isEditing.value = true;
};

const saveEditedPost = async () => {
  if (!post.value || isBusy.value) return;
  isBusy.value = true;

  try {
    const response = await customFetch.patch(`social/posts/${post.value.id}`, {
      body: editDraft.body,
      channel: post.value.channel,
      productId: post.value.product?.id || undefined,
      imageUrl: post.value.imageUrl || undefined,
    });
    post.value = response.data.data;
    cachePostUpdate();
    isEditing.value = false;
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not update post.';
  } finally {
    isBusy.value = false;
  }
};

const toggleLike = async () => {
  if (!post.value || !isLoggedIn.value || isBusy.value) return;
  isBusy.value = true;

  try {
    const response = await customFetch.post(`social/posts/${post.value.id}/like`);
    post.value = response.data.data;
    cachePostUpdate();
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not update like.';
  } finally {
    isBusy.value = false;
  }
};

const addComment = async () => {
  const body = commentDraft.value.trim();
  if (!post.value || !isLoggedIn.value || isBusy.value || !body) return;
  isBusy.value = true;

  try {
    const response = await customFetch.post(`social/posts/${post.value.id}/comments`, { body });
    post.value = response.data.data;
    cachePostUpdate();
    commentDraft.value = '';
    await focusComment();
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not add comment.';
  } finally {
    isBusy.value = false;
  }
};

const cancelDeletePost = () => {
  if (isBusy.value) return;
  isDeleteModalOpen.value = false;
};

const confirmDeletePost = async () => {
  if (!post.value || isBusy.value) return;
  isBusy.value = true;

  try {
    await customFetch.delete(`social/posts/${post.value.id}`);
    router.push('/timeline');
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not delete post.';
  } finally {
    isBusy.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadCurrentUser(), loadPost()]);
});
</script>

<style scoped>
.detail-action {
  display: inline-flex;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 0.375rem;
  color: rgb(156 163 175);
  font-weight: 900;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.detail-action:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.detail-action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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
