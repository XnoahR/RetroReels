import { computed, reactive } from 'vue';

const MIN_VISIBLE_MS = 420;
const SHOW_DELAY_MS = 120;

const state = reactive({
  pending: 0,
  visible: false,
  message: 'Loading',
});

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let shownAt = 0;

const clearShowTimer = () => {
  if (!showTimer) return;
    clearTimeout(showTimer);
  showTimer = null;
};

const clearHideTimer = () => {
  if (!hideTimer) return;
    clearTimeout(hideTimer);
  hideTimer = null;
};

const show = () => {
  clearHideTimer();
  if (state.visible || showTimer) return;

  showTimer = setTimeout(() => {
    shownAt = Date.now();
    state.visible = true;
    showTimer = null;
  }, SHOW_DELAY_MS);
};

const hide = () => {
  clearShowTimer();
  if (!state.visible) return;

  const elapsed = Date.now() - shownAt;
  const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);

  clearHideTimer();
  hideTimer = setTimeout(() => {
    state.visible = false;
    hideTimer = null;
  }, delay);
};

export const appLoading = computed(() => state.visible);
export const appLoadingMessage = computed(() => state.message);

export const startLoading = (message = 'Loading') => {
  state.pending += 1;
  state.message = message;
  show();
};

export const stopLoading = () => {
  state.pending = Math.max(0, state.pending - 1);
  if (state.pending === 0) hide();
};

export const resetLoading = () => {
  state.pending = 0;
  hide();
};
