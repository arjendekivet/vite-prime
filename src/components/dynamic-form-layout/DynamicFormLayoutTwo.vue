<template>
  <div class="dynamicformlayout">
    <FormLayoutRecursor :config="fields"></FormLayoutRecursor>

    <!-- <Recursor3
      v-for="item in fields.items"
      :key="item.id"
      :config="item"
      :label="item.label || 'uhhhhh'"
    ></Recursor3>-->
  </div>
</template>

<script setup lang="ts">
import FormLayoutRecursor from '@/components/recursor/FormLayoutRecursor.vue'

type configContainer = {
  items?: configContainer[],
  id?: string,
  type?: string,
  isContainer?: boolean,
  placeholder?: string,
  label?: string,
}

type FormProp = {
  fields: configContainer,
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