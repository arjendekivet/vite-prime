<template>
  <div class="dynamicformlayout">
    <FormLayoutRecursorTwo v-for="config in formConfig" :config="config"></FormLayoutRecursorTwo>
  </div>
</template>

<script setup lang="ts">
import FormLayoutRecursorTwo from '@/components/recursor/FormLayoutRecursorTwo.vue'
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