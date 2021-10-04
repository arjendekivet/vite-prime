<!-- This Component should act as a recursive component to resolve hierarchical dynamic components -->
<template>
    <div class="FormLayoutRecursor card">
        <div>{{ config.label || "No Label ..." }} ({{ config.type || "No Type ..." }})</div>
        <component :is="config.type">
            <slot>PIPO</slot>
        </component>

        <FormLayoutRecursor
            v-for="item in config.items"
            :key="item.id"
            :config="item"
            :label="item.label || 'uhhhhh'"
        >
            <slot>Recursor</slot>
        </FormLayoutRecursor>
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

<style lang="scss">
.FormLayoutRecursor {
    text-align: left;
    margin: 5px 0px 0px 15px;
}
</style>