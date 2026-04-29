import { computed, reactive } from 'vue';
import customFetch from '@/api';

interface PlayerState {
  volume: number;
}

const state = reactive<PlayerState>({
  volume: 0.8,
});

let initialized = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleSave = () => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await customFetch.patch('me/settings', {
        volume: state.volume,
      });
    } catch {
      // Silent fail - volume is already reactive locally
    }
  }, 800);
};

export const volume = computed({
  get: () => state.volume,
  set: (val: number) => {
    const next = Math.min(1, Math.max(0, Number(val) || 0));
    state.volume = Math.round(next * 100) / 100;
    localStorage.setItem('retroReelsPlayerVolume', String(state.volume));
    scheduleSave();
  },
});

export const applyVolumeToAudio = (audio: HTMLAudioElement) => {
  if (audio) audio.volume = state.volume;
};

export const loadPlayerVolume = async () => {
  if (initialized) return;
  initialized = true;

  const savedVolume = localStorage.getItem('retroReelsPlayerVolume');
  if (savedVolume !== null) {
    const num = Number(savedVolume);
    if (Number.isFinite(num)) state.volume = Math.min(1, Math.max(0, num));
  }

  try {
    const { data } = await customFetch.get('me/settings');
    if (data.data && typeof data.data.volume === 'number') {
      state.volume = Math.min(1, Math.max(0, data.data.volume));
      localStorage.setItem('retroReelsPlayerVolume', String(state.volume));
    }
  } catch {
    // Silent fail - defaults are already set
  }
};
