<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold mb-6">Mérés Részletei</h1>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-if="loading" class="text-gray-500 mb-4">Adatok betöltése...</div>

    <div v-if="!loading && measurement">
      <p><strong>ID:</strong> {{ measurement.id }}</p>
      <p><strong>Név:</strong> {{ measurement.name }}</p>
      <p><strong>Státusz:</strong> {{ measurement.status }}</p>
      <p><strong>Tömeg (Brix):</strong> {{ measurement.brix }}</p>
      <p><strong>Kezdeti súly(kg):</strong> {{ measurement.initial_weight }}</p>
      <p><strong>Kezdés dátuma:</strong> {{ measurement.created_at }}</p>
      <p><strong>Zárás dátuma:</strong> {{ measurement.stopped_at || 'N/A' }}</p>

      <!-- Új adatok megjelenítése -->
      <p><strong>Kihozatal (liter):</strong> {{ measurement.yield_amount || 'N/A' }}</p>
      <p><strong>Alkoholfok:</strong> {{ measurement.alcohol_content || 'N/A' }}</p>
      <p><strong>Íz osztályozása (1-10):</strong> {{ measurement.taste_rating || 'N/A' }}</p>
      <p><strong>Illat osztályozása (1-10):</strong> {{ measurement.smell_rating || 'N/A' }}</p>
      <p><strong>Karakter osztályozása (1-10):</strong> {{ measurement.character_rating || 'N/A' }}</p>

      <!-- Hőmérséklet statisztikai adatok -->
      <h2 class="text-2xl font-semibold mt-6">Hőmérséklet Statisztikai Adatok</h2>
      <div v-if="temperatureStatistics">
        <p><strong>Átlag:</strong> {{ temperatureStatistics.average.toFixed(2) }} °C</p>
        <p><strong>Medián:</strong> {{ temperatureStatistics.median.toFixed(2) }} °C</p>
        <p><strong>Módusz:</strong> {{ temperatureStatistics.mode.toFixed(2) }} °C</p>
        <p><strong>25. Percentilis:</strong> {{ temperatureStatistics.percentiles['25th'].toFixed(2) }} °C</p>
        <p><strong>75. Percentilis:</strong> {{ temperatureStatistics.percentiles['75th'].toFixed(2) }} °C</p>
        <p><strong>90. Percentilis:</strong> {{ temperatureStatistics.percentiles['90th'].toFixed(2) }} °C</p>
      </div>

      <!-- pH statisztikai adatok -->
      <h2 class="text-2xl font-semibold mt-6">pH Statisztikai Adatok</h2>
      <div v-if="phStatistics">
        <p><strong>Átlag:</strong> {{ phStatistics.average.toFixed(2) }}</p>
        <p><strong>Medián:</strong> {{ phStatistics.median.toFixed(2) }}</p>
        <p><strong>Módusz:</strong> {{ phStatistics.mode.toFixed(2) }}</p>
        <p><strong>25. Percentilis:</strong> {{ phStatistics.percentiles['25th'].toFixed(2) }}</p>
        <p><strong>75. Percentilis:</strong> {{ phStatistics.percentiles['75th'].toFixed(2) }}</p>
        <p><strong>90. Percentilis:</strong> {{ phStatistics.percentiles['90th'].toFixed(2) }}</p>
      </div>

      <!-- Hőmérséklet diagram -->
      <h2 class="text-2xl font-semibold mt-6">Hőmérséklet Adatok</h2>
      <AppChart v-if="temperatureChartData" :chartData="temperatureChartData" />

      <!-- pH diagram -->
      <h2 class="text-2xl font-semibold mt-6">pH Adatok</h2>
      <AppChart v-if="phChartData" :chartData="phChartData" />
    </div>
  </div>
</template>

<script>
import apiClient from '../api';
import AppChart from '../components/chart/AppChart.vue';

export default {
  name: 'MeasurementDetail',
  components: {
    AppChart
  },
  data() {
    return {
      measurement: null,
      loading: false,
      error: null,
      temperatureChartData: null,
      phChartData: null,
      temperatureStatistics: null,
      phStatistics: null
    };
  },
  methods: {
    async fetchMeasurement() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get(`/measurements/${this.$route.params.id}`);
        this.measurement = response.data;

        const temperatureResponse = await apiClient.get(`/measurements/${this.$route.params.id}/temperature-statistics`);
        const temperatureData = temperatureResponse.data;

        this.temperatureStatistics = temperatureData.statistics;
        this.temperatureChartData = {
          labels: temperatureData.temperature_data.map(entry => {
            const date = new Date(entry.measured_at);
            return date.toLocaleString('hu-HU', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          }),
          datasets: [
            {
              label: 'Hőmérséklet (°C)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              data: temperatureData.temperature_data.map(entry => entry.temperature),
              borderWidth: 2,
              fill: false
            }
          ]
        };

        const phResponse = await apiClient.get(`/measurements/${this.$route.params.id}/ph-values`);
        if (phResponse.status === 204) {
          this.error = 'Jelenleg nincs még pH adat';
        } else {
          const phData = phResponse.data;
          this.phStatistics = phData.statistics;
          this.phChartData = {
            labels: phData.ph_data.map(entry => {
              const date = new Date(entry.measured_at);
              return date.toLocaleString('hu-HU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });
            }),
            datasets: [
              {
                label: 'pH érték',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: phData.ph_data.map(entry => entry.ph_value),
                borderWidth: 2,
                fill: false
              }
            ]
          };
        }
      } catch (error) {
        if (error.response && error.response.status === 204) {
          this.error = 'Az adott fermentációhoz még nem rögzítettek pH-mérést.';
        } else {
          this.error = 'Hiba történt az adat betöltése közben.';
        }
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchMeasurement();
  }
};
</script>

<style scoped>
</style>
