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
      <Message
        v-if="v$.$errors.length > 0"
        key="invalid-fields"
        :sticky="true"
        :severity="'error'"
      >There are fields that do not pass the validation rules. See marked fields.</Message>
    </transition-group>
    <div class="p-fluid p-formgrid p-grid">
      <FormDefinitionRecursor
        v-for="configObject in compConfig"
        :config="configObject"
        :readOnly="readOnly"
      ></FormDefinitionRecursor>
    </div>
    <Toolbar>
      <template #left>
        <template v-if="readOnly">
          <Button type="button" label="Edit" @click="readOnly = false" icon="pi pi-pencil" />
        </template>
        <template v-else>
          <Button
            :disabled="v$.$invalid"
            type="button"
            label="Submit"
            @click="submitForm(dataType)"
            icon="pi pi-check"
          />
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
import { ref, provide, readonly, computed } from 'vue'
import FormDefinitionRecursor from '@/components/form/FormDefinitionRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'
import router from '@/router/routes';
import Utils from '@/modules/utils'
import EventService from '@/services/ApiService'
import { messages, addSubmitMessage, addErrorMessage } from '@/modules/UseFormMessages'
import { setValidators, useValidation } from '@/modules/validate'

import formConfigDefaults from '@/data/FormLayoutDefaults'

type FormProp = {
  config?: Fieldconfig[],
  dataType: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
  formLayoutKey?: string,
}

const props = withDefaults(defineProps<FormProp>(), {
  columns: 1,
  id: undefined,
  config: undefined,
})
const emit = defineEmits(['updateFieldValue'])
const compConfig = computed(
  () => {
    return props.config ? props.config : myConfig.value
  }
)

const fieldValues: any = ref<object>({})
const fields: any = ref<object>({})
const myConfig: any = ref<object>({})

if (props.formLayoutKey) {
  EventService.getDataByFilter('formDefinition', props.formLayoutKey)
    .then((response: any) => {
      // find will return array, get the first in this case
      // isLoading.value = false
      if (response.data.length > 0) {
        myConfig.value = response.data[0].formDefinition
      } else {
        const defaultConfig = formConfigDefaults[props.dataType]
        if (defaultConfig) {
          myConfig.value = defaultConfig
        }
      }
      getFormData()
    })
    .catch((error) => {
      // isLoading.value = false
      console.error('Could not fetch formDefinition! Going to hardcoded backup option.', error)
      // myConfig.value = formConfigHardcoded
    })
} else {
  getFormData()
}

function getFormData() {
  fields.value = getFieldsFromConfig(compConfig.value, 'isField', true)
  if (props.id) {
    EventService.getById(props.dataType, props.id)
      .then((response) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData

        _.forIn(fields.value, function (field, fieldId) {
          const fieldValue = fieldValues.value[fieldId]
          calculateDependantFieldState(field, fieldValue)
        })
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })
  } else {
    _.forIn(fields.value, function (field, fieldId) {
      if (field && field.defaultValue) {
        fieldValues.value[field.id] = field.defaultValue
      }
      calculateDependantFieldState(field, fieldValues.value[field.id])
    })
  }
}

// Use a simple ref for now as there is no combined logic for rules that need it to be computed
// This way type casting stays in place
const rules = ref()
rules.value = setValidators(fields.value, undefined, fieldValues)

// TODO: we could have fully dynamical rules in the sense of: depending on form definition and form state, the rulesset could morph
// const rules = computed(() => {
//   return validatorRules
// })

const v$ = useValidation(rules, fieldValues,)

const updateFieldValue = (fieldId: string, value: any) => {
  fieldValues.value[fieldId] = value

  if (v$.value[fieldId]) {
    v$.value[fieldId].$validate()
  }
}

async function submitForm(dataType: string) {
  await v$.value.$validate()
  if (v$.value.$invalid) {
    const errors = _.map(v$.value.$errors, '$params.fieldLabel')
    addErrorMessage(`The following fields have issues: ${errors.join(', ')}`)
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
      converted[key] = Utils.convertToDate(fieldValue)
    } else {
      converted[key] = fieldValue
    }
  });
  return converted
}

function getFieldsFromConfig(arr: Fieldconfig[], key: string, value: string | boolean) {
  let matches: any = {};
  if (!Array.isArray(arr)) return matches;

  arr.forEach(function (fieldConfig) {
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

provide('fieldValues', readonly(fieldValues))
provide('fields', readonly(fields))
provide('updateFieldValue', updateFieldValue)
provide('calculateDependantFieldState', calculateDependantFieldState)
provide('v$', v$)
</script>

<style lang="scss">
@import "@/css/fieldicons.scss";

.dynamicform {
  .p-formgrid {
    flex-direction: column;
  }
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