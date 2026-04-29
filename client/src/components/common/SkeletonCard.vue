<template>
  <div class="skeleton-card" :class="{ 'skeleton-card-grid': variant === 'grid', 'skeleton-card-list': variant === 'list' }">
    <div class="skeleton skeleton-media" :class="{ 'skeleton-square': variant === 'grid', 'skeleton-rect': variant === 'list' }"></div>
    <div class="skeleton-body">
      <div class="skeleton skeleton-text skeleton-title"></div>
      <div class="skeleton skeleton-text skeleton-subtitle"></div>
      <div class="skeleton skeleton-text skeleton-meta"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'grid',
    validator: (v) => ['grid', 'list'].includes(v),
  },
});
</script>

<style scoped>
.skeleton-card {
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.skeleton-card-grid .skeleton-media {
  aspect-ratio: 4 / 3;
  border-radius: 0;
}

.skeleton-card-list {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
}

.skeleton-card-list .skeleton-media {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.skeleton-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-text {
  height: 0.75rem;
}

.skeleton-title {
  width: 75%;
  height: 1rem;
}

.skeleton-subtitle {
  width: 50%;
}

.skeleton-meta {
  width: 35%;
  height: 0.6rem;
}
</style>
