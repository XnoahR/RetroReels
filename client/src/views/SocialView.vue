<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 pb-28 text-white">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[14rem_minmax(0,42rem)_18rem] lg:justify-center">
        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-4">
            <section class="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-300">Signal Room</p>
              <h1 class="mt-2 text-2xl font-black uppercase tracking-widest">Listening Wall</h1>
              <p class="mt-3 text-sm leading-6 text-gray-400">Post thoughts, album drops, and shelf finds from the Retro Reels archive.</p>
            </section>

            <section class="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <h2 class="text-sm font-black uppercase tracking-widest text-gray-300">Mood Channels</h2>
              <div class="mt-4 grid gap-2">
                <button
                  v-for="channel in channels"
                  :key="channel"
                  type="button"
                  class="rounded border px-3 py-3 text-left text-sm font-bold transition"
                  :class="activeChannel === channel ? 'border-serenade-500/50 bg-serenade-500/15 text-serenade-200' : 'border-white/5 bg-black/25 text-gray-400 hover:bg-white/5'"
                  @click="setChannel(channel)"
                >
                  {{ channel }}
                </button>
              </div>
            </section>
          </div>
        </aside>

        <main class="mx-auto min-w-0 w-full max-w-2xl space-y-4">
          <header class="rounded-lg border border-white/10 bg-black/35 p-5 lg:hidden">
            <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-300">Signal Room</p>
            <h1 class="mt-2 text-3xl font-black uppercase tracking-widest">Listening Wall</h1>
          </header>

          <section class="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div v-if="!isLoggedIn" class="rounded border border-serenade-500/30 bg-serenade-500/10 p-4 text-sm font-bold text-serenade-100">
              Login to post, like, or comment. You can still read the wall.
            </div>

            <div class="mt-0 grid gap-4" :class="{ 'mt-4': !isLoggedIn }">
              <textarea
                v-model="draft.body"
                class="min-h-24 resize-none rounded border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-serenade-500/60"
                placeholder="Share a thought, a shelf find, or a listening note..."
                :disabled="!isLoggedIn || isPublishing"
              ></textarea>

              <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <select
                  v-model="draft.channel"
                  class="h-10 rounded border border-white/10 bg-black/50 px-3 text-sm font-bold text-gray-300 outline-none focus:border-serenade-500/60"
                  :disabled="!isLoggedIn || isPublishing"
                >
                  <option v-for="channel in postChannels" :key="channel" :value="channel">{{ channel }}</option>
                </select>
                <select
                  v-model="draft.productId"
                  class="h-10 min-w-0 rounded border border-white/10 bg-black/50 px-3 text-sm font-bold text-gray-300 outline-none focus:border-serenade-500/60"
                  :disabled="!isLoggedIn || isPublishing"
                >
                  <option value="">No album drop</option>
                  <option v-if="albums.length === 0" value="" disabled>No purchased albums yet</option>
                  <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.title }} - {{ album.artist }}</option>
                </select>
                <label class="inline-flex h-10 cursor-pointer items-center justify-center rounded border border-white/10 bg-black/50 px-4 text-sm font-black uppercase tracking-widest text-gray-300 transition hover:border-serenade-500/40 hover:text-white" :class="{ 'cursor-not-allowed opacity-50': !isLoggedIn || isPublishing || isUploadingImage }">
                  {{ imageButtonLabel }}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    class="sr-only"
                    :disabled="!isLoggedIn || isPublishing || isUploadingImage"
                    @change="uploadImage"
                  />
                </label>
              </div>

              <div v-if="selectedAlbum || draft.imageUrl.trim()" class="grid gap-3 sm:grid-cols-2">
                <div v-if="selectedAlbum" class="flex gap-3 rounded border border-white/10 bg-black/30 p-3">
                  <img class="h-16 w-16 rounded object-cover" :src="selectedAlbum.image" :alt="`${selectedAlbum.title} cover`" />
                  <div class="min-w-0">
                    <p class="truncate text-sm font-black">{{ selectedAlbum.title }}</p>
                    <p class="truncate text-xs text-gray-500">{{ selectedAlbum.artist }} / {{ selectedAlbum.format }}</p>
                  </div>
                </div>
                <div v-if="draft.imageUrl.trim()" class="flex gap-3 rounded border border-white/10 bg-black/30 p-3">
                  <img class="h-16 w-16 rounded object-cover" :src="draft.imageUrl" alt="Post preview" />
                  <div class="min-w-0">
                    <p class="truncate text-sm font-black">Image post</p>
                    <p class="truncate text-xs text-gray-500">{{ draft.imageUrl }}</p>
                  </div>
                  <button
                    type="button"
                    class="ml-auto self-start rounded border border-white/10 px-2 py-1 text-[0.65rem] font-black uppercase tracking-widest text-gray-500 hover:border-red-400/40 hover:text-red-300"
                    :disabled="isPublishing"
                    @click="clearUploadedImage"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-xs font-mono uppercase tracking-widest text-gray-500">{{ postHint }}</p>
                <button
                  type="button"
                  class="h-10 rounded bg-serenade-500 px-5 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!canPublish"
                  @click="publishPost"
                >
                  Drop Tape
                </button>
              </div>
            </div>
          </section>

          <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 p-2">
            <div class="flex gap-2 overflow-x-auto lg:hidden">
              <button
                v-for="channel in channels"
                :key="channel"
                type="button"
                class="shrink-0 rounded border px-3 py-2 text-xs font-black uppercase tracking-widest transition"
                :class="activeChannel === channel ? 'border-serenade-500/50 bg-serenade-500/15 text-serenade-200' : 'border-white/10 text-gray-500'"
                @click="setChannel(channel)"
              >
                {{ channel }}
              </button>
            </div>

            <div class="flex gap-2">
              <button
                v-for="sort in sortOptions"
                :key="sort.value"
                type="button"
                class="rounded border px-3 py-2 text-xs font-black uppercase tracking-widest transition"
                :class="activeSort === sort.value ? 'border-white/30 bg-white text-black' : 'border-white/10 text-gray-500 hover:text-white'"
                @click="setSort(sort.value)"
              >
                {{ sort.label }}
              </button>
            </div>
          </div>

          <p v-if="notice || error" class="rounded border px-4 py-3 text-sm font-bold" :class="error ? 'border-red-400/30 bg-red-500/10 text-red-200' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'">
            {{ error || notice }}
          </p>

          <section class="space-y-4">
            <div v-if="isLoading" class="rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center font-mono text-xs uppercase tracking-widest text-gray-500">Loading wall...</div>
            <div v-else-if="posts.length === 0" class="rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center font-mono text-xs uppercase tracking-widest text-gray-500">No posts yet.</div>

            <template v-else>
            <article
              v-for="post in posts"
              :key="post.id"
              class="cursor-pointer rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-lg shadow-black/10 transition hover:border-white/20 sm:p-5"
              @click="openPostDetail(post, $event)"
            >
              <div class="flex gap-3">
                <RouterLink :to="`/profile/${post.user?.id}`" class="h-10 w-10 shrink-0 overflow-hidden rounded bg-serenade-500/15 text-sm font-black text-serenade-200">
                  <img v-if="post.user?.avatarUrl" class="h-full w-full object-cover" :src="post.user.avatarUrl" alt="Profile" />
                  <span v-else class="flex h-full w-full items-center justify-center">{{ initials(post.user?.name || post.user?.email || 'User') }}</span>
                </RouterLink>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                    <RouterLink :to="`/profile/${post.user?.id}`" class="font-black text-gray-300 hover:text-serenade-300">{{ post.user?.name || post.user?.email || 'Retro Listener' }}</RouterLink>
                    <span>/</span>
                    <span>{{ post.channel }}</span>
                    <span>/</span>
                    <span>{{ formatDate(post.createdAt) }}</span>
                  </div>

                  <div v-if="canManagePost(post)" class="mt-2 flex gap-2">
                    <button type="button" class="owner-button" @click="startEditPost(post)">Edit</button>
                    <button type="button" class="owner-button danger" :disabled="post.isBusy" @click="requestDeletePost(post)">Delete</button>
                  </div>

                  <div v-if="post.isEditing" class="mt-3 space-y-3 rounded border border-white/10 bg-black/25 p-3">
                    <textarea v-model="post.editDraft.body" class="min-h-20 w-full resize-y rounded border border-white/10 bg-black/35 p-3 text-sm text-white outline-none focus:border-serenade-500/60"></textarea>
                    <div class="grid gap-2 sm:grid-cols-2">
                      <select v-model="post.editDraft.channel" class="h-10 rounded border border-white/10 bg-black/50 px-3 text-sm text-gray-300 outline-none">
                        <option v-for="channel in postChannels" :key="channel" :value="channel">{{ channel }}</option>
                      </select>
                      <select v-model="post.editDraft.productId" class="h-10 rounded border border-white/10 bg-black/50 px-3 text-sm text-gray-300 outline-none">
                        <option value="">No album drop</option>
                        <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.title }} - {{ album.artist }}</option>
                      </select>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <button class="rounded bg-serenade-500 px-3 py-2 text-xs font-black uppercase tracking-widest text-black hover:bg-serenade-400" :disabled="post.isBusy" @click="saveEditedPost(post)">Save</button>
                      <button class="rounded border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white" :disabled="post.isBusy" @click="cancelEditPost(post)">Cancel</button>
                      <button v-if="post.editDraft.imageUrl" class="rounded border border-red-400/30 px-3 py-2 text-xs font-black uppercase tracking-widest text-red-200 hover:bg-red-500/10" :disabled="post.isBusy" @click="post.editDraft.imageUrl = ''">Remove Image</button>
                    </div>
                  </div>

                  <p v-else class="mt-2 whitespace-pre-line text-sm leading-6 text-gray-200">{{ post.body }}</p>

                  <div v-if="post.product || post.imageUrl" class="mx-auto mt-4 w-full max-w-sm space-y-3">
                    <RouterLink v-if="post.product" :to="`/product/${post.product.id}`" class="group flex gap-3 rounded border border-white/10 bg-black/30 p-2 transition hover:border-serenade-500/40">
                      <img class="h-12 w-12 rounded object-cover" :src="post.product.image" :alt="`${post.product.title} cover`" />
                      <div class="min-w-0 self-center">
                        <p class="truncate text-sm font-black text-white group-hover:text-serenade-300">{{ post.product.title }}</p>
                        <p class="truncate text-xs text-gray-500">{{ post.product.artist }} / {{ post.product.format || 'Album' }}</p>
                      </div>
                    </RouterLink>

                    <a v-if="post.imageUrl" :href="post.imageUrl" target="_blank" rel="noreferrer" class="block overflow-hidden rounded border border-white/10 bg-black/30">
                      <img class="aspect-[4/3] w-full object-cover" :src="post.imageUrl" alt="Post attachment" />
                    </a>
                  </div>

                  <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <button type="button" class="action-button" :disabled="!isLoggedIn || post.isBusy" @click="toggleLike(post)">
                      <Heart class="h-4 w-4" :class="{ 'fill-serenade-300 text-serenade-300': post.isLiked }" />
                      {{ post._count?.likes || 0 }}
                    </button>
                    <button type="button" class="action-button" @click="post.showComments = !post.showComments">
                      <MessageCircle class="h-4 w-4" />
                      {{ post._count?.comments || post.comments?.length || 0 }}
                    </button>
                  </div>

                  <div v-if="post.showComments" class="mt-4 space-y-3 rounded border border-white/10 bg-black/25 p-3">
                    <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
                      <RouterLink :to="`/profile/${comment.user?.id}`" class="h-8 w-8 shrink-0 overflow-hidden rounded bg-white/10 text-xs font-black text-gray-300 transition hover:ring-2 hover:ring-serenade-500/40">
                        <img v-if="comment.user?.avatarUrl" class="h-full w-full object-cover" :src="comment.user.avatarUrl" alt="Profile" />
                        <span v-else class="flex h-full w-full items-center justify-center">{{ initials(comment.user?.name || comment.user?.email || 'User') }}</span>
                      </RouterLink>
                      <div class="min-w-0">
                        <RouterLink :to="`/profile/${comment.user?.id}`" class="text-xs font-black text-gray-500 transition hover:text-serenade-300">
                          {{ comment.user?.name || comment.user?.email || 'Retro Listener' }}
                        </RouterLink>
                        <p class="mt-1 text-sm leading-5 text-gray-300">{{ comment.body }}</p>
                      </div>
                    </div>

                    <form class="flex gap-2" @submit.prevent="addComment(post)">
                      <input
                        v-model="post.commentDraft"
                        class="h-10 min-w-0 flex-1 rounded border border-white/10 bg-black/35 px-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-serenade-500/60"
                        placeholder="Add a comment..."
                        :disabled="!isLoggedIn || post.isBusy"
                      />
                      <button type="submit" class="rounded bg-serenade-500 px-4 text-xs font-black uppercase tracking-widest text-black hover:bg-serenade-400 disabled:opacity-50" :disabled="!isLoggedIn || post.isBusy || !post.commentDraft?.trim()">
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </article>
            <div ref="loadMoreTarget" class="h-8"></div>
            <div v-if="isLoadingMore" class="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-center font-mono text-xs uppercase tracking-widest text-gray-500">Loading more...</div>
            <div v-else-if="!hasMorePosts" class="p-3 text-center font-mono text-xs uppercase tracking-widest text-gray-600">End of wall</div>
            </template>
          </section>
        </main>

        <aside class="hidden lg:block">
          <div class="sticky top-24 space-y-4">
            <section class="relative rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <input
                v-model="userSearch"
                class="h-10 w-full rounded border border-white/10 bg-black/35 px-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-serenade-500/60"
                placeholder="Search Retro Reels"
                @focus="isSearchFocused = true"
                @blur="closeSearchResults"
                @input="queueDiscoverySearch"
              />

              <div v-if="showSearchResults" class="absolute left-4 right-4 top-[4.25rem] z-40 overflow-hidden rounded-lg border border-white/10 bg-shark-900 shadow-2xl shadow-black/50">
                <RouterLink
                  v-for="user in discoveryUsers"
                  :key="user.id"
                  :to="`/profile/${user.id}`"
                  class="flex gap-3 border-b border-white/5 p-3 transition last:border-b-0 hover:bg-white/[0.045]"
                >
                  <div class="h-9 w-9 shrink-0 overflow-hidden rounded bg-serenade-500/15 text-xs font-black text-serenade-200">
                    <img v-if="user.avatarUrl" class="h-full w-full object-cover" :src="user.avatarUrl" alt="Profile" />
                    <span v-else class="flex h-full w-full items-center justify-center">{{ initials(user.name || user.email || 'User') }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-black text-gray-200">{{ user.name || user.email }}</p>
                    <p class="truncate text-xs text-gray-500">{{ user._count?.socialPosts || 0 }} posts / {{ user._count?.orders || 0 }} albums</p>
                  </div>
                </RouterLink>
                <p v-if="!discoveryUsers.length" class="p-4 text-sm font-bold text-gray-500">No listeners found.</p>
              </div>
            </section>

            <section class="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <h2 class="text-sm font-black uppercase tracking-widest text-gray-300">Trending Now</h2>
              <div class="mt-4 space-y-3">
                <RouterLink
                  v-for="topic in trendingPosts"
                  :key="topic.id"
                  :to="`/posts/${topic.id}`"
                  class="block rounded border border-white/5 bg-black/20 p-3 transition hover:border-serenade-500/40 hover:bg-white/[0.045]"
                >
                  <p class="line-clamp-2 text-sm font-black leading-5 text-white">{{ topic.body }}</p>
                  <p class="mt-2 text-xs font-bold text-gray-500">{{ topic._count?.likes || 0 }} likes / {{ topic._count?.comments || 0 }} comments</p>
                </RouterLink>
              </div>
            </section>

            <section class="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-sm font-black uppercase tracking-widest text-gray-300">Tags</h2>
                <button v-if="activeTag" type="button" class="text-xs font-black uppercase tracking-widest text-serenade-300 hover:text-serenade-100" @click="clearTag">
                  Clear
                </button>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  v-for="tag in discoveryTags"
                  :key="tag.label"
                  type="button"
                  class="rounded border px-3 py-2 text-xs font-black transition"
                  :class="activeTag === tag.label ? 'border-serenade-500/50 bg-serenade-500/15 text-serenade-200' : 'border-white/10 bg-black/25 text-gray-400 hover:border-serenade-500/40 hover:text-serenade-200'"
                  @click="setTag(tag)"
                >
                  {{ tag.label }}
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>

      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" @click.self="cancelDeletePost">
        <section class="w-full max-w-sm rounded-lg border border-white/10 bg-shark-900 p-5 shadow-2xl shadow-black/50">
          <h2 class="text-lg font-black text-white">Delete post?</h2>
          <p class="mt-2 text-sm leading-6 text-gray-400">This post will be removed from the social wall and profile pages.</p>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white" :disabled="deleteTarget.isBusy" @click="cancelDeletePost">
              Cancel
            </button>
            <button type="button" class="rounded bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-red-400 disabled:opacity-50" :disabled="deleteTarget.isBusy" @click="confirmDeletePost">
              Delete
            </button>
          </div>
        </section>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { RouterLink, onBeforeRouteLeave, useRouter } from 'vue-router';
import { Heart, MessageCircle } from 'lucide-vue-next';
import customFetch from '@/api';
import HomeLayout from '@/layouts/HomeLayout.vue';
import { mergePostUpdates, postUpdatedEventName, readPostUpdates, writePostUpdate } from '@/utils/socialPostUpdates';

const router = useRouter();
const channels = ['All Signals', 'Listening Wall', 'Needle Drop', 'Tape Scan', 'Loop Note', 'Indo Covers'];
const postChannels = channels.filter((channel) => channel !== 'All Signals');
const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Popular', value: 'popular' },
];

