<template>
    <h3 v-if="compTitle">{{ compTitle }}</h3>
    <transition-group name="p-message" tag="div">
        <Message
            v-for="msg of messages"
            :severity="msg.severity"
            :key="msg.id"
            :life="msg.life"
            :sticky="msg.sticky"
            @close="removeMessage(msg.id)"
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
import { onBeforeUnmount, ref, inject, computed } from 'vue'
import TableToolbar from '@/components/TableToolbar.vue'
import _ from 'lodash';
import Utils from '@/modules/utils'
import ColumnConfig from "@/types/columnconfig"
import EventService from '@/services/ApiService'
import router from '@/router/routes'
import { messages, addSuccesMessage, addErrorMessage, addWarningMessage } from '@/modules/UseFormMessages'
import TableLayoutDefaults from '@/data/TableLayoutDefaults'

const pushToRouter: any = inject('pushToRouter')

onBeforeUnmount(() => {
    // clear component based messages
    messages.value = []
})

type Props = {
    dataType: string,
    layoutKey?: string,
    formLayoutKey?: string,
    selectionMode?: string,
    openDocumentRow?: boolean,
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    selectionMode: 'multiple',
    openDocumentRow: true,
})

const columns = ref<ColumnConfig[]>()
const tableData = ref()
const searchValue = ref<string[]>()
const configTitle = ref<string>()
const formLayoutKey = ref<string>('dummy')
const selected = ref<Object[]>()

const compTitle = computed(() => props.title ? props.title : configTitle.value)

if (props.layoutKey) {
    EventService.getDataByFilter('layoutdefinition', props.layoutKey)
        .then((response: any) => {
            if (response.data.length > 0) {
                const config = response.data[0]
                columns.value = config.config
                formLayoutKey.value = config.layoutKey
                configTitle.value = config.label
            } else {
                setDefaultLayout()
            }
            getData()
        })
        .catch((error) => {
            // isLoading.value = false
            addErrorMessage(error)
        })
} else {
    setDefaultLayout()
    getData()
}

function setDefaultLayout() {
    const defaultConfig = TableLayoutDefaults[props.dataType]
    if (defaultConfig) {
        columns.value = defaultConfig
        addWarningMessage(`No layout config was found for key: ${props.layoutKey}. Loading default layout ...`)
    } else {
        addWarningMessage(`No layout config was found for entity: ${props.dataType}.`)
    }
}

function removeMessage(id: number) {
    Utils.removeMessage(messages, id)
}

function getData() {
    EventService.getData(props.dataType, false, 0)
        .then((response) => {
            tableData.value = response.data
        })
        .catch((error) => {
            addErrorMessage(error)
        })
}

function deleteSelection() {
    const selectedIds = _.map(selected.value, '_id')
    if (selectedIds.length === 0) {
        addWarningMessage('No selection was made.')
        return
    }

    EventService.deleteByIds(props.dataType, selectedIds)
        .then((response) => {
            addSuccesMessage(`${response.data && response.data.deletedCount | 0} document(s) were deleted.`)
            // but what if search filter is active ?! Keep track of filter value
            getData()
        })
        .catch((error) => {
            addErrorMessage(error)
        })
}

function openDocument(dataType: string, rowData: any, readOnly: boolean) {
    const id = rowData._id
    if (id) {
        pushToRouter({ name: 'form', params: { type: dataType, id: id, layout: formLayoutKey.value }, query: { readOnly: readOnly.toString() } })
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
                addErrorMessage(error)
            })
    }
}

function newDoc() {
    pushToRouter({ name: 'form', params: { type: props.dataType, id: '0', layout: props.formLayoutKey } })
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