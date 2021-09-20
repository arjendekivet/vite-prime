<template>
  <div class="dynamicform">
    <h3 v-if="title">{{ title }}</h3>
    <transition-group name="p-message" tag="div">
      <Message
        v-for="msg of messages"
        :severity="msg.severity"
        :key="msg.id"
        :life="msg.life"
        :sticky="msg.sticky"
        @close="removeMessage(msg.id)"
      >{{ msg.content }}</Message>
    </transition-group>
    <div class="p-fluid p-formgrid p-grid">
      <template v-for="field in fields">
        <div
          v-if="!field.hidden"
          :class="`p-field p-text-left ${getIconType(field)} p-col-12 p-md-${12 / getColumns(columns, field.maxColumns)}`"
        >
          <label :for="field.id">{{ field.label }}{{ getRequired(field) }}</label>
          <template v-if="readOnly">
            <div>{{ fieldValues[field.id] }}</div>
          </template>
          <template v-else>
            <i v-if="getIconName(field)" :class="`pi ${getIconName(field)}`" />
            <component
              :is="field.type"
              :id="field.id"
              v-model="fieldValues[field.id]"
              @update:modelValue="fieldUpdateHandler($event, field)"
              :disabled="field.disabled"
              :options="field.options ? field.options : null"
              :optionLabel="field.optionLabel"
              :optionValue="field.optionValue"
              :placeholder="field.placeholder"
              :class="errorFields[field.id] ? 'p-invalid' : ''"
              :aria-describedby="`${field.id}-help`"
              :showIcon="field.showIcon"
              :editable="field.editable"
            ></component>
            <small :id="`${field.id}-help`" class="p-error">{{ errorFieldsInfo[field.id] }}</small>
          </template>
        </div>
      </template>
    </div>
    <Toolbar>
      <template #left>
        <template v-if="readOnly">
          <Button type="button" label="Edit" @click="readOnly = false" icon="pi pi-pencil" />
        </template>
        <template v-else>
          <Button type="button" label="Submit" @click="submitForm" icon="pi pi-check" />
        </template>
        <Button
          type="button"
          label="Close"
          @click="router.back"
          icon="pi pi-times"
          class="p-button-secondary"
        />
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import { validate } from '@/modules/validate'
import EventService from '@/services/EventService'
import _ from 'lodash'
import questionTypes from '@/enums/questionTypes'
import router from '@/router/routes';

type message = {
  id: number,
  content: string,
  severity?: string,
  closable?: boolean,
  sticky?: boolean,
  life?: number,
}

const messages = ref<message[]>([]);
const count = ref(0);

type formPropTypes = {
  fields: Fieldconfig[],
  dataType: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
}

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

// const compFieldValues = computed(() => fieldValues)

const props = withDefaults(defineProps<formPropTypes>(), {
  columns: 2,
  readOnly: true
})

const emit = defineEmits(['updateFieldValue'])

if (props.id) {
  const record = EventService.getQuestionById(props.id)
    .then((response) => {
      const convertedResponseData = convertResponseData(response.data)
      fieldValues.value = convertedResponseData
    })
    .catch((error) => {
      console.error('There was an error!', error);
    })
} else {
  props.fields.forEach(function (field) {
    if (field.defaultValue) {
      fieldValues.value[field.id] = field.defaultValue
    }
  })
}

function removeMessage(id: number) {
  const found = _.find(messages.value, { 'id': id })
  if (found) {
    messages.value = _.without(messages.value, found)
  }
}

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

function fieldUpdateHandler(payload: any, field: Fieldconfig) {
  validateField(field)
  emit('updateFieldValue', field, payload);

}

function validateField(field: Fieldconfig) {
  const value = fieldValues.value[field.id]

  if (field.validators) {
    const returnValue = validate(value, field.validators)
    // errorFields.value[field.id] = !returnValue.valid
    if (!returnValue.valid) {
      errorFieldsInfo.value[field.id] = returnValue.info
      errorFields.value[field.id] = !returnValue.valid
    } else {
      // errorFieldsInfo.value[field.id] = null
      delete errorFieldsInfo.value[field.id]
      delete errorFields.value[field.id]
    }
  }
}

function convertResponseData(responseData: object): object {
  const converted: any = {}
  _.each(responseData, function (fieldValue: any, key: string) {
    const field = _.find(props.fields, { 'id': key })
    const fieldType: string | undefined = field && field.type

    if (fieldType === 'Calendar') {
      converted[key] = Date.parse(fieldValue) !== NaN ? new Date(fieldValue) : fieldValue
    } else {
      converted[key] = fieldValue
    }
  });
  return converted
}

// Not really used at this point
// function getSubmitValue(myFieldValues: object): object {
//   const submitValue: any = {}
//   _.each(myFieldValues, function (fieldValue: any, key: string) {
//     if (myFieldValues.hasOwnProperty(key)) {
//       submitValue[key] = fieldValue && fieldValue.value ? fieldValue.value : fieldValue
//     }
//   });
//   return submitValue
// }

function addSubmitMessage() {
  messages.value.push(
    { severity: 'success', sticky: false, content: 'Form succesfully saved', id: count.value++ },
  )
}

function addErrorMessage(error: any) {
  messages.value.push(
    { severity: 'error', sticky: true, content: error, id: count.value++ },
  )
}

function submitForm() {
  const hasErrors = Object.keys(errorFields.value).length > 0
  if (hasErrors) {
    addErrorMessage(`The following fields have issues: ${Object.keys(errorFields.value).join(', ')}`)
    return
  }

  // const submitValue: any = getSubmitValue(fieldValues._rawValue)
  const submitValue: any = fieldValues._rawValue
  const id: string = submitValue._id

  if (id) {
    EventService.putForm(props.dataType, id, submitValue)
      .then((response) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData
        addSubmitMessage()
      })
      .catch((error) => {
        addErrorMessage(
          error.response && error.response.data && error.response.data.error
            ? error + " ==> " + error.response.data.error
            : error)
      })
  } else {
    EventService.postForm(props.dataType, submitValue)
      .then((response) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData
        addSubmitMessage()
      })
      .catch((error) => {
        addErrorMessage(
          error.response && error.response.data && error.response.data.error
            ? error + " ==> " + error.response.data.error
            : error)
      })
  }
}

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

  .p-field > label {
    margin-left: 0.25rem;
  }
}
</style>