const posts = ref([]);
const albums = ref([]);
const discoveryUsers = ref([]);
const discoveryTags = ref([]);
const trendingPosts = ref([]);
const userSearch = ref('');
const loadMoreTarget = ref(null);
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUserId = ref(storedUser.id || '');
const activeChannel = ref('All Signals');
const activeSort = ref('latest');
const activeTag = ref('');
const isLoading = ref(false);
const isLoadingMore = ref(false);
const hasMorePosts = ref(true);
const nextSkip = ref(0);
const isPublishing = ref(false);
const isUploadingImage = ref(false);
const error = ref('');
const notice = ref('');
const deleteTarget = ref(null);
const isSearchFocused = ref(false);
const pageSize = 8;
const feedCacheKey = 'socialFeedState';
let loadMoreObserver = null;
let discoverySearchTimer = null;
const draft = reactive({
  body: '',
  channel: 'Listening Wall',
  productId: '',
  imageUrl: '',
});

const isLoggedIn = computed(() => Boolean(localStorage.getItem('token')));
const selectedAlbum = computed(() => albums.value.find((album) => album.id === draft.productId));
const hasDraftContent = computed(() => Boolean(draft.body.trim() || draft.productId || draft.imageUrl.trim()));
const canPublish = computed(() => isLoggedIn.value && !isPublishing.value && hasDraftContent.value);
const showSearchResults = computed(() => isSearchFocused.value && Boolean(userSearch.value.trim()));
const imageButtonLabel = computed(() => {
  if (isUploadingImage.value) return 'Uploading...';
  return draft.imageUrl ? 'Change Image' : 'Upload Image';
});
const postHint = computed(() => {
  if (!isLoggedIn.value) return 'Sign in to post';
  if (!hasDraftContent.value) return 'Text, album, and image are all optional, but add at least one';
  return 'Album drop and image are optional';
});

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

