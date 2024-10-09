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
        command: () => {router.push('/')}
    },
    {
        label: "About",
        icon: 'pi pi-search',
        command: () => router.push('/about')
    },
    {
        label: 'Contacts',
        icon: 'pi pi-envelope',
        command: () =>  router.push('/contact')
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
