<template>
  <DynamicForm :fields="fields" :columns="2" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/DynamicForm.vue'
import Fieldconfig from '@/types/fieldconfig'
import Option from '@/types/Option'

const questionType: Option[] = [
  { label: 'Open', value: 'open' },
  { label: 'Multiple choice', value: 'mc' },
  { label: 'Rating scale', value: 'rs' },
];

const fields: Fieldconfig[] =
  [
    {
      id: 'id',
      label: 'Id',
      type: 'P-InputText',
      disabled: true,
    },
    {
      id: 'title',
      label: 'Title',
      type: 'P-InputText',
      placeholder: 'Title'
    },
    {
      id: 'type',
      label: 'Question type',
      type: 'P-Dropdown',
      options: questionType,
      optionLabel: "label",
    },
    {
      id: 'description',
      label: 'Description',
      type: 'P-Textarea',
      placeholder: 'Description'
    }
  ]

</script>