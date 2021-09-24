<template>
    <Toolbar>
        <template #left>
            <Button type="button" icon="pi pi-file" title="New" @click="newDoc" />
            <Button
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
                    v-model="searchValue"
                    placeholder="Search"
                    @keyup="searchUpdate"
                />
            </span>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import router from '@/router/routes';
import { ref } from 'vue';

const props = defineProps({
    newFormRoute: {
        type: String,
    }
})

const emit = defineEmits(['searchUpdate', 'deleteSelection'])

const searchValue = ref<string>()

function newDoc() {
    router.push({ name: props.newFormRoute })
}

function searchUpdate(e: any) {
    emit('searchUpdate', searchValue.value)
}
</script>