<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { Play, Pause, Square, SkipBack, SkipForward } from "lucide-vue-next";
// Login Audio Player
const props = defineProps({
    src: { type: String, required: true },
    title: { type: String, default: "Unknown Track" }
});


const emit = defineEmits(['next', 'previous'])

const nextSong = () => {
    emit('next')
    nextTick(() => {
        if (audio.value) {
            audio.value.play();
            isPlaying.value = true;
        }
    });
}
const previousSong = () => {
    audio.value.play();
    emit('previous')
    nextTick(() => {
        if (audio.value) {
            audio.value.play();
            isPlaying.value = true;
        }
    });
}

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(true);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.7);

onMounted(() => {
    if (!audio.value) return;
    audio.value.play();
    audio.value.addEventListener("loadedmetadata", () => {
        duration.value = audio.value!.duration;
    });

    audio.value.addEventListener("timeupdate", () => {
        currentTime.value = audio.value!.currentTime;
    });

    audio.value.addEventListener("ended", () => {
        isPlaying.value = false;
    });
});


const togglePlay = () => {
    if (!audio.value) return;
    if (isPlaying.value) {
        audio.value.pause();
    } else {
        audio.value.play();
    }
    isPlaying.value = !isPlaying.value;
};

const stopAudio = () => {
    if (!audio.value) return;
    audio.value.pause();
    audio.value.currentTime = 0;
    isPlaying.value = false;
};

const seekAudio = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!audio.value) return;
    currentTime.value = parseFloat(target.value);
    audio.value.currentTime = currentTime.value;
};

const setVolume = (event: Event) => {
    const target = event.target as HTMLInputElement;
    volume.value = parseFloat(target.value);
    if (audio.value) {
        audio.value.volume = volume.value;
    }
};

const isDragging = ref(false);

const calculateVolumeFromKnob = (event: MouseEvent, knob: HTMLElement) => {
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    // Calculate angle (-135° to +135°, 270° total range)
    let angle = Math.atan2(y, x);
    angle = angle * 180 / Math.PI; // Convert to degrees

    // Normalize to 0-270 range starting from -135°
    if (angle < -135) angle += 360;
    if (angle > 135) angle = 135;

    const normalizedAngle = (angle + 135) / 270; // 0 to 1
    return Math.max(0, Math.min(1, normalizedAngle));
};

const handleKnobClick = (event: MouseEvent) => {
    const knob = event.currentTarget as HTMLElement;
    const newVolume = calculateVolumeFromKnob(event, knob);
    volume.value = newVolume;
    if (audio.value) {
        audio.value.volume = newVolume;
    }
};

const handleKnobMouseDown = (event: MouseEvent) => {
    isDragging.value = true;
    event.preventDefault();
};

const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value) return;

    const knob = document.querySelector('.volume-knob') as HTMLElement;
    if (!knob) return;

    const newVolume = calculateVolumeFromKnob(event, knob);
    volume.value = newVolume;
    if (audio.value) {
        audio.value.volume = newVolume;
    }
};

const handleMouseUp = () => {
    isDragging.value = false;
};

