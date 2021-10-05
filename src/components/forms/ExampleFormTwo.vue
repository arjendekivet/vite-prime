<template>
  <div class="dynamicformlayout">
    <FormLayoutRecursor v-for="config in formConfig" :config="config"></FormLayoutRecursor>
  </div>
</template>

<script setup lang="ts">
import FormLayoutRecursor from '@/components/recursor/FormLayoutRecursor.vue'
import formConfig from '@/data/FormLayoutOne'

</script>

<style lang="scss">
.dynamicformlayout {
  textarea {
    resize: none;
  }

  .pi {
    z-index: 1;
  }

  .p-field > label {
    margin-left: 0.25rem;
  }
}
</style>