<template>
    <div class="FormLayoutRecursor card">
        {{ config.label || "No Label ..." }} ({{ config.type || "No Type ..." }})
        <component :is="SlotTest" :config="config">
            <FormLayoutRecursor
                v-for="item in config.items"
                :key="item.id"
                :config="item"
                :label="item.label || 'uhhhhh'"
            ></FormLayoutRecursor>
        </component>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import SlotTest from '@/components/SlotTest.vue'

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