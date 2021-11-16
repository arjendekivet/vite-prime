<template>
  <div class="questionnaire">
    <!-- <h1>Questionnaire ({{ category }})</h1> -->
    <Button :label="`Questionnaire - ${compCat}`" class="p-mb-4 p-button-outlined title__button" />
    <div class="questions p-grid">
      <QuestionCard v-for="question in questions" :question="question"></QuestionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addErrorMessage } from '@/modules/UseFormMessages'
import { compact } from 'lodash'
import { computed, inject, ref } from 'vue'
import QuestionCard from './QuestionCard.vue'

// const router: any = inject('router')
const EventService: any = inject('EventService')

type FormProp = {
  categoryOne?: string,
  categoryTwo?: string,
  categoryThree?: string

}
const props = withDefaults(defineProps<FormProp>(), {
  categoryOne: undefined
})

const questions = ref()

const compCat = computed(() => {
  const arr = [props.categoryOne, props.categoryTwo, props.categoryThree]
  return compact(arr).join('/')
})

const filter = {
  cat_1: props.categoryOne,
  ...(props.categoryTwo && { cat_2: props.categoryTwo }),
  ...(props.categoryThree && { cat_3: props.categoryThree })
}
EventService.postForm('questions/filter', filter)
  .then((response: any) => {
    if (response.data) {
      questions.value = response.data
    }
  })
  .catch((error: any) => {
    addErrorMessage(error)
  })

</script>

<style lang="scss">
.questionnaire {
  .title__button {
    font-size: xx-large;
  }
}
</style>