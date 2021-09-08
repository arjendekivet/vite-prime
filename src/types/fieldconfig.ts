type Fieldconfig = {
    id: string
    label: string
    type: 'P-InputText' | 'P-Dropdown' | 'P-Textarea'
    options?: object[]
    optionLabel?: string
    help?: string
    placeholder?: string
}

export { Fieldconfig }
