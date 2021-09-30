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
                @update:search-value="emit('update:searchValue', searchValue)"
                :hasSelection="selected && selected.length > 0"
                @new-doc="emit('newDoc')"
                @delete-selection="deleteSelection"
            />
        </template>
        <template #empty>No data found ...</template>
        <Column v-if="selectionMode" :selectionMode="selectionMode" headerStyle="width: 3em"></Column>
        <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field"></Column>
        <Column v-if="openDocumentRow" headerStyle="width: 8em;" bodyStyle="text-align: right">
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
import { ref, watch } from 'vue'
import TableToolbar from '@/components/tables/TableToolbar.vue'
import _ from 'lodash';
import Utils from '@/modules/utils'
import MessageType from '@/types/message';
import ColumnConfig from "@/types/columnconfig"

type FormProps = {
    columns: ColumnConfig[],
    tableData: unknown,
    searchValue?: string,
    selectionMode?: string,
    openDocumentRow?: Boolean,
}

const props = defineProps<FormProps>()

const emit = defineEmits(['openDoc', 'newDoc', 'deleteSelection', 'update:searchValue'])

const selected = ref<Object[]>()
const messages = ref<MessageType[]>([])
const count = ref(0);

function deleteSelection() {
    const selectedIds = _.map(selected.value, '_id')
    if (selectedIds.length === 0) {
        messages.value.push(
            { severity: 'warn', sticky: false, content: 'No selection was made.', id: count.value++ },
        )
        return
    }
    emit('deleteSelection', selectedIds)
}

function openDocument(rowData: any, readOnly: boolean) {
    const id = rowData._id
    if (id) {
        emit('openDoc', id, readOnly)
    }
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