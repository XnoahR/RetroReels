<template>
  <HomeLayout>
    <section class="min-h-screen bg-shark-950 pt-24 pb-32 px-6">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header & Top Actions -->
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
          <div>
            <h1 class="text-4xl font-black text-white tracking-tighter mb-2">Your Library</h1>
            <p class="text-serenade-400 font-mono text-sm tracking-widest uppercase">Manage your tapes & discs</p>
          </div>
          
          <div class="flex items-center gap-4">
             <!-- View Toggle -->
             <div class="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
                <button @click="viewMode = 'grid'" class="p-2 rounded-md transition-colors" :class="viewMode === 'grid' ? 'bg-serenade-500 text-black' : 'text-gray-500 hover:text-white'" aria-label="Grid View">
                   <LayoutGrid class="w-4 h-4" />
                </button>
                <button @click="viewMode = 'list'" class="p-2 rounded-md transition-colors" :class="viewMode === 'list' ? 'bg-serenade-500 text-black' : 'text-gray-500 hover:text-white'" aria-label="List View">
                   <List class="w-4 h-4" />
                </button>
             </div>
             <!-- Fullscreen Button -->
             <button @click="toggleFullscreen" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors flex items-center gap-2 shadow-lg">
               <Maximize2 class="w-4 h-4" /> Player
             </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-8 mb-8 border-b border-white/5 pb-px overflow-x-auto snap-x hide-scrollbar">
           <button @click="activeTab = 'all'" class="pb-3 border-b-2 font-bold uppercase tracking-widest text-sm transition-colors whitespace-nowrap snap-start shrink-0" :class="activeTab === 'all' ? 'border-serenade-500 text-serenade-400' : 'border-transparent text-gray-500 hover:text-gray-300'">Playlists</button>
           <button @click="activeTab = 'favorites'" class="pb-3 border-b-2 font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2 whitespace-nowrap snap-start shrink-0" :class="activeTab === 'favorites' ? 'border-serenade-500 text-serenade-400' : 'border-transparent text-gray-500 hover:text-gray-300'"><Heart class="w-4 h-4" :class="{'fill-current': activeTab === 'favorites'}" /> Favorites</button>
           <button @click="activeTab = 'playlists'" class="pb-3 border-b-2 font-bold uppercase tracking-widest text-sm transition-colors whitespace-nowrap snap-start shrink-0" :class="activeTab === 'playlists' ? 'border-serenade-500 text-serenade-400' : 'border-transparent text-gray-500 hover:text-gray-300'">Manage</button>
        </div>

        <div v-if="libraryNotice || libraryError" class="mb-6 rounded-xl border px-4 py-3 text-sm font-bold" :class="libraryError ? 'border-red-400/30 bg-red-500/10 text-red-200' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'">
          {{ libraryError || libraryNotice }}
        </div>

        <!-- TAB CONTENT: ALL MEDIA & FAVORITES -->
        <div v-if="activeTab === 'all' || activeTab === 'favorites'">
           <div v-if="activeTab === 'all' && !openedLibraryId" class="mb-8">
              <div class="mb-4 flex items-center justify-between gap-4">
                 <h2 class="text-xl font-black uppercase tracking-widest text-white">Playlists</h2>
                 <button class="rounded-lg border border-dashed border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 transition hover:border-serenade-500/40 hover:text-white" @click="activeTab = 'playlists'">
                    <Plus class="mr-1 inline h-3 w-3" /> New Playlist
                 </button>
              </div>
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                <button
                  class="group text-left"
                  @click="openLibrary('all')"
                >
                  <div class="relative aspect-square overflow-hidden rounded-lg border bg-shark-900 transition group-hover:-translate-y-1 group-hover:border-serenade-500/50" :class="selectedLibraryId === 'all' ? 'border-serenade-500/70 shadow-lg shadow-serenade-500/10' : 'border-white/5'">
                    <div class="grid h-full w-full grid-cols-2 grid-rows-2">
                      <div v-for="(cover, index) in allMusicCoverCells" :key="`all-${index}`" class="min-h-0 min-w-0 border border-black/20 bg-white/5">
                        <img v-if="cover" :src="cover" class="h-full w-full object-cover" />
                        <div v-else class="flex h-full w-full items-center justify-center text-gray-700">
                          <ListMusic class="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 class="mt-3 truncate font-bold text-white group-hover:text-serenade-400">All Musics</h3>
                  <p class="text-xs font-mono uppercase tracking-widest text-gray-500">{{ tracks.length }} Tracks</p>
                </button>
                <button
                  v-for="playlist in playlists"
                  :key="playlist.id"
                  class="group text-left"
                  @click="openLibrary(playlist.id)"
                >
                  <div class="relative aspect-square overflow-hidden rounded-lg border bg-shark-900 transition group-hover:-translate-y-1 group-hover:border-serenade-500/50" :class="selectedLibraryId === playlist.id ? 'border-serenade-500/70 shadow-lg shadow-serenade-500/10' : 'border-white/5'">
                    <div class="grid h-full w-full grid-cols-2 grid-rows-2">
                      <div v-for="(cover, index) in playlistCoverCells(playlist)" :key="`${playlist.id}-${index}`" class="min-h-0 min-w-0 border border-black/20 bg-white/5">
                        <img v-if="cover" :src="cover" class="h-full w-full object-cover" />
                        <div v-else class="flex h-full w-full items-center justify-center text-gray-700">
                          <ListMusic class="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 class="mt-3 truncate font-bold text-white group-hover:text-serenade-400">{{ playlist.name }}</h3>
                  <p class="text-xs font-mono uppercase tracking-widest text-gray-500">{{ playlist.items?.length || 0 }} Tracks</p>
                </button>
              </div>
           </div>
           <div v-if="activeTab === 'all' && openedLibraryId" class="mb-6 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/25 px-4 py-3">
              <div class="min-w-0">
                <p class="text-xs font-mono uppercase tracking-widest text-gray-500">Now Browsing</p>
                <h2 class="truncate text-xl font-black text-white">{{ openedLibraryTitle }}</h2>
              </div>
              <button class="rounded-lg border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 transition hover:border-serenade-500/40 hover:text-white" @click="closeLibrary">
                Back
              </button>
           </div>

           <div v-if="activeTab === 'favorites' || openedLibraryId">
           <div v-if="displayedTracks.length === 0" class="py-12 text-center">
              <p class="text-gray-500 font-mono tracking-widest uppercase">{{ libraryMessage }}</p>
           </div>

           <!-- Grid View -->
           <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <div 
                v-for="track in displayedTracks" :key="track.id"
                @click="playTrack(track)"
                class="group relative overflow-hidden rounded-2xl border border-white/5 bg-shark-900 transition-all hover:-translate-y-1 hover:border-serenade-500/50 hover:shadow-xl hover:shadow-serenade-500/10 cursor-pointer"
                :class="{ 'border-serenade-500 shadow-lg shadow-serenade-500/20': currentTrack.id === track.id }"
              >
                <div class="aspect-square overflow-hidden bg-shark-950 relative">
                   <img :src="track.image" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                   <div v-if="currentTrack.id === track.id" class="absolute inset-0 bg-serenade-500/20 backdrop-blur-[1px] flex items-center justify-center">
                      <Volume2 class="w-12 h-12 text-white animate-pulse" />
                   </div>
                </div>
                <div class="p-5">
                  <div class="mb-3 flex items-start justify-between gap-2">
                    <h3 class="font-bold text-white leading-tight group-hover:text-serenade-400 transition-colors line-clamp-1">{{ track.title }}</h3>
                    <span class="shrink-0 rounded bg-white/5 px-2 py-1 font-mono text-[9px] font-bold text-serenade-400 border border-white/10 uppercase tracking-widest">{{ track.format }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                     <div class="truncate">
                        <p class="text-sm text-gray-400 truncate">{{ track.artist }}</p>
                        <p class="text-xs text-gray-500 font-mono mt-1">{{ track.duration }}</p>
                     </div>
                     <div class="flex items-center gap-2 shrink-0">
                        <select v-if="playlists.length" class="max-w-24 rounded bg-black/50 px-2 py-1 text-[10px] text-gray-300 outline-none" @click.stop @change.stop="addTrackToPlaylist(track, $event.target.value); $event.target.value = ''">
                          <option value="">Playlist</option>
                          <option v-for="playlist in playlists" :key="playlist.id" :value="playlist.id">{{ playlist.name }}</option>
                        </select>
                        <button @click.stop="toggleFavorite(track)" class="text-gray-500 hover:text-white transition-colors">
                           <Heart class="w-5 h-5" :class="{'fill-serenade-400 text-serenade-400': isFavorite(track)}" />
                        </button>
                     </div>
                  </div>
                </div>
              </div>
           </div>

           <!-- List View (Mini List) -->
           <div v-if="viewMode === 'list'" class="flex flex-col gap-2">
              <div 
                v-for="track in displayedTracks" :key="track.id"
                @click="playTrack(track)"
                class="group flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-shark-900/50 hover:bg-shark-800 transition-all cursor-pointer"
                :class="{ 'border-serenade-500/50 bg-serenade-500/10 shadow-[inset_0_0_15px_rgba(245,143,66,0.1)]': currentTrack.id === track.id }"
              >
                <!-- Mini Cover -->
                <div class="w-12 h-12 rounded overflow-hidden relative shrink-0 border border-white/5">
                   <img :src="track.image" class="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                   <div v-if="currentTrack.id === track.id" class="absolute inset-0 bg-serenade-500/30 flex items-center justify-center backdrop-blur-[1px]">
                      <Volume2 class="w-5 h-5 text-white animate-pulse" />
                   </div>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0 flex items-center justify-between">
                   <div class="truncate pr-4">
                      <h3 class="font-bold text-base text-white truncate group-hover:text-serenade-400 transition-colors">{{ track.title }}</h3>
                      <p class="text-xs text-gray-400 truncate mt-0.5">{{ track.artist }}</p>
                   </div>
                   <div class="flex items-center gap-6 shrink-0">
                      <span class="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] font-bold text-serenade-400 border border-white/10 uppercase tracking-widest hidden sm:inline-block">{{ track.format }}</span>
                      <span class="text-sm font-mono text-gray-500 w-12 text-right">{{ track.duration }}</span>
                      <select v-if="playlists.length" class="rounded bg-black/50 px-2 py-1 text-[10px] text-gray-300 outline-none" @click.stop @change.stop="addTrackToPlaylist(track, $event.target.value); $event.target.value = ''">
                        <option value="">Playlist</option>
                        <option v-for="playlist in playlists" :key="playlist.id" :value="playlist.id">{{ playlist.name }}</option>
                      </select>
                      <button @click.stop="toggleFavorite(track)" class="text-gray-500 hover:text-white transition-colors p-1">
                         <Heart class="w-5 h-5" :class="{'fill-serenade-400 text-serenade-400': isFavorite(track)}" />
                      </button>
                   </div>
                </div>
              </div>
           </div>
           </div>
        </div>

        <!-- TAB CONTENT: PLAYLISTS -->
        <div v-if="activeTab === 'playlists'">
           <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white">Your Playlists</h2>
              <button @click="createPlaylist" class="px-4 py-2.5 bg-serenade-500 hover:bg-serenade-400 text-black font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors shadow-lg">
                 <Plus class="w-4 h-4" /> Create Playlist
              </button>
           </div>

           <div class="mb-6 rounded-xl border border-white/5 bg-black/30 p-4">
              <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Playlist Name</label>
              <input v-model="newPlaylistName" class="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-serenade-500/60" placeholder="Night Drive Mix" />
           </div>
           
           <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div v-for="playlist in playlists" :key="playlist.id" @click="selectPlaylist(playlist)" class="group relative overflow-hidden rounded-2xl border border-white/5 bg-shark-900 transition-all hover:-translate-y-1 hover:border-serenade-500/30 hover:shadow-xl cursor-pointer p-6 flex flex-col items-center justify-center min-h-[200px] text-center" :class="selectedPlaylistId === playlist.id ? 'border-serenade-500/60' : ''">
                 <button class="absolute right-3 top-3 rounded-lg border border-white/10 p-2 text-gray-600 opacity-0 transition hover:border-red-400/40 hover:text-red-300 group-hover:opacity-100" @click.stop="deletePlaylist(playlist)" aria-label="Delete playlist">
                    <Trash2 class="h-4 w-4" />
                 </button>
                 <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-serenade-500 group-hover:text-black transition-colors text-gray-400 shadow-inner">
                    <ListMusic class="w-8 h-8" />
                 </div>
                 <h3 class="font-bold text-white mb-1 group-hover:text-serenade-400 transition-colors">{{ playlist.name }}</h3>
                 <p class="text-xs text-gray-500 uppercase tracking-widest font-mono">{{ playlist.items?.length || 0 }} Tracks</p>
              </div>

              <p v-if="!playlists.length" class="col-span-full py-12 text-center text-gray-500 font-mono tracking-widest uppercase">No playlists yet.</p>
           </div>

           <div v-if="selectedPlaylist" class="mt-8 grid gap-6 lg:grid-cols-2">
              <section class="rounded-2xl border border-white/5 bg-black/25 p-5">
                <h3 class="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">{{ selectedPlaylist.name }} Tracks</h3>
                <div v-if="selectedPlaylistTracks.length" class="flex flex-col gap-2">
                   <div v-for="track in selectedPlaylistTracks" :key="track.id" class="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 p-3 text-left hover:border-serenade-500/40">
                      <button class="flex min-w-0 flex-1 items-center gap-3 text-left" @click="playTrack(track, selectedPlaylistTracks)">
                        <img :src="track.image" class="h-12 w-12 rounded object-cover" />
                        <span class="min-w-0 flex-1">
                          <span class="block truncate font-bold text-white">{{ track.title }}</span>
                          <span class="block truncate text-xs text-gray-500">{{ track.artist }}</span>
                        </span>
                      </button>
                      <button class="rounded-lg border border-white/10 p-2 text-gray-500 transition hover:border-red-400/40 hover:text-red-300" @click="removeTrackFromPlaylist(track, selectedPlaylist.id)" aria-label="Remove from playlist">
                        <Trash2 class="h-4 w-4" />
                      </button>
                   </div>
                </div>
                <p v-else class="rounded-xl border border-dashed border-white/10 py-8 text-center text-xs font-mono uppercase tracking-widest text-gray-500">This playlist is empty.</p>
              </section>

              <section class="rounded-2xl border border-white/5 bg-black/25 p-5">
                <h3 class="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Add Owned Tracks</h3>
                <div v-if="availablePlaylistTracks.length" class="flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
                   <div v-for="track in availablePlaylistTracks" :key="track.id" class="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 p-3">
                      <img :src="track.image" class="h-12 w-12 rounded object-cover" />
                      <span class="min-w-0 flex-1">
                        <span class="block truncate font-bold text-white">{{ track.title }}</span>
                        <span class="block truncate text-xs text-gray-500">{{ track.artist }}</span>
                      </span>
                      <button class="rounded-lg bg-serenade-500 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black transition hover:bg-serenade-400" @click="addTrackToPlaylist(track, selectedPlaylist.id)">
                        Add
                      </button>
                   </div>
                </div>
                <p v-else class="rounded-xl border border-dashed border-white/10 py-8 text-center text-xs font-mono uppercase tracking-widest text-gray-500">All owned tracks are in this playlist.</p>
              </section>
           </div>

           <div v-else-if="playlists.length" class="mt-8 rounded-xl border border-dashed border-white/10 py-8 text-center text-xs font-mono uppercase tracking-widest text-gray-500">
              Select a playlist to manage tracks.
           </div>
        </div>

      </div>

      <!-- The Audio Player (Exact style as HomeView) -->
      <Teleport to="body">
        <aside v-if="showMiniPlayer" class="mini-player" aria-label="Audio player">
          <div class="mini-main">
            <div class="mini-screen cursor-pointer" @click="toggleFullscreen">
              <div class="mini-track">
                <span>{{ isPlaying ? 'Now Playing' : 'Ready' }} / {{ currentTrack.artist }} - {{ currentTrack.title }}</span>
              </div>
              <div class="mini-time">{{ formatTime(currentTime) }} / {{ currentTrack.duration }}</div>
            </div>

            <input
              class="mini-range mini-seek"
              type="range"
              min="0"
              max="100"
              step="0.1"
              :value="progress"
              :style="{ '--range-fill': `${progress}%` }"
              aria-label="Seek audio"
              @input="seekCurrent"
            />

            <div class="mini-controls">
              <button type="button" class="mini-button primary" :aria-label="isPlaying ? 'Pause' : 'Play'" @click="togglePlay">
                <Pause v-if="isPlaying" class="h-4 w-4 fill-current" />
                <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
              </button>
              <button type="button" class="mini-button" aria-label="Stop" @click="stopAudio">
                <Square class="h-4 w-4 fill-current" />
              </button>
              <button type="button" class="mini-button" aria-label="Previous" @click="prevTrack">
                <SkipBack class="h-4 w-4 fill-current" />
              </button>
              <button type="button" class="mini-button" aria-label="Next" @click="nextTrack">
                <SkipForward class="h-4 w-4 fill-current" />
              </button>
              <button type="button" class="mini-button" aria-label="Shuffle" @click="randomizeQueue" :style="{ color: isRandomized ? '#ff6b35' : '' }">
                <Shuffle class="h-4 w-4" />
              </button>

              <div class="mini-volume">
                <Volume2 class="h-4 w-4" />
                <button
                  ref="volumeKnobRef"
                  type="button"
                  class="mini-knob"
                  role="slider"
                  aria-label="Volume"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuenow="volumePercent"
                  :style="{ '--knob-angle': `${volumeKnobAngle}deg` }"
                  @pointerdown="startVolumeDrag"
                  @pointermove="dragVolume"
                  @pointerup="stopVolumeDrag"
                  @pointercancel="stopVolumeDrag"
                  @lostpointercapture="stopVolumeDrag"
                >
                  <span></span>
                </button>
                <span class="mini-volume-value">{{ volumePercent }}</span>
              </div>
            </div>
          </div>

          <img class="mini-cover cursor-pointer hover:opacity-80 transition-opacity" :src="currentTrack.image" :alt="`${currentTrack.title} cover`" @click="toggleFullscreen" />
        </aside>
      </Teleport>

      <!-- FULLSCREEN THEME OVERLAY -->
      <Teleport to="body">
        <transition name="fade">
          <div v-if="isFullscreen" class="fixed inset-0 z-[2147483005] bg-[#0a0a0c] flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto overflow-x-hidden">
            <!-- Background Ambient -->
            <div class="absolute inset-0 z-0">
               <img :src="currentTrack.image" class="w-full h-full object-cover opacity-10 blur-[100px] scale-110" />
            </div>
            
            <!-- Top Nav -->
            <div class="relative z-10 flex justify-between items-start pt-4 sm:pt-0">
               <div>
                  <h3 class="text-lg sm:text-xl font-bold uppercase tracking-widest text-serenade-400">Now Playing</h3>
                  <p class="text-xs sm:text-sm font-mono text-gray-500 mt-1">{{ currentTrack.format }} FORMAT</p>
               </div>
               <button @click="toggleFullscreen" class="p-3 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 backdrop-blur">
                 <Minimize2 class="w-5 h-5 sm:w-6 sm:h-6" />
               </button>
            </div>

            <!-- Center Massive Art -->
            <div class="relative z-10 flex-1 flex items-center justify-center py-10">
               <div class="scale-100 sm:scale-100 lg:scale-[1.1] origin-center pointer-events-none w-full flex justify-center">
                  <!-- VINYL -->
                  <div v-if="currentTrack.format === 'Vinyl'" class="w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[600px] aspect-[4/3] bg-gradient-to-b from-[#1a1a20] to-[#0f0f13] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_0_rgba(255,255,255,0.1)] border border-white/10 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
                     <div class="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-gray-800 to-black shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-gray-700 flex items-center justify-center relative flex-shrink-0">
                        <div class="w-[90%] h-[90%] rounded-full bg-[#050505] flex items-center justify-center shadow-inner relative" :class="{'animate-[spin_6s_linear_infinite]': isPlaying}">
                          <div class="absolute inset-2 rounded-full border border-white/5"></div>
                          <div class="absolute inset-6 rounded-full border border-white/5"></div>
                          <div class="absolute inset-10 rounded-full border border-white/5"></div>
                          <div class="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-orange-100 overflow-hidden relative border border-white/20 shadow-inner">
                             <img :src="currentTrack.image" class="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-black rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.5)]"></div>
                          </div>
                        </div>
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 sm:w-5 h-3 sm:h-5 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.5)] z-10">
                           <div class="absolute inset-0.5 sm:inset-1 bg-white/50 rounded-full"></div>
                        </div>
                     </div>
                     <div class="absolute right-10 sm:right-16 lg:right-24 top-8 sm:top-16 w-12 sm:w-20 h-12 sm:h-20 bg-gradient-to-br from-[#222] to-[#111] rounded-full border-[2px] sm:border-[4px] border-[#333] shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center z-10">
                        <div class="w-6 sm:w-10 h-6 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-inner relative">
                           <div class="absolute inset-2 sm:inset-3 bg-black rounded-full"></div>
                        </div>
                        <div class="absolute top-1/2 left-1/2 w-2 sm:w-3 h-[160px] sm:h-[220px] lg:h-[260px] bg-gradient-to-r from-gray-300 via-white to-gray-400 origin-top shadow-[0_20px_20px_rgba(0,0,0,0.5)] transition-transform duration-[1500ms] ease-in-out rounded-t-full" 
                             :style="{ transform: isPlaying ? 'rotate(30deg)' : 'rotate(0deg)' }">
                           <div class="absolute bottom-0 -left-2 sm:-left-3 w-6 sm:w-8 h-8 sm:h-12 bg-gradient-to-b from-gray-800 to-black border border-gray-600 rounded-sm shadow-xl flex justify-end p-0.5 sm:p-1">
                              <div class="w-1 sm:w-2 h-3 sm:h-4 bg-red-500/80 rounded-sm shadow-inner"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <!-- CASSETTE -->
                  <div v-else-if="currentTrack.format === 'Cassette'" class="w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[600px] bg-gradient-to-b from-gray-800 to-[#1a1a20] rounded-lg shadow-[0_40px_80px_rgba(0,0,0,0.9),inset_0_2px_0_rgba(255,255,255,0.2)] border border-gray-700 p-4 sm:p-8 flex flex-col gap-4 sm:gap-6">
                     <div class="w-full h-40 sm:h-56 bg-[#0a0a0c] rounded-md border-[4px] sm:border-[6px] border-gray-900 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] relative flex items-center justify-center overflow-hidden">
                        <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none"></div>
                        <div class="w-[85%] sm:w-[80%] h-[75%] sm:h-[70%] bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-gray-400 p-2 sm:p-3 relative flex items-center justify-center">
                           <div class="absolute top-0 inset-x-2 sm:inset-x-4 h-2 sm:h-3 bg-gray-400/50 rounded-b shadow-inner"></div>
                           <div class="w-full h-full bg-white rounded border border-gray-300 relative overflow-hidden flex items-center justify-between px-3 sm:px-6 shadow-inner">
                              <div class="absolute inset-x-4 sm:inset-x-8 h-8 sm:h-12 bg-black/80 rounded-md top-1/2 -translate-y-1/2 flex items-center justify-between px-1 sm:px-2 border-y-2 border-white/20">
                                 <div class="w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/30" :class="{'animate-[spin_2s_linear_infinite]': isPlaying}"><div class="w-full h-0.5 sm:h-1 bg-white/80"></div><div class="w-0.5 sm:w-1 h-full bg-white/80 absolute"></div></div>
                                 <div class="w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/30" :class="{'animate-[spin_2s_linear_infinite]': isPlaying}"><div class="w-full h-0.5 sm:h-1 bg-white/80"></div><div class="w-0.5 sm:w-1 h-full bg-white/80 absolute"></div></div>
                              </div>
                              <img :src="currentTrack.image" class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
                           </div>
                           <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-3 sm:h-4 bg-gray-400 rounded-t shadow-[0_-2px_5px_rgba(0,0,0,0.2)] z-10 flex justify-between px-2 sm:px-4 items-center">
                              <div class="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                              <div class="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <!-- VHS -->
                  <div v-else class="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[600px]">
                     <div class="w-full aspect-video bg-[#050505] rounded-[24px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_1px_rgba(255,255,255,0.2)] border-[10px] sm:border-[16px] border-[#111] p-1 relative flex items-center justify-center">
                        <div class="w-full h-full rounded-[12px] sm:rounded-[16px] bg-black overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
                           <img :src="currentTrack.image" class="w-full h-full object-cover opacity-90 scale-105" :class="{'animate-[pulse_4s_ease-in-out_infinite]': isPlaying}" />
                           <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none"></div>
                           <div class="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_120%)] z-20 pointer-events-none"></div>
                           <div v-if="isPlaying" class="absolute top-4 sm:top-6 left-4 sm:left-6 text-serenade-500 font-mono text-xl sm:text-3xl font-bold tracking-widest drop-shadow-[0_0_10px_#f58f42] z-30">
                             PLAY ►
                           </div>
                        </div>
                     </div>
                     <div class="w-[90%] sm:w-full max-w-[450px] lg:max-w-[500px] h-[70px] sm:h-[100px] bg-gradient-to-b from-[#222] to-[#0a0a0c] rounded shadow-[0_20px_30px_rgba(0,0,0,0.8)] border-t border-gray-600 flex items-center px-4 sm:px-8 relative">
                        <div class="w-40 sm:w-64 h-6 sm:h-8 bg-black rounded shadow-[inset_0_5px_10px_rgba(0,0,0,0.8)] border-t border-gray-800 flex items-center justify-center relative overflow-hidden">
                           <div class="w-full h-0.5 sm:h-1 bg-gray-900 absolute top-0"></div>
                           <span class="text-[8px] sm:text-[10px] text-gray-700 font-mono tracking-widest">{{ isPlaying ? 'VHS LOADED' : 'INSERT CASSETTE' }}</span>
                        </div>
                        <div class="ml-auto bg-[#050505] border border-gray-800 rounded p-1 sm:p-2 flex items-center justify-center shadow-inner min-w-[70px] sm:min-w-[100px]">
                           <span class="text-serenade-500 font-mono text-base sm:text-xl drop-shadow-[0_0_5px_#f58f42]">{{ formatTime(currentTime) }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Bottom Giant Controls -->
            <div class="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6 pb-6">
               <div class="text-center px-4">
                  <h2 class="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-lg leading-tight">{{ currentTrack.title }}</h2>
                  <p class="text-base sm:text-xl text-serenade-400 font-bold uppercase tracking-widest mt-1 sm:mt-2 drop-shadow-md">{{ currentTrack.artist }}</p>
               </div>
               
               <div class="w-full flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono font-bold text-gray-400 mt-2 px-2 sm:px-0">
                  <span class="text-xs sm:text-base w-10 text-right">{{ formatTime(currentTime) }}</span>
                  <div class="h-1.5 sm:h-2 flex-1 bg-white/10 rounded-full cursor-pointer group relative shadow-inner" @click="seekFullscreenClick">
                    <div class="absolute inset-y-0 left-0 bg-serenade-500 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(245,143,66,0.6)] sm:shadow-[0_0_20px_rgba(245,143,66,0.6)]" :style="{ width: `${progress}%` }"></div>
                    <div class="absolute top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" :style="{ left: `calc(${progress}% - 8px)` }"></div>
                  </div>
                  <span class="text-xs sm:text-base w-10">{{ currentTrack.duration }}</span>
               </div>

               <div class="w-full flex flex-col sm:flex-row items-center justify-between mt-2 sm:mt-4 px-2 sm:px-10 gap-6 sm:gap-0">
                  <div class="w-32 hidden md:block"></div> <!-- Spacer for center alignment -->
                  
                  <div class="flex items-center justify-center gap-6 sm:gap-10">
                     <button @click="randomizeQueue" class="text-gray-500 hover:text-white transition-colors" :class="{'text-serenade-400': isRandomized}"><Shuffle class="w-5 h-5 sm:w-6 sm:h-6"/></button>
                     <button @click="prevTrack" class="text-white hover:text-serenade-400 transition-colors"><SkipBack class="w-8 h-8 sm:w-10 sm:h-10 fill-current"/></button>
                     
                     <button @click="togglePlay" class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-serenade-500 text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,143,66,0.4)] sm:shadow-[0_0_30px_rgba(245,143,66,0.4)]">
                       <Pause v-if="isPlaying" class="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                       <Play v-else class="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1 sm:ml-2" />
                     </button>

                     <button @click="nextTrack" class="text-white hover:text-serenade-400 transition-colors"><SkipForward class="w-8 h-8 sm:w-10 sm:h-10 fill-current"/></button>
                     <button @click="stopAudio" class="text-gray-500 hover:text-white transition-colors"><Square class="w-5 h-5 sm:w-6 sm:h-6 fill-current"/></button>
                  </div>

                  <!-- Fullscreen Volume Knob -->
                  <div class="mini-volume w-full sm:w-32 flex justify-center sm:justify-end transform scale-100 sm:scale-[1.3] origin-center sm:origin-right mt-4 sm:mt-0">
                     <Volume2 class="h-4 w-4" />
                     <button
                       type="button"
                       class="mini-knob"
                       role="slider"
                       aria-label="Volume"
                       aria-valuemin="0"
                       aria-valuemax="100"
                       :aria-valuenow="volumePercent"
                       :style="{ '--knob-angle': `${volumeKnobAngle}deg` }"
                       @pointerdown="startVolumeDrag"
                       @pointermove="dragVolume"
                       @pointerup="stopVolumeDrag"
                       @pointercancel="stopVolumeDrag"
                       @lostpointercapture="stopVolumeDrag"
                     >
                       <span></span>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </transition>
      </Teleport>

    </section>

    <!-- Hidden Audio -->
    <audio ref="audioRef" :src="currentTrack.audio"></audio>
  </HomeLayout>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import customFetch from '@/api';
