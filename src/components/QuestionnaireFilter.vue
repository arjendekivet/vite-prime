<template>
  <div class="questionnaire__filter p-p-2">
    <h2>Filter questions</h2>

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
      <h3>Testrun ID</h3>
      <P_Dropdown
        v-model="selectedTestRunId"
        :options="optionsTestRunId"
        :editable="true"
        :showClear="true"
        optionLabel="label"
        optionValue="value"
        style="overflow: hidden;"
        class="p-mb-2"
      />
      <div class="p-d-inline-flex p-mb-2">
        <InputSwitch v-model="selectedQuickPractice" />
        <div class="p-ml-2 p-text-bold" style="line-height: 1.75rem">Quick practice</div>
      </div>

      <div class="p-d-inline-flex p-mb-2">
        <InputSwitch v-model="selectedShowDescription" />
        <div class="p-ml-2 p-text-bold" style="line-height: 1.75rem">Show description</div>
      </div>
      <Button
        label="Go!"
        class="p-button-success p-mt-4"
        @click="router.push({
          name: 'questionnaire',
          params: { categoryOne: selectedCategoryOne, categoryTwo: selectedCategoryTwo, categoryThree: selectedCategoryThree },
          query: { quickPractice: selectedQuickPractice.toString(), showDescription: selectedShowDescription.toString(), testRunId: selectedTestRunId }
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
import MessageType from '@/types/message'

const messages = ref<MessageType[]>([])

onMounted(() => {
  // reset left sidebar visibility
  setNavVisible(true)
})

type FormProp = {
  categoryOne?: string,
  categoryTwo?: string,
  categoryThree?: string,
  testRunId?: string,
  quickPractice?: boolean,
  showDescription?: boolean,
}
const props = withDefaults(defineProps<FormProp>(), {
  categoryOne: undefined,
  categoryTwo: undefined,
  categoryThree: undefined,
  testRunId: undefined,
  quickPractice: false,
  showDescription: false,
})

const EventService: any = inject('EventService')

const catOne = ref()
const catTwo = ref()
const catThree = ref()
const optionsTestRunId = ref()

const selectedCategoryOne = ref(props.categoryOne)
const selectedCategoryTwo = ref(props.categoryTwo)
const selectedCategoryThree = ref(props.categoryThree)
const selectedTestRunId = ref(props.testRunId)
const selectedQuickPractice = ref(props.quickPractice)
const selectedShowDescription = ref(props.showDescription)

EventService.getDistinctDataByField('questions', 'cat_1')
  .then((response: any) => {
    catOne.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error, messages)
  })

EventService.getDistinctDataByField('questions', 'cat_2')
  .then((response: any) => {
    catTwo.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error, messages)
  })

EventService.getDistinctDataByField('questions', 'cat_3')
  .then((response: any) => {
    catThree.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error, messages)
  })

EventService.getDistinctDataByField('answer', 'test_run_id')
  .then((response: any) => {
    optionsTestRunId.value = response.data.map((cat: string) => ({ label: cat, value: cat }))
  })
  .catch((error: any) => {
    addErrorMessage(error, messages)
  })
</script>

<style lang="scss">
.questionnaire__filter {
  text-align: left;
  .p-inputswitch {
    .p-inputswitch-slider {
      border-radius: 30px;
      &:before {
        border-radius: 50%;
      }
    }
  }
  h3 {
    margin: 1em 0em 0em 0em;
  }
}
</style>