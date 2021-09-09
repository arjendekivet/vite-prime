type Question = {
    id: number
    type: 'open' | 'mc' | 'rs'
    title: string
    Description: string
    Answer: string[]
}

export default Question