const showNotice = (message) => {
  error.value = '';
  notice.value = message;
  window.setTimeout(() => {
    notice.value = '';
  }, 2400);
};

const normalizePost = (post) => ({
  ...post,
  showComments: false,
  commentDraft: '',
  isEditing: false,
  editDraft: {
    body: post.body || '',
    channel: post.channel || 'Listening Wall',
    productId: post.product?.id || '',
    imageUrl: post.imageUrl || '',
  },
  isBusy: false,
});

const canManagePost = (post) => Boolean(currentUserId.value && post.user?.id === currentUserId.value);
const cacheFeedState = () => {
  sessionStorage.setItem(feedCacheKey, JSON.stringify({
    scrollY: window.scrollY,
    channel: activeChannel.value,
    sort: activeSort.value,
    tag: activeTag.value,
    posts: posts.value.slice(0, 80),
    nextSkip: nextSkip.value,
    hasMorePosts: hasMorePosts.value,
  }));
};

const mergeUpdatedPost = (updatedPost) => {
  if (!updatedPost?.id) return;
  posts.value = posts.value.map((post) => (
    post.id === updatedPost.id
      ? { ...normalizePost(updatedPost), showComments: post.showComments }
      : post
  ));
};

const applyCachedPostUpdates = () => {
  const updates = readPostUpdates();
  Object.values(updates).forEach(mergeUpdatedPost);
};

