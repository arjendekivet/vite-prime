<template>
  <div class="dynamicformlayout">
    <RecursorForm
      :config="formConfig"
      data-type="questions"
      title="Question"
      :id="id"
      :readOnly="readOnly"
    ></RecursorForm>
  </div>
</template>

<script setup lang="ts">
import RecursorForm from '@/components/recursor/RecursorForm.vue'
import formConfig from '@/data/FormLayoutOne'

type formPropTypes = {
  id?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<formPropTypes>(), {
  id: undefined
})

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