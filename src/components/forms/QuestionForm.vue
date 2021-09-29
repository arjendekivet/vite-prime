<template>
  <DynamicForm
    :fields="fields"
    data-type="questions"
    :columns="2"
    title="Question"
    :id="id"
    :readOnly="readOnly"
    @update-field-value="fieldValueUpdated"
  />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import Fieldconfig from '@/types/fieldconfig'
import QuestionType from '@/enums/questionTypes'
import OptionType from '@/types/Option'
import { ref } from 'vue'

type formPropTypes = {
  id?: string,
  readOnly?: boolean,
}

const catOne: OptionType[] = [
  { label: 'Duits', value: 'DE' },
  { label: 'Engels', value: 'EN' },
  { label: 'Frans', value: 'FR' },
];

const catTwo: OptionType[] = [
  { label: 'Chapter one', value: 'Ch-1' },
  { label: 'Chapter two', value: 'Ch-2' },
  { label: 'Chapter five', value: 'Ch-5' },
];

const catThree: OptionType[] = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'D', value: 'D' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' },
];

const props = withDefaults(defineProps<formPropTypes>(), {
  id: undefined
})

const fields = ref<Fieldconfig[]>([])
fields.value =
  [
    {
      id: '_id',
      label: 'Id',
      type: 'P_InputText',
      disabled: true,
      icon: { type: 'right', name: 'pi-lock' }
    },
    {
      id: 'title',
      label: 'Title',
      type: 'P_InputText',
      placeholder: 'Title',
      validators: ['required'],
      icon: { type: 'right', name: 'pi-bookmark' }
    },
    {
      id: 'type',
      label: 'Question type',
      type: 'P_Dropdown',
      options: QuestionType,
      optionLabel: "label",
      optionValue: "value",
      validators: ['required'],
      icon: { type: 'left', name: 'pi-bookmark' },
      defaultValue: 'open'
    },
    {
      id: 'cat_1',
      label: 'Category 1',
      type: 'P_Dropdown',
      options: catOne,
      optionLabel: "label",
      optionValue: "value",
      editable: true,
      validators: ['required'],
      dependantFields: ['cat_2'],
    },
    {
      id: 'cat_2',
      label: 'Category 2',
      type: 'P_Dropdown',
      options: catTwo,
      optionLabel: "label",
      optionValue: "value",
      editable: true,
      dependantFields: ['cat_3'],
    },
    {
      id: 'cat_3',
      label: 'Category 3',
      type: 'P_Dropdown',
      options: catThree,
      optionLabel: "label",
      optionValue: "value",
      editable: true,
    },
    {
      id: 'due',
      label: 'Due on',
      type: 'Calendar',
      showIcon: true,
    },
    {
      id: 'description',
      label: 'Description',
      type: 'P_Textarea',
      placeholder: 'Description',
      maxColumns: 1
    },
    {
      id: 'answer',
      label: 'Answer',
      type: 'P_Textarea',
      placeholder: 'Answer',
      maxColumns: 1
    }
  ]

function fieldValueUpdated(field: Fieldconfig, value: any) {
  console.log('running fieldValueUpdated in QuestionForm via @update-field-value on <DynamicForm')
  console.log(field)
  console.log(value)
}

</script>