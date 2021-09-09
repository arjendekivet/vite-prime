<template>
  <div class="card dynamicform">
    <div class="p-fluid p-formgrid p-grid">
      <div v-for="field in fields" :class="`p-field p-col-12 p-md-${12 / columns}`">
        <label :for="field.id">{{ field.label }}</label>
        <component
          :is="field.type"
          :id="field.id"
          v-model="fieldValues[field.id]"
          @blur="fieldChangeHandler(field)"
          :disabled="field.disabled"
          :options="field.options ? field.options : null"
          :optionLabel="field.optionLabel"
          :placeholder="field.placeholder"
          :class="errorFields[field.id] ? 'p-invalid' : ''"
          :aria-describedby="`${field.id}-help`"
        ></component>
        <small :id="`${field.id}-help`"></small>
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

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})

function fieldChangeHandler(field: Fieldconfig) {
  validateField(field)
}

function validateField(field: Fieldconfig) {
  const value = fieldValues.value[field.id]

  if (field.validators) {
    const validated = validate(value, field.validators)
    errorFields.value[field.id] = !validated
  }
}


</script>

<style lang="scss">
.dynamicform {
  textarea {
    resize: none;
  }
}
</style>