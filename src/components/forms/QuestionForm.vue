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
import DynamicForm from '@/components/form/Form.vue'
import formConfigHardcoded from '@/data/FormLayoutOne'
import EventService from '@/services/EventService'
import { ref } from 'vue'

type formPropTypes = {
  id?: string,
  readOnly?: boolean,
  formLayoutKey: string,
}

const props = withDefaults(defineProps<formPropTypes>(), {
  id: undefined,
  formLayoutKey: 'question'
})

const formConfig = ref()
EventService.getDataByFilter('formDefinition', props.formLayoutKey)
  .then((response: any) => {
    // find will return array, get the first in this case
    if (response.data.length > 0) {
      formConfig.value = response.data[0].formDefinition
    } else {
      formConfig.value = formConfigHardcoded.value
    }
  })
  .catch((error) => {
    console.error('Could not fetch formDefinition! Going to hardcoded backup option.', error)
    formConfig.value = formConfigHardcoded
  })

</script>