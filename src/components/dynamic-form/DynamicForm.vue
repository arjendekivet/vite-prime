<template>
  <div class="card dynamicform">
    <div class="p-fluid p-formgrid p-grid">
      <div
        v-for="field in fields"
        :class="`p-field ${getIconType(field)} p-col-12 p-md-${12 / getColumns(columns, field.maxColumns)}`"
      >
        <label :for="field.id">{{ field.label }}{{ getRequired(field) }}</label>
        <i v-if="getIconName(field)" :class="`pi ${getIconName(field)}`" />
        <component
          :is="field.type"
          :id="field.id"
          v-model="fieldValues[field.id]"
          @blur="fieldChangeHandler(field)"
          @change="fieldChangeHandler(field)"
          :disabled="field.disabled"
          :options="field.options ? field.options : null"
          :optionLabel="field.optionLabel"
          :optionValue="field.optionValue"
          :placeholder="field.placeholder"
          :class="errorFields[field.id] ? 'p-invalid' : ''"
          :aria-describedby="`${field.id}-help`"
          :showIcon="field.showIcon"
        ></component>
        <small :id="`${field.id}-help`" class="p-error">{{ errorFieldsInfo[field.id] }}</small>
      </div>
    </div>
    <Button type="button" label="Submit" @click="submitForm" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import { validate } from '@/modules/validate'
import EventService from '@/services/EventService'
import _ from 'lodash'
import questionTypes from '@/enums/questionTypes'

type formPropTypes = {
  fields: Fieldconfig[],
  columns?: number,
  dataType: string
}

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

// const compFieldValues = computed(() => fieldValues)

const props = withDefaults(defineProps<formPropTypes>(), {
  columns: 2
})

function getRequired(field: Fieldconfig) {
  return _.isArray(field.validators) && _.indexOf(field.validators, 'required') > -1 ? ' *' : null
}

function getColumns(columns: number, maxColumns: number | undefined) {
  return maxColumns && maxColumns < columns ? maxColumns : columns
}

function getIconType(field: Fieldconfig) {
  return field.icon && field.icon.type ? 'aki-input-icon-' + field.icon.type : null
}

function getIconName(field: Fieldconfig) {
  return field.icon && field.icon.name
}

function fieldChangeHandler(field: Fieldconfig) {
  validateField(field)
}

function validateField(field: Fieldconfig) {
  const value = fieldValues.value[field.id]

  if (field.validators) {
    const returnValue = validate(value, field.validators)
    errorFields.value[field.id] = !returnValue.valid
    if (!returnValue.valid) {
      errorFieldsInfo.value[field.id] = returnValue.info
    } else {
      errorFieldsInfo.value[field.id] = null
    }
  }
}

// Not really used at this point
function getSubmitValue(myFieldValues: object): object {
  const submitValue: any = {}
  _.each(myFieldValues, function (fieldValue: any, key: string) {
    if (myFieldValues.hasOwnProperty(key)) {
      submitValue[key] = fieldValue && fieldValue.value ? fieldValue.value : fieldValue
    }
  });
  return submitValue
}

function submitForm() {
  const submitValue: any = getSubmitValue(fieldValues._rawValue)
  const id: string = submitValue._id

  if (id) {
    EventService.putForm(props.dataType, id, submitValue)
      .then((response) => {
        console.log('Submit succesfull ...', response)
        fieldValues.value = response.data
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })
  } else {
    EventService.postForm(props.dataType, submitValue)
      .then((response) => {
        console.log('Submit succesfull ...', response)
        fieldValues.value = response.data
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })
  }
}

// function getFormValues(submitValues: any) {
//   _.each(submitValues, function (submitValue: any, key: string) {
//     // const field = _.find(props.fields, { 'id': key })
//     if (props.dataType === 'questions' && key === 'type') {
//       const questionType = _.find(questionTypes, { 'value': submitValue })
//       fieldValues.value[key] = questionType
//     } else {
//       fieldValues.value[key] = submitValues.data[key]
//     }
//   });
// }

</script>

<style lang="scss">
@import "./fieldicons.scss";

.dynamicform {
  textarea {
    resize: none;
  }

  .pi {
    z-index: 1;
  }
}
</style>