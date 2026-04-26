<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 pt-16 pb-32 px-4 sm:px-6 lg:px-8 text-white relative">
      
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-serenade-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10 pt-8">
        
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-widest text-white drop-shadow-md">Account Hub</h1>
          <p class="text-gray-400 mt-2 font-bold tracking-widest text-sm uppercase">Manage your profile, preferences, and analog audio settings</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Sidebar Navigation -->
          <div class="w-full lg:w-1/4 shrink-0 space-y-2">
            <button 
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 border"
              :class="activeTab === tab.id 
                ? 'bg-serenade-500/10 text-serenade-400 border-serenade-500/30 shadow-[0_0_15px_rgba(245,143,66,0.1)]' 
                : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'"
            >
              <component :is="tab.icon" class="w-5 h-5" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 bg-shark-900/40 border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-10 backdrop-blur-xl min-h-[600px]">
            
            <transition name="fade" mode="out-in">
              <!-- Profile Panel -->
              <div v-if="activeTab === 'profile'" key="profile" class="space-y-10">
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-b border-white/10 pb-8">
                  <div class="relative group cursor-pointer">
                    <div class="w-28 h-28 rounded-full border-2 border-serenade-500/50 p-1">
                      <div class="w-full h-full rounded-full bg-shark-800 overflow-hidden relative">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RetroReels" alt="Avatar" class="w-full h-full object-cover opacity-80" />
                         <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <Camera class="w-6 h-6 text-white" />
                         </div>
                      </div>
                    </div>
                    <div class="absolute bottom-0 right-0 w-8 h-8 bg-serenade-500 rounded-full border-4 border-shark-900 flex items-center justify-center shadow-[0_0_10px_rgba(245,143,66,0.5)]">
                      <Check class="w-4 h-4 text-black" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-2xl font-black text-white mb-1">Alex Retro</h2>
                    <p class="text-gray-400 font-bold text-sm tracking-widest mb-3">alex.retro@example.com</p>
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold uppercase tracking-widest">
                      <Crown class="w-3.5 h-3.5" /> Premium Audiophile
                    </span>
                  </div>
                </div>

                <div class="space-y-6">
                  <h3 class="text-lg font-black uppercase tracking-widest text-white border-l-4 border-serenade-500 pl-3">Personal Info</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-xs font-bold uppercase tracking-widest text-gray-500">Username</label>
                      <input type="text" value="Alex Retro" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-serenade-500/50 focus:ring-1 focus:ring-serenade-500/50 outline-none transition-all" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                      <input type="email" value="alex.retro@example.com" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-serenade-500/50 focus:ring-1 focus:ring-serenade-500/50 outline-none transition-all" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold uppercase tracking-widest text-gray-500">Location</label>
                      <input type="text" value="Tokyo, Japan" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-serenade-500/50 focus:ring-1 focus:ring-serenade-500/50 outline-none transition-all" />
                    </div>
                  </div>
                  <button class="px-6 py-3 rounded-xl bg-serenade-500 text-black font-black uppercase tracking-widest text-xs hover:bg-serenade-400 transition-colors shadow-[0_0_20px_rgba(245,143,66,0.3)]">Save Changes</button>
                </div>
              </div>

              <!-- Audio Settings Panel -->
              <div v-else-if="activeTab === 'audio'" key="audio" class="space-y-10">
                <div>
                  <h2 class="text-2xl font-black text-white mb-2">Analog Configuration</h2>
                  <p class="text-gray-400 text-sm font-medium">Fine-tune your hardware emulation and playback quality.</p>
                </div>

                <div class="space-y-8">
                  <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <h4 class="text-white font-bold tracking-widest uppercase text-sm mb-1">Streaming Quality</h4>
                        <p class="text-xs text-gray-500">Higher quality consumes more bandwidth.</p>
                      </div>
                      <Radio class="w-6 h-6 text-serenade-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button v-for="q in ['Standard', 'High', 'Lossless']" :key="q" @click="quality = q" class="px-4 py-3 rounded-xl border text-sm font-bold tracking-widest uppercase transition-all" :class="quality === q ? 'bg-serenade-500/20 border-serenade-500/50 text-serenade-300 shadow-[0_0_15px_rgba(245,143,66,0.1)]' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'">
                        {{ q }}
                      </button>
                    </div>
                  </div>

                  <div class="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-white font-bold tracking-widest uppercase text-sm mb-1">Hardware Crackle & Hiss</h4>
                        <p class="text-xs text-gray-500">Enable realistic vinyl pops and cassette tape hiss.</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="hardwareNoise" class="sr-only peer">
                        <div class="w-11 h-6 bg-shark-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-serenade-500"></div>
                      </label>
                    </div>
                    
                    <div class="flex items-center justify-between border-t border-white/5 pt-6">
                      <div>
                        <h4 class="text-white font-bold tracking-widest uppercase text-sm mb-1">Seamless Transitions</h4>
                        <p class="text-xs text-gray-500">Crossfade between tracks smoothly.</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="crossfade" class="sr-only peer">
                        <div class="w-11 h-6 bg-shark-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-serenade-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preferences Panel -->
              <div v-else-if="activeTab === 'preferences'" key="preferences" class="space-y-10">
                <div>
                  <h2 class="text-2xl font-black text-white mb-2">App Preferences</h2>
                  <p class="text-gray-400 text-sm font-medium">Customize your interface and experience.</p>
                </div>

                <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
                  <h4 class="text-white font-bold tracking-widest uppercase text-sm mb-4">UI Theme</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="border border-serenade-500/50 bg-shark-950 rounded-xl p-4 cursor-pointer relative overflow-hidden group">
                      <div class="absolute inset-0 bg-serenade-500/10 group-hover:bg-serenade-500/20 transition-colors"></div>
                      <div class="w-full h-20 bg-shark-900 rounded border border-white/10 mb-3 flex items-center justify-center">
                         <div class="w-8 h-8 rounded-full bg-serenade-500 shadow-[0_0_15px_rgba(245,143,66,0.5)]"></div>
                      </div>
                      <p class="text-serenade-400 text-xs font-bold text-center tracking-widest uppercase">Dark Neon</p>
                    </div>
                    <div class="border border-white/10 bg-white rounded-xl p-4 cursor-pointer opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
                      <div class="w-full h-20 bg-gray-100 rounded border border-gray-200 mb-3 flex items-center justify-center">
                         <div class="w-8 h-8 rounded-full bg-blue-500"></div>
                      </div>
                      <p class="text-gray-800 text-xs font-bold text-center tracking-widest uppercase">Light Mode</p>
                    </div>
                    <div class="border border-white/10 bg-[#2d1b2e] rounded-xl p-4 cursor-pointer opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
                      <div class="w-full h-20 bg-[#1a0f1b] rounded border border-pink-500/30 mb-3 flex items-center justify-center">
                         <div class="w-8 h-8 rounded-full bg-pink-500"></div>
                      </div>
                      <p class="text-pink-400 text-xs font-bold text-center tracking-widest uppercase">Vaporwave</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-4 text-center">Alternative themes coming soon to Retro Reels v2.0</p>
                </div>
              </div>

              <!-- Empty State for others -->
              <div v-else :key="activeTab" class="h-full flex flex-col items-center justify-center text-center py-20 opacity-60">
                <Settings class="w-16 h-16 text-serenade-500/50 mb-4" />
                <h3 class="text-xl font-black text-white uppercase tracking-widest mb-2">Coming Soon</h3>
                <p class="text-sm text-gray-400 max-w-md">This configuration panel is currently under development. Check back later for updates!</p>
              </div>
            </transition>

          </div>
        </div>

      </div>
    </section>
  </HomeLayout>
</template>

<script setup>
import { ref } from 'vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import { User, Settings, Sliders, Bell, Shield, CreditCard, Camera, Check, Crown, Radio } from 'lucide-vue-next';

const activeTab = ref('profile');
const quality = ref('High');
const hardwareNoise = ref(true);
const crossfade = ref(false);

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'audio', label: 'Audio Config', icon: Sliders },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'billing', label: 'Subscription', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
