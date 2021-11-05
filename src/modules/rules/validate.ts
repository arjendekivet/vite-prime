import _ from 'lodash'
import Validator from '@/types/validator'
import Fieldconfig from '@/types/fieldconfig'
import { useVuelidate, ValidationRule, ValidationRuleWithParams, ValidatorFn } from '@vuelidate/core'
import { helpers  } from '@vuelidate/validators'
import { isAsyncFn , isCustomValidatorType } from '@/modules/rules/core'
import rc_ from '@/modules/rules/constants'
import cvh from '@/modules/rules/validateHelpers' // imports the default export as namespace cvh...

const mapValidators = cvh.mapValidators;
/**
 * Alias for useVuelidate such that the form does not have to know which validator package we are using. We would only have to know the signature ...
 */
export const useValidation = useVuelidate

/**
 * Augment a validator,
 * 1. If async needed, calls the withAsync helper, and 
 * 2. adds the params
 * @param addedParams
 * @param validator 
 * @returns 
 */
function augmentValidator(addedParams = {}, validator: ValidationRuleWithParams | ValidationRuleWithParams | ValidatorFn): ValidationRule {
    const isAsync = isAsyncFn(validator ?? "")
    if (isAsync){
        return helpers.withParams(addedParams, helpers.withAsync(validator))
    }
    return helpers.withParams(addedParams, validator)
}