const handlePostUpdated = (event) => {
  mergeUpdatedPost(event.detail?.post);
};

const openPostDetail = (post, event) => {
  if (event.target.closest('a,button,input,textarea,select,label,form')) return;
  cacheFeedState();
  router.push(`/posts/${post.id}`);
};

const restoreCachedFeed = async () => {
  const rawState = sessionStorage.getItem(feedCacheKey);
  if (!rawState) return false;

  try {
    const state = JSON.parse(rawState);
    if (state.channel !== activeChannel.value || state.sort !== activeSort.value || (state.tag || '') !== activeTag.value || !Array.isArray(state.posts)) {
      sessionStorage.removeItem(feedCacheKey);
      return false;
    }

    posts.value = state.posts
      .map((post) => mergePostUpdates([post])[0])
      .map(normalizePost);
    nextSkip.value = Number.isFinite(Number(state.nextSkip)) ? Number(state.nextSkip) : posts.value.length;
    hasMorePosts.value = Boolean(state.hasMorePosts);

    const targetScroll = Number(state.scrollY) || 0;
    const restore = () => window.scrollTo({ top: targetScroll, behavior: 'auto' });
    await nextTick();
    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });
    window.setTimeout(restore, 120);
    window.setTimeout(() => {
      restore();
      sessionStorage.removeItem(feedCacheKey);
    }, 360);
    return true;
  } catch {
    sessionStorage.removeItem(feedCacheKey);
    return false;
  }
};

