import _ from 'lodash'
import Validator from '@/types/validator'
import Fieldconfig from '@/types/fieldconfig'
import { useVuelidate, ValidationRule, ValidationRuleWithParams, ValidatorFn } from '@vuelidate/core'
import { helpers, required, requiredIf, requiredUnless, email, minLength, maxLength, between, maxValue , and } from '@vuelidate/validators'
//import { isCustomValidatorType, RULE_GENERATOR, disablerIf, V_DISPLAYIF , V_DISABLEIF, VISIBILITY , SILENTVALIDITY , V_CUSTOM_PREFIX, CV_TYPE_DISABLE_IF} from '@/modules/validateHelpers' //custom vuelidate helpers...
import cvh from '@/modules/validateHelpers' //custom vuelidate helpers...

// create an alias for cvh.helpers ?
let v_h_ = cvh.cHelpers;

// debugger;
//inspect if between is callable???? sommige zijn callable (function,), andere zijn normalized validator objects ... met een $validator function erop
// sommige kunnen herhaaldelijk worden aangeroepen, andere niet. Between biv. zet eenmaal de params en moet dan aangeroepen worden?

// Voorbeeld uit de browser console van de "and" api van vuelidate:
// let chk; try{ chk = and(requiredIf(true),requiredUnless(false),email.$validator('o.henneken@cynapps.nl')) } catch(e){ console.warn(e);debugger;} chk.$validator.toString()
//'function(...args) {\n    return validators.reduce((valid, fn) => {\n      if (!unwrapValidatorResponse(valid))\n        return valid;\n      return unwrapNormalizedValidator(fn).apply(this, args);\n    }, true);\n  }'
// running voorbeeld uit de browser console
// let chk; try{ chk = and(requiredIf("pipoooooooooooooooooooo"),minLength(21)) } catch(e){ console.warn(e);debugger;} chk.$validator('o.henneken@cynapps.nl')
// true
//let chk; try{ chk = and(requiredIf("pipoooooooooooooooooooo"),minLength(22)) } catch(e){ console.warn(e);debugger;} chk.$validator('o.henneken@cynapps.nl')
//false
//etcetera 
// console.log(typeof(and))

// create a map to be able to dynamically refer to the vuelidate validators
export const mapValidators = {
    required,
    requiredIf,
    requiredUnless,
    email,
    minLength,
    maxLength,
    between,
    maxValue, 
    // custom cynapps validators which are rule-executioners for NON-validation purposes, like "display", and "disable".
    [cvh.CV_TYPE_DISABLE_IF]: cvh.disablerIf,
    [cvh.CV_TYPE_DISPLAY_IF]: cvh.displayerIf,
}

/**
 * Alias for useVuelidate such that the form does not have to know which validator package we are using. We would only have to know the signature ...
 */
export const useValidation = useVuelidate


