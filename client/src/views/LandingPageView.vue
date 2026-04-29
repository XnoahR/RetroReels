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
            v-if="!changeRoute" class="w-[80vw] max-w-lg border-2 border-amber-300/30 shadow-[0_0_8px_rgba(251,211,77),0_0_20px_rgba(251,211,77,0.3),inset_0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center p-6 sm:p-8 bg-[#2a2a2e] rounded-lg relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
            <div class="w-full flex flex-col space-y-6">
                <div class="w-full h-auto text-center">
                    <H1 class="text-4xl font-bold text-stroke ">RETRO REELS</H1>
                    <p class="font-semibold text-md mt-2 uppercase text-yellow-300 ">Preserving Cinema, One Reel at a
                        Time.</p>
                </div>
                <div
                    class="w-full min-h-14 bg-black/80 border border-yellow-300/20 rounded shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-center items-center px-4 py-2">
                    <p class="text-yellow-300 text-tiny uppercase font-semibold mt-2"> > Ready to Play</p>
                    <p :class="{ blink: isFullText }" class="uppercase text-tiny text-white my-2"> {{ displayText }}</p>
                </div>
                <div class="w-full flex flex-col items-center gap-3">
                    <button
                        @click="goTo('/Home')"
                        class="px-8 h-12 rounded-sm bg-serenade-600/60 outline outline-1 outline-yellow-300/50 text-base font-bold text-white hover:shadow-[0_0_12px_#f58f42,0_0_4px_rgba(253,224,71)] transition-all ease-linear flex items-center justify-center whitespace-nowrap">PLAY
                        RETRO REELS</button>
                    <div class="flex items-center gap-3">
                        <button @click="goTo('/login')"
                            class="px-4 h-8 rounded-sm outline outline-1 outline-serenade-400/50 text-xs font-semibold text-serenade-400 bg-serenade-400/30 hover:shadow-[0_0_8px_#f58f42,0_0_4px_#f58f42] transition-all ease-linear whitespace-nowrap">LOG
                            IN</button>
                        <button @click="goTo('/login')"
                            class="px-4 h-8 rounded-sm outline outline-1 outline-amber-400/50 text-xs font-semibold text-amber-400 bg-amber-400/30 hover:shadow-[0_0_8px_#f58f42,0_0_4px_#fbbf24] transition-all ease-linear whitespace-nowrap">REGISTER</button>
                    </div>
                </div>
                <div class="mt-4 w-full flex justify-center items-center gap-4 pt-4 border-t border-white/5">
                    <div class="flex items-center gap-1.5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">
                        <div class="rounded-full bg-green-500 w-1.5 h-1.5 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>Power On
                    </div>
                    <div class="flex items-center gap-1.5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">
                        <div class="rounded-full bg-yellow-500 w-1.5 h-1.5 shadow-[0_0_6px_rgba(234,179,8,0.6)]"></div>Tracking
                    </div>
                    <div class="flex items-center gap-1.5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">
                        <div class="rounded-full bg-red-500 w-1.5 h-1.5 shadow-[0_0_6px_rgba(239,68,68,0.6)]"></div>Rec
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