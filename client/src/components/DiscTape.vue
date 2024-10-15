<template>
     <div
                    class="border-8 bg-black border-gray-400 rounded-2xl w-80 h-48 rotate-45 flex justify-evenly items-center animate-tape-spin">
                    <div class="bg-gray-700 w-16 h-20 rounded-l-3xl overflow-hidden border-none">
                        <div
                            class="w-20 h-20 ms-6 rounded-full bg-black flex items-center justify-center animate-spin-slow-left">
                            <div
                                class="w-1/2 h-1/2  rounded-full border-2 border-dashed border-white flex items-center justify-center">
                                <div class="w-3/4 h-3/4 bg-white rounded-full border-2 border-dashed border-white">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-cover border border-white w-32 h-20 rounded-xl overflow-hidden"
                        style="background-image: url('/Yoru.jpeg');">
                        <div
                            class="w-full h-4 bg-gray-600 rounded-md text-center text-white text-sm flex-col justify-start items-start">
                        </div>
                    </div>
                    <div class="bg-gray-700 w-16 h-20 rounded-r-3xl overflow-hidden">
                        <div class="w-20 h-20 -ms-10  -z-10 rounded-full bg-black flex items-center justify-center ">
                            <div
                                class="w-1/2 h-1/2  rounded-full border-2 border-dashed border-white flex items-center justify-center animate-spin-slow-right">
                                <div class="w-3/4 h-3/4 bg-white rounded-full border-2 border-dashed border-white">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
</template>



<style scoped>

@keyframes spin-slow-left {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes spin-slow-right {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}

/* Customizing animation speed */
.animate-tape-spin {
    animation: tape-spin 15s linear infinite;
}

.animate-spin-slow-left {
    animation: spin-slow-left 10s linear infinite;
}

.animate-spin-slow-right {
    animation: spin-slow-right 10s linear infinite;
}
</style>