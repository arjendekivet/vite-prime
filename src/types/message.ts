import MessageType from 'primevue/message'

type Message = MessageType['$props'] & {
    id: number,
    content: string,
}

export default Message
