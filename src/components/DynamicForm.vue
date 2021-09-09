<template>
  <div class="card dynamicform">
    <div class="p-fluid p-formgrid p-grid">
      <div v-for="field in fields" :class="`p-field p-col-12 p-md-${12 / columns}`">
        <label :for="field.id">{{ field.label }}</label>
        <component
          :is="field.type"
          :id="field.id"
          v-model="fieldValues[field.id]"
          :disabled="field.disabled"
          :options="field.options ? field.options : null"
          :optionLabel="field.optionLabel"
          :placeholder="field.placeholder"
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

const props = defineProps({
  fields: { type: Object as PropType<Fieldconfig[]>, default: 2 },
  columns: { type: Number, default: 2 }
})

const fieldValues: any = ref<object>({})
</script>

<style lang="scss">
.dynamicform {
  textarea {
    resize: none;
  }
}
</style>