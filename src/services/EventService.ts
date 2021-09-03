import axios from 'axios'
import { Event, EventResponse } from '@/types/event'

const apiClient = axios.create({
    baseURL: `/api`,
    withCredentials: false, // This is the default
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

export default {
    getEvents(perPage: boolean, page: number): Promise<EventResponse> {
        return apiClient.get('/events?_limit=' + perPage + '&_page=' + page)
    },
    getEvent(id: number) {
        return apiClient.get('/events/' + id)
    },
    // postEvent(event) {
    //     return apiClient.post('/events', event)
    // },
}
