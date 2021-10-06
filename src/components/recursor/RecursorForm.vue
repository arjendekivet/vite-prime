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
          <Button
            type="button"
            label="Submit"
            @click="formactions.submitForm(props.dataType)"
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
import { ref, provide, readonly } from 'vue'
import FormLayoutRecursor from '@/components/recursor/FormLayoutRecursor.vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'
import router from '@/router/routes';
import Utils from '@/modules/utils'

import { formactions, messages, count, errorFields, errorFieldsInfo } from '@/modules/formactionsrecursor'

type FormProp = {
  config: Fieldconfig[],
  fields?: Fieldconfig[],
  dataType?: string,
  id?: string,
  columns?: number,
  title?: string,
  readOnly?: boolean,
}

const props = withDefaults(defineProps<FormProp>(), {
  columns: 2,
})
const emit = defineEmits(['updateFieldValue'])

const fieldValues: any = ref<object>({})

const updateFieldValue = (fieldId: string, value: any) => {
  fieldValues.value[fieldId] = value
}

provide('fieldValues', readonly(fieldValues))
// provide('errorFields', errorFields)
// provide('errorFieldsInfo', errorFieldsInfo)
provide('updateFieldValue', updateFieldValue)

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
}
</style>