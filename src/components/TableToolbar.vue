<template>
    <Toolbar class="table--toolbar">
        <template #left>
            <Button
                type="button"
                icon="pi pi-file"
                @click="emit('newDoc')"
                v-tooltip="t('NewDocument')"
            />
            <Button
                v-show="hasSelection"
                type="button"
                icon="pi pi-trash"
                v-tooltip="t('DeleteSelection')"
                @click="emit('deleteSelection')"
            />
        </template>
        <template #right>
            <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <P_InputText
                    type="text"
                    v-model:modelValue="searchValue"
                    @keyup="emit('update:searchValue', searchValue)"
                    :placeholder="t('Search')"
                />
            </span>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps({
    searchValue: String,
    hasSelection: {
        type: Boolean,
    }
})

const emit = defineEmits(['newDoc', 'deleteSelection', 'update:searchValue'])

const { t } = useI18n({
    inheritLocale: true, useScope: 'global'
})

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