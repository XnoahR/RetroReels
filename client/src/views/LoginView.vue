<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import LoginAudioPlayer from '@/components/auth/LoginAudioPlayer.vue';
import VynylCassete from '@/components/auth/VynylCassete.vue';
import DiscTape from '@/components/catalog/media/DiscTape.vue';
import { Store } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import customFetch from '@/api';
import { setAuth } from '@/stores/auth';

const router = useRouter()

const currentSong = ref(0);
const showRegister = ref(false);
const isTransitioning = ref(false);

const casseteRef = ref(null)
const showOverlay = ref(false)
const playerRef = ref(null)

const copyComputedStyles = (source, target) => {
    const computed = window.getComputedStyle(source)

    for (const property of computed) {
        target.style.setProperty(property, computed.getPropertyValue(property), computed.getPropertyPriority(property))
    }

    target.style.animation = 'none'

    Array.from(source.children).forEach((sourceChild, index) => {
        copyComputedStyles(sourceChild, target.children[index])
    })
}

const createRollingDoor = (sourceVinyl) => {
    document.querySelector('.route-rolling-door')?.remove()

    if (!document.querySelector('#route-rolling-door-style')) {
        const style = document.createElement('style')
        style.id = 'route-rolling-door-style'
        style.textContent = `
            .route-rolling-door {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                overflow: visible;
                pointer-events: none;
                isolation: isolate;
            }

            .route-rolling-cover {
                position: fixed;
                top: 0;
                /* Start at 0 to cover the whole screen and slide to the right */
                left: var(--rolling-cover-left, 0px);
                z-index: 1;
                height: 100vh;
                width: 360vw;
                background: #2a2f35;
                box-shadow: -24px 0 58px rgba(0, 0, 0, 0.42);
                will-change: translate;
            }

            .route-rolling-disc {
                position: absolute;
                z-index: 2;
                transform-origin: center;
                will-change: transform;
            }
        `
        document.head.appendChild(style)
    }

    const door = document.createElement('div')
    const vinylClone = sourceVinyl.cloneNode(true)
    // Always start the cover from the far left of the screen so it hides the entire loaded scene
    const coverLeft = 0

    door.className = 'route-rolling-door'
    door.innerHTML = '<div class="route-rolling-cover"></div>'
    door.style.setProperty('--rolling-cover-left', `${coverLeft}px`)
    vinylClone.id = 'route-rolling-vinyl'
    vinylClone.className = 'route-rolling-disc'
    copyComputedStyles(sourceVinyl, vinylClone)

    vinylClone.style.position = 'fixed'
    vinylClone.style.zIndex = '2'
    vinylClone.style.pointerEvents = 'none'
    vinylClone.style.willChange = 'transform'

    door.appendChild(vinylClone)
    document.body.appendChild(door)
    return door
}

const rollDoor = (door) => {
    const disc = door?.querySelector('.route-rolling-disc')
    const cover = door?.querySelector('.route-rolling-cover')
    if (!door || !disc) return

    const startTransform = disc.style.transform || window.getComputedStyle(disc).transform || 'none'
    const duration = 2100
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
    const travel = '200vw'
    const rotation = '190deg'

    cover?.animate(
        [
            { translate: '0 0' },
            { translate: `${travel} 0` },
        ],
        {
            duration,
            easing,
            fill: 'forwards',
        },
    )

    disc.style.transform = startTransform

    disc.animate(
        [
            { translate: '0 0', rotate: '0deg' },
            { translate: `${travel} 0`, rotate: rotation },
        ],
        {
            duration,
            easing,
            fill: 'forwards',
        },
    )
}

const GoToHome = () => {
    if (!casseteRef.value || !playerRef.value) {
        router.push({ name: 'Home' });
        return;
    }

    showOverlay.value = true
    casseteRef.value.triggerExit()
    playerRef.value.fadeOut(1100)
    setTimeout(() => {
        const vinyl = document.querySelector('#cassete-vynyl')
        const door = vinyl ? createRollingDoor(vinyl) : null
        router.push({ name: 'Home' }).then(() => {
            requestAnimationFrame(() => {
                rollDoor(door)
            })
            setTimeout(() => door?.remove(), 1950)
        })
    }, 1040)
}