const fetchPostPage = async (skip) => {
  const params = {
    sort: activeSort.value,
    skip,
    take: pageSize,
    ...(activeTag.value ? { tag: activeTag.value } : {}),
    ...(activeChannel.value !== 'All Signals' ? { channel: activeChannel.value } : {}),
  };
  const response = await customFetch.get('social/posts', { params });
  return response.data;
};

const loadPosts = async ({ restoreScroll = false } = {}) => {
  isLoading.value = true;
  error.value = '';

  try {
    if (restoreScroll && await restoreCachedFeed()) {
      return;
    }

    const response = await fetchPostPage(0);
    posts.value = mergePostUpdates(response.data || []).map(normalizePost);
    nextSkip.value = response.pagination?.nextSkip ?? posts.value.length;
    hasMorePosts.value = Boolean(response.pagination?.hasMore);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load social posts.';
  } finally {
    isLoading.value = false;
    await nextTick();
    setupLoadMoreObserver();
  }
};

const loadMorePosts = async () => {
  if (isLoading.value || isLoadingMore.value || !hasMorePosts.value) return;
  isLoadingMore.value = true;

  try {
    const response = await fetchPostPage(nextSkip.value);
    const nextPosts = mergePostUpdates(response.data || []).map(normalizePost);
    const seen = new Set(posts.value.map((post) => post.id));
    posts.value = [...posts.value, ...nextPosts.filter((post) => !seen.has(post.id))];
    nextSkip.value = response.pagination?.nextSkip ?? posts.value.length;
    hasMorePosts.value = Boolean(response.pagination?.hasMore);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load more posts.';
  } finally {
    isLoadingMore.value = false;
  }
};