import { Play, Pause, Square, SkipBack, SkipForward, Shuffle, Volume2, Maximize2, Minimize2, LayoutGrid, List, Heart, Plus, ListMusic, Trash2 } from 'lucide-vue-next';

defineOptions({ name: 'PlayerView' });

const route = useRoute();

const fallbackTrack = {
  id: '',
  title: 'No purchased music',
  artist: 'Buy music from the shop',
  format: 'VHS',
  duration: '0:00',
  image: '/Yoru.jpeg',
  audio: '',
};

const originalTracks = ref([]);
const tracks = ref([]);
const playbackQueue = ref([]);
const playlists = ref([]);
const favorites = ref([]);
const isLoadingLibrary = ref(false);
const libraryError = ref('');
const libraryNotice = ref('');
const newPlaylistName = ref('');
const selectedPlaylistId = ref('');
const selectedLibraryId = ref('all');
const openedLibraryId = ref('');

// View State
const viewMode = ref('grid'); // 'grid' | 'list'
const activeTab = ref('all'); // 'all' | 'favorites' | 'playlists'

const displayedTracks = computed(() => {
  if (activeTab.value === 'favorites') {
    return tracks.value.filter(t => favorites.value.includes(t.id));
  }
  if (activeTab.value === 'all' && openedLibraryId.value && openedLibraryId.value !== 'all') {
    const playlist = playlists.value.find((item) => item.id === openedLibraryId.value);
    return (playlist?.items || []).map((item) => mapProductToTrack(item.product)).filter(Boolean);
  }
  return tracks.value;
});

