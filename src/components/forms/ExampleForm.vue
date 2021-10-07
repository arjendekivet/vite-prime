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
      placeholder: 'Firstname',
      validators: [ 'required', { type: 'minLength', params: { min: 2 } }, { type: 'maxLength', params:{ max: 10 } } ]
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P_InputText',
      placeholder: 'Lastname',
      validators: [ 'required', { type: 'minLength', params: { min: 2 } }, { type: 'maxLength', params:{ max: 100 } } ]
    },
    {
      id: 'email',
      label: 'Email',
      type: 'P_InputText',
      placeholder: 'Email address',
      validators: [ 'required', 'email']
    },
    {
      id: 'countrystate',
      label: 'Country State',
      type: 'P_Dropdown',
      options: states,
      optionLabel: "label",
      optionValue: "value",
      placeholder: 'Country States',
      validators: ['required']
    }
  ]

</script>