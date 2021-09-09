import Option from '@/types/Option'

type Fieldconfig = {
    id: string
    label: string
    type: 'P-InputText' | 'P-Dropdown' | 'P-Textarea'
    options?: object[]
    optionLabel?: keyof Option
    help?: string
    placeholder?: string
}

export default Fieldconfig
