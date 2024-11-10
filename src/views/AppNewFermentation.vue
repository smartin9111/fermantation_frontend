<template>
  <div class="p-10 bg-white shadow-md rounded-lg max-w-lg mx-auto">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">Új mérés indítása</h1>

    <div v-if="error" class="text-red-500 mb-4 text-center">{{ error }}</div>
    <div v-if="success" class="text-green-500 mb-4 text-center">{{ success }}</div>

    <!-- Kép feltöltése és predikció -->
    <label for="file-upload" class="block text-lg font-medium mb-2">Tölts fel egy képet a gyümölcs felismeréséhez</label>
    <input type="file" id="file-upload" @change="onFileChange" accept="image/*" class="block w-full p-2 border rounded mb-4">

    <AppButton class="bg-blue-500 text-white py-2 px-4 rounded w-full" @click="predictImage" :disabled="!selectedFile">Gyümölcs felismerése</AppButton>

    <!-- Pop-up ablak a predikció eredményével -->
    <div v-if="showPrediction" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 class="text-xl font-semibold mb-4">Gyümölcs felismerési eredmény</h2>
        <p><strong>Gyümölcs:</strong> {{ prediction }}</p>
        <p><strong>Biztonság:</strong> {{ confidence }}%</p>
        <p>Ez a felismerés helyes?</p>
        <button @click="confirmPrediction(true)" class="bg-green-500 text-white py-2 px-4 rounded mt-4">Igen</button>
        <button @click="confirmPrediction(false)" class="bg-red-500 text-white py-2 px-4 rounded mt-4">Nem</button>
      </div>
    </div>

    <!-- Gyümölcs kiválasztása, ha a felismerés nem megfelelő -->
    <label v-if="showManualSelection" for="fruit" class="block text-lg font-medium text-gray-700 mb-2">Válassz gyümölcsöt:</label>
    <select v-if="showManualSelection" v-model="selectedFruit" id="fruit" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4">
      <option value="" disabled>Kérlek, válassz gyümölcsöt</option>
      <option value="Alma">Alma</option>
      <option value="Cigány meggy">Cigány Meggy</option>
      <option value="Szilva">Szilva</option>
      <option value="Barack">Barack</option>
    </select>

    <!-- Brix és súly mezők, ha a felismerés helyes -->
    <div v-if="selectedFruit">
      <label for="initial_brix" class="block text-lg font-medium text-gray-700 mb-2">Kezdeti brix érték:</label>
      <input v-model="initial_brix" id="initial_brix" type="number" placeholder="Brix érték megadása" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4" />

      <label for="initialWeight" class="block text-lg font-medium text-gray-700 mb-2">Induló súly (kg):</label>
      <input v-model="initialWeight" id="initialWeight" type="number" placeholder="Induló súly megadása" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
    </div>

    <!-- Start gomb -->
    <div class="flex justify-center space-x-6 mt-6">
      <AppButton @click="startMeasurement" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105" :disabled="!selectedFruit">Start</AppButton>
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
      selectedFile: null,          // A feltöltött kép
      prediction: '',              // Predikció eredménye (gyümölcs neve)
      confidence: '',              // Predikció százalékos valószínűsége
      showPrediction: false,       // Pop-up megjelenítése
      showManualSelection: false,  // Manuális gyümölcsválasztás megjelenítése
      selectedFruit: '',           // Választott gyümölcs (ha szükséges)
      initial_brix: null,
      initialWeight: null,
      activeMeasurementId: null,
      error: null,
      success: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async predictImage() {
      if (!this.selectedFile) {
        this.error = "Kérlek, válassz egy képet!";
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await apiClient.post('/predict-image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.prediction = response.data.prediction;
        this.confidence = (response.data.confidence * 100).toFixed(2);
        this.showPrediction = true;
        this.error = null;
      } catch (err) {
        this.error = 'Nem sikerült a predikció végrehajtása.';
        console.error(err);
      }
    },
    confirmPrediction(isCorrect) {
      if (isCorrect) {
        this.selectedFruit = this.prediction;
      } else {
        this.showManualSelection = true;
      }
      this.showPrediction = false;
    },
    async startMeasurement() {
      if (!this.selectedFruit || !this.initial_brix || !this.initialWeight) {
        this.error = 'Kérlek, töltsd ki az összes mezőt!';
        return;
      }

      try {
        await apiClient.post('/start-measurement/', {
          name: this.selectedFruit,
          initial_brix: this.initial_brix,
          initial_weight: this.initialWeight,
          year: new Date().getFullYear(),
        });

        this.success = 'A mérés sikeresen elindult!';
        this.error = null;
      } catch (error) {
        this.error = 'Hiba történt a mérés indítása során.';
      }
    },
  }
};
</script>

<style scoped>
/* Stílus a gombok letiltásához és a felülethez */
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
