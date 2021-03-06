import Option from '@/types/option'
import Validator from '@/types/validator'

type FieldIcon = {
    type: 'left' | 'right'
    name: string
}
/**
 * Note: if type is 'FieldSet' or another container, it is meant to hold other "items" ....
 * This may be nested... etc.
 */

// add index signature to id. Seperate it using a union, 
// otherwise all explicit members must also conform to that index signature
type Fieldconfig = {
    id: string
} & {
    label: string
    type: 'P_InputText' | 'P_Dropdown' | 'P_Textarea' | 'JsonEditor' | 'Calendar' | 'FieldSet' | 'Accordion' | 'AccordionTab' | 'TabView' | 'TabPanel' | 'InputText'
    items?: Fieldconfig[]
    isContainer?: boolean // true when type is a form field "container" like FieldSet or Tab or Accordion etc AND fieldConfig has 'items' as array of FieldConfigs
    isField?: boolean
    options?: Option[]
    optionLabel?: keyof Option
    optionValue?: keyof Option
    editable?: boolean
    help?: string
    placeholder?: string
    disabled?: boolean
    hidden?: boolean
    validators?: Validator[]
    maxColumns?: number
    icon?: FieldIcon
    showIcon?: boolean
    defaultValue?: string | number | Date | null
    dependantFields?: string[]
}

export default Fieldconfig
