<template>
  <Form :config="fields" data-type="questions" :columns="2" />
</template>

<script setup lang="ts">
import Form from '@/components/form/Form.vue'
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
      isField: true,
      label: 'Test Dummy',
      type: 'P_InputText',
      placeholder: 'Test Dummy',
    },
    {
      id: 'firstname',
      isField: true,
      label: 'Firstname',
      type: 'P_InputText',
      placeholder: 'Firstname',
      validators: ['required', { type: 'minLength', params: [{ min: 2 }] }, { type: 'maxLength', params: [{ max: 10 }] }]
    },
    {
      id: 'lastname',
      isField: true,
      label: 'Lastname',
      type: 'P_InputText',
      placeholder: 'Lastname',
      validators: ['required', { type: 'minLength', params: [{ min: 2 }] }, { type: 'maxLength', params: [{ max: 100 }] }]
    },
    {
      id: 'email',
      isField: true,
      label: 'Email',
      type: 'P_InputText',
      placeholder: 'Email address',
      validators: ['required', 'email']
    },
    {
      id: 'age',
      isField: true,
      label: 'Age',
      type: 'P_InputText',
      placeholder: 'Age',
      validators: ['required', { type: 'between', params: [{ min: 0 }, { max: 100 }], normalizeParams: true }]
    },
    {
      id: 'dateofbirth',
      isField: true,
      label: 'Date of Birth',
      type: 'Calendar',
      placeholder: 'Date of birth',
      validators: ['required', { type: 'between', params: [{ min: new Date("11-11-1950") }, { max: new Date("11-11-2020") }] }]
    },
    {
      id: 'expirydate',
      isField: true,
      label: 'Date of expiration',
      type: 'Calendar',
      placeholder: 'Date of expiration',
      validators: ['required', { type: 'maxValue', params: [{ max: new Date("11-31-2025") }] }]
    },
    {
      id: 'countrystate',
      isField: true,
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