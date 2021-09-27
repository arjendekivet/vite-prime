<template>
  <h3>Start</h3>

  <Button type="button" icon="pi pi-file" label="Go to admin page" @click="goToAdmin" />
</template>

<script setup lang="ts">
import router from '@/router/routes';

function goToAdmin() {
  router.push({ name: 'admin' })
}

</script>