/**
 * Genereer een aantal simpele validators, zoals isVisible('fieldName'), isEnabled('fieldName'), isLazyValid('fieldName'), isValid() (silently!)
 * 
 * De isValid() validator zou eigenlijk NIETS moeten executeren maar alleen moeten uitlezen, hetzelfde geldt voor de 
 * 
 * die als eenvoudige rules afgaan op relevante velden velden voordat ze uitgelezen moeten worden.
 * Bijv als cat_3 aanstuurt de velden cat_4 en cat_5 moet op cat_3 een setje eenvoudige validators afgaan 
 * We focussen pimair op het gebruik van values (formData) en van -silent-Validity, want die zijn standaard al beschikbaar.
 * 
 * Om de benodigde validators op tijd te laten afgaan per veld, moeten we in de velden die dependentFields hebben een aantal validators registreren
 * niet zozeer als hun eigen validators maar zeker ook validators tbv andere velden. Zoals dus de validators die validatie uitrekenen, maar ook visibility.
 * En optioneel ook enabling... 
 * 
 * Als field veld3 geen eigen uitgebreiden validators heeft, voor zijn content en of voor zijn eigen visibility en enabling, dan kan een ander veld dat nooit uitlezen uit v$.veld3 ...
 * en al helemaal niet als de rules voor veld3 pas afgaan NADAT veld5 gecalculeerd wordt, dus de aanname / voorwaarde is dan wel dat die validators er zijn.
 * 
 * Te ondersteunen use case: de functionaliteit die nu in calculateDependentFieldStates wordt geleverd in 1 recursive go:
 * - Wanneer er dependent fields zijn, en de waarde van een current field is veranderd dan moet recursief de hele chain van dependentFields worden afgelopen,
 * - als de verandering was isEmpty() -null of undefined of "" dan moet de visibility van die velden op FALSE gezet worden en de value op null gezet worden
 * - als de verandering NIET isEmpty() dan moet de visibility van die velden op TRUE gezet worden en hun huidige value NIET veranderd worden.
 * 
 * Daaraan voegen we toe, optioneel, als de verandering is naar een invalid waarde, ook dan gaan we recursief hiden en al dan niet resetten.
 * 
 * De bestaande validators / rules kunnen dan met de or / and / not API gechained en gegroupeerd worden, maar deze validators slaan dan op het veld waaraan ze geassocieerd zijn.
 * Je wil noet de rules van andere validators runnen als dat niet hoeft?
 * Er zijn dus ook gewoon helper functies nodig die UITLEZEN wat de state is van andere velden... qua validity qua visibility etc.
 * 
 * Nota bene: kunnen we eventueel collections gebruiken om de 'exotische' rules over visibility en enabling te grouperen i response namespaces?
 * Nota bene: volgens de api moet met een Higher Order Function wel degelijk een hele set van params in scope gebracht kunnen worden voor een validator.
 * 1. De Higher Order Function moet een signatuur hebben waarin de params gerefereerd/gespecificeerd worden en deze moet de reurn value van helper.withParams retourneren!
 * 2. De higher Order Function moet de helpers.withparams() api aanroepen en de inner function daarin moet de validator function zijn.
 * 
 */

/**
 * HOC which adds extra params to the passed validator.
 */
function addParamsTovalidator(addedParams = {}, validator: ValidationRuleWithParams | ValidationRuleWithParams | ValidatorFn): ValidationRule {
    return helpers.withParams(addedParams, validator)
}

