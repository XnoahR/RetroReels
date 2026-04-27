<template>
  <Transition name="loader-fade">
    <div v-if="visible" class="app-loader" role="status" aria-live="polite" aria-label="Loading">
      <div class="loader-panel">
        <div class="loader-mark">
          <img src="/RR.png" alt="" />
          <span></span>
        </div>
        <div class="min-w-0">
          <p class="loader-eyebrow">Retro Reels</p>
          <p class="loader-title">{{ message }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: 'Loading' },
});
</script>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 2147483640;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, rgba(245, 143, 66, 0.14), transparent 34rem),
    rgba(5, 6, 7, 0.78);
  backdrop-filter: blur(10px);
}

.loader-panel {
  display: flex;
  width: min(24rem, calc(100vw - 2rem));
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(245, 143, 66, 0.34);
  border-radius: 0.5rem;
  background: rgba(10, 10, 12, 0.92);
  padding: 1rem;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    0 0 36px rgba(245, 143, 66, 0.12);
}

.loader-mark {
  position: relative;
  display: grid;
  height: 4.25rem;
  width: 4.25rem;
  flex: 0 0 4.25rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.45rem;
  background: #050607;
}

.loader-mark img {
  height: 2.55rem;
  width: 2.55rem;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(245, 143, 66, 0.42));
}

.loader-mark span {
  position: absolute;
  inset: auto 0 0;
  height: 0.18rem;
  background: linear-gradient(90deg, transparent, #f58f42, transparent);
  animation: loader-scan 1.1s ease-in-out infinite;
}

.loader-eyebrow {
  color: #f58f42;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.loader-title {
  margin-top: 0.2rem;
  overflow: hidden;
  color: white;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.22s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

@keyframes loader-scan {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
