<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import 'primeflex/primeflex.css'
const items = ref([
    {
        label: "Home",
        icon: "pi pi-home"
    },
    {
        label: "Projects",
        icon: 'pi pi-search',
        "items": [{
            label: "Components",
            icon: "pi pi-bold"
        },
        {
            label: 'Blocks',
            icon: 'pi pi-server'
        }
        ]
    },
    {
        label: 'Contacts',
        icon: 'pi pi-envelope'
    }
])
</script>

<template>
    <Menubar :model="items" />
</template>