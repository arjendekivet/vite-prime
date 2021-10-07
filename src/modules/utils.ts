import _ from 'lodash'

const utils = {
    removeMessage(messages: any, id: number) {
        const found = _.find(messages.value, { 'id': id })
        if (found) {
            messages.value = _.without(messages.value, found)
        }
    },
    setDate(value: number){
        return Date.parse(value) !== NaN ? new Date(value) : value
    }
}

export default utils