// Add global mouse listeners in onMounted
onMounted(() => {

    if (!audio.value) return;

    audio.value.play()
    audio.value.addEventListener("loadedmetadata", () => {
        duration.value = audio.value!.duration;
    });

    audio.value.addEventListener("timeupdate", () => {
        currentTime.value = audio.value!.currentTime;
    });

    audio.value.addEventListener("ended", () => {
        isPlaying.value = false;
    });

    // Global mouse listeners for knob dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

const formatTime = (time: number) => {
    const min = Math.floor(time / 60) || 0;
    const sec = Math.floor(time % 60) || 0;
    return `${min}:${sec.toString().padStart(2, "0")}`;
};
</script>

<template>
    <div class="retro-player">
        <!-- Display Screen -->
        <div class="display-screen">
            <div class="track-info">
                <div class="track-title-container">
                    <div class="track-title">{{ title }}</div>
                </div>
            </div>
            <div class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
            <input type="range" min="0" :max="duration" step="0.1" :value="currentTime" @input="seekAudio"
                class="progress-bar" />
        </div>

        <!-- Control Panel -->
        <div class="control-panel">
            <!-- Transport Controls -->
            <div class="transport-controls">
                <button @click="previousSong" class="control-btn secondary">
                    <SkipBack :size="16" />
                </button>
                <button @click="togglePlay" class="control-btn primary">
                    <component :is="isPlaying ? Pause : Play" :size="20" />
                </button>
                <button @click="stopAudio" class="control-btn secondary">
                    <Square :size="16" />
                </button>
                <button @click="nextSong" class="control-btn secondary">
                    <SkipForward :size="16" />
                </button>
            </div>

            <!-- Volume Control -->
            <div class="volume-section">
                <span class="volume-label">VOL</span>

                <!-- Volume Knob -->
                <div class="volume-knob-container">
                    <div class="volume-knob" @click="handleKnobClick" @mousedown="handleKnobMouseDown">
                        <!-- Volume Arc Background -->
                        <svg width="36" height="36" viewBox="0 0 36 36" class="knob-svg">
                            <!-- Background arc -->
                            <path d="M 9 27 A 13 13 0 1 1 27 27" stroke="#333" stroke-width="2" fill="none"
                                stroke-linecap="round" />
                            <!-- Volume arc -->
                            <path d="M 9 27 A 13 13 0 1 1 27 27" stroke="#00ff41" stroke-width="2" fill="none"
                                stroke-linecap="round" :stroke-dasharray="`${volume * 40.8} 40.8`" class="volume-arc" />
                        </svg>

                        <!-- Knob Handle -->
                        <div class="knob-handle" :style="{ transform: `rotate(${(volume * 270) - 135}deg)` }">
                            <div class="knob-indicator"></div>
                        </div>
                    </div>
                </div>

                <span class="volume-value">{{ Math.round(volume * 100) }}</span>
            </div>
        </div>

        <!-- Hidden Audio Element -->
        <audio ref="audio" :src="src"></audio>
    </div>
</template>

<style scoped>
.retro-player {
    width: 100%;
    max-width: 400px;
    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
    border: 2px solid #404040;
    border-radius: 8px;
    padding: 20px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    font-family: 'Courier New', monospace;
}

/* Display Screen */
.display-screen {
    background: #0a0a0a;
    border: 2px inset #333;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60px;
}

.track-info {
    flex: 1;
    overflow: hidden;
}

.track-title-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
}

.track-title {
    color: #00ff41;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 8px #00ff41;
    display: inline-block;
    animation: marquee 8s linear infinite;
}

@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

.track-artist {
    color: #888;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.time-display {
    color: #ff6b35;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 0 6px #ff6b35;
}

/* Progress Bar */
.progress-section {
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: #333;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
}

.progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: linear-gradient(145deg, #ff6b35, #e55a2b);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.6);
}

.progress-bar::-webkit-slider-track {
    background: linear-gradient(to right, #00ff41 0%, #00ff41 var(--progress, 0%), #333 var(--progress, 0%));
    height: 6px;
    border-radius: 3px;
}

/* Control Panel */
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.transport-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.control-btn {
    background: linear-gradient(145deg, #404040, #2a2a2a);
    border: 1px solid #555;
    border-radius: 4px;
    padding: 8px;
    color: #ccc;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    background: linear-gradient(145deg, #505050, #3a3a3a);
    border-color: #666;
    color: #fff;
}

.control-btn.primary {
    background: linear-gradient(145deg, #ff6b35, #e55a2b);
    border-color: #ff6b35;
    color: white;
    padding: 12px;
}

.control-btn.primary:hover {
    background: linear-gradient(145deg, #ff7849, #f06439);
    box-shadow: 0 0 12px rgba(255, 107, 53, 0.4);
}

.control-btn:active {
    transform: translateY(1px);
}

/* Volume Section */
.volume-section {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    max-width: 140px;
}

.volume-label {
    color: #888;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
}

/* Volume Knob */
.volume-knob-container {
    position: relative;
}

.volume-knob {
    width: 36px;
    height: 36px;
    background: transparent;
    border: 2px solid #404040;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.volume-knob:hover {
    border-color: #555;
    box-shadow: 0 0 8px rgba(0, 255, 65, 0.2);
}

.knob-svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.volume-arc {
    filter: drop-shadow(0 0 3px #00ff41);
    transition: stroke-dasharray 0.1s ease;
}

.knob-handle {
    width: 22px;
    height: 22px;
    background: linear-gradient(145deg, #505050, #3a3a3a);
    border: 1px solid #666;
    border-radius: 50%;
    position: relative;
    transition: transform 0.1s ease;
    pointer-events: none;
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.3),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.knob-indicator {
    width: 2px;
    height: 6px;
    background: linear-gradient(180deg, #ff6b35, #e55a2b);
    border-radius: 1px;
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 3px rgba(255, 107, 53, 0.8);
}

.volume-knob:active .knob-handle {
    background: linear-gradient(145deg, #454545, #353535);
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.4),
        inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.volume-value {
    color: #00ff41;
    font-size: 10px;
    font-weight: bold;
    min-width: 20px;
    text-align: right;
    text-shadow: 0 0 4px #00ff41;
}
</style>