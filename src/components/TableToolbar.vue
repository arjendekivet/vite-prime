<template>
    <Toolbar>
        <template #left>
            <Button type="button" icon="pi pi-file" title="New" @click="newDoc" />
        </template>
        <template #right></template>
    </Toolbar>
</template>

<script setup lang="ts">
import router from '@/router/routes';

const props = defineProps({
    newFormRoute: {
        type: String,
    }
})

function newDoc() {
    router.push({ name: props.newFormRoute })
}
</script>