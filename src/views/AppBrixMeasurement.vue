<template>
  <div class="p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-semibold mb-6 text-center text-blue-600">Brix Mérés</h1>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-if="success" class="text-green-500 mb-4">{{ success }}</div>

    <div v-if="activeMeasurements.length">
      <label for="measurementSelect" class="block text-lg font-medium mb-2 text-gray-700">Válassz egy aktív mérést:</label>
      <select
        id="measurementSelect"
        v-model="selectedMeasurementId"
        class="mb-4 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option v-for="measurement in activeMeasurements" :key="measurement.id" :value="measurement.id">
          {{ measurement.name }} - {{ formatDate(measurement.created_at) }}
        </option>
      </select>

      <!-- Brix érték bevitele -->
      <label for="brixValue" class="block text-lg font-medium mb-2 text-gray-700">Brix érték:</label>
      <input
        id="brixValue"
        type="number"
        v-model="brixValue"
        placeholder="Add meg a Brix értéket"
        class="mb-4 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Gombok -->
      <div class="flex flex-col space-y-4 mt-6">
        <AppButton @click="saveBrixMeasurement" class="bg-blue-500 hover:bg-blue-600" :disabled="!brixValue">Brix Érték Mentése</AppButton>
      </div>

      <div v-if="brixValue" class="mt-4 text-lg text-center font-semibold text-gray-700">
        Megadott Brix érték: <span class="text-blue-600">{{ brixValue }}</span>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 text-center mt-6">Nincs aktív mérés, Brix mérés nem indítható.</p>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/ui/AppButton.vue';
import apiClient from '../api';

export default {
  name: 'AppBrixMeasurement',
  components: { AppButton },
  data() {
    return {
      activeMeasurements: [],     // Aktív mérések listája
      selectedMeasurementId: null, // Kiválasztott mérés ID-je
      brixValue: null,            // Brix érték, amit a felhasználó megad
      error: null,
      success: null
    };
  },
  methods: {
    async checkActiveMeasurements() {
      try {
        const response = await apiClient.get('/active-measurements/');
        this.activeMeasurements = response.data; // Aktív mérések beállítása
        if (this.activeMeasurements.length > 0) {
          this.selectedMeasurementId = this.activeMeasurements[0].id; // Alapértelmezettként az első mérés kiválasztása
        }
      } catch (error) {
        this.error = 'Hiba történt az aktív mérések lekérdezése során.';
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('hu-HU', options);
    },
    async saveBrixMeasurement() {
      if (!this.selectedMeasurementId || !this.brixValue) {
        this.error = 'Kérlek, válaszd ki a mérést és add meg a Brix értéket!';
        return;
      }

      this.error = null;
      this.success = null;

      try {
        await apiClient.post(`/add-brix/${this.selectedMeasurementId}/`, {
          brix_value: this.brixValue
        });
        this.success = 'A Brix érték sikeresen mentve lett!';
        this.brixValue = null; // Brix érték mező törlése a mentés után
      } catch (error) {
        this.error = 'Hiba történt a Brix érték mentése során.';
      }
    }
  },
  mounted() {
    this.checkActiveMeasurements();
  }
};
</script>

<style scoped>
.text-red-500 {
  color: #f56565;
}
.text-green-500 {
  color: #48bb78;
}
.text-gray-500 {
  color: #6b7280;
}
.bg-blue-500 {
  background-color: #4299e1;
}
.bg-white {
  background-color: #ffffff;
}
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.text-blue-600 {
  color: #3182ce;
}
</style>
