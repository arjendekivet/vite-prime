<template>
  <DynamicForm :fields="fields" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/DynamicForm.vue'
import { Fieldconfig } from '@/types/fieldconfig'

const states = [
  { name: 'Arizona', code: 'Arizona' },
  { name: 'California', value: 'California' },
  { name: 'Florida', code: 'Florida' },
  { name: 'Ohio', code: 'Ohio' },
  { name: 'Washington', code: 'Washington' }
];

const fields: Fieldconfig[] =
  [
    {
      id: 'firstname',
      label: 'Firstname',
      type: 'P-InputText',
      placeholder: 'Firstname'
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P-InputText',
      placeholder: 'Lastname'
    },
    {
      id: 'state',
      label: 'State',
      type: 'P-Dropdown',
      options: states,
      optionLabel: "name",
      placeholder: 'States'
    }
  ]

</script>