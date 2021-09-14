<template>
  <DynamicForm :fields="fields" data-type="questions" :columns="2" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
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
      id: '_id',
      label: '_Id',
      type: 'P-InputText',
      disabled: true,
    },
    {
      id: 'title',
      label: 'Title',
      type: 'P-InputText',
      placeholder: 'Title',
      validators: ['required'],
      icon: { type: 'right', name: 'pi-search' }
    },
    {
      id: 'type',
      label: 'Question type',
      type: 'P-Dropdown',
      options: questionType,
      optionLabel: "label",
      validators: ['required']
    },
    {
      id: 'description',
      label: 'Description',
      type: 'P-Textarea',
      placeholder: 'Description',
      validators: ['required'],
      maxColumns: 1
    }
  ]

</script>