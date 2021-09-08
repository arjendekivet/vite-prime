<template>
  <div class="card">
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-md-6">
        <label for="firstname6">Firstname</label>
        <P-InputText id="firstname6" v-model="value1"></P-InputText>
      </div>
      <div class="p-field p-col-12 p-md-6">
        <label for="lastname6">Lastname</label>
        <P-InputText id="lastname6" type="text" />
      </div>
      <div class="p-field p-col-12 p-md-6">
        <label for="address">Address</label>
        <P-InputText id="address" />
      </div>
      <div class="p-field p-col-12 p-md-6">
        <label for="city">City</label>
        <P-InputText id="city" type="text" />
      </div>
      <div class="p-field p-col-12 p-md-6">
        <label for="state">State</label>
        <P-Dropdown
          inputId="state"
          v-model="selectedState"
          :options="states"
          optionLabel="name"
          placeholder="Select"
        />
      </div>
      <div class="p-field p-col-12 p-md-6">
        <label for="zip">Zip</label>
        <P-InputText id="zip" type="text" />
      </div>

      <div v-for="field in fields" class="p-field p-col-12 p-md-6">
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

const states = ref([
  { name: 'Arizona', code: 'Arizona' },
  { name: 'California', value: 'California' },
  { name: 'Florida', code: 'Florida' },
  { name: 'Ohio', code: 'Ohio' },
  { name: 'Washington', code: 'Washington' }
]);

const value = ref()
const value1 = ref()
const fieldValues: any = ref<object>({})

const fields = ref<Fieldconfig[]>(
  [
    {
      id: 'fieldOne',
      label: 'Firstname',
      type: 'P-InputText',
      placeholder: 'placeholder ...'
    },
    {
      id: 'fieldTwo',
      label: 'States',
      type: 'P-Dropdown',
      options: states.value,
      optionLabel: "name"
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

.layout-content .content-section.implementation > h3 {
  font-weight: 600;
}

textarea {
  resize: none;
}
</style>