const setupLoadMoreObserver = () => {
  loadMoreObserver?.disconnect();
  if (!loadMoreTarget.value) return;

  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      loadMorePosts();
    }
  }, { rootMargin: '360px 0px' });

  loadMoreObserver.observe(loadMoreTarget.value);
};

const loadCurrentUser = async () => {
  if (!isLoggedIn.value) return;

  try {
    const response = await customFetch.get('auth/me');
    currentUserId.value = response.data.user?.id || currentUserId.value;
    localStorage.setItem('user', JSON.stringify(response.data.user));
  } catch {
    // The feed can still render without owner controls if session refresh fails.
  }
};

const loadProducts = async () => {
  if (!isLoggedIn.value) {
    albums.value = [];
    return;
  }

  try {
    const response = await customFetch.get('orders');
    const orders = response.data.data || [];
    const products = orders
      .map((order) => order.product)
      .filter(Boolean);
    const seen = new Set();
    albums.value = products
      .filter((product) => {
        if (seen.has(product.id)) return false;
        seen.add(product.id);
        return true;
      })
      .map((product) => ({
        id: product.id,
        title: product.title,
        artist: product.artist,
        format: product.format || 'Album',
        image: product.image || '/Yoru.jpeg',
      }));
  } catch {
    albums.value = [];
  }
};

