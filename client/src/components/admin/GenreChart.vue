<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: { type: Array, default: () => [] },
});

const colors = [
  'rgba(245, 143, 66, 0.8)',
  'rgba(182, 140, 255, 0.8)',
  'rgba(77, 231, 255, 0.8)',
  'rgba(255, 91, 189, 0.8)',
  'rgba(55, 245, 166, 0.8)',
  'rgba(255, 209, 102, 0.8)',
];

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      data: props.data.map((d) => d.value),
      backgroundColor: colors.slice(0, props.data.length),
      borderColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: 2,
      hoverOffset: 8,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 10 },
    },
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
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 280px;
}
</style>
