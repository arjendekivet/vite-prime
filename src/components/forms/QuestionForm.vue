<template>
  <div v-if="isLoading" class="p-d-flex" style="height:100%;">
    <ProgressSpinner
      style="width:8em;height:8em; margin: auto;"
      strokeWidth="4"
      animationDuration="2s"
    />
  </div>
  <DynamicForm
    v-if="!isLoading"
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
const isLoading = ref(true);

EventService.getDataByFilter('formDefinition', props.formLayoutKey)
  .then((response: any) => {
    // find will return array, get the first in this case
    isLoading.value = false
    if (response.data.length > 0) {
      formConfig.value = response.data[0].formDefinition
    } else {
      formConfig.value = formConfigHardcoded.value
    }
  })
  .catch((error) => {
    isLoading.value = false
    console.error('Could not fetch formDefinition! Going to hardcoded backup option.', error)
    formConfig.value = formConfigHardcoded
  })



</script>