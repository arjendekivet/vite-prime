<template>
  <div
    class="question__card p-col-12 p-md-6 p-lg-3"
    :class="{ flipped: flip, hide__description: !showDescription }"
  >
    <Card style="margin-bottom: 2em" v-if="!flip" class="card">
      <!-- <template #header></template> -->
      <template #title>{{ question?.title }}</template>
      <!-- <template #subtitle>{{ question?.title }}</template> -->
      <template #content>
        <!-- <div v-html="question?.description"></div> -->
        <div v-if="showDescription">{{ question?.description }}</div>
        <div v-if="!quickPractice" class="answer__input">
          <P_InputText
            v-model="userAnswer"
            placeholder="Answer"
            class="p-mt-2"
            style="background-color: azure"
          ></P_InputText>
        </div>
      </template>
      <template #footer>
        <!-- <Button icon="pi pi-check" label="Show Answer" @click="flip = !flip" /> -->
        <Button label="Check answer" icon="pi pi-check" class="p-mt-2" @click="checkAnswer()" />
      </template>
    </Card>
    <Card v-else style="margin-bottom: 2em" class="card">
      <template #header>
        <div class="header p-pr-4 p-pt-4">
          <Button icon="pi pi-replay" label="Back" @click="flip = !flip" />
        </div>
      </template>
      <template #content class="hidden">
        <!-- <div v-html="question?.answer"></div> -->
        <div>{{ question?.answer }}</div>
        <div v-html="highlightedAnswer()" class="answer__given"></div>
      </template>
      <template #footer v-if="props.quickPractice">
        <Button icon="pi pi-thumbs-up" class="p-mr-2" @click="submitAnswer(true)" />
        <Button icon="pi pi-thumbs-down" @click="submitAnswer(false)" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Question from '@/types/question'
import { computed, inject, ref, watch } from 'vue'
import { useToast } from "primevue/usetoast"

const EventService: any = inject('EventService')
const toast = useToast()

type FormProp = {
  question: Question,
  quickPractice?: boolean,
  showDescription: boolean,
}
const props = withDefaults(defineProps<FormProp>(), {
  question: undefined
})

const flip = ref(false)
const userAnswer = ref()
const diff = computed(() => props.quickPractice ? [] : findDiff(props.question.answer, userAnswer.value || ''))
const errorPercentage = computed(() => Math.round((diff.value.length / props.question.answer.length) * 100))

watch(
  () => flip.value,
  (value, prevValue) => {
    if (!value && userAnswer.value) {
      // Clear given answer, to try again
      userAnswer.value = null
    }
  }
)

async function submitAnswer(correct: boolean) {
  const submitValue = {
    question_id: props.question._id,
    answer: userAnswer.value,
    correct: correct,
    manual: props.quickPractice,
    percentage: errorPercentage.value,
  }
  EventService.postForm('answer', submitValue)
    .then((response: any) => {
      console.info(response)
    })
    .catch((error: any) => {
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 2500 })
    })
  flip.value = false
}

function checkAnswer() {
  if (props.quickPractice) {
    flip.value = true
    return
  }

  if (props.question.answer && userAnswer.value) {
    if (diff.value.length === 0) {
      toast.add({ severity: 'success', summary: 'Correct', detail: 'Answer is correct', life: 2500 })
    } else {
      toast.add({ severity: 'error', summary: 'False', detail: `Answer is false (${errorPercentage.value}%)`, life: 2500 })
    }
    submitAnswer(diff.value.length === 0)
    flip.value = true
  } else {
    toast.add({ severity: 'warn', summary: 'No answer', detail: 'No answer given', life: 2500 })
  }
}

function findDiff(str1: string, str2: string): number[] {
  // start with longest answer
  const desc = [str1, str2].sort((a: string, b: string) => b.length - a.length)
  const cDiff: number[] = []
  desc[0].split('').forEach(function (val, i) {
    if (val != desc[1].charAt(i)) {
      cDiff.push(i)
    }
  })
  return cDiff
}

// AKI TODO: Check by word for more accurate result!!!
function highlightedAnswer() {
  if (props.quickPractice) {
    return props.question.answer
  }
  if (props.question.answer === userAnswer.value) {
    return userAnswer.value
  }
  const desc = [props.question.answer, userAnswer.value].sort((a: string, b: string) => b.length - a.length)
  const longestString = desc[0]
  const arrIndex = diff.value

  let newValue = ''
  let start
  arrIndex.forEach(function (val, i, myArr) {
    const str = longestString.substr(val, 1)
    const replacedIndexString = `<b>${str}</b>`

    if (i === 0 && val > 0) {
      start = 0
      newValue += longestString.substr(start, val)
    } else if (i > 0 && val > 0) {
      start = myArr[i - 1]
      newValue += longestString.substr(start + 1, val - start - 1)
    }
    newValue += replacedIndexString
  })
  return newValue
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
  &.flipped {
    .card {
      // background-color: #a6f7c3;
      border: solid var(--blue-800) 4px;
    }
  }
  .answer__given {
    font-size: 1.5em;
    font-weight: 500;
    b {
      color: red;
      text-decoration: underline;
      font-weight: 700;
    }
  }
  &.hide__description {
    .p-card {
      .p-card-content {
        padding: 0;
      }
    }
  }
}
</style>