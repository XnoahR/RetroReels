<template>
  <div
    id="cassete-vynyl"
    :class="[
      enter ? 'enter-animation' : '',
      spin ? 'animate-spin-slow-right' : '',
      exit ? 'exit-animation' : ''
    ]"
    class="absolute w-disc h-disc rounded-full bg-black -left-72 -top-64 flex justify-center items-center transition-transform z-50"
  >
    <div class="border border-gray-800 rounded-full w-5/6 h-5/6 flex items-center justify-center">
      <div class="border border-gray-800 rounded-full w-5/6 h-5/6 flex items-center justify-center">
        <div class="border border-gray-800 rounded-full w-5/6 h-5/6 flex items-center justify-center">
          <div
            class="bg-center border border-white rounded-full w-4/6 h-4/6 flex items-center justify-center"
            :style="{ backgroundImage: `url(${image})` }"
          >
            <span class="w-5 h-5 bg-white border-2 border-black rounded-full"></span>
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
  40% {
    transform: scale(5) translateX(0) rotate(180deg);
  }
  100% {
    transform: scale(5) translateX(150vw) rotate(720deg);
  }
}
.exit-animation {
  animation: exit-roll 2.5s ease-in forwards;
}
</style>