const selectedPlaylist = computed(() => playlists.value.find((playlist) => playlist.id === selectedPlaylistId.value));
const selectedPlaylistTracks = computed(() => (selectedPlaylist.value?.items || []).map((item) => mapProductToTrack(item.product)).filter(Boolean));
const selectedPlaylistTrackIds = computed(() => new Set((selectedPlaylist.value?.items || []).map((item) => item.productId)));
const availablePlaylistTracks = computed(() => tracks.value.filter((track) => !selectedPlaylistTrackIds.value.has(track.id)));
const allMusicCoverCells = computed(() => coverCellsFromTracks(tracks.value));
const openedLibraryTitle = computed(() => {
  if (openedLibraryId.value === 'all') return 'All Musics';
  return playlists.value.find((playlist) => playlist.id === openedLibraryId.value)?.name || 'Playlist';
});
const libraryMessage = computed(() => {
  if (isLoadingLibrary.value) return 'Loading your purchased music...';
  if (libraryError.value) return libraryError.value;
  if (activeTab.value === 'favorites') return 'No favorite purchased tracks yet.';
  if (activeTab.value === 'all' && openedLibraryId.value !== 'all') return 'No tracks in this playlist yet.';
  return 'No purchased music yet. Buy music from the shop to unlock it here.';
});

