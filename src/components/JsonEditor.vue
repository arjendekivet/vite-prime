<template>
    <div class="json-field">
        <template v-if="readOnly">
            <vue-json-pretty :data="modelValue" class="json-reader"></vue-json-pretty>
        </template>
        <template v-else>
            <vue3-json-editor
                v-model:modelValue="modelValue"
                :show-btns="true"
                :expandedOnStart="true"
                @json-save="onjsonSave"
                class="json-editor"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { Vue3JsonEditor } from 'vue3-json-editor'

type FormProp = {
    modelValue: any,
    readOnly: boolean,
}
const props = withDefaults(defineProps<FormProp>(), {
    modelValue: undefined,
    readOnly: false,
})

const emit = defineEmits(['update:modelValue'])

function onjsonSave(value: any) {
    emit('update:modelValue', value)
}

</script>