const nextSong = () => {
    currentSong.value = (currentSong.value + 1) % songList.length;
}
const previousSong = () => {
    currentSong.value = currentSong.value === 0 ? songList.length - 1 : currentSong.value - 1;
}

const switchToRegister = (e) => {
    e.preventDefault();
    showRegister.value = true;
    errorMessage.value = '';
}

const switchToLogin = (e) => {
    e.preventDefault();
    showRegister.value = false;
    errorMessage.value = '';
}

const loginEmail = ref('');
const loginPassword = ref('');
const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

// Auto-clear errors when user types
watch([loginEmail, loginPassword, registerName, registerEmail, registerPassword, confirmPassword], () => {
    errorMessage.value = '';
});

const handleLogin = async () => {
    if (!loginEmail.value || !loginPassword.value) {
        errorMessage.value = 'User ID and Access Key are required.';
        return;
    }

    try {
        errorMessage.value = '';
        const { data } = await customFetch.post('auth/login', {
            email: loginEmail.value,
            password: loginPassword.value,
        });
        
        setAuth(data.token, data.user);
        GoToHome();
    } catch (err) {
        errorMessage.value = err.response?.data?.message || err.message;
    }
}

const handleRegister = async () => {
    if (!registerName.value) {
        errorMessage.value = 'Display Name is required.';
        return;
    }
    if (!registerEmail.value || !registerEmail.value.includes('@')) {
        errorMessage.value = 'Valid User ID (Email) is required.';
        return;
    }
    if (registerPassword.value.length < 6) {
        errorMessage.value = 'Access Key must be at least 6 characters.';
        return;
    }
    if (registerPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Access Keys do not match.';
        return;
    }
    
    try {
        errorMessage.value = '';
        
        const { data } = await customFetch.post('auth/register', {
            name: registerName.value,
            email: registerEmail.value,
            password: registerPassword.value,
        });
        
        setAuth(data.token, data.user);
        GoToHome();
    } catch (err) {
        errorMessage.value = err.response?.data?.message || err.message;
    }
}

const songList = reactive([
    {
        title: "モエチャッカファイア",
        titleBackgroundColor: "bg-red-500",
        artist: "エレン・ジョー",
        baseColor: "bg-black",
        borderColor: "border-white",
        discColor: "bg-red-500",
        sideColor: "bg-gray-500",
        image: "/ejm3.jpg",
        music: "/music/【ゼンゼロ】モエチャッカファイア   エレン・ジョー（CV：若山詩音）cover - 128.mp3"
    },
    {
        title: "Put Your Head on My Shoulder",
        titleBackgroundColor: "bg-red-500",
        artist: "Hu Tao",
        baseColor: "bg-red-800",
        borderColor: "border-red-400",
        discColor: "bg-red-300",
        sideColor: "bg-red-100",
        image: "/ht.png",
        music: "/music/Hu Tao - Put Your Head on My Shoulder.mp3"
    },
    {
        title: "My Sadness is Liquid-Formed  Japanese Cover",
        titleBackgroundColor: "bg-purple-500",
        artist: "Lime",
        baseColor: "bg-purple-800",
        borderColor: "border-purple-400",
        discColor: "bg-purple-300",
        sideColor: "bg-purple-100",
        image: "pasan.jpg",
        music: "/music/ChiliChill - My Sadness is Liquid-Formed  Japanese Cover - 128.mp3"
    },
    {
        title: " I Can't Stop The Loneliness",
        titleBackgroundColor: "bg-sky-500",
        artist: "ANRI",
        baseColor: "bg-sky-800",
        borderColor: "border-sky-400",
        discColor: "bg-sky-300",
        sideColor: "bg-sky-100",
        image: "her.jpg",
        music: "/music/ANRI - I Can't Stop The Loneliness - 128-1.mp3"
    },
    {
        title: " Wanderlust",
        titleBackgroundColor: "bg-gray-500",
        artist: "Metric",
        baseColor: "bg-gray-800",
        borderColor: "border-gray-400",
        discColor: "bg-black",
        sideColor: "bg-gray-100",
        image: "skizo.jpg",
        music: "/music/[Metric] - Wanderlust - 128.mp3"
    }
])
</script>


