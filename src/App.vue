<template>
  <div id="app" class="flex flex-col min-h-screen">
    <AppNavbar />
    <main class="flex-grow mt-16 mb-16 p-4">
      <router-view /> 
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from './components/layout/AppNavbar.vue';
import AppFooter from './components/layout/AppFooter.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
