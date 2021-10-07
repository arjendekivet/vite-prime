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
 * dummy validator to enforce uniform binding at the v$ scope?
 */
// const dummyValidator = {
//     $params: { type: 'dummy', value: undefined },
//     $validator: (value) => true,
//     $message: 'dummy validator, should always be true'
// }

/**
 * Sets the validators for useVuelidate
 * Iterates the field validators config and populates validatorRules with the mapped -vuelidate/custom- validators.
 * TODO: must validatorRules become a reactive objective itself first?
 * TODO: pass formContext, this could refer to any other data point in scope in the form... for interdependent field validations and form state dependent rule morphing etc
 */
export function setValidators(formDefinition: Fieldconfig[], pValidatorRules: Object = {}, pFormContext: Object = {}) {
    const validatorRules = Object.assign({}, pValidatorRules)
    formDefinition.forEach(function (field) {
        let fieldName = field.id
        let mappedValidator  // 1 Get any previous object of validators, if it existed, since there may be multiple per field.
        let objValidator = validatorRules?.[fieldName] || {}

        field.validators?.forEach(function (cfgValidator) {
            debugger
            // since there may be multiple validators per field...
            objValidator = validatorRules[fieldName] || {}
            
            let lisString = typeof cfgValidator === 'string'
            let tag = lisString ? cfgValidator : typeof cfgValidator === 'object' && typeof cfgValidator?.type === 'string' ? cfgValidator?.type : ""
            let isParam = !lisString && tag && Object.keys(cfgValidator.params).length > 0 

            // if the config carries it own validator function, that should prevail over the vuelidate validator in the mapping...
            // mappedValidator = !isString && cfgValidator['fn'] ? cfgValidator['fn'] : mapValidators[tag]
            mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-

            if (mappedValidator){
                if (lisString) {
                    // unparameterized mapped validator
                    objValidator[tag] = mappedValidator
                }
                else if (isParam) {
                    // parameterized mapped validator.
                    debugger
                    //if it is a built in vuelidate validator, it already knows how to take params, but if there are multiple params, how do we know how to pass them ... e.g. which param in which order?
                    // should we only allow for an array of param values to be configured ? like, for 'between', two values, [min max] ?
                    let paramValues = []
                    let params = Object.keys(cfgValidator.params)
                    
                    params.forEach(function (paramValue) {
                    // get the proper param value ...
                    let paramX = cfgValidator.params[paramValue]
                        paramValues.push(paramX)
                    })

                    // set the validator the parameterized invocation of it, since apparently we have params ...
                    //objValidator[tag]= () => mapValidators[tag](...paramValues)
                    objValidator[tag] = mappedValidator(...paramValues)
                }
            }
            // In case objValidator was not populated at all yet ... use the dummy
            // if (Object.keys(objValidator).length < 1){
            //     objValidator['dummy'] = dummyValidator
            // }
            // and add objValidator to validatorRules ...  for usage in rules = computed()
            validatorRules[fieldName] = objValidator
        })
        debugger
        // // In case we did NOT have any validators, and we still want to monitor the field for a uniform dynamic v-model binding expression, should we associate a dummy validator to such fields?
        // if (!field?.validators || !field?.validators?.length){
        //     debugger
        //     objValidator['dummy'] = dummyValidator
        // }
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