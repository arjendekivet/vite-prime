import _ from 'lodash'
import Validator from '@/types/validator'

const validate = function (value: unknown, validators: Validator[]): boolean {
    let valid = true
    validators.forEach(function (validator) {
        if (validator === 'required' && _.isEmpty(value)) {
            return valid = false
        }
    })
    return valid
}

export { validate }