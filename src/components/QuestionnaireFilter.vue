<template>
  <div class="questionnaire__filter p-p-2">
    <h3>Filter questions</h3>

    <div class="p-d-flex p-flex-column">
      <P_Dropdown
        v-model="selectedCategoryOne"
        :options="catOne"
        :showClear="true"
        optionLabel="label"
        optionValue="value"
        placeholder="Select"
        style="overflow: hidden;"
        class="p-mb-2"
      />
      <P_Dropdown
        v-model="selectedCategoryTwo"
        :options="catTwo"
        :showClear="true"
        optionLabel="label"
        optionValue="value"
        placeholder="Select"
        style="overflow: hidden;"
        class="p-mb-2"
      />
      <P_Dropdown
        v-model="selectedCategoryThree"
        :options="catThree"
        :showClear="true"
        optionLabel="label"
        optionValue="value"
        placeholder="Select"
        style="overflow: hidden;"
        class="p-mb-2"
      />
      <Button
        label="Go!"
        class="p-ml-1"
        @click="router.push({
          name: 'questionnaire',
          params: { categoryOne: selectedCategoryOne, categoryTwo: selectedCategoryTwo, categoryThree: selectedCategoryThree }
        })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import router from '@/router/routes'
import { onMounted } from 'vue'
import { setNavVisible } from '@/modules/globalState'
import { addErrorMessage } from '@/modules/UseFormMessages'

onMounted(() => {
  // reset left sidebar visibility
  setNavVisible(true)
})

type FormProp = {
  categoryOne?: string,
  categoryTwo?: string,
  categoryThree?: string

}
const props = withDefaults(defineProps<FormProp>(), {
  categoryOne: undefined,
  categoryTwo: undefined,
  categoryThree: undefined
})

const EventService: any = inject('EventService')

const catOne = ref()
const catTwo = ref()
const catThree = ref()

const selectedCategoryOne = ref(props.categoryOne)
const selectedCategoryTwo = ref(props.categoryTwo)
const selectedCategoryThree = ref(props.categoryThree)

EventService.getDistinctDataByField('questions', 'cat_1')
  .then((response: any) => {
    catOne.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error)
  })

EventService.getDistinctDataByField('questions', 'cat_2')
  .then((response: any) => {
    catTwo.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error)
  })

EventService.getDistinctDataByField('questions', 'cat_3')
  .then((response: any) => {
    catThree.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error)
  })
</script>
