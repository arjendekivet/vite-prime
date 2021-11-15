<template>
  <div class="question__card p-col-12 p-md-6 p-lg-3" :class="flip ? 'flip' : ''">
    <Card style="margin-bottom: 2em" v-if="!flip" class="card">
      <!-- <template #header></template> -->
      <template #title>{{ question?.title }}</template>
      <!-- <template #subtitle>{{ question?.title }}</template> -->
      <template #content v-if="question?.description">
        <div v-html="question?.description"></div>
      </template>
      <template #footer>
        <Button icon="pi pi-check" label="Show Answer" @click="flip = !flip" />
      </template>
    </Card>
    <Card v-else style="margin-bottom: 2em" class="card">
      <template #header>
        <div class="header p-pr-4 p-pt-4">
          <Button icon="pi pi-replay" label="Back" @click="flip = !flip" />
        </div>
      </template>
      <template #title>
        <div v-html="question?.answer"></div>
      </template>
      <template #footer>
        <Button icon="pi pi-thumbs-up" label="Correct" class="p-mr-2" @click="answer(true)" />
        <Button icon="pi pi-thumbs-down" label="False" @click="answer(false)" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Question from '@/types/question'
import { inject, ref } from 'vue';

const EventService: any = inject('EventService')

type FormProp = {
  question: Question
}
const props = withDefaults(defineProps<FormProp>(), {
  question: undefined
})

const flip = ref(false)

async function answer(correct: boolean) {
  const submitValue = {
    question_id: props.question._id,
    answer: 'dummy answer ...',
    correct: correct
  }
  EventService.postForm('answer', submitValue).then((response: any) => {
    console.info(response)
  })
    .catch((error: any) => {
      console.error(error)
    })
}

</script>

<style lang="scss">
.question__card {
  .p-card {
    color: #2c3e50;
  }
  .card {
    background-color: #a6daf7;
    border: solid var(--blue-800) 2px;
    border-radius: 3em;
    .header {
      text-align: end;
    }
  }
  &.flip {
    .card {
      // background-color: #a6f7c3;
      border: solid var(--blue-800) 4px;
    }
  }
}
</style>