const playlistTracks = (playlist) => (playlist?.items || []).map((item) => mapProductToTrack(item.product)).filter(Boolean);
const coverCellsFromTracks = (items) => {
  const covers = items.map((track) => track.image).filter(Boolean).slice(0, 4);
  return [...covers, ...Array(Math.max(0, 4 - covers.length)).fill(null)];
};
const playlistCoverCells = (playlist) => coverCellsFromTracks(playlistTracks(playlist));

let noticeTimer;
const showLibraryNotice = (message) => {
  libraryError.value = '';
  libraryNotice.value = message;
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => {
    libraryNotice.value = '';
  }, 2500);
};

const isFavorite = (track) => favorites.value.includes(track.id);
const toggleFavorite = async (track) => {
  try {
    if (isFavorite(track)) {
      await customFetch.delete(`me/favorites/${track.id}`);
      favorites.value = favorites.value.filter(id => id !== track.id);
    } else {
      await customFetch.post(`me/favorites/${track.id}`);
      favorites.value.push(track.id);
    }
  } catch (error) {
    libraryError.value = error.response?.data?.message || 'Could not update favorites.';
  }
};

const openLibrary = (libraryId) => {
  selectedLibraryId.value = libraryId;
  openedLibraryId.value = libraryId;
  activeTab.value = 'all';
};

