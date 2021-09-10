<template>
  <div class="card dynamicform">
    <div class="p-fluid p-formgrid p-grid">
      <div
        v-for="field in fields"
        :class="`p-field ${getIconType(field)} p-col-12 p-md-${12 / getColumns(columns, field.maxColumns)}`"
      >
        <label :for="field.id">{{ field.label }}</label>
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
          :placeholder="field.placeholder"
          :class="errorFields[field.id] ? 'p-invalid' : ''"
          :aria-describedby="`${field.id}-help`"
        ></component>
        <small :id="`${field.id}-help`" class="p-error">{{ errorFieldsInfo[field.id] }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import { validate } from '@/modules/validate'

const props = defineProps({
  fields: { type: Object as PropType<Fieldconfig[]>, default: 2 },
  columns: { type: Number, default: 2 }
})

function getColumns(columns: number, maxColumns: number | undefined) {
  return maxColumns && maxColumns < columns ? maxColumns : columns
}

function getIconType(field: Fieldconfig) {
  return field.icon && field.icon.type ? 'aki-input-icon-' + field.icon.type : null
}

function getIconName(field: Fieldconfig) {
  return field.icon && field.icon.name
}

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

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


</script>

<style lang="scss">
@import "@/css/fieldicons.scss";

.dynamicform {
  textarea {
    resize: none;
  }
}
</style>