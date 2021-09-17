<template>
    <DataTable
        :value="questions"
        v-model:selection="selected"
        data-key="_id"
        class="question-table"
        @row-click="openDocument"
    >
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column field="_id" header="_Id" hidden></Column>
        <Column field="title" header="Title" :sortable="true"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="description" header="Description"></Column>
        <Column headerStyle="width: 8em;" bodyStyle="text-align: right">
            <template #body="slotProps">
                <Button type="button" icon="pi pi-eye" @click="openDocument(slotProps.data)"></Button>
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventService from '@/services/EventService'
import Question from '@/types/question'
import router from '@/router/routes';

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

function openDocument(rowData: Question) {
    const id = rowData._id
    if (id) {
        router.push({ name: 'questionformbyid', params: { id: id } })
    }
}
</script>

<style lang="scss">
@media screen and (max-width: 960px) {
    .question-table {
        &.p-datatable .p-datatable-tbody > tr > td:last-child {
            border-width: 0 0 1px 0;
        }
    }
}
</style>