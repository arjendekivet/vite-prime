import _ from 'lodash'

const utils = {
    removeMessage(messages: any, id: number) {
        const found = _.find(messages.value, { 'id': id })
        if (found) {
            messages.value = _.without(messages.value, found)
        }
    },
    convertToDate(value: string) {
        return !value ? value : new Date(value)
    }
}

export default utils