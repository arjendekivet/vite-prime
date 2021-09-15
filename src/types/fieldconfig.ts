import Option from '@/types/option'
import Validator from '@/types/validator'

type FieldIcon = {
    type: 'left' | 'right'
    name: string
}

type Fieldconfig = {
    id: string
    label: string
    type: 'P-InputText' | 'P-Dropdown' | 'P-Textarea' | 'Calendar'
    options?: Option[]
    optionLabel?: keyof Option
    optionValue?: keyof Option
    help?: string
    placeholder?: string
    disabled?: boolean
    validators?: Validator[]
    maxColumns?: number
    icon?: FieldIcon
    showIcon?: boolean
}

export default Fieldconfig
