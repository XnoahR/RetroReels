<template>
    <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <!-- Apply conditional class using a method -->
            <Column field="code" header="Code" :class="getBodyClass(statusColor)" sortable style="width: 25%"></Column>
            <Column field="name" header="Name" sortable style="width: 25%"></Column>
            <Column field="category" header="Category" sortable style="width: 25%"></Column>
            <Column field="quantity" header="Quantity" sortable style="width: 25%"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Sample product data
const products = ref([
  {
    code: 'P001',
    name: 'Product A',
    category: 'Category 1',
    quantity: 100,
  },
  {
    code: 'P002',
    name: 'Product B',
    category: 'Category 2',
    quantity: 150,
  },
  {
    code: 'P003',
    name: 'Product C',
    category: 'Category 1',
    quantity: 200,
  },
  {
    code: 'P004',
    name: 'Product D',
    category: 'Category 3',
    quantity: 50,
  },
]);

const statusColor = ref(true); // You can toggle this to test

// Computed function to return the class based on statusColor
const getBodyClass = (rowData) => {
  return statusColor.value ? 'bg-blue-500' : '';
};
</script>
