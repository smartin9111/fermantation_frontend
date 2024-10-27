<template>
  <div>
    <h1>Test Django Connection</h1>
    <AppButton @click="testConnection">Test Connection</AppButton>
    <p v-if="response && response.ph_value !== undefined">pH érték: {{ response.ph_value }}</p>
    <p v-if="error" style="color: red;">Error: {{ error }}</p>
  </div>
</template>

<script>
import apiClient from '../api';
import AppButton from '../components/ui/AppButton.vue';

export default {
  name: 'AppTestConnect',
  components: {
    AppButton
  },
  data() {
    return {
      response: null,
      error: null
    };
  },
  methods: {
    async testConnection(resetLoading) {
      try {
        const res = await apiClient.get('/get-ph');
        this.response = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        resetLoading();
      }
    }
  }
};
</script>
