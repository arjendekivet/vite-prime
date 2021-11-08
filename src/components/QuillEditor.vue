<template>
    <div class="quill__editor">
        <div :id="uuid" class="quill__editor__container"></div>
    </div>
</template>

<script setup lang="ts">
import Quill from 'quill'
import { v4 as uuidv4 } from 'uuid'
import { onMounted, watch } from 'vue'

import 'quill/dist/quill.bubble.css'

type FormProp = {
    modelValue: any,
    theme?: 'snow' | 'bubble',
    toolbarOptions?: any
}
const props = withDefaults(defineProps<FormProp>(), {
    modelValue: undefined,
    theme: 'snow',
    toolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'align': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                         // text direction
        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        // [{ 'font': [] }],
        ['code-block'],                                 // 'blockquote', 'code-block'
        ['link', 'image'],
        ['clean']                                         // remove formatting button
    ]
})

const emit = defineEmits(['update:modelValue'])
const quill: any = {}
const uuid = uuidv4()

// As data comes in async, watch the modelValue change and update editor if needed
const stop = watch(
    () => props.modelValue,
    (value, prevValue) => {
        if (quill.editor) {
            if (quill.editor.root.innerHTML !== props.modelValue) {
                quill.editor.root.innerHTML = props.modelValue
            }
        }
    }
)

onMounted(() => {
    const options = {
        debug: 'error',
        theme: props.theme,
        placeholder: 'Your content goes here ...',
        readOnly: false,
        modules: {
            toolbar: props.toolbarOptions
        }
    }

    const container = document.getElementById(uuid)
    if (container) {
        quill.editor = new Quill(container, options)
        // Set initial value of editor
        if (props.modelValue) {
            quill.editor.root.innerHTML = props.modelValue
        }
        quill.editor.on('text-change', onUpdate)
    }
})

function onUpdate() {
    emit('update:modelValue', quill.editor.root.innerHTML)
}
</script>

<style lang="scss">
.quill__editor {
    .ql-bubble {
        border: solid #ccc 1px;
        .ql-tooltip {
            // position: relative;
            left: 0px !important;
        }
    }
}
</style>