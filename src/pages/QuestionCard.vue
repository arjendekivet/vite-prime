<template>
  <div class="question__card p-col-12 p-md-6 p-lg-3" :class="flip ? 'flip' : ''">
    <Card style="margin-bottom: 2em" v-if="!flip">
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
    <Card style="margin-bottom: 2em" v-else>
      <template #header>
        <Button icon="pi pi-replay" label="Back" @click="flip = !flip" />
      </template>
      <template #title>
        <div v-html="question?.answer"></div>
      </template>
      <template #footer>
        <Button icon="pi pi-thumbs-up" label="Correct" class="p-mr-2" />
        <Button icon="pi pi-thumbs-down" label="False" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Question from '@/types/question'
import { ref } from 'vue';

type FormProp = {
  question: Question
}
const props = withDefaults(defineProps<FormProp>(), {
  question: undefined
})

const flip = ref(false)

</script>