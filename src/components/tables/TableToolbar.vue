<template>
    <Toolbar>
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
                <P-InputText
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

const props = defineProps({
    searchValue: String,
    hasSelection: {
        type: Boolean,
    }
})

const emit = defineEmits(['newDoc', 'deleteSelection', 'update:searchValue'])

</script>