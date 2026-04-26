<template>
    <div id="catalog-card" class="w-72 h-80  border border-red-500  flex-col justify-center items-center ">
                <div
                    class="w-full h-2/3 border border-red-500 bg-gray-500 overflow-hidden flex items-center justify-center p-3">

                    <DiscTape :tape-rotation="'rotate-0'" :image="'/Yoru.jpeg'" />
                </div>
                <div class="w-full h-1/3 border border-blue-600">
                    <p class="text-center text-xl font-bold">Yoru</p>
                </div>
            </div>
</template>

<script setup>
import DiscTape from '../catalog/media/DiscTape.vue';
</script>
