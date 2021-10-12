<template>
  <DynamicForm
    :config="formConfig"
    data-type="formDefinition"
    title="Form Definition"
    :id="id"
    :readOnly="readOnly"
  ></DynamicForm>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/form/Form.vue'
import formConfig from '@/data/FormDefinitionLayout'

type formPropTypes = {
  id?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<formPropTypes>(), {
  id: undefined
})

</script>