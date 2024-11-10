<template>
  <nav class="bg-gray-800 p-4 fixed w-full top-0 left-0 z-10">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-bold">
        <router-link to="/" class="text-white">Fermentáció</router-link>
      </div>
      
      <!-- Desktop Menu -->
      <ul class="hidden sm:flex space-x-4">
		<li><router-link to="/meters" class="text-white">Mérések</router-link></li>
        <li><router-link to="/newmeters" class="text-white">Új Mérés</router-link></li> 
        <li><router-link to="/ph-measurement" class="text-white">pH Mérés</router-link></li>
        <li><router-link to="/brix" class="text-white">Brix Rözítése</router-link></li> 
        <li><router-link to="/evaluation" class="text-white">Értékelések</router-link></li>
        <li><router-link to="/testpredict" class="text-white">AI Teszt</router-link></li> 
        <li><router-link to="/test" class="text-white">Conn test</router-link></li> 
      </ul>

      <!-- Hamburger Icon -->
      <button 
        class="sm:hidden text-white focus:outline-none" 
        @click="toggleMenu">
        ☰
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isOpen" class="sm:hidden bg-gray-700">
      <ul class="flex flex-col space-y-2 p-4">
		<li><router-link to="/meters" class="text-white">Mérések</router-link></li>
        <li><router-link to="/newmeters" class="text-white">Új Mérés</router-link></li> 
        <li><router-link to="/ph-measurement" class="text-white">pH Mérés</router-link></li>
        <li><router-link to="/brix" class="text-white">Brix Rözítése</router-link></li> 
        <li><router-link to="/evaluation" class="text-white">Értékelések</router-link></li>
        <li><router-link to="/testpredict" class="text-white">AI Teszt</router-link></li> 
        <li><router-link to="/test" class="text-white">Conn test</router-link></li> 
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}
</script>
