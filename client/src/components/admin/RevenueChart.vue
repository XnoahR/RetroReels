<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps({
  data: { type: Array, default: () => [] },
});

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      label: 'Revenue',
      data: props.data.map((d) => d.value),
      borderColor: 'rgba(245, 143, 66, 0.8)',
      backgroundColor: 'rgba(245, 143, 66, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(245, 143, 66, 1)',
      pointBorderColor: 'rgba(245, 143, 66, 0.5)',
      pointRadius: 3,
      pointHoverRadius: 6,
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
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11 } },
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
