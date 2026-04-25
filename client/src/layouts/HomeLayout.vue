<template>
    <div id="body" class="min-h-screen bg-shark-950">
        <HomeNavbarComponent />

        <main class="min-h-0">
            <slot />
        </main>

    </div>


</template>

<script setup lang="ts">
import HomeNavbarComponent from '@/components/HomeComponents/HomeNavbarComponent.vue';
</script>