const closeLibrary = () => {
  openedLibraryId.value = '';
};

const audioRef = ref(null);
const volumeKnobRef = ref(null);
const isVolumeDragging = ref(false);

const isPlaying = ref(false);
const isRandomized = ref(false);
const isFullscreen = ref(false);
const currentIndex = ref(0);
const progress = ref(0);
const currentTime = ref(0);
const durationMs = ref(0);
const savedVolume = Number(localStorage.getItem('retroReelsPlayerVolume'));
const volume = ref(Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.8);

const activeQueue = computed(() => playbackQueue.value);
const currentTrack = computed(() => activeQueue.value[currentIndex.value] || fallbackTrack);
const showMiniPlayer = computed(() => {
  const visibleRoutes = new Set(['Social', 'Player', 'Account', 'Profile', 'Settings']);
  return tracks.value.length > 0 && visibleRoutes.has(route.name);
});

const volumePercent = computed(() => Math.round(volume.value * 100));
const volumeKnobAngle = computed(() => -135 + volume.value * 270);

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const formatTime = (timeInSeconds) => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
  const min = Math.floor(timeInSeconds / 60) || 0;
  const sec = Math.floor(timeInSeconds % 60) || 0;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const togglePlay = () => {
  if (!audioRef.value || !currentTrack.value.audio) return;
  if (isPlaying.value) { audioRef.value.pause(); } else { audioRef.value.play(); }
  isPlaying.value = !isPlaying.value;
};

