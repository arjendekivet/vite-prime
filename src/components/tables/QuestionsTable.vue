<template>
    <transition-group name="p-message" tag="div">
        <Message
            v-for="msg of messages"
            :severity="msg.severity"
            :key="msg.id"
            :life="msg.life"
            :sticky="msg.sticky"
            @close="Utils.removeMessage(messages, msg.id)"
        >{{ msg.content }}</Message>
    </transition-group>
    <DataTable
        :value="questions"
        v-model:selection="selected"
        data-key="_id"
        class="question-table"
        @row-click="openDocument"
    >
        <template #header>
            <TableToolbar
                :hasSelection="selected && selected.length > 0"
                @new-doc="newDoc"
                @search-update="searchUpdate"
                @delete-selection="deleteSelection"
            />
        </template>
        <template #empty>No data found ...</template>
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column field="_id" header="_Id" hidden></Column>
        <Column field="title" header="Title" :sortable="true"></Column>
        <Column field="answer" header="Answer" :sortable="true"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="cat_1" header="Category 1"></Column>
        <Column field="description" header="Description" hidden></Column>
        <Column headerStyle="width: 8em;" bodyStyle="text-align: right">
            <template #body="slotProps">
                <Button type="button" icon="pi pi-eye" @click="openDocument(slotProps.data, true)"></Button>
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    @click="openDocument(slotProps.data, false)"
                ></Button>
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventService from '@/services/EventService'
import Question from '@/types/question'
import router from '@/router/routes';
import { useRoute } from 'vue-router'
import TableToolbar from '@/components/tables/TableToolbar.vue'
import _ from 'lodash';
import Utils from '@/modules/utils'
import MessageType from '@/types/message';

const route = useRoute()

const questions = ref<Question[]>()
const selected = ref<Question[]>()
const messages = ref<MessageType[]>([])
const count = ref(0);

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

function openDocument(rowData: Question, readOnly: boolean) {
    const id = rowData._id
    if (id) {
        router.push({ name: 'questionformbyid', params: { id: id }, query: { readOnly: readOnly.toString() } })
    }
}

function newDoc() {
    router.push({ name: 'questionform' })
}

function deleteSelection() {
    const selectedIds = _.map(selected.value, '_id')
    if (selectedIds.length === 0) {
        messages.value.push(
            { severity: 'warn', sticky: false, content: 'No selection was made.', id: count.value++ },
        )
        return
    }

    EventService.deleteQuestionsById(selectedIds)
        .then((response) => {
            console.log(response.data)
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
@media screen and (max-width: 960px) {
    .question-table {
        &.p-datatable .p-datatable-tbody > tr > td:last-child {
            border-width: 0 0 1px 0;
        }
    }
}

.question-table {
    td .p-button {
        margin-right: 0.5rem;
    }

    &.p-datatable {
        .p-datatable-header {
            padding: 0;
            border: 0;
        }
    }
}
</style>