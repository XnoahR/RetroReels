<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-8 text-white sm:px-6">
      <div class="mx-auto max-w-3xl space-y-5">
        <header class="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Account Menu</p>
          <h1 class="mt-2 text-3xl font-black uppercase tracking-widest">Settings</h1>
          <p class="mt-2 text-sm leading-6 text-gray-400">Manage your public profile, playback preferences, and password.</p>
        </header>

        <p v-if="alert.message" class="rounded border px-4 py-3 text-sm font-bold" :class="alert.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'">
          {{ alert.message }}
        </p>

        <section class="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <div class="mb-5 flex items-center gap-4">
            <div class="h-20 w-20 overflow-hidden rounded-lg bg-serenade-500/20">
              <img v-if="profileForm.avatarUrl" class="h-full w-full object-cover" :src="profileForm.avatarUrl" alt="Profile preview" />
              <div v-else class="flex h-full w-full items-center justify-center text-2xl font-black text-serenade-200">{{ initials(profileForm.name || currentUser.email || 'User') }}</div>
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Profile</p>
              <h2 class="mt-1 text-xl font-black uppercase tracking-widest">Public Info</h2>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-2">
              <span class="label">Display Name</span>
              <input v-model="profileForm.name" class="field" />
            </label>
            <div class="space-y-2">
              <span class="label">Profile Picture</span>
              <div class="flex flex-wrap gap-2">
                <label class="inline-flex h-11 cursor-pointer items-center justify-center rounded border border-white/10 bg-black/35 px-4 text-xs font-black uppercase tracking-widest text-gray-300 transition hover:border-serenade-500/40 hover:text-white" :class="{ 'cursor-not-allowed opacity-50': isUploadingAvatar }">
                  {{ isUploadingAvatar ? 'Uploading...' : 'Upload Image' }}
                  <input class="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" :disabled="isUploadingAvatar" @change="uploadAvatar" />
                </label>
                <button
                  v-if="profileForm.avatarUrl"
                  type="button"
                  class="h-11 rounded border border-red-400/30 px-4 text-xs font-black uppercase tracking-widest text-red-200 hover:bg-red-500/10"
                  :disabled="isUploadingAvatar"
                  @click="profileForm.avatarUrl = ''"
                >
                  Remove
                </button>
              </div>
            </div>
            <label class="space-y-2 sm:col-span-2">
              <span class="label">Bio</span>
              <textarea v-model="profileForm.bio" class="field min-h-24 resize-y" maxlength="220"></textarea>
            </label>
          </div>

          <button class="mt-5 h-11 rounded bg-serenade-500 px-5 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400" @click="saveProfile">
            Save Profile
          </button>
        </section>

        <section class="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <div class="mb-5">
            <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Playback</p>
            <h2 class="mt-1 text-xl font-black uppercase tracking-widest">Player Settings</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-2">
              <span class="label">Streaming Quality</span>
              <select v-model="settingsForm.quality" class="field">
                <option>Standard</option>
                <option>High</option>
                <option>Lossless</option>
              </select>
            </label>
            <label class="space-y-2">
              <span class="label">Volume</span>
              <input v-model.number="settingsForm.volume" class="field" max="1" min="0" step="0.05" type="number" />
            </label>
            <label class="toggle-row">
              <span>Hardware Crackle</span>
              <input v-model="settingsForm.hardwareNoise" type="checkbox" />
            </label>
            <label class="toggle-row">
              <span>Crossfade</span>
              <input v-model="settingsForm.crossfade" type="checkbox" />
            </label>
          </div>
          <button class="mt-5 h-11 rounded bg-serenade-500 px-5 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400" @click="saveSettings">
            Save Playback
          </button>
        </section>

        <section class="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <div class="mb-5">
            <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Security</p>
            <h2 class="mt-1 text-xl font-black uppercase tracking-widest">Change Password</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-2">
              <span class="label">Current Password</span>
              <input v-model="passwordForm.currentPassword" class="field" type="password" />
            </label>
            <label class="space-y-2">
              <span class="label">New Password</span>
              <input v-model="passwordForm.newPassword" class="field" type="password" />
            </label>
          </div>
          <button class="mt-5 h-11 rounded border border-serenade-500/40 px-5 text-sm font-black uppercase tracking-widest text-serenade-300 hover:bg-serenade-500/10" @click="changePassword">
            Update Password
          </button>
        </section>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = reactive({
  email: storedUser.email || '',
});
const alert = reactive({ message: '', type: 'success' });
const isUploadingAvatar = ref(false);
const profileForm = reactive({
  name: storedUser.name || '',
  bio: storedUser.bio || '',
  avatarUrl: storedUser.avatarUrl || '',
});
const settingsForm = reactive({
  quality: 'High',
  hardwareNoise: true,
  crossfade: false,
  theme: 'dark-neon',
  volume: 0.8,
});
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
});

const initials = (value) => value
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('') || 'U';

const setAlert = (message, type = 'success') => {
  alert.message = message;
  alert.type = type;
  window.setTimeout(() => {
    alert.message = '';
  }, 2600);
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const uploadAvatar = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    setAlert('Please upload an image file.', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    setAlert('Image must be 5MB or smaller.', 'error');
    return;
  }

  isUploadingAvatar.value = true;

  try {
    const dataUrl = await fileToDataUrl(file);
    const response = await customFetch.post('social/uploads', {
      fileName: file.name,
      dataUrl,
    });
    profileForm.avatarUrl = response.data.data.imageUrl;
    setAlert('Profile picture uploaded.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to upload profile picture', 'error');
  } finally {
    isUploadingAvatar.value = false;
  }
};

const loadSettings = async () => {
  try {
    const [meRes, settingsRes] = await Promise.all([
      customFetch.get('auth/me'),
      customFetch.get('me/settings'),
    ]);
    Object.assign(profileForm, {
      name: meRes.data.user.name || '',
      bio: meRes.data.user.bio || '',
      avatarUrl: meRes.data.user.avatarUrl || '',
    });
    currentUser.email = meRes.data.user.email;
    localStorage.setItem('user', JSON.stringify(meRes.data.user));
    Object.assign(settingsForm, settingsRes.data.data || {});
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to load settings', 'error');
  }
};

const saveProfile = async () => {
  try {
    const response = await customFetch.patch('auth/profile', profileForm);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setAlert('Profile saved.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to save profile', 'error');
  }
};

const saveSettings = async () => {
  try {
    await customFetch.patch('me/settings', settingsForm);
    setAlert('Playback settings saved.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to save playback settings', 'error');
  }
};

const changePassword = async () => {
  try {
    await customFetch.patch('auth/password', passwordForm);
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    setAlert('Password updated.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to update password', 'error');
  }
};

onMounted(loadSettings);
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

.toggle-row {
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.34);
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(209, 213, 219);
}
</style>
