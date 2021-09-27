<template>
  <DynamicForm :fields="fields" data-type="examples" :columns="2" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import Fieldconfig from '@/types/fieldconfig'
import Option from '@/types/Option'

const states: Option[] = [
  { label: 'Arizona', value: 'Arizona' },
  { label: 'California', value: 'California' },
  { label: 'Florida', value: 'Florida' },
  { label: 'Ohio', value: 'Ohio' },
  { label: 'Washington', value: 'Washington' }
];

const fields: Fieldconfig[] =
  [
    {
      id: 'firstname',
      label: 'Firstname',
      type: 'P_InputText',
      placeholder: 'Firstname'
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P_InputText',
      placeholder: 'Lastname'
    },
    {
      id: 'state',
      label: 'State',
      type: 'P_Dropdown',
      options: states,
      optionLabel: "label",
      optionValue: "value",
      placeholder: 'States'
    }
  ]

</script>