const visibility = (params: object, validatorFn: any, fieldCfg, formDefinition, formData) => {
    //
    const mergedParams = Object.assign({},{ type: 'displayIf' } , params, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
    return helpers.withParams(
        mergedParams,
        // (value, vm , ...mergedParams) => { // console.log('hardcoded code'); return true;}
        validatorFn
        )
    }

/**
 * Dynamically creates a validator for vuelidate.
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
    let preliminaryValidator
    debugger;
    if (fieldCfg.id==='cat_5' && type==='disableIf'){
        
        try{
            
            // let lParams = {
            //     dependsOn: {
            //         // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
            //         ALL_VISIBLE: ['cat_4', 'cat_5'], 
            //         ALL_INVALID: ['cat_4']
            //     },
            // }
            // let objParams = Object.assign({}, params, { type: type }, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
            let objParams = Object.assign({}, params, { type, fieldCfg, formDefinition, formData })
            
            // we cannot assume the JSON config will contains functions, so we have to retrieve these functions from elsewhere ...
            // preliminaryValidator = validatorFn(objParams)
            preliminaryValidator = cvh.disablerIf(objParams)
            
            validator = helpers.withParams(
                objParams,
                preliminaryValidator //this should now be in the format of a proper validator function for vuelidate!!!
            )
        } catch(e){
            console.warn(e)
        }
    }
    // first create the basic validator ???????????????
    // let basic_validator = addParamsTovalidator({ type: type }, { $validator: validatorFn, $message: message } )
    //let invocator = (fieldCfg, formData, formDefinition) => { // return validatorFn(value, vm, fieldCfg, formData, formDefinition)}
    //let test = () => validatorFn(value, vm, fieldCfg, formData, formDefinition)
    
    try {
        const mergedParams = Object.assign({}, params, { type: type }, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )

        // validator = helpers.withParams(
        //     mergedParams,
        //     { 
        //         $validator: validatorFn, 
        //     })
        if (fieldCfg.id !=='cat_5' && type ==='disableIf'){
            validator = helpers.withParams(
                mergedParams,
                //invocator(fieldCfg, formData, formDefinition)
                //validatorFn(fieldCfg, formData, formDefinition)
                validatorFn
                )
        }
    
        //then add the rest of the params ???
        // const mergedParams = Object.assign({}, params, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
        // validator = helpers.withParams(
        //     mergedParams,
        //     basic_validator)
    }
    catch(e){
        debugger
        console.warn(e)
    }
    //
    return validator
}
   
//add to mapValidators
// mapValidators['displayIf'] = visibility
// mapValidators['disableIf'] = disabler
mapValidators[cvh.RULE_GENERATOR] = ruleGenerator

// mapValidators['name_pattern'] = helpers.withParams(
//     { type: 'valid_name' },
//     {  $validator: validName, $message: `Invalid name via custom validator 'name_pattern' via source code` }
//     )
    
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
    // // can we totally get rid of v$ in this scope?
    // try { if (v$) {debugger; console.log('v$ is in scope')}} 
    // catch(e){console.warn(e);debugger}
    
    const validatorRules = Object.assign({}, pValidatorRules)
    _.forEach(formDefinition, function (field) {
        let mappedValidator
        let fieldName = field.id
        let fieldLabel = field.label
        let objValidator = validatorRules?.[fieldName] || {} // Get previous to augment/overwrite or start freshly.
        let augmentedValidator // to hold the fieldLabel as an extra param, imerged into the original validator
        let hasCustomPrefix = false
        let addDisplayRule = true
        let addDisableRule = true
        let objParams = {}
        let tag: string
        
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
                console.error('validator type is missing...')
                return // without the validator type we cannot proceed 
            }

            // use the tag to deduce if this is a custom validator that needs a special mapping plus invocation
            hasCustomPrefix = tag && cvh.isCustomValidatorType(tag)
            
            // TODO: First decide if we have to IGNORE the rule ? Moet dat? Moet het veld niet wellicht een rule ten behoeve van een ander veld aftrappen?
            // dus wanneer een veld indirect/gededuceerd dependents heeft, dan een rule NIET ignoren, omdat anders NOOIT een rule result wordt genoteerd over een veld en andere velden dat dan nooit kunnen consulteren?
            // Deze skip / ignore feature bewaren we voor later, als performance reasons dat vereisen.
            if ( hasCustomPrefix ){
                if (mapValidators[tag]){
                    //register the state about having to addDisplayRule or addDisableRule or ... Once false, it should remain false
                    addDisableRule = ( addDisableRule === false || tag === cvh.CV_TYPE_DISABLE_IF) ? false : true
                    addDisplayRule = ( addDisplayRule === false || tag === cvh.CV_TYPE_DISPLAY_IF) ? false : true

                    objParams = Object.assign({}, cfgValidator.params, { type: tag, fieldCfg: field, formDefinition: formDefinition, formData: formData, fieldLabel: fieldLabel } )
                    
                    // we must map AND INVOKE a dedicated HOC from our mapValidators. So ... NOT invoke the legacy RULE_GENERATOR, which is meant only for rules based on passed fn: function!!! IN the JSON instead of in the source code, which will be rarely supported, we guess for now.
                    mappedValidator = mapValidators[tag](objParams)

                    // and we MUST pass it at least ONCE across vuelidate helpers.withParams to format it for vuelidate as an executable validator
                    augmentedValidator = addParamsTovalidator(objParams, mappedValidator) 
                    objValidator[tag] = augmentedValidator
                }
                else {
                    console.warn('unmapped custom precoded validator: ', tag)
                }
            }
            //for dynamic isCustom validator configs, direct type is not present, instead the type must live inside the params instead of in the direct type
            else {
                if ( cfgValidator.isCustom ){
                    // we must create the validator dynamically via the rule_generator...
                    // must we use a HOC to get the additional parametrization implemented?
                    //mappedValidator = mapValidators[cvh.RULE_GENERATOR](tag, _.clone(cfgValidator.params), cfgValidator.fn, cfgValidator.message || "no message yet", field, formDefinition, formData, lv$)
                    mappedValidator = mapValidators[cvh.RULE_GENERATOR](tag, _.clone(cfgValidator.params), cfgValidator.fn, cfgValidator.message || "no message yet", field, formDefinition, formData )
                }
                else {
                    mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-
                }
                let isParam = !isString && tag && Object.keys(cfgValidator.params).length > 0 // ! hasCustomPrefix???????

                if (mappedValidator) {
                    if (isString) { // unparameterized vuelidate built-in validator
                        augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                    }
                    // parameterized vuelidate built-in validator, NOT meant for custom validators, 
                    else if (isParam) { 
                        // TODO !!!!! however, we might want to check if we can resolve dynamically for params !!!!!!
                        // like requiredIf(data) the data must come from some field from formData!
                        let paramValues = []
                        let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                        
                        // if (cfgValidator.isCustom ){
                        //     mappedValidator = mapValidators[tag](_.clone(cfgValidator.params), cfgValidator.fn)
                        // }
                        // cfgValidator.params.forEach(function (paramEntry) {
                        // Note: we usually want params to be an array to preserve the order in which they are passed... for BUILTIN validators that is necessary ... 
                        // However, we should not enter this branch for our fully custom validators....?
                        _.forIn(cfgValidator.params, function (paramEntry) {
                            //cfgValidator.params.forEach(function (paramEntry) {
                            if (normalize === true && paramEntry !== undefined  && paramEntry !== null ) {
                                let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
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
                                        paramValues.push(paramValue)
                                    }
                                    else {
                                        paramValues.push(paramValue)
                                    }
                                })
                            }
                            else { 
                                //push as is
                                paramValues.push(paramEntry)
                            }
                        })
                        debugger;
                        // if the mappedValidator can be invoked, set the validator to the parameterized invocation of it, since apparently we have params ...
                        if (typeof mappedValidator === 'function' && paramValues.length > 0){
                            augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator(...paramValues))
                        }
                        // else if we have passed it ourselves, it should already have the correct signature????
                        else {
                            augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                        }
                    }
                    // if (fieldName === 'firstnamertx'){
                    //     objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' using source code from validate.ts`})
                    // }        
                    objValidator[tag] = augmentedValidator
                }
                else {
                    console.log('is this a dead branch running ??? or for fields other then cat_5 ?????');
                    //for now only hardcoded on visibility? meant for one display rule with a FUNCTION in the JSON (field anwer hiding on 'pipo' in field title)
                    // for totally extraneous rules, say from the server ...
                    if (cfgValidator.isCustom && cfgValidator.type === 'displayIf'){
                        debugger;
                        //TODO make this dynamically valid code, so that we will support validatrs of type: display, disableIf etc etc 
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
                                augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator(...paramValues))
                            }
                            else {                        
                                augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                            }
                        }
                        objValidator[tag] = augmentedValidator
                    }
                }
            }
        })

        // A. If we still have to add a displayerIf Rule, do so.
        if (addDisplayRule){
            try{
                tag = cvh.CV_TYPE_DISPLAY_IF
                if ( mapValidators[tag] && cvh.isCustomValidatorType(tag)){
                    objParams = Object.assign({}, { type: tag, fieldCfg: field, formDefinition: formDefinition, formData: formData, fieldLabel: fieldLabel } )
                    mappedValidator = mapValidators[tag](objParams)
                    augmentedValidator = addParamsTovalidator(objParams, mappedValidator) 
                    objValidator[tag] = augmentedValidator
                }
            }
            catch(e){
                console.warn(e)
            }
        }
        // B. If we still have to add a disablerIf Rule, do so.
        if (addDisableRule){
            try{
                tag = cvh.CV_TYPE_DISABLE_IF
                if ( mapValidators[tag] && cvh.isCustomValidatorType(tag)){
                    debugger
                    objParams = Object.assign({}, { type: tag, fieldCfg: field, formDefinition: formDefinition, formData: formData, fieldLabel: fieldLabel } )
                    mappedValidator = mapValidators[tag](objParams)
                    augmentedValidator = addParamsTovalidator(objParams, mappedValidator) 
                    objValidator[tag] = augmentedValidator
                }
            } catch(e){
                console.warn(e)
            }
        }
        if ( _.values(objValidator).length>0 ){
            validatorRules[fieldName] = objValidator
        }
    })
    return validatorRules
}

export function setValidatorsBAK(formDefinition: formDefinition, pValidatorRules: Object = {}, formData: Object = {}) {
    let lv$
    try {lv$ = v$ } catch(e){
        console.warn(e)
        debugger
    }
    
    const validatorRules = Object.assign({}, pValidatorRules)
    _.forEach(formDefinition, function (field) {
        let mappedValidator
        let fieldName = field.id
        let fieldLabel = field.label
        let objValidator = validatorRules?.[fieldName] || {} // Get previous to augment/overwrite or start freshly.
        let augmentedValidator // to hold the fieldLabel as an extra param, imerged into the original validator
        let hasCustomPrefix = false
        let addDisplayRule = true
        let addDisableRule = true
        let objParams = {}
        let tag: string
        // 1. After walking the PRE-CONFIGURED field.validators to implement them, we should decide if we should programmatically ADD certain validators.
        // For example, we may want for EACH field to map it's visibility and it's mode via a rule to vuelidate ...
        // Then, if the field had NO validator of type CV_TYPE_DISPLAY_IF we should append ONE programmatically.
        // Then, if the field had NO validator of type CV_TYPE_DISABLE_IF we should append ONE programmatically.
        // We do this so that other fields or the form or some other component in scope might retrieve that state from vuelidate, because there could de dependsOn in other fields...
        // Only when later on it will show the performance breaks down we could decide to NOT add such rules.
        
        field.validators?.forEach(function (cfgValidator) {

            augmentedValidator = null //reset
            let isString = typeof cfgValidator === 'string'
            tag = isString ? cfgValidator : typeof cfgValidator === 'object' && typeof cfgValidator?.type === 'string' ? cfgValidator?.type : null
            if (!tag){
                //
                console.error('type is missing...')
                return
                //without the type we cannot proceed 
            }

            // use the tag to deduce if this is a custom validator that needs a special mapping plus invocation
            hasCustomPrefix = tag && cvh.isCustomValidatorType(tag)
            
            // TODO: First decide if we have to IGNORE the rule ? Moet dat? Moet het veld niet wellicht een rule ten behoeve van een ander veld aftrappen?
            // dus wanneer een veld indirect/gededuceerd dependents heeft, dan een rule NIET ignoren, omdat anders NOOIT een rule result wordt genoteerd over een veld en andere velden dat dan nooit kunnen consulteren?
            // Deze skip / ignore feature bewaren we voor later, als performance reasons dat vereisen.

            //for dynamic isCustom validator configs, direct type is not present, instea d the type must live inside the params instead of in the direct type
            if ( hasCustomPrefix && mapValidators[tag]){
                
                //register the state about having to addDisplayRule or addDisableRule or ... Once false, it should remain false
                addDisableRule = ( addDisableRule === false || tag === cvh.CV_TYPE_DISABLE_IF) ? false : true
                addDisplayRule = ( addDisplayRule === false || tag === cvh.CV_TYPE_DISPLAY_IF) ? false : true

                objParams = Object.assign({}, cfgValidator.params, { type: tag, fieldCfg: field, formDefinition: formDefinition, formData: formData, fieldLabel: fieldLabel } )
                
                // we must map AND INVOKE a dedicated HOC and bypass the RULE_GENERATOR, which is meant only for rules based on passed fn: function!!! IN the JSON instead of in the source code, which will be rarely supported, we guess for now.
                mappedValidator = mapValidators[tag](objParams)

                // and we MUST pass it at least ONCE across vuelidate helpers.withParams to format it for vuelidate as an executable validator
                augmentedValidator = addParamsTovalidator(objParams, mappedValidator) 
                objValidator[tag] = augmentedValidator
            }
            //for dynamic isCustom validator configs, direct type is not present, instead the type must live inside the params instead of in the direct type
            else if ( cfgValidator.isCustom ){
                // we must create the validator dynamically via the rule_generator...
                // must we use a HOC to get the additional parametrization implemented?
                mappedValidator = mapValidators[cvh.RULE_GENERATOR](tag, _.clone(cfgValidator.params), cfgValidator.fn, cfgValidator.message || "no message yet", field, formDefinition, formData, lv$)
            }
            else {
                mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-
            }

            let isParam = !isString && tag && Object.keys(cfgValidator.params).length > 0 // ! hasCustomPrefix???????

            if (mappedValidator && !hasCustomPrefix) {
                if (isString) { // unparameterized vuelidate built-in validator
                    augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                }
                // parameterized vuelidate built-in validator, NOT meant for custom validators, 
                else if (isParam) { 
                    // TODO !!!!! however, we might want to check if we can resolve dynamically for params !!!!!!
                    // like requiredIf(data) the data must come from some field from formData!
                    let paramValues = []
                    let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                    
                    // if (cfgValidator.isCustom ){
                    //     mappedValidator = mapValidators[tag](_.clone(cfgValidator.params), cfgValidator.fn)
                    // }
                    // cfgValidator.params.forEach(function (paramEntry) {
                    // Note: we usually want params to be an array to preserve the order in which they are passed... for BUILTIN validators that is necessary ... 
                    // However, we should not enter this branch for our fully custom validators....?
                    _.forIn(cfgValidator.params, function (paramEntry) {
                        //cfgValidator.params.forEach(function (paramEntry) {
                        if (normalize === true && paramEntry !== undefined  && paramEntry !== null ) {
                            let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                            _.forEach(paramEntry, function (paramValue) {
                                if ( paramEntry?.['$model']) {
                                    try {
                                        let tmp
                                        //if $model is an array of strings, we have to pick up multiple dynamical values from the data in scope ...
                                        if (_.isArray(paramEntry['$model'])){
                                            let arrTmp = [];
                                            // walk the array and push a value from the data in scope for each entry...
                                            _.forEach(paramEntry['$model'], function(targetDataPoint){
                                                    tmp = formData?.[targetDataPoint] ?? lv$?.[targetDataPoint]?.$model ?? null
                                                    arrTmp.push(tmp) 
                                            })
                                            paramValue = arrTmp
                                        }
                                        else {
                                            // just try to pick up one dynamical data parameter
                                            let targetDataPoint = paramEntry.$model
                                            paramValue = formData?.[targetDataPoint] ?? lv$?.[targetDataPoint]?.$model ?? null
                                        }
                                    }
                                    catch(e) {
                                        console.log(e)
                                    }
                                    paramValues.push(paramValue)
                                }
                                else {
                                    paramValues.push(paramValue)
                                }
                            })
                        }
                        else { 
                            //push as is
                            paramValues.push(paramEntry)
                        }
                    })
                    
                    // if the mappedValidator can be invoked, set the validator to the parameterized invocation of it, since apparently we have params ...
                    if (typeof mappedValidator === 'function' && paramValues.length > 0){
                        augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator(...paramValues))
                    }
                    // else if we have passed it ourselves, it should already have the correct signature????
                    else {
                        augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                    }
                }
                // if (fieldName === 'firstnamertx'){
                //     objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' using source code from validate.ts`})
                // }        
                objValidator[tag] = augmentedValidator
            }
            else {
            
                //for now only hardcoded on visibility?
                // for totally extraneous rules, say from the server ...
                if (cfgValidator.isCustom ){

                    // map it to visibility hardcoded for now to test...
                    //mappedValidator = visibility(_.clone(cfgValidator.params), cfgValidator.fn , field, formDefinition, pFormContext )
                    //TODO: do we HAVE to clone the params? TODO: pass in the rest of the context like fieldValues/formdata and formdefinition etc ? 
                    //TODO make this dynamically valid code, so that we will support validatrs of type: display, disableIf etc etc 
                    mappedValidator = visibility(_.clone(cfgValidator.params), cfgValidator.fn)

                    if (isParam) { // parameterized custom validator
                        let paramValues = []
                        let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                    
                        let iterator = Array.isArray(cfgValidator.params) ? cfgValidator.params : Object.values(cfgValidator.params)
                            iterator.forEach(function (paramEntry) {
                                if(paramEntry){
                                    //_.forEach(cfgValidator.params, function (paramEntry) {
                                    if (normalize) {
                                        // let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                                        // _.forEach(paramEntry, function (paramValue) {
                                        //     paramValues.push(paramValue)
                                        // })
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
                            augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator(...paramValues))
                        }
                        else {                        
                            augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                        }
                    }
                    // if (fieldName === 'firstnamex'){
                    //     //augmentedValidator = addParamsTovalidator({ fieldLabel }, { $validator: cfgValidator.fn, $message: `Invalid name via custom validator 'name_pattern' from external JSON`})
                    //     augmentedValidator = addParamsTovalidator({ fieldLabel }, { $validator: cfgValidator.fn, $message: cfgValidator.message })
                    // }
                    objValidator[tag] = augmentedValidator
                }
            }
        })

        // A. If we still have to add a displayRule, do so.
        if (addDisplayRule){
            try{
                tag = cvh.CV_TYPE_DISPLAY_IF
                if ( mapValidators[tag] && cvh.isCustomValidatorType(tag)){
                    objParams = Object.assign({}, { type: tag, fieldCfg: field, formDefinition: formDefinition, formData: formData, fieldLabel: fieldLabel } )
                    mappedValidator = mapValidators[tag](objParams)
                    augmentedValidator = addParamsTovalidator(objParams, mappedValidator) 
                    objValidator[tag] = augmentedValidator
                }
            }
            catch(e){
                console.warn(e)
            }
        }
        // B. If we still have to add a disableRule, do so.
        if (addDisableRule){
            try{
                tag = cvh.CV_TYPE_DISABLE_IF
                if ( mapValidators[tag] && cvh.isCustomValidatorType(tag)){
                    objParams = Object.assign({}, { type: tag, fieldCfg: field, formDefinition: formDefinition, formData: formData, fieldLabel: fieldLabel } )
                    mappedValidator = mapValidators[tag](objParams)
                    augmentedValidator = addParamsTovalidator(objParams, mappedValidator) 
                    objValidator[tag] = augmentedValidator
                }
            } catch(e){
                console.warn(e)
        
            }
        }

        //for test purposes, for field firstnamertx add hardcoded a name validator
        // if relevant, add these validators
        // if (fieldName === 'firstnamertx'){
        //     objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' `})
        // }
        // this works with validName being a classic Function. Also as arrow funciton?
        if (fieldName === 'firstnamertx'){
            objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' `})
        }

        if ( _.values(objValidator).length>0 ){
            validatorRules[fieldName] = objValidator
        }
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
            if (typeof lvalue === 'string') {
                lvalue = lvalue.trim()
            }

            if (_.isEmpty(lvalue)) {
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