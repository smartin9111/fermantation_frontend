<template>
  <div class="p-10 bg-white shadow-md rounded-lg max-w-lg mx-auto">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">Új mérés indítása</h1>

    <div v-if="error" class="text-red-500 mb-4 text-center">{{ error }}</div>
    <div v-if="success" class="text-green-500 mb-4 text-center">{{ success }}</div>

    <!-- Gyümölcs választása -->
    <label for="fruit" class="block text-lg font-medium text-gray-700 mb-2">Gyümölcs:</label>
    <select v-model="selectedFruit" id="fruit" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
      <option value="" disabled>Kérlek, válassz gyümölcsöt</option>
      <option value="alma">Alma</option>
      <option value="cigány meggy">Cigány Meggy</option>
      <option value="szilva">Szilva</option>
      <option value="barack">Barack</option>
    </select>

    <!-- Brix érték megadása -->
    <label for="brix" class="block text-lg font-medium text-gray-700 mt-4 mb-2">Brix érték:</label>
    <input v-model="brix" id="brix" type="number" placeholder="Brix érték megadása" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

    <!-- Induló súly megadása -->
    <label for="initialWeight" class="block text-lg font-medium text-gray-700 mt-4 mb-2">Induló súly (kg):</label>
    <input v-model="initialWeight" id="initialWeight" type="number" placeholder="Induló súly megadása" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

    <!-- Start és Stop gombok -->
    <div class="flex justify-center space-x-6 mt-6">
      <AppButton @click="startMeasurement" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105">Start</AppButton>
      <AppButton @click="stopMeasurement" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105" :disabled="!activeMeasurementId">Stop</AppButton>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/ui/AppButton.vue';
import apiClient from '../api';

export default {
  name: 'AppNewFermentation',
  components: { AppButton },
  data() {
    return {
      selectedFruit: '',
      brix: null,
      initialWeight: null, // Új adatmező az induló súlyhoz
      activeMeasurementId: null,
      error: null,
      success: null
    };
  },
  methods: {
    async startMeasurement() {
      this.error = null;
      this.success = null;

      if (!this.selectedFruit || !this.brix || !this.initialWeight) {
        this.error = 'Kérlek, töltsd ki az összes mezőt!';
        return;
      }

      try {
        await apiClient.post('/start-measurement/', {
          name: this.selectedFruit,
          brix: this.brix,
          initial_weight: this.initialWeight, // Induló súly hozzáadása
          year: new Date().getFullYear()
        });

        this.success = 'A mérés sikeresen elindult!';
      } catch (error) {
        this.error = 'Hiba történt a mérés indítása során.';
      }
    },

    async stopMeasurement() {
      if (!this.activeMeasurementId) {
        this.error = 'Nincs aktív mérés, amit le lehetne állítani.';
        return;
      }

      try {
        await apiClient.post(`/stop-measurement/${this.activeMeasurementId}/`);
        this.success = 'A mérés sikeresen leállt!';
        this.activeMeasurementId = null;
      } catch (error) {
        this.error = 'Hiba történt a mérés leállítása során.';
      }
    }
  }
};
</script>

<style scoped>
/* Ha szükséges, adhatsz hozzá további stílusokat */
</style>
