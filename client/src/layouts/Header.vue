<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import FormAuthComponent from "@/components/FormAuthComponent.vue"
const dialog = ref(false)

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
    <Menubar :model="items">
        <template #end>
            <Button label="Login" icon="pi pi-user" @click="dialog = true" />
        </template>
    </Menubar>

    <FormAuthComponent v-model:visible="dialog"/>
</template>