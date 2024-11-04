<template>
  <button 
    @click="handleClick" 
    :disabled="loading"
    class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-md border border-gray-600"
  >
    <slot v-if="!loading" />
    <span v-else>Loading...</span>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
 
};
</script>
