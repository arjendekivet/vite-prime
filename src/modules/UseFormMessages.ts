import { ref } from 'vue'
import MessageType from '@/types/message'

const messages = ref<MessageType[]>([]);
const count = ref(0);

const addSubmitMessage = () => {
    messages.value.push(
        { severity: 'success', sticky: false, content: 'Form succesfully saved', id: count.value++ },
    )
}

const addErrorMessage = (error: any) => {
    messages.value.push(
        { severity: 'error', sticky: true, content: error, id: count.value++ },
    )
}

export { messages, addSubmitMessage, addErrorMessage }