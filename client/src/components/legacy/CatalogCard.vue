<template>
    <div id="catalog-card"
                class="w-72 h-96  rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
                <!-- Top Section (Disc Container) -->
                <div class="w-full h-3/4  bg-gray-500 relative overflow-hidden rounded-t-xl">
                    <DiscTape  :image="'/Yoru.jpeg'"
                        class="absolute inset-0 top-10 -left-4" />
                </div>

                <!-- Bottom Section (Text) -->
                <div class="w-full h-1/4  bg-[#E5D5B6] rounded-b-xl">
                    <p class="text-center text-xl font-bold">Yoru</p>
                </div>
            </div>
</template>

<script setup>
import DiscTape from '../catalog/media/DiscTape.vue';
</script>
