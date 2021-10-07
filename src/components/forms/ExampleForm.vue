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
      id: 'testdummy',
      label: 'Test Dummy',
      type: 'P_InputText',
      placeholder: 'Test Dummy',
    },
    {
      id: 'firstname',
      label: 'Firstname',
      type: 'P_InputText',
      placeholder: 'Firstname',
      validators: [ 'required', { type: 'minLength', params: { min: 2 } }, { type: 'maxLength', params: { max: 10 } } ]
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P_InputText',
      placeholder: 'Lastname',
      validators: [ 'required', { type: 'minLength', params: { min: 2 } }, { type: 'maxLength', params: { max: 100 } } ]
    },
    {
      id: 'email',
      label: 'Email',
      type: 'P_InputText',
      placeholder: 'Email address',
      validators: ['required', 'email']
    },
    {
      id: 'age',
      label: 'Age',
      type: 'P_InputText',
      placeholder: 'Age',
      validators: ['required', { type: 'between', params: { min: 0, max: 100 } } ]
    },
    {
      id: 'dateofbirth',
      label: 'Date of Birth',
      type: 'Calendar',
      placeholder: 'Date of birth',
      validators: ['required', { type: 'between', params: { min: new Date("11-11-1950"), max: new Date("11-11-2020") } } ]
    },
    {
      id: 'expirydate',
      label: 'Date of expiration',
      type: 'Calendar',
      placeholder: 'Date of expiration',
      validators: ['required', { type: 'maxValue', params: { max: new Date("11-31-2025") } } ]
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