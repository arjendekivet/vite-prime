import Person from '@/types/person'

type Event = {
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

type EventResponse = {
    data: Event[]
}

export { Event, EventResponse }