const loadDiscovery = async () => {
  try {
    const response = await customFetch.get('social/discovery', {
      params: {
        ...(userSearch.value.trim() ? { search: userSearch.value.trim() } : {}),
      },
    });
    discoveryUsers.value = response.data.data?.users || [];
    discoveryTags.value = response.data.data?.tags || [];
    trendingPosts.value = response.data.data?.trendingPosts || [];
  } catch {
    discoveryUsers.value = [];
    discoveryTags.value = [];
    trendingPosts.value = [];
  }
};

const queueDiscoverySearch = () => {
  window.clearTimeout(discoverySearchTimer);
  discoverySearchTimer = window.setTimeout(loadDiscovery, 220);
};

const closeSearchResults = () => {
  window.setTimeout(() => {
    isSearchFocused.value = false;
  }, 140);
};

const setTag = (tag) => {
  activeTag.value = tag.label;
  sessionStorage.removeItem(feedCacheKey);
  loadPosts();
};

const clearTag = () => {
  activeTag.value = '';
  sessionStorage.removeItem(feedCacheKey);
  loadPosts();
};

const setChannel = (channel) => {
  activeChannel.value = channel;
  sessionStorage.removeItem(feedCacheKey);
  loadPosts();
};

const setSort = (sort) => {
  activeSort.value = sort;
  sessionStorage.removeItem(feedCacheKey);
  loadPosts();
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const uploadImage = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file.';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image must be 5MB or smaller.';
    return;
  }

  isUploadingImage.value = true;
  error.value = '';

  try {
    const dataUrl = await fileToDataUrl(file);
    const response = await customFetch.post('social/uploads', {
      fileName: file.name,
      dataUrl,
    });
    draft.imageUrl = response.data.data.imageUrl;
    showNotice('Image uploaded.');
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not upload image.';
  } finally {
    isUploadingImage.value = false;
  }
};

const clearUploadedImage = () => {
  draft.imageUrl = '';
};

