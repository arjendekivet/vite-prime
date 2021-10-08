<template>
  <DynamicForm
    :config="formConfig"
    data-type="questions"
    title="Question"
    :id="id"
    :readOnly="readOnly"
  ></DynamicForm>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import formConfig from '@/data/FormLayoutOne'

type formPropTypes = {
  id?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<formPropTypes>(), {
  id: undefined
})

</script>