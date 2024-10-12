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

const isOpen = ref(false);
const toggleMenu = () => { isOpen.value = !isOpen.value };

</script>

<template>
    <!-- <Menubar class="bg-blue-300" :model="items" >
        <template #end>
            <Button label="Login" icon="pi pi-user" @click="dialog = true" />
        </template>
</Menubar>
<FormAuthComponent v-model:visible="dialog" /> -->
    <nav class="flex justify-between py-3  bg-serenade-100 border-b border-b-black">
        <img src="../../public/RR.png" alt="" class="w-8 h-6 ms-3">
        <div id="MenuBar" class="w-1/3 me-10" :class="{ 'hidden': !isOpen, 'w-1/3': true }">
            <ul class="flex justify-center space-x-10">
                <li v-for="(item, index) in items" @click="item.command" key="index"
                    class="hover:cursor-pointer font-semibold border-black max-sm:hidden">{{ item.label }}</li>
            </ul>
        </div>
        <button @click="toggleMenu" class="sm:hidden flex flex-col justify-center space-y-1 focus:outline-none me-2">
            <span class="block w-6 h-0.5 bg-black"></span>
            <span class="block w-6 h-0.5 bg-black"></span>
            <span class="block w-6 h-0.5 bg-black"></span>
        </button>
    </nav>
</template>
