<template>
    <Toolbar class="table--toolbar">
        <template #left>
            <Button type="button" icon="pi pi-file" title="New" @click="emit('newDoc')" />
            <Button
                v-show="hasSelection"
                type="button"
                icon="pi pi-trash"
                title="Delete"
                @click="emit('deleteSelection')"
            />
        </template>
        <template #right>
            <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <P_InputText
                    type="text"
                    v-model:modelValue="searchValue"
                    placeholder="Search"
                    @keyup="emit('update:searchValue', searchValue)"
                />
            </span>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import router from '@/router/routes';
import { ref } from 'vue';

import Button from 'primevue/button';
import P_InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';

const props = defineProps({
    searchValue: String,
    hasSelection: {
        type: Boolean,
    }
})

const emit = defineEmits(['newDoc', 'deleteSelection', 'update:searchValue'])

</script>

<style lang="scss">
.table--toolbar.p-toolbar {
    .p-toolbar-group-left {
        .p-button {
            margin-right: 0.5rem;
        }
    }

    .p-toolbar-group-right {
        .p-button {
            margin-left: 0.5rem;
        }
    }
}
</style>