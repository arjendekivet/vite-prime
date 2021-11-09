type Question = {
    _id: string
    id: number
    title: string
    Answer: string[]
    type?: 'open' | 'mc' | 'rs'
    description?: string
    cat_1?: {
        type: string,
    },
    cat_2?: {
        type: string,
    },
    cat_3?: {
        type: string,
    },
    answer?: {
        type: string,
    },
    due?: {
        type: Date,
    },
    created_by?: {
        type: string
    },
    updated_by?: {
        type: string
    },
    created_at?: {
        type: Date
    },
    updated_at?: {
        type: Date
    }
}

export default Question
