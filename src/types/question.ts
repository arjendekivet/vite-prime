type Question = {
    _id: string,
    id: number,
    title: string,
    answer: string,
    type?: 'open' | 'mc' | 'rs'
    description?: string
    cat_1?: string,
    cat_2?: string,
    cat_3?: string,
    due?: Date,
    created_by?: string,
    updated_by?: string,
    created_at?: string,
    updated_at?: string,
}

export default Question
