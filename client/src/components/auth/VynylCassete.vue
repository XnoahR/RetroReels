<template>
  <div
    id="cassete-vynyl"
    :class="[
      enter ? 'enter-animation' : '',
      spin ? 'animate-spin-slow-right' : '',
      exit ? 'exit-animation' : ''
    ]"
    class="vinyl-body hidden sm:flex absolute w-disc h-disc rounded-full -left-72 -top-64 justify-center items-center transition-transform z-50"
  >
    <div class="border border-white/10 rounded-full w-5/6 h-5/6 flex items-center justify-center vinyl-groove">
      <div class="border border-white/10 rounded-full w-5/6 h-5/6 flex items-center justify-center vinyl-groove">
        <div class="border border-white/10 rounded-full w-5/6 h-5/6 flex items-center justify-center vinyl-groove">
          <div
            class="bg-center border-2 border-[#1a1a1a] rounded-full w-4/6 h-4/6 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            :style="{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }"
          >
            <span class="w-6 h-6 bg-[#1a1a1a] border border-gray-600 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineExpose } from "vue";

const spin = ref(false);
const enter = ref(true);
const exit = ref(false);

const props = defineProps({
  image: { type: String, default: "/Yoru.jpeg" }
});

// dipanggil dari parent
const triggerExit = () => {
  spin.value = false;
  exit.value = true;
};

defineExpose({ triggerExit });

onMounted(() => {
  setTimeout(() => {
    enter.value = false;
    spin.value = true;
  }, 1000);
});
</script>

<style scoped>
@keyframes up-to-bottom {
  0% {
    transform: translate(-200px, -400px) rotate(-20deg);
  }
  50% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}
.enter-animation {
  animation: up-to-bottom 2s linear forwards;
}

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

@keyframes exit-roll {
  0% {
    transform: scale(1) translateX(0) rotate(0deg);
  }
  100% {
    transform: scale(3.45) translateX(0) rotate(180deg);
  }
}
.exit-animation {
  animation: exit-roll 1.05s ease-in forwards;
}

.vinyl-body {
  background: conic-gradient(
    #0f0f0f 0deg,
    #333333 45deg,
    #0f0f0f 90deg,
    #333333 135deg,
    #0f0f0f 180deg,
    #333333 225deg,
    #0f0f0f 270deg,
    #333333 315deg,
    #0f0f0f 360deg
  );
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.9),
    0 15px 35px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.05);
}

.vinyl-groove {
  box-shadow: 
    inset 0 0 5px rgba(0,0,0,0.6),
    0 0 2px rgba(255,255,255,0.05);
}
</style>