const stopAudio = () => {
  if (!audioRef.value) return;
  audioRef.value.pause();
  audioRef.value.currentTime = 0;
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = 0;
};

const playTrack = (track, queue = displayedTracks.value) => {
  const scopedQueue = queue.length ? [...queue] : [track];
  const index = scopedQueue.findIndex(t => t.id === track.id);
  if (index !== -1) {
    playbackQueue.value = scopedQueue;
    currentIndex.value = index;
    setTimeout(() => { if (audioRef.value) { audioRef.value.play(); isPlaying.value = true; } }, 50);
  }
};

const nextTrack = () => {
  if (!activeQueue.value.length) return;
  if (currentIndex.value >= activeQueue.value.length - 1) {
    stopAudio();
    return;
  }
  currentIndex.value += 1;
  setTimeout(() => { if (audioRef.value && isPlaying.value) { audioRef.value.play(); } }, 50);
};

const prevTrack = () => {
  if (!activeQueue.value.length) return;
  currentIndex.value = Math.max(0, currentIndex.value - 1);
  setTimeout(() => { if (audioRef.value && isPlaying.value) { audioRef.value.play(); } }, 50);
};

const randomizeQueue = () => {
  if (!tracks.value.length) return;
  isRandomized.value = !isRandomized.value;
  if (isRandomized.value) {
    const shuffled = [...activeQueue.value].sort(() => Math.random() - 0.5);
    const currentId = currentTrack.value.id;
    playbackQueue.value = [currentTrack.value, ...shuffled.filter(t => t.id !== currentId)];
    currentIndex.value = 0;
  } else {
    const currentId = currentTrack.value.id;
    playbackQueue.value = [...displayedTracks.value];
    currentIndex.value = activeQueue.value.findIndex(t => t.id === currentId);
  }
};

