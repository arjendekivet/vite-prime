<template>
  <div class="questionaire">
    <!-- <h1>Questionnaire ({{ category }})</h1> -->
    <Button :label="'Questionnaire - ' + category" class="p-mb-4 p-button-outlined title__button" />
    <div class="questions p-grid">
      <QuestionCard v-for="question in questions" :question="question"></QuestionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addErrorMessage } from '@/modules/UseFormMessages'
import { inject, ref } from 'vue'
import QuestionCard from './QuestionCard.vue'

// const router: any = inject('router')
const EventService: any = inject('EventService')

type FormProp = {
  category: string
}
const props = withDefaults(defineProps<FormProp>(), {
  category: undefined
})

const questions = ref()

EventService.getDataByFilterType('questions', 'cat_1', props.category)
  .then((response: any) => {
    questions.value = response.data
  })
  .catch((error: any) => {
    addErrorMessage(error)
  })

</script>

<style lang="scss">
.questionaire {
  .title__button {
    font-size: xx-large;
  }
}
</style>