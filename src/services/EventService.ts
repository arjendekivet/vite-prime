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
    getEvents(perPage: boolean, page: number): Promise<EventResponse> {
        return apiClient.get('/events?_limit=' + perPage + '&_page=' + page)
    },
    getEvent(id: number) {
        return apiClient.get('/events/' + id)
    },
    getQuestions(perPage: boolean, page: number): Promise<QuestionResponse> {
        return apiClient.get('/questions?_limit=' + perPage + '&_page=' + page)
    },
    getQuestionById(id: number) {
        return apiClient.get('/questions/' + id)
    },
    postForm(type: string, submitValues: object) {
        return apiClient.post('/' + type, submitValues)
    },
    putForm(type: string, id: string, submitValues: object) {
        return apiClient.put('/' + type + '/' + id, submitValues)
    },
}
