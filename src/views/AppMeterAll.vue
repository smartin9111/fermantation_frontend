<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold mb-6">Mérések listája</h1>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div v-if="loading" class="text-gray-500 mb-4">Adatok betöltése...</div>

    <div v-if="!loading">
      <table class="min-w-full bg-white border border-gray-300 mb-6">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="py-2 px-4 border">ID</th>
            <th class="py-2 px-4 border">Név</th>
            <th class="py-2 px-4 border">Státusz</th>
            <th class="py-2 px-4 border">Tömeg (Brix)</th>
            <th class="py-2 px-4 border">Kezdés dátuma</th>
            <th class="py-2 px-4 border">Zárás dátuma</th>
            <th class="py-2 px-4 border">Részletek</th>
            <th class="py-2 px-4 border">Leállítás</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="measurement in measurements" :key="measurement.id" class="border-b hover:bg-gray-100">
            <td class="py-2 px-4 border">{{ measurement.id }}</td>
            <td class="py-2 px-4 border">{{ measurement.name }}</td>
            <td class="py-2 px-4 border">{{ measurement.status }}</td>
            <td class="py-2 px-4 border">{{ measurement.brix }}</td>
            <td class="py-2 px-4 border">{{ measurement.created_at }}</td>
            <td class="py-2 px-4 border">{{ measurement.stopped_at || 'N/A' }}</td>
            <td class="py-2 px-4 border">
              <Button @click="goToDetails(measurement.id)">Részletek</Button>
            </td>
            <td class="py-2 px-4 border">
              <Button 
                @click="stopMeasurement(measurement.id)" 
                :disabled="measurement.status !== 'active'"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Leállítás
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiClient from '../api';
import Button from '../components/ui/AppButton.vue';

export default {
  name: 'AppMeasurements',
  components: {
    Button
  },
  data() {
    return {
      measurements: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchMeasurements() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get('/all-measurements');
        this.measurements = response.data;
      } catch (error) {
        this.error = 'Hiba történt az adatok betöltése közben.';
      } finally {
        this.loading = false;
      }
    },
    goToDetails(id) {
      this.$router.push({ name: 'AppMeasurementDetail', params: { id } });
    },
    async stopMeasurement(id) {
      this.error = null;
      try {
        const response = await apiClient.post(`/stop-measurement/${id}/`);
        const stoppedMeasurement = response.data;
        
        // Frissítsük az adott mérés státuszát és leállítási dátumát a helyi adatokban
        const measurement = this.measurements.find(m => m.id === id);
        if (measurement) {
          measurement.status = stoppedMeasurement.status;
          measurement.stopped_at = stoppedMeasurement.stopped_at;
        }
        
      } catch (error) {
        this.error = 'Hiba történt a mérés leállítása során.';
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchMeasurements();
  }
};
</script>
