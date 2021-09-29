<template>
    <BaseTable
        :tableData="questions"
        :openDocumentRow="true"
        v-model:searchValue="searchValue"
        @delete-selection="deleteSelection"
        @new-doc="newDoc"
        @open-doc="openDocument"
    />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import EventService from '@/services/EventService'
import Question from '@/types/question'
import router from '@/router/routes';
import { useRoute } from 'vue-router'
import BaseTable from '@/components/tables/BaseTable.vue'
import _ from 'lodash';
// import Utils from '@/modules/utils'
import MessageType from '@/types/message';

const route = useRoute()

const questions = ref<Question[]>()
const selected = ref<Question[]>()
const messages = ref<MessageType[]>([])
const count = ref(0);

const searchValue = ref();
watch(searchValue, (value, prevValue) => {
    searchUpdate(value)
})

getQuestions()

function getQuestions() {
    EventService.getQuestions(false, 0)
        .then((response) => {
            questions.value = response.data
        })
        .catch((error) => {
            console.log(error)
        })
}

function searchUpdate(searchValue: string) {
    if (searchValue === '') {
        getQuestions()
    } else {
        EventService.getQuestionByFilter(searchValue, false, 0)
            .then((response) => {
                questions.value = response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

function openDocument(id: string, readOnly: boolean) {
    router.push({ name: 'questionformbyid', params: { id: id }, query: { readOnly: readOnly.toString() } })
}

function newDoc() {
    router.push({ name: 'questionform' })
}

function deleteSelection(selectedIds: string[]) {
    EventService.deleteQuestionsById(selectedIds)
        .then((response) => {
            messages.value.push(
                { severity: 'success', sticky: false, content: `${response.data && response.data.deletedCount | 0} document(s) were deleted.`, id: count.value++ },
            )
            // but what if search filter is active ?! Keep track of filter value
            getQuestions()
        })
        .catch((error) => {
            console.error(error);
        })
}
</script>

<style lang="scss">
</style>