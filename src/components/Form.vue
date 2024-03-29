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
            :label="t('Submit')"
            @click="submitForm(dataType)"
            icon="pi pi-check"
          />
        </template>
        <Button
          type="button"
          :label="t('Close')"
          @click="router.back"
          icon="pi pi-times"
          class="p-button-secondary"
        />
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, readonly, computed, onBeforeMount, onBeforeUnmount, inject, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import FormDefinitionRecursor from '@/components/FormDefinitionRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'
import Utils from '@/modules/utils'
import { messages, addSubmitMessage, addErrorMessage, addWarningMessage } from '@/modules/UseFormMessages'
import { setValidators, useValidation } from '@/modules/rules/validate'
import formConfigDefaults from '@/data/FormLayoutDefaults'

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

const { t } = useI18n({
  inheritLocale: true, useScope: 'global'
})

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
const schema: any = ref<object>({})
const myConfig: any = ref<object>({})
const $externalResults = reactive({})

// Use a simple ref for now as there is no combined logic for rules that need it to be computed
// This way type casting stays in place
const rules = ref({})
const v$ = useValidation(rules, fieldValues, { $lazy: false, $autoDirty: true, $externalResults } ) //  $rewardEarly nog niet supported? $commit() dan ook nog niet.

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
  catch(e){console.error(e)
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

  arr.forEach(function (fieldConfig: any) {
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

const updateFieldValue = (fieldId: string, value: any) => {
  fieldValues.value[fieldId] = value
  // ??????????????????
  // als we async validators in andere rules hebben, die als dependency zijn genoemd, 
  // gaan die niet af als niet heel v$.$validate() wordt gecalled????????????????????
  // dat lijkt op zich logisch, als we in veld 1 iets wijzigen en veld 3 gebruikt indirect een validator against veld 1, 
  // hoe kan vuelidate dan weten dat ie ook de rule vanveld 3 moet aftrappen.
  // Maar als alles sync is, dan gaan die rules wel af????????????????????????
  // Vergelijk dat nogmaals eenduidig, exact dezelfde rules in de andere branch, sync en async
  // want dat zou betekenen dat struturele async rules een veel verdergaande calling vereisen....
  // Ergens in de vuelidate github staat dat alle rules async zijn by default, klopt dat ook? Dat lijkt inconsistent.

  //v$?.value?.$validate()
  v$?.value?.$touch() //is genoeg om indirecte / async validators te triggeren ...
  v$?.value?.$reset()

  if (v$.value[fieldId]) {
    // validate the field explicitely... or validate the entire rule set since we can have dependencies????
    v$.value[fieldId].$validate()
  }
}

onBeforeMount( async() => {
  try{
    await EventService.getSchema(props.dataType)
      .then((response: any) => {
        schema.value = response.data
      })
    .catch((error: any) => {
      addErrorMessage(error)
    })

    if (props.config) {
      myConfig.value = props.config
    } else if (props.formLayoutKey) {
      const response = await EventService.getDataByFilter('layoutdefinition', props.formLayoutKey)
      if (response.data.length > 0) {
        myConfig.value = response.data[0].config
      } else {
        setDefaultLayout()
      }
    } 
    else {
      setDefaultLayout()
    }

    await getFormData()
  }
  catch(e) { console.error(e) }
  finally {
    // Note: if we use sync validators
    // plus $lazy: false AND $autoDirty: true as the global vuelidate config, 
    // then we do not have to call $validate explicitely over here, only $reset
    // but with explicit async validators we apparently need to call $validate?
    // plus we also need to call in updateFieldValue the overall $validate again?
    v$?.value?.$validate()
    //v$?.value?.$touch() //is dit genoeg om indirecte / async validators te triggeren? Kennelijk niet.
    v$?.value?.$reset()
  }
})

onBeforeUnmount(() => {
  // clear component based messages
  messages.value = []
})

provide('fieldValues', readonly(fieldValues))
provide('fields', readonly(fields))
provide('updateFieldValue', updateFieldValue)
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