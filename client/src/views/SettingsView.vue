<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 px-4 pb-32 pt-8 text-white sm:px-6">
      <div class="mx-auto max-w-3xl space-y-5">
        <header class="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-serenade-400">Account Menu</p>
          <h1 class="mt-2 text-3xl font-black uppercase tracking-widest">Settings</h1>
          <p class="mt-2 text-sm leading-6 text-gray-400">Manage your public profile and password.</p>
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

          <button
            class="mt-5 h-11 rounded bg-serenade-500 px-5 text-sm font-black uppercase tracking-widest text-black hover:bg-serenade-400 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isSavingProfile"
            @click="saveProfile"
          >
            {{ isSavingProfile ? 'Saving...' : 'Save Profile' }}
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
            <label class="space-y-2 sm:col-span-2">
              <span class="label">Confirm New Password</span>
              <input v-model="passwordForm.confirmPassword" class="field" type="password" @keyup.enter="changePassword" />
            </label>
          </div>
          <button
            class="mt-5 h-11 rounded border border-serenade-500/40 px-5 text-sm font-black uppercase tracking-widest text-serenade-300 hover:bg-serenade-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isChangingPassword"
            @click="changePassword"
          >
            {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </section>
      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import { currentUser as authUser, isLoggedIn, updateUser } from '@/stores/auth';

const router = useRouter();

const currentUser = reactive({
  email: authUser.value?.email || '',
});
const alert = reactive({ message: '', type: 'success' });
const isUploadingAvatar = ref(false);
const isSavingProfile = ref(false);
const isChangingPassword = ref(false);

const profileForm = reactive({
  name: authUser.value?.name || '',
  bio: authUser.value?.bio || '',
  avatarUrl: authUser.value?.avatarUrl || '',
});
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
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
  if (!isLoggedIn.value) {
    router.push({ name: 'Login' });
    return;
  }

  try {
    const meRes = await customFetch.get('auth/me');
    Object.assign(profileForm, {
      name: meRes.data.user.name || '',
      bio: meRes.data.user.bio || '',
      avatarUrl: meRes.data.user.avatarUrl || '',
    });
    currentUser.email = meRes.data.user.email;
    updateUser(meRes.data.user);
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to load profile', 'error');
  }
};

const saveProfile = async () => {
  if (isSavingProfile.value) return;
  isSavingProfile.value = true;
  try {
    const response = await customFetch.patch('auth/profile', profileForm);
    updateUser(response.data.user);
    setAlert('Profile saved.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to save profile', 'error');
  } finally {
    isSavingProfile.value = false;
  }
};

const changePassword = async () => {
  if (isChangingPassword.value) return;
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setAlert('New passwords do not match.', 'error');
    return;
  }
  isChangingPassword.value = true;
  try {
    await customFetch.patch('auth/password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    setAlert('Password updated.');
  } catch (error) {
    setAlert(error.response?.data?.message || 'Failed to update password', 'error');
  } finally {
    isChangingPassword.value = false;
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
</style>
