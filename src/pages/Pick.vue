<template>
  <h3>Pick learning category</h3>

  <P_Dropdown
    v-model="selectedCategory"
    :options="catOne"
    optionLabel="label"
    optionValue="value"
    placeholder="Select a Category"
  />
  <Button
    label="Go!"
    icon="pi pi-youtube"
    class="p-ml-1"
    @click="router.push({ name: 'questionnaire', params: { category: selectedCategory } })"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/routes'

const catOne: any = [
  { label: 'Duits', value: 'DE' },
  { label: 'Engels', value: 'EN' },
  { label: 'Frans', value: 'FR' },
]

const selectedCategory = ref()


</script>