<template>
    <div class="relative">
    <button @click="GoToHome" class="absolute z-30 top-2 right-2 retro-button px-6 py-3 flex items-center space-x-2">
        <Store class="w-6 h-6" />
        <span>Shop</span>
    </button>
    <section class="w-screen h-screen flex flex-col justify-center bg-shark-950 overflow-hidden relative">
        <VynylCassete ref="casseteRef" :image="songList[currentSong].image" />
        <div class="vhs-blocker">
            <span
                class="absolute w-auto h-auto font-bold text-center border border-white bottom-64 right-32 text-4xl text-white">
                VHS </span><span
                class="absolute bg-blue-500 w-1.5-screen bottom-32 h-8 -left-6 -rotate-12 block"></span><span
                class="absolute bg-green-500 w-1.5-screen bottom-24 h-8 -left-6 -rotate-12 block"></span><span
                class="absolute bg-yellow-500 w-1.5-screen bottom-16 h-8 -left-6 -rotate-12 block"></span><span
                class="absolute bg-red-500 w-1.5-screen bottom-8 h-8 -left-6 -rotate-12 block"></span>
        </div>
        <div class="flex w-full z-10 form-fade max-w-sm mx-auto overflow-hidden retro-container lg:max-w-4xl">
            <div class="hidden retro-left-panel lg:flex lg:w-1/2 flex-col justify-evenly space-y-24 pt-24 items-center">
                <DiscTape :baseColor="songList[currentSong].baseColor" :title="songList[currentSong].title"
                    :titleBackgroundColor="songList[currentSong].titleBackgroundColor"
                    :borderColor="songList[currentSong].borderColor" :discColor="songList[currentSong].discColor"
                    :image="songList[currentSong].image" :sideColor="songList[currentSong].sideColor" />
                <LoginAudioPlayer :src="songList[currentSong].music" ref="playerRef"
                    :title="songList[currentSong].artist + ' - ' + songList[currentSong].title" @next="nextSong"
                    @previous="previousSong" />
            </div>

            <div class="w-full px-8 py-8 lg:w-1/2 relative overflow-hidden">
                <!-- Logo -->
                <div class="flex justify-center mx-auto mb-6">
                    <div class="retro-text text-3xl logo-glow terminal-flicker">RETRO REELS</div>
                </div>

                <!-- Login Form (Always Present) -->
                <div>
                    <!-- Welcome Text -->
                    <div class="text-center mb-6">
                        <div class="retro-text text-xl mb-2">ACCESS TERMINAL</div>
                        <p class="text-gray-400 text-sm uppercase tracking-wide">
                            Enter credentials to continue
                        </p>
                        <p v-if="errorMessage && !showRegister" class="text-red-500 text-xs mt-2 font-bold">{{ errorMessage }}</p>
                    </div>

                    <!-- Google Sign In -->
                    <button
                        class="retro-secondary-button flex items-center justify-center w-full mt-4 rounded-lg py-3 px-4 transition-all duration-300">
                        <div class="mr-3">
                            <svg class="w-5 h-5" viewBox="0 0 40 40">
                                <path
                                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                    fill="#FFC107" />
                                <path
                                    d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                                    fill="#FF3D00" />
                                <path
                                    d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                                    fill="#4CAF50" />
                                <path
                                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                    fill="#1976D2" />
                            </svg>
                        </div>
                        <span class="font-bold text-sm uppercase tracking-wider">Google Auth</span>
                    </button>

                    <!-- Divider -->
                    <div class="flex items-center justify-between mt-6">
                        <span class="w-1/5 border-b retro-divider"></span>
                        <span class="retro-link text-center">Manual Login</span>
                        <span class="w-1/5 border-b retro-divider"></span>
                    </div>

                    <!-- Email Input -->
                    <div class="mt-6">
                        <label class="retro-label block mb-3" for="LoggingEmailAddress">User ID</label>
                        <input id="LoggingEmailAddress" v-model="loginEmail" class="retro-input block w-full px-4 py-3 rounded-lg"
                            type="email" placeholder="user@terminal.sys" />
                    </div>

                    <!-- Password Input -->
                    <div class="mt-6">
                        <div class="flex justify-between mb-3">
                            <label class="retro-label" for="loggingPassword">Access Key</label>
                            <a href="#" class="retro-link">Reset Key?</a>
                        </div>
                        <input id="loggingPassword" v-model="loginPassword" @keyup.enter="handleLogin" class="retro-input block w-full px-4 py-3 rounded-lg"
                            type="password" placeholder="••••••••" />
                    </div>

                    <!-- Sign In Button -->
                    <div class="mt-8">
                        <button @click="handleLogin" class="retro-button w-full px-6 py-4 rounded-lg text-sm uppercase tracking-wider">
                            Initialize Session
                        </button>
                    </div>

                    <!-- Sign Up Link -->
                    <div class="flex items-center justify-between mt-6">
                        <span class="w-1/5 border-b retro-divider"></span>
                        <a href="#" @click="switchToRegister" class="retro-link text-center">Create Account</a>
                        <span class="w-1/5 border-b retro-divider"></span>
                    </div>
                </div>

                <!-- Register Form Overlay (Slides Down) -->
                <div class="register-overlay" :class="{ 'slide-down': showRegister, 'slide-up': !showRegister }">
                    <!-- Logo -->
                    <div class="flex justify-center mx-auto mb-6">
                        <div class="retro-text text-3xl logo-glow terminal-flicker">RETRO REELS</div>
                    </div>

                    <!-- Welcome Text -->
                    <div class="text-center mb-6">
                        <div class="retro-text text-xl mb-2">NEW USER REGISTRATION</div>
                        <p class="text-gray-400 text-sm uppercase tracking-wide">
                            Create your access credentials
                        </p>
                        <p v-if="errorMessage && showRegister" class="text-red-500 text-xs mt-2 font-bold">{{ errorMessage }}</p>
                    </div>

                    <!-- Name Input -->
                    <div class="mt-4">
                        <label class="retro-label block mb-2" for="registerName">Display Name</label>
                        <input id="registerName" v-model="registerName" class="retro-input block w-full px-4 py-2 rounded-lg" type="text"
                            placeholder="Alex Retro" />
                    </div>

                    <!-- Email Input -->
                    <div class="mt-4">
                        <label class="retro-label block mb-2" for="registerEmail">User ID</label>
                        <input id="registerEmail" v-model="registerEmail" class="retro-input block w-full px-4 py-2 rounded-lg" type="email"
                            placeholder="user@terminal.sys" />
                    </div>

                    <!-- Password Input -->
                    <div class="mt-4">
                        <label class="retro-label block mb-2" for="registerPassword">Access Key</label>
                        <input id="registerPassword" v-model="registerPassword" class="retro-input block w-full px-4 py-2 rounded-lg"
                            type="password" placeholder="••••••••" />
                    </div>

                    <!-- Confirm Password Input -->
                    <div class="mt-4">
                        <label class="retro-label block mb-2" for="confirmPassword">Confirm Key</label>
                        <input id="confirmPassword" v-model="confirmPassword" @keyup.enter="handleRegister" class="retro-input block w-full px-4 py-2 rounded-lg"
                            type="password" placeholder="••••••••" />
                    </div>

                    <!-- Register Button -->
                    <div class="mt-6">
                        <button @click="handleRegister" class="retro-button w-full px-6 py-4 rounded-lg text-sm uppercase tracking-wider">
                            Create Account
                        </button>
                    </div>

                    <!-- Back to Login Link -->
                    <div class="flex items-center justify-between mt-4">
                        <span class="w-1/5 border-b retro-divider"></span>
                        <a href="#" @click="switchToLogin" class="retro-link text-center">Back to Login</a>
                        <span class="w-1/5 border-b retro-divider"></span>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div v-if="showOverlay" class="absolute inset-0 bg-shark-950 z-40"></div>
        </transition>
    </section>
    </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

