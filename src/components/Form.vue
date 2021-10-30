<template>
  <div class="dynamicform">
    <h3 v-if="title">{{ title }}</h3>
    <transition-group name="p-message" tag="div">
      <Message
        v-for="msg of messages"
        v-bind="msg"
        :key="msg.id"
        @close="removeMessage(msg.id)"
      >{{ msg.content }}</Message>
      <Message
        v-if="v$?.$errors?.length > 0"
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
            :disabled="v$?.$invalid"
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
import { ref, provide, readonly, computed, onBeforeMount, onBeforeUnmount, inject } from 'vue'
import FormDefinitionRecursor from '@/components/FormDefinitionRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'
import Utils from '@/modules/utils'
import { messages, addSubmitMessage, addErrorMessage, addWarningMessage } from '@/modules/UseFormMessages'
import { setValidators, useValidation } from '@/modules/validate'
import formConfigDefaults from '@/data/FormLayoutDefaults'
import { resolve } from 'path/posix'

type FormProp = {
  config?: Fieldconfig[],
  dataType: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
  formLayoutKey?: string,
  initialFormData?: any
}

const router: any = inject('router')
const EventService: any = inject('EventService')

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

// Use a simple ref for now as there is no combined logic for rules that need it to be computed
// This way type casting stays in place
const rules = ref({})

const v$ = useValidation(rules, fieldValues, { $lazy: false, $autoDirty: true } ) //  $rewardEarly nog net supported? $commit() dan ook nog net.

const getFormData = async function() {
    try {
      fields.value = getFieldsFromConfig(compConfig.value, 'isField', true)
      rules.value = setValidators(fields.value, undefined, fieldValues)

      if (props.initialFormData) {
        fieldValues.value = props.initialFormData
      } else if (props.id) {
          let response = await EventService.getById(props.dataType, props.id)
          fieldValues.value = convertResponseData(response?.data)
      } else {
        _.forIn(fields.value, function (field, fieldId) {
          if (field && field.defaultValue) {
            fieldValues.value[field.id] = field.defaultValue
          }
        })
      }
    } 
    catch(e){console.error(e)}
    finally {
      return await Promise.resolve("trivially resolving getFormData");
    }
}

function setDefaultLayout() {
  const defaultConfig = formConfigDefaults[props.dataType]
  if (defaultConfig) {
    myConfig.value = defaultConfig
    addWarningMessage(`No layout config was found for key: ${props.formLayoutKey}. Loading default layout ...`)
  } else {
    addWarningMessage(`No layout config was found for entity: ${props.dataType}.`)
  }
}

function removeMessage(id: number) {
  Utils.removeMessage(messages, id)
}

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
      .then((response: any) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData
        addSubmitMessage()
      })
      .catch((error: any) => {
        addErrorMessage(error)
      })
  } else {
    EventService.postForm(dataType, submitValue)
      .then((response: any) => {
        const convertedResponseData = convertResponseData(response.data)
        fieldValues.value = convertedResponseData
        addSubmitMessage()
      })
      .catch((error: any) => {
        addErrorMessage(error)
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

provide('fieldValues', readonly(fieldValues))
provide('fields', readonly(fields))
provide('updateFieldValue', updateFieldValue)
provide('v$', v$)

onBeforeMount( async() => {
  try{
    if (props.config) {
      myConfig.value = props.config
    } else if (props.formLayoutKey) {
        const response = await EventService.getDataByFilter('layoutdefinition', props.formLayoutKey)
        if (response.data.length > 0) {
          myConfig.value = response.data[0].config
        } else {
          setDefaultLayout()
        }
    } else {
      setDefaultLayout()
    }
  }
  catch(e) { console.error(e) }
  finally {
    await getFormData()
    //Note: if we use $lazy: false AND $autoDirty: true as the global vuelidate config, then we do not have to call $validate explicitely over here, only $reset
    v$?.value?.$reset()  ////decoupled v$?.value?.$reset() from getFormData!
    return await Promise.resolve('trivially resolving async onBeforeMount handler')
    }
  })

onBeforeUnmount(() => {
  // clear component based messages
  messages.value = []
})

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