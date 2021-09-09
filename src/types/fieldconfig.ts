import Option from '@/types/option'
import Validator from '@/types/validator'

type validator = 'required' | 'email' | 'isNumber' | 'isDate'

type Fieldconfig = {
    id: string
    label: string
    type: 'P-InputText' | 'P-Dropdown' | 'P-Textarea'
    options?: Option[]
    optionLabel?: keyof Option
    help?: string
    placeholder?: string
    disabled?: boolean
    validators?: Validator[]
}

export default Fieldconfig
