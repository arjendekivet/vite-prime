import Person from '../types/person'

interface Event {
    id: Number
    title: String
    category: String
    organizer: String
    description: String
    location: String
    date: String
    time: String
    attendees: Array<Person>
}

interface EventResponse {
    data: Event[]
}

export { Event, EventResponse }