const seekCurrent = (event) => {
  if (!audioRef.value || durationMs.value <= 0) return;
  const val = parseFloat(event.target.value);
  progress.value = val;
  audioRef.value.currentTime = (val / 100) * durationMs.value;
};

const seekFullscreenClick = (e) => {
  if (!audioRef.value || durationMs.value <= 0) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  progress.value = percentage * 100;
  audioRef.value.currentTime = percentage * durationMs.value;
};

// Volume Knob Logic matching HomeView Exactly
let activeKnob = null;
const updateVolumeFromPointer = (knobElement, clientX, clientY) => {
  if (!knobElement) return;
  const rect = knobElement.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  let rawAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
  if (rawAngle > 180) rawAngle -= 360;
  if (rawAngle < -180) rawAngle += 360;

  const angle = Math.min(135, Math.max(-135, rawAngle));
  volume.value = (angle + 135) / 270;
};

const startVolumeDrag = (event) => {
  event.preventDefault();
  isVolumeDragging.value = true;
  activeKnob = event.currentTarget;
  event.currentTarget.setPointerCapture(event.pointerId);
  updateVolumeFromPointer(activeKnob, event.clientX, event.clientY);
};

const dragVolume = (event) => {
  if (!isVolumeDragging.value || !activeKnob) return;
  updateVolumeFromPointer(activeKnob, event.clientX, event.clientY);
};

const stopVolumeDrag = () => {
  isVolumeDragging.value = false;
  activeKnob = null;
};

watch(volume, (newVol) => {
  if (audioRef.value) audioRef.value.volume = newVol;
  localStorage.setItem('retroReelsPlayerVolume', String(newVol));
});

const mapProductToTrack = (product) => {
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    artist: product.artist,
    format: product.format || 'VHS',
    duration: product.duration || '0:00',
    image: product.image || '/Yoru.jpeg',
    audio: product.track?.audioUrl || product.previewUrl || '',
  };
};

const loadLibrary = async () => {
  isLoadingLibrary.value = true;
  libraryError.value = '';

  try {
    const previousTrackId = currentTrack.value.id;
    const previousPlaylistId = selectedPlaylistId.value;
    const [ordersRes, favoritesRes, playlistsRes] = await Promise.all([
      customFetch.get('orders'),
      customFetch.get('me/favorites'),
      customFetch.get('me/playlists'),
    ]);

    const purchasedTracks = (ordersRes.data.data || [])
      .map((order) => mapProductToTrack(order.product))
      .filter(Boolean);
    const uniqueTracks = Array.from(new Map(purchasedTracks.map((track) => [track.id, track])).values());

    originalTracks.value = uniqueTracks;
    tracks.value = [...uniqueTracks];
    favorites.value = (favoritesRes.data.data || []).map((favorite) => favorite.productId);
    playlists.value = playlistsRes.data.data || [];
    const refreshedById = new Map(uniqueTracks.map((track) => [track.id, track]));
    selectedPlaylistId.value = playlists.value.some((playlist) => playlist.id === previousPlaylistId) ? previousPlaylistId : '';
    if (selectedLibraryId.value !== 'all' && !playlists.value.some((playlist) => playlist.id === selectedLibraryId.value)) {
      selectedLibraryId.value = 'all';
    }
    if (openedLibraryId.value !== 'all' && openedLibraryId.value && !playlists.value.some((playlist) => playlist.id === openedLibraryId.value)) {
      openedLibraryId.value = '';
    }
    playbackQueue.value = playbackQueue.value.length
      ? playbackQueue.value.map((track) => refreshedById.get(track.id)).filter(Boolean)
      : [...uniqueTracks];
    const nextIndex = playbackQueue.value.findIndex((track) => track.id === previousTrackId);
    currentIndex.value = nextIndex === -1 ? 0 : nextIndex;
  } catch (error) {
    libraryError.value = error.response?.data?.message || 'Could not load your library.';
  } finally {
    isLoadingLibrary.value = false;
  }
};

const handleLibraryUpdated = async () => {
  await loadLibrary();
  showLibraryNotice('Library updated.');
};

const createPlaylist = async () => {
  const name = newPlaylistName.value.trim();
  if (!name) return;

  try {
    const response = await customFetch.post('me/playlists', { name });
    newPlaylistName.value = '';
    selectedPlaylistId.value = response.data.data.id;
    selectedLibraryId.value = response.data.data.id;
    openedLibraryId.value = response.data.data.id;
    await loadLibrary();
    activeTab.value = 'all';
    showLibraryNotice('Playlist created.');
  } catch (error) {
    libraryError.value = error.response?.data?.message || 'Could not create playlist.';
  }
};

const addTrackToPlaylist = async (track, playlistId) => {
  if (!playlistId) return;

  try {
    await customFetch.post(`me/playlists/${playlistId}/items/${track.id}`);
    selectedPlaylistId.value = playlistId;
    await loadLibrary();
    showLibraryNotice(`${track.title} added to playlist.`);
  } catch (error) {
    libraryError.value = error.response?.data?.message || 'Could not add track to playlist.';
  }
};

const removeTrackFromPlaylist = async (track, playlistId) => {
  if (!playlistId) return;

  try {
    await customFetch.delete(`me/playlists/${playlistId}/items/${track.id}`);
    selectedPlaylistId.value = playlistId;
    await loadLibrary();
    showLibraryNotice(`${track.title} removed from playlist.`);
  } catch (error) {
    libraryError.value = error.response?.data?.message || 'Could not remove track from playlist.';
  }
};

const deletePlaylist = async (playlist) => {
  try {
    await customFetch.delete(`me/playlists/${playlist.id}`);
    if (selectedPlaylistId.value === playlist.id) {
      selectedPlaylistId.value = '';
    }
    if (selectedLibraryId.value === playlist.id) {
      selectedLibraryId.value = 'all';
    }
    if (openedLibraryId.value === playlist.id) {
      openedLibraryId.value = '';
    }
    await loadLibrary();
    showLibraryNotice('Playlist deleted.');
  } catch (error) {
    libraryError.value = error.response?.data?.message || 'Could not delete playlist.';
  }
};