/* Register Form Overlay - Steel Door Animation */
.register-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 2rem;
    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
    transform: translateY(-100%);
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 20;
    box-shadow:
        inset 0 -3px 0 rgba(255, 255, 255, 0.1),
        inset 0 3px 0 rgba(0, 0, 0, 0.3),
        0 8px 32px rgba(0, 0, 0, 0.6);
}

.register-overlay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    border-top: 4px solid #2d3136;
    border-bottom: 4px solid #1a202c;
    pointer-events: none;
}

.register-overlay::after {
    content: 'SECURITY ACCESS';
    position: absolute;
    bottom: 20px;
    right: 20px;
    color: rgba(226, 232, 240, 0.3);
    font-family: 'Courier Prime', 'Courier New', monospace;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 2px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    pointer-events: none;
}

.slide-down {
    transform: translateY(0);
}

.slide-up {
    transform: translateY(-100%);
}

/* Retro Container */
.retro-container {
    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
    border: 2px solid #404040;
    border-radius: 8px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    font-family: 'Courier Prime', 'Courier New', monospace;
}

/* Left Panel */
.retro-left-panel {
    background: linear-gradient(145deg, #333, #222);
    border-right: 2px solid #404040;
}

/* Text Styles */
.retro-text {
    color: #00ff41;
    text-shadow: 0 0 6px #00ff41;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Courier Prime', 'Courier New', monospace;
}

.retro-label {
    color: #888;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Courier Prime', 'Courier New', monospace;
}

.retro-link {
    color: #ff6b35;
    text-shadow: 0 0 4px #ff6b35;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
    font-family: 'Courier Prime', 'Courier New', monospace;
    cursor: pointer;
}

.retro-link:hover {
    color: #ff7849;
    text-shadow: 0 0 8px #ff7849;
}

/* Input Styles */
.retro-input {
    background: #0a0a0a;
    border: 2px inset #333;
    color: #00ff41;
    font-family: 'Courier Prime', 'Courier New', monospace;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-shadow: 0 0 4px #00ff41;
}

.retro-input:focus {
    outline: none;
    border-color: #00ff41;
    box-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
}

.retro-input::placeholder {
    color: #555;
    text-shadow: none;
}

/* Button Styles */
.retro-button {
    background: linear-gradient(145deg, #ff6b35, #e55a2b);
    border: 2px solid #ff6b35;
    color: white;
    font-family: 'Courier Prime', 'Courier New', monospace;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.retro-button:hover {
    background: linear-gradient(145deg, #ff7849, #f06439);
    box-shadow: 0 0 16px rgba(255, 107, 53, 0.5);
    transform: translateY(-1px);
}

.retro-button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);
}

.retro-secondary-button {
    background: linear-gradient(145deg, #404040, #2a2a2a);
    border: 2px solid #555;
    color: #ccc;
    font-family: 'Courier Prime', 'Courier New', monospace;
    transition: all 0.2s ease;
}

.retro-secondary-button:hover {
    background: linear-gradient(145deg, #505050, #3a3a3a);
    border-color: #666;
    color: #fff;
}

/* Effects */
.retro-divider {
    border-color: #404040;
}

.logo-glow {
    filter: drop-shadow(0 0 8px #00ff41);
}

.terminal-flicker {
    animation: flicker 2s infinite alternate;
}

@keyframes flicker {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}

/* Original VHS Animation Styles */
.vhs-blocker::before {
    content: "";
    background: #2a2f35;
    position: absolute;
    right: -50px;
    bottom: -200px;
    rotate: 170deg;
    width: 100%;
    height: 33%;
    z-index: 10;
    animation: slide-up 1s ease-in forwards;
    pointer-events: none;
}

.form-fade {
    animation: fade-in 1s ease-in forwards;
}

@keyframes slide-up {
    0% {
        transform: translateX(-50vh);
    }

    100% {
        transform: translateX(-225vh);
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes scale-up {
    0% {
        width: 0;
    }

    100% {
        width: 9rem;
    }
}

.store-button-anim {
    animation: scale-up 0.45s linear forwards;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