const publishPost = async () => {
  if (!canPublish.value) return;

  isPublishing.value = true;
  error.value = '';

  try {
    const response = await customFetch.post('social/posts', {
      body: draft.body,
      channel: draft.channel,
      productId: draft.productId || undefined,
      imageUrl: draft.imageUrl.trim() || undefined,
    });
    posts.value.unshift(normalizePost(response.data.data));
    draft.body = '';
    draft.productId = '';
    draft.imageUrl = '';
    activeChannel.value = 'All Signals';
    showNotice('Post dropped.');
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not create post.';
  } finally {
    isPublishing.value = false;
  }
};

const replacePost = (nextPost) => {
  writePostUpdate(nextPost);
  posts.value = posts.value.map((post) => (
    post.id === nextPost.id
      ? { ...normalizePost(nextPost), showComments: post.showComments }
      : post
  ));
};

const startEditPost = (post) => {
  post.isEditing = true;
  post.editDraft = {
    body: post.body || '',
    channel: post.channel || 'Listening Wall',
    productId: post.product?.id || '',
    imageUrl: post.imageUrl || '',
  };
};

const cancelEditPost = (post) => {
  post.isEditing = false;
};

const saveEditedPost = async (post) => {
  if (post.isBusy) return;
  post.isBusy = true;

  try {
    const response = await customFetch.patch(`social/posts/${post.id}`, {
      body: post.editDraft.body,
      channel: post.editDraft.channel,
      productId: post.editDraft.productId || undefined,
      imageUrl: post.editDraft.imageUrl || undefined,
    });
    replacePost(response.data.data);
    showNotice('Post updated.');
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not update post.';
  } finally {
    post.isBusy = false;
  }
};

const requestDeletePost = (post) => {
  if (post.isBusy) return;
  deleteTarget.value = post;
};

const cancelDeletePost = () => {
  if (deleteTarget.value?.isBusy) return;
  deleteTarget.value = null;
};

const confirmDeletePost = async () => {
  const post = deleteTarget.value;
  if (!post || post.isBusy) return;
  post.isBusy = true;

  try {
    await customFetch.delete(`social/posts/${post.id}`);
    posts.value = posts.value.filter((item) => item.id !== post.id);
    deleteTarget.value = null;
    showNotice('Post deleted.');
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not delete post.';
  } finally {
    post.isBusy = false;
  }
};

const toggleLike = async (post) => {
  if (!isLoggedIn.value || post.isBusy) return;
  post.isBusy = true;

  try {
    const response = await customFetch.post(`social/posts/${post.id}/like`);
    replacePost(response.data.data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not update like.';
  } finally {
    post.isBusy = false;
  }
};

const addComment = async (post) => {
  const body = post.commentDraft?.trim();
  if (!isLoggedIn.value || post.isBusy || !body) return;
  post.isBusy = true;

  try {
    const response = await customFetch.post(`social/posts/${post.id}/comments`, { body });
    replacePost(response.data.data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not add comment.';
  } finally {
    post.isBusy = false;
  }
};

onMounted(() => {
  loadCurrentUser();
  loadProducts();
  loadDiscovery();
  loadPosts({ restoreScroll: true });
  window.addEventListener(postUpdatedEventName, handlePostUpdated);
  window.addEventListener('focus', applyCachedPostUpdates);
  document.addEventListener('visibilitychange', applyCachedPostUpdates);
});

onBeforeRouteLeave(() => {
  if (posts.value.length) {
    cacheFeedState();
  }
});

onBeforeUnmount(() => {
  loadMoreObserver?.disconnect();
  window.clearTimeout(discoverySearchTimer);
  window.removeEventListener(postUpdatedEventName, handlePostUpdated);
  window.removeEventListener('focus', applyCachedPostUpdates);
  document.removeEventListener('visibilitychange', applyCachedPostUpdates);
});
</script>

<style scoped>
.action-button {
  display: inline-flex;
  height: 2.25rem;
  align-items: center;
  gap: 0.45rem;
  border-radius: 0.375rem;
  padding: 0 0.75rem;
  color: rgb(156 163 175);
  font-weight: 800;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.action-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.action-button:disabled {
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
