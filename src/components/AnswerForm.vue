<template>
  <DynamicForm :fields="fields" :columns="2" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import Fieldconfig from '@/types/fieldconfig'

const fields: Fieldconfig[] =
  [
    {
      id: 'title',
      label: 'Title',
      type: 'P-InputText',
      placeholder: 'Title'
    },
    {
      id: 'answer',
      label: 'Answer',
      type: 'P-InputText',
      placeholder: 'Answer'
    }
  ]

</script>