<template>
    <Toolbar>
        <template #left>
            <Button type="button" icon="pi pi-bars" @click="onMenuToggle" />
        </template>
        <template #right>
            <Button type="button" icon="pi pi-cog" class="p-mr-2" />
            <Button type="button" icon="pi pi-user" />
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits<{
    (event: 'menuToggle'): void
}>()

function onMenuToggle() {
    emit('menuToggle')
}
</script>