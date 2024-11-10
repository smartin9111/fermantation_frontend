<template>
  <div class="max-w-lg mx-auto bg-gray-100 p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Kép feltöltése és predikció</h1>

    <div class="mb-4">
      <label for="file-upload" class="block text-lg font-medium mb-2">Tölts fel egy képet</label>
      <input type="file" id="file-upload" @change="onFileChange" accept="image/*" class="block w-full p-2 border rounded">
    </div>

    <div class="mb-4">
      <button class="bg-blue-500 text-white py-2 px-4 rounded w-full" @click="uploadImage" :disabled="!selectedFile">Kép feltöltése és predikció</button>
    </div>

    <div v-if="prediction" class="mt-4 p-4 bg-green-100 rounded">
      <h2 class="text-lg font-bold">Predikció eredménye:</h2>
      <p>Gyümölcs: <strong>{{ prediction }}</strong></p>
      <p>Biztonság: <strong>{{ confidence }}%</strong></p>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-100 rounded">
      <p class="text-red-600">Hiba történt: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '../api'; 

const selectedFile = ref(null);  
const prediction = ref(null);    
const confidence = ref(null);    
const error = ref(null);  

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    error.value = "Kérjük, válassz egy képet!";
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await apiClient.post('/predict-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Predikció eredménye
    prediction.value = response.data.prediction;
    confidence.value = (response.data.confidence * 100).toFixed(2); 
    error.value = null;
  } catch (err) {
    error.value = 'Nem sikerült a predikció végrehajtása.';
    console.error(err);
  }
};
</script>

<style scoped>
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
