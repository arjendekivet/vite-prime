import _ from 'lodash'

const utils = {
    removeMessage(messages: any, id: number) {
        const value = messages.value
        const found = _.find(value, { 'id': id })
        if (found) {
            messages.value = _.without(value, found)
        }
    },
    convertToDate(value: string) {
        return !value ? value : new Date(value)
    },
    addToLocalStorage(key: string, value: string) {
        localStorage.setItem(key, value)
    },
    getFromLocalStorage(key: string) {
        return localStorage.getItem(key);
    },
    removeFromLocalStorage(key: string) {
        localStorage.removeItem(key);
    }
}

export default utils