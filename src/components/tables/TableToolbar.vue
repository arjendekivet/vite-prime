<template>
    <Toolbar>
        <template #left>
            <Button type="button" icon="pi pi-file" title="New" @click="newDoc" />
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
    },
    routeTableName: {
        type: String,
    }
})

const emit = defineEmits(['searchUpdate'])

const searchValue = ref<string>()

function newDoc() {
    router.push({ name: props.newFormRoute })
}

function searchUpdate(e: any) {
    emit('searchUpdate', e.srcElement.value)
}
</script>