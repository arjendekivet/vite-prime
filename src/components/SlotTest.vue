<template>
    <div class="slottest">
        <component v-if="config.type === 'P_InputText'" :is="config.type"></component>
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'

type configContainer = {
    items?: configContainer[],
    id?: string,
    type: string,
    level?: number,
    isContainer?: boolean,
    placeholder?: string,
    label?: string,
}

type FormProp = {
    config: configContainer,
    id?: string,
    type?: string,
    level?: number,
    isContainer?: boolean,
    placeholder?: string,
    label?: string,
}

const props = withDefaults(defineProps<FormProp>(), {
    level: 0,
})

</script>