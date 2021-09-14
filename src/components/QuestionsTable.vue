<template>
    <DataTable :value="questions" v-model:selection="selected" data-key="_id">
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column field="_id" header="_Id"></Column>
        <Column field="title" header="Title" :sortable="true"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="description" header="Description"></Column>
    </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventService from '@/services/EventService'
import Question from '@/types/question'

const questions = ref<Question[]>()
const selected = ref<Question[]>();

EventService.getQuestions(false, 0)
    .then((response) => {
        const names = response.data.map(function (item) {
            // if (item.date && item.date !== '') {
            //     item.date = new Date(item.date).toLocaleDateString('nl-NL')
            // }
            return item;
        });
        questions.value = response.data
    })
    .catch((error) => {
        console.log(error)
    })

</script>