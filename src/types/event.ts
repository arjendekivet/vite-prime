import Person from '../types/person'

interface Event {
    id: number
    title: string
    category: string
    organizer: string
    description: string
    location: string
    date: string
    time: string
    attendees: Array<Person>
}

interface EventResponse {
    data: Event[]
}

export { Event, EventResponse }
