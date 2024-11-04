<template>
  <div class="p-8 max-w-2xl mx-auto bg-white shadow rounded">
    <h1 class="text-2xl font-semibold mb-6">Kiértékelés rögzítése</h1>

    <div v-if="success" class="mb-4 text-green-600">{{ success }}</div>
    <div v-if="error" class="mb-4 text-red-600">{{ error }}</div>

    <!-- Mérési azonosító kiválasztása -->
    <label for="measurement" class="block mb-2 text-sm font-medium text-gray-700">Mérés kiválasztása</label>
    <select v-model="selectedMeasurement" id="measurement" class="mb-4 p-2 border rounded w-full">
      <option v-for="measurement in measurements" :key="measurement.id" :value="measurement.id">
        {{ measurement.name }} ({{ measurement.stopped_at }})
      </option>
    </select>

    <!-- Kihozatal megadása -->
    <label for="yieldAmount" class="block mb-2 text-sm font-medium text-gray-700">Kihozatal (liter)</label>
    <input v-model="yieldAmount" type="number" id="yieldAmount" class="mb-4 p-2 border rounded w-full" />

    <!-- Alkoholtartalom megadása -->
    <label for="alcoholContent" class="block mb-2 text-sm font-medium text-gray-700">Alkoholfok</label>
    <input v-model="alcoholContent" type="number" id="alcoholContent" class="mb-4 p-2 border rounded w-full" />

    <!-- Íz osztályozása -->
    <label for="tasteRating" class="block mb-2 text-sm font-medium text-gray-700">Íz osztályozása (1-10)</label>
    <input v-model="tasteRating" type="number" id="tasteRating" min="1" max="10" class="mb-4 p-2 border rounded w-full" />

    <!-- Illat osztályozása -->
    <label for="smellRating" class="block mb-2 text-sm font-medium text-gray-700">Illat osztályozása (1-10)</label>
    <input v-model="smellRating" type="number" id="smellRating" min="1" max="10" class="mb-4 p-2 border rounded w-full" />

    <!-- Karakter osztályozása -->
    <label for="characterRating" class="block mb-2 text-sm font-medium text-gray-700">Karakter osztályozása (1-10)</label>
    <input v-model="characterRating" type="number" id="characterRating" min="1" max="10" class="mb-4 p-2 border rounded w-full" />

    <!-- Form beküldése -->
    <AppButton @click="submitForm" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Rögzítés</AppButton>
  </div>
</template>

<script>
import apiClient from '../api';
import AppButton from '../components/ui/AppButton.vue';

export default {
    name: 'AppEvaluation',
	components: { AppButton },
    data() {
        return {
            selectedMeasurement: '',
            yieldAmount: null,
            alcoholContent: null,
            tasteRating: null,
            smellRating: null,
            characterRating: null,
            success: null,
            error: null,
            measurements: [] // Feltöltendő mérések listája
        };
    },
    methods: {
        async fetchMeasurements() {
            try {
                const response = await apiClient.get('/inactive-measurements/');
                this.measurements = response.data;
            }
            catch (error) {
                this.error = 'Hiba történt a mérések betöltése során.';
            }
        },
        async submitForm() {
            try {
                await apiClient.post(`/add-evaluation/${this.selectedMeasurement}/`, {
					yield_amount: this.yieldAmount,
					alcohol_content: this.alcoholContent,
					taste_rating: this.tasteRating,
					smell_rating: this.smellRating,
					character_rating: this.characterRating
				});
                this.success = 'Az adatok sikeresen rögzítve lettek!';
            }
            catch (error) {
                this.error = 'Hiba történt az adatok rögzítése során.';
            }
        }
    },
    mounted() {
        this.fetchMeasurements();
    },
};
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}
.shadow {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
