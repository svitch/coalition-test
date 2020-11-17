<template>
  <v-app>
    <UploadForm />
  </v-app>
</template>

<script>
import '@/assets/icons/style.css';
import UploadForm from './components/UploadForm.vue';

export default {
  name: 'App',
  components: {
    // VideoUpload,
    UploadForm,
  },
};
</script>
