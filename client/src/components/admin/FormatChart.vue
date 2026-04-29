<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  data: { type: Array, default: () => [] },
});

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      label: 'Sales',
      data: props.data.map((d) => d.value),
      backgroundColor: [
        'rgba(245, 143, 66, 0.7)',
        'rgba(110, 168, 255, 0.7)',
        'rgba(214, 255, 98, 0.7)',
      ],
      borderColor: [
        'rgba(245, 143, 66, 1)',
        'rgba(110, 168, 255, 1)',
        'rgba(214, 255, 98, 1)',
      ],
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#f58f42',
      bodyColor: '#fff',
      borderColor: 'rgba(245, 143, 66, 0.3)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11 }, stepSize: 5 },
      beginAtZero: true,
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 280px;
}
</style>
