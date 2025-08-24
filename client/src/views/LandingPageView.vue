<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const displayText = ref("")
const fullText = "Insert Selection to Continue"
const isFullText = ref(false)

const changeRoute = ref(false)

onMounted(() => {
    let i = 0;

    // Delay sebelum mulai mengetik
    setTimeout(() => {
        const interval = setInterval(() => {
            displayText.value += fullText[i];
            i++;
            if (i === fullText.length) {
                isFullText.value = true
                clearInterval(interval)
            };
        }, 100); // ketik 1 huruf tiap 100ms
    }, 1500); // tunggu 1.5 detik dulu sebelum mulai
});

function goTo(path: string) {
    changeRoute.value = true;

    // Durasi glitch = 800ms
    setTimeout(() => {
        router.push(path);
        changeRoute.value = false;
    }, 800);
}
</script>

<template>
    <section class="w-screen h-screen flex flex-col justify-center items-center bg-shark-950">

<transition name="fade">

        <div
            v-if="!changeRoute" class="w-auto h-auto border border-amber-300/20 shadow-[0_0_2px_rgba(251,211,77),0_0_4px_rgba(251,211,77)]  flex justify-center  items-center p-12 bg-[#323237]">
            <div class="w-auto h-auto flex flex-col space-y-5">
                <div class="w-full h-auto text-center">
                    <H1 class="text-4xl font-bold text-stroke ">RETRO REELS</H1>
                    <p class="font-semibold text-md mt-2 uppercase text-yellow-300 ">Preserving Cinema, One Reel at a
                        Time.</p>
                </div>
                <div
                    class="w-full min-h-12 bg-black outline outline-1 outline-yellow-300/15 flex flex-col justify-center items-center rounded-sm">
                    <p class="text-yellow-300 text-tiny uppercase font-semibold mt-2"> > Ready to Play</p>
                    <p :class="{ blink: isFullText }" class="uppercase text-tiny text-white my-2"> {{ displayText }}</p>
                </div>
                <div class="w-auto h-auto flex items-center space-x-2">
                    <button
                        class="text-center bg-serenade-600/60 outline outline-1 text-sm outline-yellow-300/50 hover:shadow-[0_0_12px_#f58f42,0_0_4px_rgba(253,224,71)] transition-all delay-100 ease-linear rounded-sm font-semibold w-60 h-10 text-white flex items-center justify-center">PLAY
                        RETRO REELS</button>
                    <button v-on:click="goTo('/login')"
                        class="flex items-center justify-center w-16 h-6 text-tiny outline outline-1 outline-serenade-400/50 rounded-sm text-serenade-400 hover:shadow-[0_0_8px_#f58f42,0_0_4px_#f58f42] transition-all delay-100 ease-linear  font-semibold bg-serenade-400/30">LOG
                        IN</button>
                    <button onclick=""
                        class="flex items-center justify-center w-16 h-6 text-tiny outline outline-1 outline-amber-400/50 rounded-sm text-amber-400 hover:shadow-[0_0_8px_#f58f42,0_0_4px_#fbbf24] transition-all delay-100 ease-linear  font-semibold bg-amber-400/30">REGISTER</button>
                </div>
                <div class="mt-6 w-full flex justify-center items-center space-x-3">
                    <div class="text-tiny flex justify-center items-center text-gray-400 uppercase">
                        <div class="rounded-full mx-1 bg-green-500 w-1 h-1 "></div>Power On
                    </div>
                    <div class="text-tiny flex justify-center items-center text-gray-400 uppercase">
                        <div class="rounded-full mx-1 bg-yellow-500 w-1 h-1 "></div>Tracking
                    </div>
                    <div class="text-tiny flex justify-center items-center text-gray-400 uppercase">
                        <div class="rounded-full mx-1 bg-red-500 w-1 h-1 "></div>Power On
                    </div>

                </div>
            </div>
        </div>

</transition>
    </section>
</template>

<style scoped>
.text-stroke {
    -webkit-text-stroke: 1px #36df20;
    -webkit-text-fill-color: white;
    text-shadow:
        0 0 1px #36df20,
        0 0 15px #36df20,
        0 0 30px #36df20,
        0 0 15px #36df20,
        0 0 2px #36df20;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes blink {

    0%,
    50%,
    100% {
        opacity: 1;
    }

    25%,
    75% {
        opacity: 0;
    }
}

.blink {
    animation: blink 2s infinite;
}

@keyframes change-route {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.change-route {
    animation: change-route 3s;
}


</style>