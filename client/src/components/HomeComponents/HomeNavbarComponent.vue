<template>
   <nav id="nav-body" class="bg-black text-white h-16 flex justify-between py-2 px-3 items-center w-screen">
    <img id="nav-logo" class="ml-3 h-6 w-64 object-contain" src="../../../public/nav-title.png">
</img>
    <div id="nav-main" class="border border-white bg-white rounded-3xl py-1  font-semibold flex justify-start items-center w-1/3 mr-32">
        <a href="#" id="nav-github" class="w-10 h-10 text-center  ml-1  rounded-2xl">
            <img src="../../../public/nav-github-black.png"></img>
        </a>
        <div id="nav-route" class="flex justify-evenly w-5/6 ml-8">
        <a href="#" id="nav-route-1" class="w-24 text-center h-8 px-2 pb-1 border border-white text-black rounded-2xl hover:bg-black hover:text-white ease-in-out transition-all hover:animate-pulse duration-300">Home</a>
        <a href="#" id="nav-route-2" class="w-24 text-center h-auto px-2 pb-1 border border-white text-black rounded-2xl hover:bg-black hover:text-white ease-in-out transition-all hover:animate-pulse duration-300">Category</a>
        <a href="#" id="nav-route-3" class="w-24 text-center h-auto px-2 pb-1 border border-white text-black rounded-2xl hover:bg-black hover:text-white ease-in-out transition-all hover:animate-pulse duration-300">Player</a>
        <a href="#" id="nav-route-4" class="w-24 text-center h-auto px-2 pb-1 border border-white text-black rounded-2xl hover:bg-black hover:text-white ease-in-out transition-all hover:animate-pulse duration-300">Account</a>
        </div>
    </div>
   </nav>
</template>

<script setup lang="ts">

</script>