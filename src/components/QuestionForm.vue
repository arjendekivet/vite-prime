<template>
  <div class="card">
    <div class="p-fluid p-formgrid p-grid">
      <div v-for="field in fields" :class="`p-field p-col-12 p-md-${12 / columns}`">
        <label :for="field.id">{{ field.label }}</label>
        <component
          :is="field.type"
          :id="field.id"
          v-model="fieldValues[field.id]"
          :options="field.options ? field.options : null"
          :optionLabel="field.optionLabel"
          :placeholder="field.placeholder"
        ></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fieldconfig } from '@/types/fieldconfig'

const props = defineProps({
  columns: { type: Number, default: 2 }
})

const states = ref([
  { name: 'Arizona', code: 'Arizona' },
  { name: 'California', value: 'California' },
  { name: 'Florida', code: 'Florida' },
  { name: 'Ohio', code: 'Ohio' },
  { name: 'Washington', code: 'Washington' }
]);

const fieldValues: any = ref<object>({})
const fields = ref<Fieldconfig[]>(
  [
    {
      id: 'firstname',
      label: 'Firstname',
      type: 'P-InputText',
      placeholder: 'Firstname'
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P-InputText',
      placeholder: 'Lastname'
    },
    {
      id: 'state',
      label: 'State',
      type: 'P-Dropdown',
      options: states.value,
      optionLabel: "name",
      placeholder: 'States'
    }
  ]
)

const selectedState = ref(null);

</script>

<style lang="scss" scoped>
@media screen and (max-width: 489px) {
  .p-formgroup-inline {
    .p-field {
      margin-bottom: 1em !important;
    }
  }
}

textarea {
  resize: none;
}
</style>