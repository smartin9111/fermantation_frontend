<template>
  <div class="p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-semibold mb-6 text-center text-blue-600">pH Mérés</h1>

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

	<div class="flex flex-col space-y-4 mt-6">
		<AppButton @click="startPHMeasurement" class="bg-green-500 hover:bg-green-600">Start pH Mérés</AppButton>
		<AppButton @click="getPHValue" class="bg-blue-500 hover:bg-blue-600" :disabled="!phMeasurementActive">pH Érték Lekérése</AppButton>
		<AppButton @click="savePHMeasurement" class="bg-blue-500 hover:bg-blue-600" :disabled="!phValue">pH Érték Mentése</AppButton>
		<AppButton @click="stopPHMeasurement" class="bg-red-500 hover:bg-red-600" :disabled="!phMeasurementActive">Stop pH Mérés</AppButton>
	</div>

      <div v-if="phValue" class="mt-4 text-lg text-center font-semibold text-gray-700">
        Jelenlegi pH érték: <span class="text-blue-600">{{ phValue.toFixed(2) }}</span>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 text-center mt-6">Nincs aktív mérés, pH mérés nem indítható.</p>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/ui/AppButton.vue';
import apiClient from '../api';

export default {
  name: 'AppPHMeasurement',
  components: { AppButton },
  data() {
    return {
      activeMeasurements: [], // Aktív mérések listája
      selectedMeasurementId: null, // Kiválasztott mérés ID-je
      phMeasurementActive: false, // Aktív pH mérés állapota
      phValue: null, // Jelenlegi pH érték
      error: null,
      success: null,
      intervalId: null
    };
  },
  methods: {
    async checkActiveMeasurements() {
      try {
        const response = await apiClient.get('/active-measurements/');
        this.activeMeasurements = response.data; // Aktív mérések beállítása
        if (this.activeMeasurements.length > 0) {
          this.selectedMeasurementId = this.activeMeasurements[0].id; // Az első mérés kiválasztása alapértelmezettként
        }
      } catch (error) {
        this.error = 'Hiba történt az aktív mérések lekérdezése során.';
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('hu-HU', options);
    },
    async startPHMeasurement() {
      this.error = null;
      this.success = null;

      try {
        await apiClient.post('/start-ph-measurement/');
        this.phMeasurementActive = true;
        this.success = 'A pH mérés elindult!';
        this.intervalId = setInterval(this.getPHValue, 5000); // 5 másodpercenként pH érték lekérése
      } catch (error) {
        this.error = 'Hiba történt a pH mérés indítása során.';
      }
    },
    async stopPHMeasurement() {
      this.error = null;
      this.success = null;

      try {
        await apiClient.post('/stop-ph-measurement/');
        this.phMeasurementActive = false;
        this.success = 'A pH mérés leállt!';
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      } catch (error) {
        this.error = 'Hiba történt a pH mérés leállítása során.';
      }
    },
    async getPHValue() {
      this.error = null;
      this.success = null;

      try {
        const phResponse = await apiClient.get('/get-ph/');
        this.phValue = phResponse.data.ph_value; // pH érték beállítása megjelenítéshez
        this.success = 'A pH érték sikeresen lekérve!';
      } catch (error) {
        this.error = 'Hiba történt a pH érték lekérése során.';
      }
    },
    async savePHMeasurement() {
      this.error = null;
      this.success = null;

      try {
        await apiClient.post(`/add-ph-measurement/${this.selectedMeasurementId}/`, {
          ph_value: this.phValue.toFixed(2) // pH érték 2 tizedesjegyig mentve
        });
        this.success = 'A pH érték sikeresen mentve lett!';
      } catch (error) {
        this.error = 'Hiba történt a pH érték mentése során.';
      }
    }
  },
  mounted() {
    this.checkActiveMeasurements();
  },
  beforeUnmount() { // A beforeDestroy helyett
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
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
.bg-green-500 {
  background-color: #48bb78;
}
.bg-blue-500 {
  background-color: #4299e1;
}
.bg-red-500 {
  background-color: #f56565;
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
