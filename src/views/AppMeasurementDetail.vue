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
      <p><strong>Kezdés dátuma:</strong> {{ measurement.created_at }}</p>
      <p><strong>Zárás dátuma:</strong> {{ measurement.stopped_at || 'N/A' }}</p>
      <!-- További részletek jeleníthetők meg, ha szükséges -->
    </div>
  </div>
</template>

<script>
import apiClient from '../api';

export default {
  name: 'MeasurementDetail',
  data() {
    return {
      measurement: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchMeasurement() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get(`/measurements/${this.$route.params.id}`);
        this.measurement = response.data;
      } catch (error) {
        this.error = 'Hiba történt az adat betöltése közben.';
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
