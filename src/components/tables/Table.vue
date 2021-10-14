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
        :value="tableData"
        v-model:selection="selected"
        data-key="_id"
        class="base-table"
        @row-click="openDocument"
    >
        <template #header>
            <TableToolbar
                v-model:searchValue="searchValue"
                @update:search-value="searchUpdate($event)"
                :hasSelection="selected && selected.length > 0"
                @new-doc="newDoc"
                @delete-selection="deleteSelection"
            />
        </template>
        <template #empty>No data found ...</template>
        <Column v-if="selectionMode" :selectionMode="selectionMode" headerStyle="width: 3em"></Column>
        <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field"></Column>
        <Column v-if="openDocumentRow" headerStyle="width: 8em;" bodyStyle="text-align: right">
            <template #body="slotProps">
                <Button
                    type="button"
                    icon="pi pi-eye"
                    @click="openDocument(props.dataType, slotProps.data, true)"
                ></Button>
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    @click="openDocument(props.dataType, slotProps.data, false)"
                ></Button>
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TableToolbar from '@/components/tables/TableToolbar.vue'
import _ from 'lodash';
import Utils from '@/modules/utils'
import MessageType from '@/types/message'
import ColumnConfig from "@/types/columnconfig"
import EventService from '@/services/EventService'
import router from '@/router/routes'

type FormProps = {
    dataType: string,
    layoutKey: string,
    selectionMode?: string,
    openDocumentRow?: boolean,
}

const props = withDefaults(defineProps<FormProps>(), {
    selectionMode: 'multiple',
    openDocumentRow: true,
})

const emit = defineEmits(['openDoc', 'newDoc', 'deleteSelection', 'update:searchValue'])

const columns = ref<ColumnConfig[]>()
const tableData = ref()
const searchValue = ref<string[]>()

const selected = ref<Object[]>()
const messages = ref<MessageType[]>([])
const count = ref(0);

if (props.layoutKey) {
    EventService.getDataByFilter('formDefinition', props.layoutKey)
        .then((response: any) => {
            if (response.data.length > 0) {
                columns.value = response.data[0].formDefinition
            } else {
                messages.value.push(
                    { severity: 'warn', sticky: false, content: 'No layout config was found. Loading default columns', id: count.value++ },
                )
                columns.value = [
                    {
                        field: 'title',
                        header: 'Title'
                    }
                ]
            }
            getData()
        })
        .catch((error) => {
            // isLoading.value = false
            // console.error('Could not fetch formDefinition! Going to hardcoded backup option.', error)
            messages.value.push(
                { severity: 'warn', sticky: false, content: error, id: count.value++ },
            )
        })
} else {
    messages.value.push(
        { severity: 'warn', sticky: false, content: 'No layout key was provided.', id: count.value++ },
    )
}

function getData() {
    EventService.getData(props.dataType, false, 0)
        .then((response) => {
            tableData.value = response.data
        })
        .catch((error) => {
            console.log(error)
        })
}

function deleteSelection() {
    const selectedIds = _.map(selected.value, '_id')
    if (selectedIds.length === 0) {
        messages.value.push(
            { severity: 'warn', sticky: false, content: 'No selection was made.', id: count.value++ },
        )
        return
    }
    emit('deleteSelection', selectedIds)
    EventService.deleteByIds(props.dataType, selectedIds)
        .then((response) => {
            messages.value.push(
                { severity: 'success', sticky: false, content: `${response.data && response.data.deletedCount | 0} document(s) were deleted.`, id: count.value++ },
            )
            // but what if search filter is active ?! Keep track of filter value
            getData()
        })
        .catch((error) => {
            console.error(error);
        })
}

function openDocument(dataType: string, rowData: any, readOnly: boolean) {
    const id = rowData._id
    if (id) {
        router.push({ name: 'formbyid', params: { type: dataType, id: id, layout: 'getFromMap' }, query: { readOnly: readOnly.toString() } })
    }
}

function searchUpdate(searchValue: string) {
    if (searchValue === '') {
        getData()
    } else {
        EventService.getDataByFilter(props.dataType, searchValue, false, 0)
            .then((response) => {
                tableData.value = response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

function newDoc() {
    router.push({ name: 'newform' })
}
</script>

<style lang="scss">
@media screen and (max-width: 960px) {
    .base-table {
        &.p-datatable .p-datatable-tbody > tr > td:last-child {
            border-width: 0 0 1px 0;
        }
    }
}

.base-table {
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