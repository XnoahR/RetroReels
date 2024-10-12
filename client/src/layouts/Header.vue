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
        label: 'Contacts',
        icon: 'pi pi-envelope',
        name: "Contact",
        command: () => router.push({ name: 'Contact' })
    }
]);

</script>

<template>
    <Menubar :model="items" >
        <template #end>
            <Button label="Login" icon="pi pi-user" @click="dialog = true" />
        </template>
    </Menubar>
    <FormAuthComponent v-model:visible="dialog" />
</template>
