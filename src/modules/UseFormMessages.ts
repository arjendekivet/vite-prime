import { ref } from 'vue'
import MessageType from '@/types/message'

const messages = ref<MessageType[]>([]);
const count = ref(0);

const addSubmitMessage = () => {
    messages.value.push(
        { severity: 'success', sticky: false, content: 'Form succesfully saved', id: count.value++ },
    )
}

const addSuccesMessage = (msg: string) => {
    messages.value.push(
        { severity: 'success', sticky: false, content: msg, id: count.value++ },
    )
}

const addErrorMessage = (error: string | any, pMessages?: any) => {
    const usedMessages = pMessages ? pMessages : messages
    let content = error
    if (typeof (error) === 'object') {
        content = error.response?.data?.message
            ? error + " ==> " + error.response.data.message
            : content = error.response?.data?.error
                ? error + " ==> " + error.response.data.error
                : error
    }
    usedMessages.value.push(
        { severity: 'error', sticky: true, content: content, id: count.value++ },
    )
}

const addWarningMessage = (warning: string, life?: number) => {
    messages.value.push(
        { severity: 'warn', sticky: false, life: life, content: warning, id: count.value++ },
    )
}

export { messages, addSubmitMessage, addSuccesMessage, addErrorMessage, addWarningMessage }