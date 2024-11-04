<template>
  <div>
    <canvas ref="myChart" width="400" height="200"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const ctx = this.$refs.myChart.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};
</script>

<style scoped>
</style>
