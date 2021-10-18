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
        v-for="configObject in config"
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
          <Button type="button" label="Submit" :disabled="v$.$invalid" @click="submitForm(dataType)" icon="pi pi-check" />
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
import { ref, provide, readonly, reactive, computed, watchEffect } from 'vue'
import FormDefinitionRecursor from '@/components/form/FormDefinitionRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'
import router from '@/router/routes';
import Utils from '@/modules/utils'
import EventService from '@/services/EventService'
import { messages, addSubmitMessage, addErrorMessage } from '@/modules/UseFormMessages'
import { validate, mapValidators, setValidators, useValidation } from '@/modules/validate'

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

fields.value = getFieldsFromConfig(props.config, 'isField', true)

if (props.id) {
  const record = EventService.getById(props.dataType, props.id)
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

// TODO: if we need to pass in v$ into setValidators, we need a valid reference to v$ ???
// but 
let v$ = ref({})
 // should validatorRules be a reactive object?
let validatorRules = ref({})
let abortSetValidators = ref(true) // initially do not set up rules, until v$ is properly populated

// TODO: remove the reactive dependency on v$ itself ????????? 
// first initiate dummy rules?
//validatorRules = setValidators(v$.value, fields.value, {}, fieldValues.value)

watchEffect(() => fieldValues.value)

// TODO: we could have fully dynamical rules in the sense of: depending on form definition and form state, the rulesset could morph
// if some relevant state changes or metadata changes, we could recalculate the ruleset? but HOW exactly?
const rules = computed(() => {
      console.log('executing computed "rules"')
      // use some assignments simply to make rules explicitely dependent upon fields and FieldValues
      let dep1 = fieldValues.value;
      let dep2 = fields.value;
      //let dep3 = v$.value;
      //let lv$ = v$.value ????
      //abortSetValidators.value = ?????
      debugger;
      //validatorRules = setValidators(v$.value, fields.value, {}, fieldValues.value)
      return setValidators(undefined, fields.value, {}, fieldValues.value)
    }, { 
        onTrack(e) {
          // triggered when the above is tracked as a dependency
          //debugger
          console.log('executing onTrack in computed "rules"')
        },
        onTrigger(e) {
          // triggered when the above is mutated
          debugger
          console.log('executing onTrigger in computed "rules"')
        }
    }
)

// TODO useValidation plus extra global config like autoDirty or lazy or ???
v$ = useValidation(rules, fieldValues,)

const updateFieldValue = (fieldId: string, value: any) => {
  fieldValues.value[fieldId] = value

  if (v$.value[fieldId]) {
    v$.value[fieldId].$validate()
  }
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

async function submitForm(dataType: string) {
  
  const hasErrors = await v$.value.$validate()
  if (hasErrors) {
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
  console.log('exiting calculateDependantFieldState')
  return
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
@import "@/components/form/fieldicons.scss";

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