const visibility = (params: object, validatorFn: any, fieldCfg, formDefinition, formData) => {
    const mergedParams = Object.assign({},{ type: 'displayIf' } , params, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
    return helpers.withParams(
        mergedParams,
        validatorFn
        )
    }

/**
 * Dynamically creates a validator for vuelidate.
 * Is only to support rules of type "disableIf" that pass in an entire Function from the JSON, which we do not likely want to support.
 * @param type String Indicates which validator this should become in vuelidate.
 * @param params Object. Holds the params that should be added to the vuelidate validator function signature. NOTE: IT MUST AT LEAST BE AN EMPTY OBJECT!
 * @param validatorFn. The function to call as the vuelidate internal validator fucntion.
 * @param message. TODO: IF we pass in a message, should we call helper.withMessage and will v$ then NOT use themessage on the $response object???
 * @param fieldCfg 
 * @param formDefinition 
 * @param formData 
 * @returns 
 */
const ruleGenerator = function(type: string, params: object = {} , validatorFn: any, message: string = "dummy message string ohe",  fieldCfg, formDefinition, formData) {
    let validator;
    try {
        const mergedParams = Object.assign({}, params, { type: type }, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
        if (type ==='disableIf'){
            validator = helpers.withParams( mergedParams, validatorFn)
        }
    }
    catch(e){
        console.warn(e)
    }
    return validator
}
   
//add to mapValidators ...
mapValidators[rc_.RULE_GENERATOR] = ruleGenerator
    
export function validName(name) {
    let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
    if (validNamePattern.test(name)){
        return true;
    }
    return false;
}

/**
 * Sets the validators for useVuelidate
 * Iterates the field validators config and populates validatorRules with the mapped -vuelidate/custom- validators.
 * TODO: must validatorRules become a reactive objective itself first?
 * TODO: pass formContext, this could refer to any other data point in scope in the form... for interdependent field validations and form state dependent rule morphing etc
 */
interface formDefinition {
    [key: string]: Fieldconfig
}

// TODO: should we remove all rules every time on invocation or pass in all exisiting rules so the thing will notice which rules did change and refire these? or such?
// Note: if we never pass in the existing rules, we do not need the pValidatorRules either...
export function setValidators(formDefinition: formDefinition, pValidatorRules: Object = {}, formData: Object = {}) {
    const validatorRules = Object.assign({}, pValidatorRules)
    _.forEach(formDefinition, function (field) {
        let mappedValidator
        let fieldName = field.id
        let fieldLabel = field.label
        let objValidator = validatorRules?.[fieldName] || {} // Get previous to augment/overwrite or start freshly.
        let augmentedValidator // to hold the fieldLabel as an extra param, imerged into the original validator
        let hasCustomPrefix = false
        // setting to programmatically generate rules for displayIf and disableIf when no such validators are configured in the field configuration...
        // this setting also makes each field available in the v$ map... so other rules can 'read/retrieve/query' all kinds of validator results..
        const autoMonitorDisplay_Disable = true 
        let addDisplayRule = autoMonitorDisplay_Disable
        let addDisableRule = autoMonitorDisplay_Disable
        let objParams = {}
        let tag: string
        let isAsync = false
        
        // 1. After walking the PRE-CONFIGURED field.validators to implement them, we should decide if we should programmatically ADD certain validators.
        // For example, we may want for EACH field to map it's visibility and it's mode via a rule to vuelidate ...
        // Then, if the field had NO validator of type CV_TYPE_DISPLAY_IF we should append ONE programmatically.
        // Then, if the field had NO validator of type CV_TYPE_DISABLE_IF we should append ONE programmatically.
        // We do this so that other fields or the form or some other component in scope might retrieve that state from vuelidate, because there could de dependsOn in other fields...
        // Only when later on it will show the performance breaks down we could decide to NOT add such rules.
        field.validators?.forEach(function (cfgValidator) {
            augmentedValidator = null; //reset
            let isString = typeof cfgValidator === 'string'
            tag = isString ? cfgValidator : typeof cfgValidator === 'object' && typeof cfgValidator?.type === 'string' ? cfgValidator?.type : null
            if (!tag){
                console.warn(`validator type is not configured on field ${fieldLabel}. Aborting...`)
                return // without the validator type we cannot proceed 
            }

            // use the tag to deduce if this is a custom validator that needs a special mapping plus invocation
            hasCustomPrefix = (tag && isCustomValidatorType(tag)) ? true : false
            
            // TODO: First decide if we have to IGNORE the rule ? Moet dat? Moet het veld niet wellicht een rule ten behoeve van een ander veld aftrappen?
            // dus wanneer een veld indirect/gededuceerd dependents heeft, dan een rule NIET ignoren, omdat anders NOOIT een rule result wordt genoteerd over een veld en andere velden dat dan nooit kunnen consulteren?
            // Deze skip / ignore feature bewaren we voor later, als performance reasons dat vereisen.
            if ( hasCustomPrefix ){
                if (mapValidators[tag]){
                    //register the state about having to addDisplayRule or addDisableRule or ... Once false, it should remain false
                    addDisableRule = ( addDisableRule === false || tag === rc_.CV_TYPE_DISABLE_IF) ? false : true
                    addDisplayRule = ( addDisplayRule === false || tag === rc_.CV_TYPE_DISPLAY_IF) ? false : true
                    objParams = Object.assign({}, cfgValidator.params, { type: tag, fieldCfg: field, formDefinition, formData, fieldLabel } )
                    // we must map AND INVOKE a dedicated HOF from our mapValidators.
                    objValidator[tag] = augmentValidator(objParams, mapValidators[tag](objParams))
                }
                else {
                    console.warn('unmapped custom precoded validator: ', tag)
                }
            }
            else { //for dynamic isCustom validator configs, which bring their own fn:Function configuration....
                if ( cfgValidator.isCustom ){
                    // we must create the validator dynamically via the rule_generator... must use a HOF to get the additional parametrization implemented?
                    mappedValidator = mapValidators[rc_.RULE_GENERATOR](tag, _.clone(cfgValidator.params), cfgValidator.fn, cfgValidator.message || "no message yet", field, formDefinition, formData )
                    //temporarily still support this special case
                    if (!mappedValidator && cfgValidator.type === 'displayIf' && cfgValidator.fn){
                        mappedValidator = visibility(cfgValidator.params, cfgValidator.fn, field, formDefinition, formData)
                    }
                }
                else {
                    mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-
                }

                let isParam = !isString && tag && Object.keys(cfgValidator.params).length > 0 // ! hasCustomPrefix???????

                if (mappedValidator) {
                    if (isString) { // unparameterized vuelidate built-in validator
                        augmentedValidator = augmentValidator({ fieldLabel }, mappedValidator)
                    }
                    // parameterized vuelidate built-in validator, note NOT meant for our fully custom validators from hofRuleFnGenerator... 
                    else if (isParam) { 
                        let paramValues = []
                        let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                        // Note: we usually want params to be an array to preserve the order in which they are passed... for BUILTIN validators that is necessary ... 
                        // However, we should not enter this branch for our fully custom validators....?
                        _.forIn(cfgValidator.params, function (paramEntry) {
                            if (normalize === true && paramEntry !== undefined  && paramEntry !== null ) {
                                _.forEach(paramEntry, function (paramValue) {
                                    if ( paramEntry?.['$model']) {
                                        try {
                                            let tmp
                                            //if $model is an array of strings, we have to pick up multiple dynamical values from the data in scope ...
                                            if (_.isArray(paramEntry['$model'])){
                                                let arrTmp = [];
                                                // walk the array and push a value from the data in scope for each entry...
                                                _.forEach(paramEntry['$model'], function(targetDataPoint){
                                                        tmp = formData?.[targetDataPoint]
                                                        arrTmp.push(tmp)
                                                })
                                                paramValue = arrTmp
                                            }
                                            else {
                                                // just try to pick up one dynamical data parameter
                                                let targetDataPoint = paramEntry.$model
                                                paramValue = formData?.[targetDataPoint]
                                            }
                                        }
                                        catch(e) {
                                            console.log(e)
                                        }
                                    }
                                    paramValues.push(paramValue)
                                })
                            }
                            else { // push as is!
                                paramValues.push(paramEntry)
                            }
                        })
                        // if the mappedValidator can be invoked, set the validator to the parameterized invocation of it, since apparently we have params ...
                        if (typeof mappedValidator === 'function' && paramValues.length > 0){
                            augmentedValidator = augmentValidator({ fieldLabel }, mappedValidator(...paramValues))
                        }
                        // else if we have passed it ourselves, it should already have the correct signature?
                        else {
                            augmentedValidator = augmentValidator({ fieldLabel }, mappedValidator)
                        }
                    }        
                    objValidator[tag] = augmentedValidator
                }
                else {
                    // for now only hardcoded on visibility? meant for one display rule with a FUNCTION in the JSON (field anwer hiding on 'pipo' in field title)
                    // for totally extraneous rules, say from the server ...
                    if (cfgValidator.isCustom && cfgValidator.type === 'displayIf'){
                        mappedValidator = visibility(cfgValidator.params, cfgValidator.fn, field, formDefinition, formData)
                        if (isParam) { // parameterized custom validator
                            let paramValues = []
                            let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                            let iterator = Array.isArray(cfgValidator.params) ? cfgValidator.params : Object.values(cfgValidator.params)
                                iterator.forEach(function (paramEntry) {
                                    if(paramEntry){
                                        if (normalize) {
                                            let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                                            iterator.forEach(function (paramValue) {
                                                paramValues.push(paramValue)
                                            })
                                        }
                                        else { //push as is
                                            paramValues.push(paramEntry)
                                        }
                                }
                            })
                            if (paramValues.length > 0){ 
                                // set the validator to the parameterized invocation of it, since apparently we have params ...
                                augmentedValidator = augmentValidator({ fieldLabel }, mappedValidator(...paramValues))
                            }
                            else {                        
                                augmentedValidator = augmentValidator({ fieldLabel }, mappedValidator)
                            }
                        }
                        objValidator[tag] = augmentedValidator
                    }
                }
            }
        })
        // A. If we still have to programmatically add a displayerIf Rule, do so.
        if (addDisplayRule){
            try{
                tag = rc_.CV_TYPE_DISPLAY_IF
                objParams = Object.assign({}, { type: tag, fieldCfg: field, formDefinition, formData, fieldLabel } )
                objValidator[tag] = augmentValidator(objParams, mapValidators[tag](objParams))
            }
            catch(e){
                console.warn(e)
            }
        }
        // B. If we still have to  programmatically add a disablerIf Rule, do so.
        if (addDisableRule){
            try{
                tag = rc_.CV_TYPE_DISABLE_IF
                objParams = Object.assign({}, { type: tag, fieldCfg: field, formDefinition, formData, fieldLabel } )
                objValidator[tag] = augmentValidator(objParams, mapValidators[tag](objParams))
            } catch(e){
                console.warn(e)
            }
        }
        // Register the validators on the ref that will be passed in to useVuelidate ...
        if ( _.values(objValidator).length>0 ){
            validatorRules[fieldName] = objValidator
        }
    })
    return validatorRules
}