import _ from 'lodash'
import Validator from '@/types/validator'

type returnValue = {
    valid: boolean
    info: string
}

const validate = function (value: unknown, validators: Validator[]): returnValue {
    const returnValue = { valid: true, info: '' }
    validators.forEach(function (validator) {
        if (validator === 'required' && _.isEmpty(value)) {
            returnValue.valid = false
            returnValue.info = validator
            return
        }
    })
    return returnValue
}

export { validate }