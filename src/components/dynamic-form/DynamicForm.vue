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
      <template v-for="field in fields">
        <div
          v-if="!field.hidden"
          :class="`p-field p-text-left ${formactions.getIconType(field)} p-col-12 p-md-${12 / formactions.getColumns(columns, field.maxColumns)}`"
        >
          <label :for="field.id">{{ field.label }}{{ formactions.getRequired(field) }}</label>
          <template v-if="readOnly">
            <div>{{ fieldValues[field.id] }}</div>
          </template>
          <template v-else>
            <i
              v-if="formactions.getIconName(field)"
              :class="`pi ${formactions.getIconName(field)}`"
            />
            <component
              v-bind="field"
              :is="field.type"
              v-model="fieldValues[field.id]"
              @update:modelValue="formactions.fieldUpdateHandler(props, emit, $event, field)"
              :class="errorFields[field.id] ? 'p-invalid' : ''"
              :aria-describedby="`${field.id}-help`"
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
          <Button
            type="button"
            label="Submit"
            @click="formactions.submitForm(props)"
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
import Fieldconfig from '@/types/fieldconfig'
import EventService from '@/services/EventService'
import _ from 'lodash'
import router from '@/router/routes';
import Utils from '@/modules/utils'

import { formactions, messages, count, fieldValues, errorFields, errorFieldsInfo } from '@/modules/formactions'

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
      const convertedResponseData = formactions.convertResponseData(props, response.data)
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