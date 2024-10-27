<template>
    <div class="border-8 bg-black border-gray-400 rounded-2xl flex justify-evenly items-center animate-tape-spin"
        :class="[width, height, tapeRotation]">
        <!-- Left Disc -->
        <div class=" rounded-l-3xl overflow-hidden border-none" :class="[sideColor, sideSize]">
            <div class="  rounded-full bg-black flex items-center justify-center animate-spin-slow-left
        " :class="[discSize, discColor, discMarginLeft]">
                <div
                    class="w-1/2 h-1/2 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                    <div class="w-3/4 h-3/4 bg-white rounded-full border-2 border-dashed border-white"></div>
                </div>
            </div>
        </div>

        <!-- Center Image -->
        <div class="bg-cover border border-white rounded-xl overflow-hidden" :class="[centerWidth, centerHeight]"
            :style="{ backgroundImage: `url(${image})` }">
            <div
                class="w-full h-4 bg-gray-600 rounded-md text-center text-white text-sm flex-col justify-start items-start"
                :class="[titleSize]"
            </div>
        </div>

        <!-- Right Disc -->
        <div class=" rounded-r-3xl overflow-hidden" :class="[sideColor, sideSize]">
            <div class="  -z-10 rounded-full bg-black flex items-center justify-center"
                :class="[discSize, discColor, diskMarginRight]">
                <div
                    class="w-1/2 h-1/2 rounded-full border-2 border-dashed border-white flex items-center justify-center animate-spin-slow-right">
                    <div class="w-3/4 h-3/4 bg-white rounded-full border-2 border-dashed border-white"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, defineProps } from 'vue';

// Define props
const props = defineProps({
    width: {
        type: String,
        default: 'w-80',
    },
    height: {
        type: String,
        default: 'h-48',
    },
    tapeRotation: {
        type : String,
        default: 'rotate-45'
    },
    centerWidth: {
        type: String,
        default: 'w-32',
    },
    centerHeight: {
        type: String,
        default: 'h-20',
    },
    titleSize: {
        type: String,
        default : 'h-4'
    },
    discSize: {
        type: String,
        default: 'w-20 h-20',
    },
    discColor: {
        type: String,
        default: 'bg-black',
    },
    discMarginLeft: {
        type: String,
        default: 'ms-6'
    },
    diskMarginRight: {
        type: String,
        default: '-ms-10'
    },
    sideColor: {
        type: String,
        default: 'bg-gray-700',
    },
    image: {
        type: String,
        default: '/Yoru.jpeg',
    },
    sideSize: {
        type: String,
        default: 'w-16 h-20'
    }
});

// Extract refs from props
const { width, height, centerWidth, centerHeight, discSize, sideColor, image } = toRefs(props);
//   let currValue;
//   function calculateMargin() {
//   const sizeMatch = props.discSize.match(/(\d+)/); // Extract number from discSize (e.g., 'w-20' -> 20)
//   console.log(sizeMatch)
//   const sizeValue = sizeMatch ? parseInt(sizeMatch[1]) : 20; // Default to 20 if not found
//     currValue = `${sizeValue / 2}px`; // Half of the disc size
//    console.log(currValue)
// }
// calculateMargin()

</script>

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