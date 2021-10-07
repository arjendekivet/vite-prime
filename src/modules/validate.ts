import _ from 'lodash'
import Validator from '@/types/validator'
import Fieldconfig from '@/types/fieldconfig'
import { useVuelidate } from '@vuelidate/core'
import { required, email , minLength, maxLength, between , maxValue } from '@vuelidate/validators'

// create a map to be able to dynamically refer to the vuelidate validators
export const mapValidators = {
  required,
  email,
  minLength,
  maxLength,
  between,
  maxValue
}

/**
 * Alias for useVuelidate such that the form does not have to know which validator package we are using. We would only have to know the signature ...
 */
export const useValidation = useVuelidate

/**
 * Sets the validators for useVuelidate
 * Iterates the field validators config and populates validatorRules with the mapped -vuelidate/custom- validators.
 * TODO: must validatorRules become a reactive objective itself first?
 * TODO: pass formContext, this could refer to any other data point in scope in the form... for interdependent field validations and form state dependent rule morphing etc
 */
export function setValidators(formDefinition: Fieldconfig[], pValidatorRules: Object = {}, pFormContext: Object = {}) {
    const validatorRules = Object.assign({}, pValidatorRules)
    formDefinition.forEach(function (field) {
        let mappedValidator  
        let fieldName = field.id
        let objValidator = validatorRules?.[fieldName] || {} // Get previous to augment/overwrite or start freshly.

        field.validators?.forEach(function (cfgValidator) {
            let isString = typeof cfgValidator === 'string'
            let tag = isString ? cfgValidator : typeof cfgValidator === 'object' && typeof cfgValidator?.type === 'string' ? cfgValidator?.type : ""
            let isParam = !isString && tag && Object.keys(cfgValidator.params).length > 0 
            mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-
            if (mappedValidator){
                if (isString) {
                    objValidator[tag] = mappedValidator //unparameterized mapped validator
                }
                else if (isParam) { // parameterized mapped validator
                    let paramValues = []
                    let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false 

                    cfgValidator.params.forEach(function (paramEntry) {
                        if(normalize){
                            let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                            iterator.forEach(function(paramValue){
                                debugger
                                paramValues.push(paramValue)        
                            })
                        }
                        else { //push as is
                            paramValues.push(paramEntry)
                        }
                    })
                    // set the validator the parameterized invocation of it, since apparently we have params ...
                    objValidator[tag] = mappedValidator(...paramValues)
                }
            }
        })
        validatorRules[fieldName] = objValidator
    })
    return validatorRules
}

type returnValue = {
    valid: boolean
    info: string
}

/**
 * naive validate.
 * TODO: code all kinds of validators and edge cases or use a proper validation framework 
 * @param value 
 * @param validators 
 * @returns 
 */
const validate = function (value: unknown, validators: Validator[]): returnValue {
    // clone the value deeply (and idealy once) since we might have to change it in some validator...
    let lvalue = _.cloneDeep(value);
    const returnValue = { valid: true, info: '' }
    validators.forEach(function (validator) {
        if (validator === 'required') {
            // when a string, trim, since/if/because a value consisting only out of spaces does not count as a valid value.
            if (typeof lvalue === 'string'){
                lvalue = lvalue.trim() 
            }

            if ( _.isEmpty(lvalue) ){
                returnValue.valid = false
                returnValue.info = validator
                // break out of the loop at the first invalidati... for now ...
                return
            }
        }
    })
    return returnValue
}

export { validate }