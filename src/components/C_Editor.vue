<template>
    <!-- https://quilljs.com/docs/formats/ -->
    <!-- :formats="['bold', 'italic']" -->
    <Editor v-model:modelValue="modelValue" @update:modelValue="onUpdate" editorStyle="height: 5em">
        <!-- <template v-slot:toolbar>
            <span class="ql-formats">
                <button class="ql-bold" v-tooltip.bottom="'Bold'"></button>
                <button class="ql-italic" v-tooltip.bottom="'Italic'"></button>
                <button class="ql-underline" v-tooltip.bottom="'Underline'"></button>
                <button class="ql-color" v-tooltip.bottom="'Color'"></button>
                <button class="ql-strike" v-tooltip.bottom="'Strike'"></button>
                <button class="ql-underline" v-tooltip.bottom="'Underline'"></button>
                <button class="ql-code-block" v-tooltip.bottom="'Code Block'"></button>
                <button class="ql-list" value="bullet" v-tooltip.bottom="'Unordered List'"></button>
                <button class="ql-list" value="ordered" v-tooltip.bottom="'Ordered List'"></button>
            </span>
        </template>-->
    </Editor>
</template>

<script setup lang="ts">
type FormProp = {
    modelValue: any
}
const props = withDefaults(defineProps<FormProp>(), {
    modelValue: undefined,
})

const emit = defineEmits(['update:modelValue'])

function onUpdate(value: any) {
    emit('update:modelValue', value)
}
</script>
