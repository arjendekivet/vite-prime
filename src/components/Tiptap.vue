<template>
    <div class="tiptap">
        <div v-if="editor" class="toolbar">
            <Button
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'p-button-outlined': !editor.isActive('bold') }"
            >bold</Button>
            <Button
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'p-button-outlined': !editor.isActive('italic') }"
            >italic</Button>
            <Button
                @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'p-button-outlined': !editor.isActive('strike') }"
            >strike</Button>
            <Button
                @click="editor.isActive({ textAlign: 'right' }) ?
                editor.chain().focus().unsetTextAlign().run() :
                editor.chain().focus().setTextAlign('right').run()"
                :class="{ 'p-button-outlined': !editor.isActive({ textAlign: 'right' }) }"
            >align right</Button>
            <Button
                @click="editor.isActive({ textAlign: 'center' }) ?
                editor.chain().focus().unsetTextAlign().run() :
                editor.chain().focus().setTextAlign('center').run()"
                :class="{ 'p-button-outlined': !editor.isActive({ textAlign: 'center' }) }"
            >align center</Button>
            <Button
                @click="editor.chain().focus().toggleCode().run()"
                :class="{ 'p-button-outlined': !editor.isActive('code') }"
            >code</Button>
            <Button
                @click="editor.chain().focus().unsetAllMarks().run()"
                class="p-button-outlined"
            >clear marks</Button>
            <Button
                @click="editor.chain().focus().clearNodes().run()"
                class="p-button-outlined"
            >clear nodes</Button>
            <!-- <Button
                @click="editor.chain().focus().setParagraph().run()"
                :class="{ 'p-button-outlined': !editor.isActive('paragraph') }"
            >paragraph</Button>-->
            <Button
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 1 }) }"
            >h1</Button>
            <Button
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 2 }) }"
            >h2</Button>
            <Button
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 3 }) }"
            >h3</Button>
            <!-- <Button
                @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 4 }) }"
            >h4</Button>
            <Button
                @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 5 }) }"
            >h5</Button>
            <Button
                @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                :class="{ 'p-button-outlined': !editor.isActive('heading', { level: 6 }) }"
            >h6</Button>
            <Button
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'p-button-outlined': !editor.isActive('bulletList') }"
            >bullet list</Button>-->
            <Button
                @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'p-button-outlined': !editor.isActive('orderedList') }"
            >ordered list</Button>
            <Button
                @click="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'p-button-outlined': !editor.isActive('codeBlock') }"
            >code block</Button>
            <!-- <Button
                @click="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'p-button-outlined': !editor.isActive('blockquote') }"
            >blockquote</Button>-->
            <!-- <Button
                @click="editor.chain().focus().setHorizontalRule().run()"
                class="p-button-outlined"
            >horizontal rule</Button>
            <Button
                @click="editor.chain().focus().setHardBreak().run()"
                class="p-button-outlined"
            >hard break</Button>-->
            <Button @click="editor.chain().focus().undo().run()" class="p-button-outlined">undo</Button>
            <Button @click="editor.chain().focus().redo().run()" class="p-button-outlined">redo</Button>
        </div>
        <editor-content :editor="editor" class="content" />
    </div>
</template>

<script setup lang='ts'>
import { Editor, useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { onMounted, ref, watch } from 'vue'

type FormProp = {
    modelValue: any
}
const props = withDefaults(defineProps<FormProp>(), {
    modelValue: undefined,
})

const emit = defineEmits(['update:modelValue'])

const editor: any = ref()

// As data comes in async, watch the modelValue change and update editor if needed
const stop = watch(
    () => props.modelValue,
    (value, prevValue) => {
        const isSame = editor.value.getHTML() === value
        if (isSame) {
            return
        }
        editor.value.commands.setContent(value, false)
    }
)

onMounted(() => {
    editor.value = new Editor({
        content: props.modelValue,
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        onUpdate: () => {
            emit('update:modelValue', editor.value.getHTML())
        },
    })
})

</script>

<style lang="scss">
.tiptap {
    border: solid #ccc 1px;
    .content {
        .ProseMirror {
            padding: 0.5em;
        }
    }
    .toolbar {
        // display: inline;
        border-bottom: solid #ccc 1px;
        padding: 0.25em 0.25em 0.25em 0.25em;
        .p-button {
            width: fit-content;
            font-size: small;
            padding: 0.25em;
            margin: 0 0.25em 0.25em 0.25em;
        }
    }
}
</style>