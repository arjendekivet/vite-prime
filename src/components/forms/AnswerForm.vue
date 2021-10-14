<template>
  <Form :config="fields" data-type="answers" title="Answers" :id="id" :readOnly="readOnly"></Form>
</template>

<script setup lang="ts">
import Form from '@/components/Form.vue'
import Fieldconfig from '@/types/fieldconfig'

type formPropTypes = {
  id?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<formPropTypes>(), {
  id: undefined
})

const fields: Fieldconfig[] =
  [
    {
      id: 'title',
      isField: true,
      label: 'Title',
      type: 'P_InputText',
      placeholder: 'Title',
      validators: ['required', { type: 'minLength', params: [{ min: 2 }] }, { type: 'maxLength', params: [{ max: 10 }] }],
    },
    {
      id: 'answer',
      isField: true,
      label: 'Answer',
      type: 'P_InputText',
      placeholder: 'Answer'
    }
  ]

</script>