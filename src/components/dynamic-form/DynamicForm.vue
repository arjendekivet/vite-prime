<template>
  <div class="dynamicform">
    <h3 v-if="title">{{ title }}</h3>
      <transition-group name="p-message-x" tag="div">
      <Message
        v-for="msg of v$.$errors"
        :key="msg.$uid"
        :id="msg.$uid"
        :sticky="true"
        :severity="'error'"
        :content="msg.$message"
      >{{ msg.$message }}</Message>
      </transition-group>
    <transition-group name="p-message" tag="div">
      <Message
        v-for="msg of messages"
        v-bind=msg 
        :key="msg.id" 
        @close="Utils.removeMessage(messages, msg.id)"
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
          <!-- 1. v-model is using dynamic specification of which property to bind to v-model="fieldValues[field.id]"-->
          <!-- 2. since v-model will trigger an emit('update:modelValue', event, DynamicForm instance listens to that event from that field component !!! -->
          <!-- in order to be able for example to do some validation and/or calculate dependendencies and/or emit another custom event on form level: emit('updateFieldValue' -->
          <!-- v-model="fieldValues[field.id]" :v-model="v$[field.id]?.$model || fieldValues[field.id]" -->
          <template v-else>
            <i v-if="getIconName(field)" :class="`pi ${getIconName(field)}`" />
            <component 
              v-bind=field
              :is="field.type"
              :vmodelbak="v$[field.id]?.$model"
              v-model="fieldValues[field.id]"
              @update:modelValue="fieldUpdateHandler($event, field)"
              :class="errorFields[field.id] || v$[field.id]?.$error ? 'p-invalid' : ''"
              :aria-describedby="`${field.id}-help`"
            ></component>
            <small :id="`${field.id}-help`" class="p-error">{{ errorFieldsInfo[field.id] || v$[field.id]?.$errors[0]?.$message }}</small>
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
          <Button type="button" label="Submit" :disabled="v$.$invalid" @click="submitForm" icon="pi pi-check" />
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
import { ref , reactive , computed } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import MessageType from '@/types/message'
import { validate , mapValidators , setValidators, useValidation } from '@/modules/validate'
import EventService from '@/services/EventService'
import _ from 'lodash'
import questionTypes from '@/enums/questionTypes'
import router from '@/router/routes';
import Utils from '@/modules/utils'

const messages = ref<MessageType[]>([]);
const count = ref(0);

// should we use reactive?? if we use ref, we need to unwrap it where we use it etc
const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

type FormProp = {
  fields: Fieldconfig[],
  dataType: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<FormProp>(), {
  columns: 2,
  readOnly: true
})

const emit = defineEmits(['updateFieldValue'])

if (props.id) {
  const record = EventService.getQuestionById(props.id)
    .then((response) => {
      const convertedResponseData = convertResponseData(response.data)
      fieldValues.value = convertedResponseData
      // TODO: we could have fully dynamical rules in the sense of: depending on form definition and form state, the validation rulesset could morph
    })
    .catch((error) => {
      console.error('There was an error!', error);
    })
} else {
  props.fields.forEach(function (field) {
    if (field.defaultValue) {
      fieldValues.value[field.id] = field.defaultValue
    }
    else { 
      fieldValues.value[field.id] = '' 
    }
  })
}

// iterate all fields for field validators config and map these to -vuelidate- validators implementations.
const validatorRules = setValidators(props.fields, undefined ,fieldValues)

// TODO: we could have fully dynamical rules in the sense of: depending on form definition and form state, the rulesset could morph
const rules = computed(() => {
  return validatorRules
})

//const v$ = useVuelidate(rules, fieldValues)
const v$ = useValidation(rules, fieldValues, )

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

function calculateDependantFieldState(field: Fieldconfig, fieldValue: any) {
  field.dependantFields?.forEach(function (fieldId: string) {
    const myField = _.find(props.fields, { id: fieldId })
    if (myField) {
      // ohe: moet dit zijn fieldValue ?? true
      // als fieldValue nu undefined is of null of boolean false of 0 dan geldt die nu as hidden?
      myField.hidden = fieldValue ? false : true

      // empty field that is being hidden
      if (!fieldValue) {
        fieldValues.value[fieldId] = null

        // current field could have dependantFields which have to be hidden now, so call recursively ...
        calculateDependantFieldState(myField, null)
      }
    }
  })
}

/**
 * TODO: do we want to call this update always, id est also when the field does not qualify?
 */
function fieldUpdateHandler(payload: any, field: Fieldconfig) {
  debugger
  validateField(field)
  // Is this necessary and or is it used at this moment? Yes, listened to eg by Question form.
  // Should we only emit when stuff is valid?
  // If we always emit, while also the regular v-model update:<propName>has been triggered 
  // should it be before calling calculateDependantFieldState?
  emit('updateFieldValue', field, payload);

  calculateDependantFieldState(field, payload)
}

function validateField(field: Fieldconfig) {
  debugger
  const value = fieldValues.value[field.id]

  if (v$.value[field.id]) {
    v$.value[field.id].$validate(value)
  }
    //temporarily disable the regular validation
    // const returnValue = validate(value, field.validators)
    // // errorFields.value[field.id] = !returnValue.valid
    // if (!returnValue.valid) {
    //   errorFieldsInfo.value[field.id] = returnValue.info
    //   errorFields.value[field.id] = !returnValue.valid
    // } else {
    //   // errorFieldsInfo.value[field.id] = null
    //   delete errorFieldsInfo.value[field.id]
    //   delete errorFields.value[field.id]
    // }
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

async function submitForm() {
  debugger;
  // use vuelidate to validate the form v$.validate()
  // 1. Call $touch() to indicate it should mark all monitored fields as dirty/touched
  //v$.$touch()
  // 2. Then it should call the validation
  const hasErrors = await v$.value.$validate()
  //const hasErrors = Object.keys(errorFields.value).length > 0
  if (hasErrors) {
    //   //TODO: walk v$.value.$errors and compose an Object for addErrorMessage?
    //   //addErrorMessage(`The following fields have issues: ${Object.keys(errorFields.value).join(', ')}`)
    //   addErrorMessage(`The following fields have issues: ${Object.keys(v$.value.$errors).join(', ')}`)
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
}
</style>