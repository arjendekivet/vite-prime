<template>
  <DynamicForm :fields="fields" data-type="questions" :columns="2" />
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import Fieldconfig from '@/types/fieldconfig'
import questionType from '@/enums/questionTypes'

const fields: Fieldconfig[] =
  [
    {
      id: 'id',
      label: 'Id',
      type: 'P-InputText',
      disabled: true,
      icon: { type: 'right', name: 'pi-lock' }
    },
    {
      id: '_id',
      label: '_Id',
      type: 'P-InputText',
      disabled: true,
      icon: { type: 'right', name: 'pi-lock' }
    },
    {
      id: 'title',
      label: 'Title',
      type: 'P-InputText',
      placeholder: 'Title',
      validators: ['required'],
      icon: { type: 'right', name: 'pi-bookmark' }
    },
    {
      id: 'type',
      label: 'Question type',
      type: 'P-Dropdown',
      options: questionType,
      optionLabel: "label",
      optionValue: "value",
      validators: ['required'],
      icon: { type: 'left', name: 'pi-bookmark' }
    },
    {
      id: 'created',
      label: 'Created on',
      type: 'Calendar',
      showIcon: true,

    },
    {
      id: 'description',
      label: 'Description',
      type: 'P-Textarea',
      placeholder: 'Description',
      maxColumns: 1
    }
  ]

</script>