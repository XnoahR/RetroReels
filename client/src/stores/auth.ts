import { computed, reactive } from 'vue';

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  credits: number;
  bio?: string;
  avatarUrl?: string;
}

interface AuthState {
  token: string | null;
  user: SafeUser | null;
}

const parseUser = (raw: string | null): SafeUser | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.id) return parsed as SafeUser;
    return null;
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!base64) return null;
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const state = reactive<AuthState>({
  token: localStorage.getItem('token'),
  user: parseUser(localStorage.getItem('user')),
});

export const isLoggedIn = computed(() => {
  if (!state.token) return false;
  const payload = decodeJwtPayload(state.token);
  if (payload?.exp && Date.now() >= payload.exp * 1000) return false;
  return true;
});

export const currentUser = computed(() => state.user);
export const isAdmin = computed(() => state.user?.role === 'ADMIN');
export const authToken = computed(() => state.token);

export const setAuth = (token: string, user: SafeUser) => {
  state.token = token;
  state.user = user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const updateUser = (patch: Partial<SafeUser>) => {
  if (!state.user) return;
  const next = { ...state.user, ...patch };
  state.user = next;
  localStorage.setItem('user', JSON.stringify(next));
};

export const clearAuth = () => {
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
