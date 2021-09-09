import Option from '@/types/Option'

type Fieldconfig = {
    id: string
    label: string
    type: 'P-InputText' | 'P-Dropdown' | 'P-Textarea'
    options?: Option[]
    optionLabel?: keyof Option
    help?: string
    placeholder?: string
    disabled?: boolean
}

export default Fieldconfig
