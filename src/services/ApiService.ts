import axios from 'axios'
import { Event, EventResponse } from '@/types/event'
import Question from '@/types/question'

const apiClient = axios.create({
    baseURL: `/api`,
    withCredentials: false, // This is the default
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

type QuestionResponse = {
    data: Question[]
}

export default {
    postForm(type: string, submitValues: object) {
        return apiClient.post('/' + type, submitValues)
    },
    putForm(type: string, id: string, submitValues: object) {
        return apiClient.put('/' + type + '/' + id, submitValues)
    },
    getById(type: string, id: string) {
        return apiClient.get('/' + type + '/' + id)
    },
    deleteByIds(type: string, ids: string[]) {
        return apiClient.delete('/' + type + '/' + ids)
    },
    getData(type: string, perPage: boolean, page: number): Promise<QuestionResponse> {
        return apiClient.get('/' + type + '?_limit=' + perPage + '&_page=' + page)
    },
    getDataByFilter(type: string, filter: string | string[], perPage: boolean = false, page: number = 0) {
        return apiClient.get('/' + type + '/filter/' + filter + '?_limit=' + perPage + '&_page=' + page)
    },
}
