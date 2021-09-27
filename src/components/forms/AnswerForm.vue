<template>
  <DynamicForm :fields="fields" data-type="answers" :columns="2" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import Fieldconfig from '@/types/fieldconfig'

const fields: Fieldconfig[] =
  [
    {
      id: 'title',
      label: 'Title',
      type: 'P_InputText',
      placeholder: 'Title'
    },
    {
      id: 'answer',
      label: 'Answer',
      type: 'P_InputText',
      placeholder: 'Answer'
    }
  ]

</script>