const selectPlaylist = (playlist) => {
  selectedPlaylistId.value = selectedPlaylistId.value === playlist.id ? '' : playlist.id;
};

onMounted(() => {
  loadLibrary();
  window.addEventListener('retro-reels:library-updated', handleLibraryUpdated);
  if (audioRef.value) {
    audioRef.value.volume = volume.value;
    audioRef.value.addEventListener("loadedmetadata", () => { durationMs.value = audioRef.value.duration; });
    audioRef.value.addEventListener("timeupdate", () => {
      currentTime.value = audioRef.value.currentTime;
      if (durationMs.value > 0) { progress.value = (currentTime.value / durationMs.value) * 100; }
    });
    audioRef.value.addEventListener("ended", () => { nextTrack(); });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('retro-reels:library-updated', handleLibraryUpdated);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* EXACT COPY OF HomeView.vue .mini-player css */
.mini-player {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2147483000;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 7.25rem;
  gap: 1rem;
  width: 100%;
  align-items: stretch;
  border: 2px solid #404040;
  border-width: 2px 0 0;
  border-radius: 0;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 0.85rem max(1rem, calc((100vw - 84rem) / 2));
  color: #ccc;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  isolation: isolate;
  font-family: "Courier New", monospace;
}

.mini-cover {
  display: block;
  align-self: center;
  height: 7.25rem;
  width: 7.25rem;
  overflow: hidden;
  border-radius: 4px;
  border: 2px inset #333;
  background: #111;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  object-fit: cover;
}

.mini-main {
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 0.75rem;
  min-width: 0;
}

.mini-screen {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  min-height: 3.5rem;
  border: 2px inset #333;
  border-radius: 4px;
  background: #0a0a0a;
  padding: 0.75rem;
}

.mini-track {
  overflow: hidden;
  white-space: nowrap;
}

.mini-track span {
  display: inline-block;
  padding-left: 100%;
  color: #00ff41;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 8px #00ff41;
  text-transform: uppercase;
  animation: player-marquee 8s linear infinite;
}

.mini-time {
  color: #ff6b35;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 6px #ff6b35;
  white-space: nowrap;
}

.mini-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mini-volume {
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: 0.45rem;
  color: #00ff41;
}

.mini-knob {
  position: relative;
  display: grid;
  height: 2.5rem;
  width: 2.5rem;
  touch-action: none;
  place-items: center;
  border: 1px solid #555;
  border-radius: 999px;
  background:
    radial-gradient(circle at 38% 32%, rgba(255, 255, 255, 0.28), transparent 24%),
    linear-gradient(145deg, #4c4c4c, #171717);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.22),
    inset 0 -4px 8px rgba(0, 0, 0, 0.55),
    0 0 0 2px rgba(0, 0, 0, 0.45);
  cursor: grab;
}

.mini-knob:active {
  cursor: grabbing;
}

.mini-knob:focus-visible {
  outline: 2px solid #00ff41;
  outline-offset: 3px;
}

.mini-knob::before {
  content: "";
  position: absolute;
  inset: 0.35rem;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle, #292929 0 34%, #111 35% 100%);
}

.mini-knob span {
  position: absolute;
  top: 0.34rem;
  left: 50%;
  z-index: 1;
  height: 0.65rem;
  width: 0.16rem;
  transform: translateX(-50%) rotate(var(--knob-angle));
  transform-origin: 50% 0.9rem;
  border-radius: 999px;
  background: #ff6b35;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.85);
}

.mini-volume-value {
  min-width: 1.6rem;
  color: #ff6b35;
  font-size: 0.65rem;
  font-weight: 800;
  text-align: right;
  text-shadow: 0 0 6px rgba(255, 107, 53, 0.75);
}

.mini-range {
  width: 100%;
  height: 0.45rem;
  cursor: pointer;
  appearance: none;
  border: 1px solid #222;
  border-radius: 999px;
  background:
    linear-gradient(90deg, #00ff41, #00ff41) 0 / var(--range-fill, 0%) 100% no-repeat,
    #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7);
}

.mini-range:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.mini-range::-webkit-slider-thumb {
  height: 1rem;
  width: 1rem;
  appearance: none;
  border: 2px solid #101010;
  border-radius: 999px;
  background: #ff6b35;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.45);
}

.mini-range::-moz-range-thumb {
  height: 0.8rem;
  width: 0.8rem;
  border: 2px solid #101010;
  border-radius: 999px;
  background: #ff6b35;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.45);
}

.mini-button {
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #555;
  background: linear-gradient(145deg, #404040, #2a2a2a);
  color: #ccc;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.mini-button:hover {
  border-color: #666;
  background: linear-gradient(145deg, #505050, #3a3a3a);
  color: #fff;
}

.mini-button.primary {
  height: 2.75rem;
  width: 2.75rem;
  border-color: #ff6b35;
  background: linear-gradient(145deg, #ff6b35, #e55a2b);
  color: white;
}

.mini-button.primary:hover {
  background: linear-gradient(145deg, #ff7849, #f06439);
  box-shadow: 0 0 12px rgba(255, 107, 53, 0.4);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes player-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@media (max-width: 640px) {
  .mini-player {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    grid-template-columns: minmax(0, 1fr) 3.75rem;
    grid-template-areas:
      "screen cover"
      "seek seek"
      "controls controls";
    padding: 0.65rem;
    gap: 0.55rem;
  }
  .mini-main {
    display: contents;
  }
  .mini-cover {
    grid-area: cover;
    height: 3.75rem;
    width: 3.75rem;
  }
  .mini-screen {
    grid-area: screen;
    min-height: 2.5rem;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .mini-seek {
    grid-area: seek;
  }
  .mini-controls {
    grid-area: controls;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .mini-button {
    height: 2rem;
    width: 2rem;
  }
  .mini-button.primary {
    height: 2.25rem;
    width: 2.25rem;
  }
  .mini-volume {
    margin-left: 0;
    flex: 1 1 auto;
    justify-content: flex-end;
  }
  .mini-track span {
    font-size: 0.65rem;
  }
  .mini-time {
    font-size: 0.65rem;
  }
}
</style>
