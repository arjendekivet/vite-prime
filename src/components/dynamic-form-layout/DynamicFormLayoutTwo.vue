<template>
  <div class="dynamicformlayout">
    <FormLayoutRecursor :config="config"></FormLayoutRecursor>
  </div>
</template>

<script setup lang="ts">
import FormLayoutRecursor from '@/components/recursor/FormLayoutRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'

type FormProp = {
  config: Fieldconfig,
}
const props = withDefaults(defineProps<FormProp>(), {})


</script>

<style lang="scss">
@import "./fieldicons.scss";

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