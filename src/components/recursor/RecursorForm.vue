<template>
  <div class="dynamicform">
    <h3 v-if="title">{{ title }}</h3>
    <transition-group name="p-message" tag="div">
      <Message
        v-for="msg of messages"
        v-bind="msg"
        :key="msg.id"
        @close="Utils.removeMessage(messages, msg.id)"
      >{{ msg.content }}</Message>
    </transition-group>
    <div class="p-fluid p-formgrid p-grid">
      <FormLayoutRecursor
        v-for="configObject in config"
        :config="configObject"
        :readOnly="readOnly"
      ></FormLayoutRecursor>
    </div>
    <Toolbar>
      <template #left>
        <template v-if="readOnly">
          <Button type="button" label="Edit" @click="readOnly = false" icon="pi pi-pencil" />
        </template>
        <template v-else>
          <Button type="button" label="Submit" @click="submitForm(dataType)" icon="pi pi-check" />
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
import { ref, provide, readonly } from 'vue'
import FormLayoutRecursor from '@/components/recursor/FormLayoutRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'
import router from '@/router/routes';
import Utils from '@/modules/utils'
import EventService from '@/services/EventService'
import { messages, addSubmitMessage, addErrorMessage } from '@/modules/UseFormMessages'

type FormProp = {
  config: Fieldconfig[],
  dataType: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<FormProp>(), {
  columns: 1,
  id: undefined,
  config: undefined,
})
const emit = defineEmits(['updateFieldValue'])

const fieldValues: any = ref<object>({})
const fields: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

fields.value = getFieldsFromConfig(props.config, 'isField', true)

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
  _.forIn(fields, function (field, fieldId) {
    if (field && field.defaultValue) {
      fieldValues.value[field.id] = field.defaultValue
    }
  })
}

const updateFieldValue = (fieldId: string, value: any) => {
  fieldValues.value[fieldId] = value
}

const addField = (fieldId: string, field: any) => {
  fields.value[fieldId] = field
}

const updateFieldErrors = (fieldId: string, valid: boolean, info: string) => {
  if (!valid) {
    errorFieldsInfo.value[fieldId] = info
    errorFields.value[fieldId] = !valid
  } else {
    delete errorFieldsInfo.value[fieldId]
    delete errorFields.value[fieldId]
  }
}

provide('fieldValues', readonly(fieldValues))
provide('fields', readonly(fields))
provide('errorFields', errorFields)
provide('errorFieldsInfo', errorFieldsInfo)
provide('updateFieldValue', updateFieldValue)
provide('updateFieldErrors', updateFieldErrors)
provide('addField', addField)
provide('calculateDependantFieldState', calculateDependantFieldState)

function submitForm(dataType: string) {
  const hasErrors = Object.keys(errorFields.value).length > 0
  if (hasErrors) {
    addErrorMessage(`The following fields have issues: ${Object.keys(errorFields.value).join(', ')}`)
    return
  }

  // const submitValue: any = getSubmitValue(fieldValues._rawValue)
  const submitValue: any = fieldValues._rawValue
  const id: string = submitValue._id

  if (id) {
    EventService.putForm(dataType, id, submitValue)
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
    EventService.postForm(dataType, submitValue)
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

function convertResponseData(responseData: object): object {
  const converted: any = {}
  _.each(responseData, function (fieldValue: any, key: string) {
    const field = fields.value[key]
    const fieldType: string | undefined = field && field.type
    if (fieldType === 'Calendar') {
      converted[key] = Date.parse(fieldValue) !== NaN ? new Date(fieldValue) : fieldValue
    } else {
      converted[key] = fieldValue
    }
  });
  return converted
}

function getFieldsFromConfig(arr: Fieldconfig[], key: string, value: string | boolean) {
  let matches: object = {};
  if (!Array.isArray(arr)) return matches;

  arr.forEach(function (fieldConfig: Fieldconfig) {
    if (fieldConfig[key] === value) {
      matches[fieldConfig.id] = fieldConfig
    } else {
      if (fieldConfig.items) {
        let childResults = getFieldsFromConfig(fieldConfig.items, key, value)
        matches = { ...matches, ...childResults }
      }
    }
  })
  return matches;
}

function calculateDependantFieldState(field: Fieldconfig, fieldValue: any) {
  field.dependantFields?.forEach(function (fieldId: string) {
    const myField = fields.value[fieldId]
    if (myField) {
      myField.hidden = fieldValue ? false : true

      if (!fieldValue) {
        fieldValues.value[fieldId] = null

        // current field could have dependantFields which have to be hidden now, so call recursively ...
        calculateDependantFieldState(myField, null)
      }
    }
  })
}
</script>

<style lang="scss">
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

  .p-toolbar-group-left {
    .p-button {
      margin-right: 0.5rem;
    }
  }

  .p-toolbar-group-right {
    .p-button {
      margin-left: 0.5rem;
    }
  }

  .p-fieldset {
    margin-bottom: 2em;
  }
}
</style>