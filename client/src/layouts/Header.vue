<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter to handle navigation
import Menubar from 'primevue/menubar';
import FormAuthComponent from "@/components/FormAuthComponent.vue";

const dialog = ref(false);
const router = useRouter(); // Get router instance

// Define the menu items with their paths
const items = ref([
    {
        label: "Home",
        icon: "pi pi-home",
        name: "Home",
        command: () => router.push({ name: 'Home' })  // Use name for navigation
    },
    {
        label: "About",
        icon: 'pi pi-search',
        name: "About",
        command: () => router.push({ name: 'About' })
    },
    {
        label: "Category",
        icon: 'pi pi-th-large',
        name: "Category",
        command: () => router.push({ name: 'Category' })
    },
    {
        label: 'Contacts',
        icon: 'pi pi-envelope',
        name: "Contact",
        command: () => router.push({ name: 'Contact' })
    }
]);

const GoToLogin = () => {
  router.push({'name' : 'Login'})
}

const isMobileScreen = ref(window.innerWidth < 640);
window.addEventListener('resize', () => {
    isMobileScreen.value = window.innerWidth < 640;
});

const isOpen = ref(false);
const toggleMenu = () => { isOpen.value = !isOpen.value };

</script>

<template>
    <nav class="flex justify-between py-6 pe-6 bg-gray-500 border-b border-b-black">
        <img src="/RR.png" alt="" class="w-8 h-6 ms-3">
        <div id="MenuBar" class="w-1/3  me-24 max-sm:hidden">
            <ul class="flex max-sm:flex-col justify-center items-center ">
                <li v-for="(item, index) in items" @click="item.command" key="index"
                    class="hover:cursor-pointer font-semibold border-black mx-6">{{ item.label }}
                </li>
                <li
                    @click="GoToLogin"
                    class="mx-6 bg-bay-leaf-300 hover:cursor-pointer hover:bg-bay-leaf-500 px-5 py-1 font-semibold rounded-md shadow-[1px_2px_1px_1px_#2d3748] hover:shadow-none">
                    Login</li>
            </ul>
        </div>
        <button @click="toggleMenu" class="sm:hidden flex flex-col justify-center space-y-1 focus:outline-none">
            <span class="block w-6 h-0.5 bg-black"></span>
            <span class="block w-6 h-0.5 bg-black"></span>
            <span class="block w-6 h-0.5 bg-black"></span>
        </button>
    </nav>
    <transition
    name="dropdown"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div 
      v-if="isOpen && isMobileScreen"
      id="SecondMenuBar" 
      class="w-full absolute bg-white z-50 border-b border-black overflow-hidden"
    >
      <ul class="flex max-sm:h-full max-sm:flex-col justify-evenly items-center py-6">
        <li
          v-for="(item, index) in items"
          :key="index"
          @click="item.command"
          class="hover:cursor-pointer font-semibold mx-6 max-sm:hover:bg-gray-300 max-sm:w-4/6 rounded-md max-sm:text-center max-sm:mb-3 max-sm:py-1"
        >
          {{ item.label }}
        </li>
        <li
          class=" max-sm:w-4/6 text-center bg-bay-leaf-300 hover:bg-bay-leaf-500 px-5 py-1 font-semibold rounded-md shadow-[1px_2px_1px_1px_#2d3748] hover:shadow-none"
          @click="GoToLogin"
        >
          Login
        </li>
      </ul>
    </div>
  </transition>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
}

.dropdown-enter-from, .dropdown-leave-to {
  max-height: 0;

}

.dropdown-enter-to, .dropdown-leave-from {
  max-height: 16rem;

}
</style>