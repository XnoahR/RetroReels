<template>
    <div id="cassete-vynyl" class="absolute w-disc h-disc rounded-full bg-black -left-72 -top-64 flex justify-center items-center animate-spin-slow-right">
            <div class="border border-gray-800 rounded-full w-5/6 h-5/6 flex items-center justify-center">
                <div class="border border-gray-800 rounded-full w-5/6 h-5/6 flex items-center justify-center">
                    <div class="border border-gray-800 rounded-full w-5/6 h-5/6 flex items-center justify-center">
                        <div
                            class="bg-[url(../../public/Yoru.jpeg)] bg-center border border-gray-800 rounded-full w-4/6 h-4/6 flex items-center justify-center">
                            <span class=" w-5 h-5 bg-white border-2 border-black rounded-full"> </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes spin-slow-right {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.animate-spin-slow-right {
    animation: spin-slow-right 30s linear infinite;
}

</style>