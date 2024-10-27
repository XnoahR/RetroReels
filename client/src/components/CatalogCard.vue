<template>
    <div id="catalog-card"
                class="w-72 h-96 border border-red-500 flex flex-col justify-center items-center relative overflow-hidden">
                <!-- Top Section (Disc Container) -->
                <div class="w-full h-2/3 border border-red-500 bg-gray-500 relative overflow-hidden">
                    <DiscTape  :image="'/Yoru.jpeg'"
                        class="absolute inset-0 top-5 -left-5" />
                </div>

                <!-- Bottom Section (Text) -->
                <div class="w-full h-1/3 border border-blue-600">
                    <p class="text-center text-xl font-bold">Yoru</p>
                </div>
            </div>
</template>

<script setup>
import DiscTape from './DiscTape.vue';
</script>