<template>
  <div class="welcome p-d-flex p-flex-column">
    <h3>Welcome to Cynapps Spaced Repetition Learning App</h3>
    <img :src="leitner" class="p-m-auto" />

    <!-- <Button
      label="Start"
      icon="pi pi-caret-right"
      class="p-m-auto"
      @click="router.push({ name: 'home_pick' })"
    />-->
  </div>
</template>

<script setup lang="ts">
import router from '@/router/routes'
import leitner from '@/assets/leitner.png'
</script>