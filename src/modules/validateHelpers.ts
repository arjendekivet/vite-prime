/**
 * Logica: 
* Qua <Feature> "Validity, Visibility, Mode (Read/ReadOnly/Edit), Calculation/Computation/value" 
              (hoe het dan ook gaat heten qua config property en qua html attribute vue component property: display/hidden/show/hide/visible/invisible ) 

* 1. Als een entity configuratie een eigen statische <Feature> config property heeft, is die leading. Die MAG NIET worden overruled. Einde evaluatie.
* 2. Als het veld dat niet heeft, maar wel een "dependency in een rule" heeft, dan bepaalt die dependency rule het resultaat van die feature.
*      Bijvoorbeeld: veld heeft "dependsOn" of upstream heeft "dependents" die op dit veld slaat.
*      Vraagstuk: Moet de genoemde dependent field daadwerkelijk een relevante visibility validator hebben, of gaat dit buiten de verantwoordelijkheid van dit veld om? 
*      In de zin van: geen rule is ook een rule. Geen rule om visibility te negeren betekent toestemming voor visibility. etc.
*/ 
// TODO: if all methods used can come from Array instead of Lodash, drop Lodash dependency
// like myArray =[] myArray.every instead of _.every( myArray, <bla>) etc 

import _ from 'lodash'
import { helpers } from '@vuelidate/validators'

export const RULE_GENERATOR = "RULE_GENERATOR";
export const VISIBILITY = 'displayIf';
export const SILENTVALIDITY = '$silentErrors'
export const V_SILENTERRORS = '$silentErrors'
export const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...
export const V_DISPLAYIF = 'displayIf';
export const V_DISABLEIF = 'disableIf';

// Introduce constants for the validator names/types in order NOT to clash with built-in and other imported working vuelidate validators
export const V_CUSTOM_PREFIX = '__cv__';
export const CV_TYPE_DISABLE_IF = `${V_CUSTOM_PREFIX}${V_DISABLEIF}`;
export const CV_TYPE_DISPLAY_IF = `${V_CUSTOM_PREFIX}${V_DISPLAYIF}`;

export const AND = "and";
export const OR = "or";
export const NOT = "not";

export const CFG_PROP_ENTITY_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
export const CFG_PROP_ENTITY_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

export const CFG_PROP_ENTITY_DISABLE = 'disabled'; // indicates in fieldCfg the optional property 'disabled' decides the field disabling
export const CFG_PROP_ENTITY_DISABLE_INVERT = false; // indicates a disable rule will NOT ave to negate the config prop

// terms to be used in the Configuration of validators (in the form definitions / fields definition) pointing to the supported retriever functions
export const IS_VALID = "isValid"
export const SOME_VALID = "someValid"
export const ALL_VALID = "allValid";

export const IS_INVALID = "isInvalid"
export const SOME_INVALID = "someInvalid";
export const ALL_INVALID = "allInvalid";

export const IS_VISIBLE = "isVisible";
export const SOME_VISIBLE = "someVisible";
export const ALL_VISIBLE = "allVisible";

export const IS_HIDDEN = "isHidden";
export const SOME_HIDDEN = "someHidden";
export const ALL_HIDDEN = "allHidden";

export const IS_DISABLED = "isDisabled";
export const SOME_DISABLED = "someDisabled";
export const ALL_DISABLED = "allDisabled";

export const IS_ENABLED = "isEnabled";
export const SOME_ENABLED = "someEnabled";
export const ALL_ENABLED = "allEnabled";

// note: "empty" rules depend on the $model of the specified field. This assumes the two-way binding AND a dummy rule for a field when NO built in validator was specified at all. 
// We already use two of such dummy rules, namely for visibility and for enabling for each field, so $model should be present for each field.
export const IS_EMPTY = "isEmpty";
export const SOME_EMPTY = "someEmpty";
export const ALL_EMPTY = "allEmpty";

export const NOT_EMPTY = "notEmpty";
export const SOME_NOT_EMPTY = "someNotEmpty";
export const NONE_EMPTY = "noneEmpty";

// EXPERIMENT: support two helpers to retrieve the rule results of the built-in vuelidate requiredIf validator
export const IS_REQUIRED_IF = "isRequiredIf"
export const NOT_REQUIRED_IF = "notRequiredIf"

const SUPPORTED_RETRIEVERS = [
    IS_VISIBLE, SOME_VISIBLE, ALL_VISIBLE, 
    IS_VALID, SOME_VALID, ALL_VALID, 
    IS_INVALID, SOME_INVALID, ALL_INVALID, 
    IS_DISABLED, SOME_DISABLED, ALL_DISABLED, 
    IS_HIDDEN, SOME_HIDDEN, ALL_HIDDEN ,
    IS_EMPTY, SOME_EMPTY, ALL_EMPTY,
    NOT_EMPTY, SOME_NOT_EMPTY, NONE_EMPTY,
    // these search for the results for builtin vuelidate validators!!!! They do not -yet- rerun proper validators thmeselves.
    IS_REQUIRED_IF, NOT_REQUIRED_IF
]
/**
 * define helper functions like isValid, isVisible, isDisabled, that take a fieldname and return a boolean if the retrieved info qualifies.
 * // TODO: if these helpers all work robustly, rewrite them to the shortest possible format? Voorbeeld
 * isEnabled: (vm, fieldName: string) => {
        let result, defaulted = true;
        try {
            result = !cHelpers.isDisabled(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    * kunnen we -wat- korter schrijven als:
    isEnabled: (vm, fieldName: string) => {
        try {
            return !cHelpers.isDisabled(vm,fieldName)
        }
        catch(e) { 
            return true 
        }
    },
 */
export const cHelpers = {
    /**
     * Checks if for a field the -builtin- requiredIf validator resulted true.
     * Note: this is only a retriever of a rule result, it does not calculate or execute a rule itself.
     * This result will only indeed exist IF for that field the builtIn requiredIf rule existed AND was called & registered, before this retrieval helper method is called. 
     * @param vm 
     * @param fieldName 
     * @returns 
     */
     isRequiredIf: (vm,fieldName: string) => {
        let result, defaulted = false;
        try { 
            result = vm?.v$?.[fieldName]?.requiredIf?.$invalid ?? defaulted;
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    notRequiredIf: (vm,fieldName: string) => {
        let result, defaulted = true;
        try { 
            result = !cHelpers.isRequiredIf(vm,fieldName)
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is empty.
     * Note: this is only a retriever of a rule result, it does not calculate or execute a rule itself!
     * Since every field will have at least two rules ( for visibility and for disabling ) every field will be mapped and will have $model to consult!
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isEmpty: (vm,fieldName: string) => {
        let result, defaulted = true;
        try { 
            result = helpers.len( (vm?.v$?.[fieldName]?.$model ) ?? "" ) === 0;
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    someEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    notEmpty: (vm,fieldName: string) => {
        let result, defaulted = false;
        try { 
            result = !(cHelpers.isEmpty(vm, fieldName))
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    someNotEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    noneEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is silently -eagerly- valid. 
     * Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isValidSilent: (vm, fieldName: string) => {
        let result, defaulted = true;
        try {
            // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
            result = !!!(vm?.v$?.[fieldName]?.[V_SILENTERRORS]?.length > 0)
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is explicitely -being touched/dirty- valid. 
     * Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isValid: (vm,fieldName: string) => {
        let result, defaulted = true;
        try { 
            result = !!!(vm?.v$?.[fieldName]?.[V_VALID]) 
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if two types of rules for display resulted in true.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isVisible: (vm, fieldName: string) => {
        let defaulted = true;
        let result, result_1, result_2;
        try {
            // custom rule based on a FUNCTION in the field validators configuration. We do not expect this frequently though.... Functions from external JSON into Javascript Object literal configs is rare. 
            // temporarily, as long as we also use the displayIf with spawned external functions :-)
            result_1 = (vm?.v$?.[fieldName]?.[V_DISPLAYIF]?.$response?.extraParams?.rule_result ?? true)
            // for now we surely have to take into account CV_TYPE_DISPLAY_IF!!!!
            result_2 = (vm?.v$?.[fieldName]?.[CV_TYPE_DISPLAY_IF]?.$response?.extraParams?.rule_result ?? true)

            result = result_1 && result_2
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is ruled to be disabled.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isDisabled: (vm, fieldName: string) => {
        let result, defaulted = false;
        try {
            result = !!(vm?.v$?.[fieldName]?.[CV_TYPE_DISABLE_IF]?.$response?.extraParams?.rule_result)
            //result = (vm?.v$?.[fieldName]?.[CV_TYPE_DISABLED_IF]?.$response?.extraParams?.rule_result ?? false)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    isEnabled: (vm, fieldName: string) => {
        let result, defaulted = true;
        try {
            result = !cHelpers.isDisabled(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    isInvalid: (vm,fieldName: string) => {
        let result, defaulted = false;
        try {
            // invert the result because we re-use isValid, we returns true if valid
            result = !cHelpers.isValid(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    isHidden: (vm,fieldName: string) => {
        let result, defaulted = false;
        try {
            result = !cHelpers.isVisible(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    someHidden: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isVisible(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allHidden: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isVisible(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    someValidSilent:  (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        const arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValidSilent
                result =  cHelpers.isValidSilent(vm,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e){
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allValidSilent:  (vm, arrFieldNames: string[]) => {        
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = cHelpers.isValidSilent(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allInvalidSilent: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        try {
            // re-use allValidSilent and negate it
            result = !( cHelpers.allValidSilent(vm, arrFieldNames))
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    },
    someValid: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result =  cHelpers.isValid(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allValid: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result =  cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allInvalid: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid but inverted
                result = !cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
            //result = !arrResults.includes(false);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        
        return result
    },
    someInvalid:  (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = arrResults.includes(false);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }     
        return result
    },
    /**
     * @param vm 
     * @param fieldName 
     * @returns 
     * 
     */
    someVisible: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isVisible
                result =  cHelpers.isVisible(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }  
        return result
    }, 
    allVisible: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isVisible(vm,fieldName)
                
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }  
        return result
    },
    someDisabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result =  cHelpers.isDisabled(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    }, 
    allDisabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isDisabled(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    },
    someEnabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isDisabled(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    }, 
    allEnabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isDisabled(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    },
}

/**
 * A HOF that composes the parameterized version of a validator fn.
 * For now used by custom validators of type 'disABLERIf' and diplayerIf .... and ????
 * For now supports: 
 * conditioning on the eager validity of some/all fields.
 * conditioning on the lazy validity of some/all fields.
 * conditioning on the visibility of some/all fields.
 * conditioning on the disabled of some/all fields.
 * conditioning on the empty / not-empty of some/all fields.
 * @param args. Array.  We expect to get passed in all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidate, to be used as a custom rule executioner for vuelidate (as opposed to only built-in ones and only for validation purposes).
 * TODO: make async?
 */
const hofRuleFnGenerator = ( ...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    const { defaultRuleResult, staticConfigProperty , doInvertRuleResult } = args[1]
    const ruleType = params.type
    let resultFunction
    let fallBackFunction = function ruleFn(value, vm){
        return { 
            $valid: true, extraParams: { rule_result: defaultRuleResult , fieldCfg }, 
            message: `Fallback or ty-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}` 
        }
    }
    let pretest 
    let hasStaticConfigProperty 
    try {
        // 1. do we have a overruling static configuration property?
        hasStaticConfigProperty = ( fieldCfg?.[staticConfigProperty] ?? false ) !== false
        if ( hasStaticConfigProperty )
        {
            resultFunction = function ruleFn(value, vm){
                let rule_result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}` }
            }
        }
        // 2. probe for a supported custom rule function
        else if (!resultFunction){
            resultFunction = probeCustomRuleFn(args)
        }
        // 3. make sure that if we did not have any function yet, we should return a liberal/neutral fallback function 
        if (!resultFunction){
            resultFunction = fallBackFunction
        }

    } catch (error) {
        console.warn(error);
        resultFunction = fallBackFunction;
    }
    return resultFunction
}

/**
 * Generates a disablerIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
 export const disablerIf = (args) => {
    const defaultRuleResult = false;
    const staticConfigProperty = CFG_PROP_ENTITY_DISABLE
    const doInvertRuleResult = CFG_PROP_ENTITY_DISABLE_INVERT
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult, staticConfigProperty , doInvertRuleResult } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

/**
 * Generates a displayerIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
export const displayerIf = (args) => {
    const defaultRuleResult = true;
    const staticConfigProperty = CFG_PROP_ENTITY_DISPLAY
    const doInvertRuleResult = CFG_PROP_ENTITY_DISPLAY_INVERT
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult, staticConfigProperty , doInvertRuleResult } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

/**
 * Returns a vuelidate rule function, which returns a response object needed for custom vuelidate validators/rules.
 * Calls a recursive funciton.
 * @param arrCfg 
 * @returns 
 */
const probeCustomRuleFn = (arrCfg) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = arrCfg[0]
    const { defaultRuleResult, staticConfigProperty , doInvertRuleResult } = arrCfg[1]
    return function ruleFn(value, vm){
        let rule_result = probeCustomRuleFnRecursor(value, vm, arrCfg[0]) ?? defaultRuleResult
        // console.log(`running cynapps custom rule validator -type: ${params?.type} - from probeCustomRuleFn called via 2-st branch of hofRuleFnGenerator via ${params?.type?.indexOf('disable')>-1 ? 'disablerIf' : 'displayerIf' } for ${fieldCfg?.id} resulted: ${rule_result}`)
        return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `Rule of type ${params?.type} for field ${fieldCfg?.label} returned: ${rule_result}.` }
    }
}

/**
 * Inner recursor for the probeCustomRuleFn.
 * It should be able to recursively walk all nested conditions and return the correct Boolean evaluation result
 * resulting from calling and evalutaing all combined condtions in the entire set of dependsOn criteria.
 * @param value. Passed by vuelidate.
 * @param vm. Passed by vuelidate. The viewmodel/component instance, which brought vuelidate (v$) into scope.
 * @param cfg. The passed in rule evaluation params, including the dependsOn object tree.
 * @param asLogicalOperator. The and/or/not logical operator for the relevant dependsOn leaf conditions object
 * @returns rule_result Boolean.
 */
const probeCustomRuleFnRecursor = ( value, vm, objCfg, asLogical = AND ) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = objCfg
    const arrSupported = SUPPORTED_RETRIEVERS;
    const arrToRecurse = [AND, OR, NOT]

    let countAsResult = 0;
    let rule_result;
    let arrPartials = [];
    let tmp
    let iterator = dependsOn && typeof dependsOn === 'object' ? Object.entries(dependsOn) : {}
    let doIterate = Object.keys(iterator).length > 0
    try{
        if (doIterate){
            for (const [key, entryValue] of iterator) {
                tmp = null
                if (arrToRecurse.includes(key)){
                    // to correctly recur downwards set the new dependsOn property to the relevant subset!!!!
                    let objCfg2 = { "dependsOn": entryValue, fieldCfg, formData, formDefinition, params }
                    try { 
                        tmp = probeCustomRuleFnRecursor(value, vm, objCfg2, key) 
                        arrPartials.push(tmp)
                        countAsResult++
                    }
                    catch(e) {
                        console.warn(e)
                    }
                }
                else if (arrSupported.includes(key)) {
                    let fn = key;
                    try {
                        tmp = cHelpers[fn]?.(vm, entryValue)
                        countAsResult++
                        arrPartials.push(tmp)
                    }
                    catch(e) {
                        console.warn(e)
                    }
                }  
            }
        }
    }
    catch(e){
        console.warn(e)
    }

    // depending upon asLogicalOperator, we reduce arrPartials to a boolean via _.some. _.every or !_.every
    if (countAsResult){
        rule_result = asLogical === AND ? _.every(arrPartials,Boolean) : asLogical === OR ? _.some(arrPartials,Boolean) : !(_.some(arrPartials,Boolean))
    }
    return rule_result
}

/*** 
 * Indicates if a validator is a cynapps custom validator, when the type name starts with our constant custom prefix: V_CUSTOM_PREFIX
 */
export const isCustomValidatorType = (type: string) => {
    return type?.indexOf?.(V_CUSTOM_PREFIX) > -1 ?? false
}

export default { 
    cHelpers, 
    disablerIf, 
    displayerIf,
    isCustomValidatorType, 
    V_CUSTOM_PREFIX,
    RULE_GENERATOR ,
    VISIBILITY ,
    SILENTVALIDITY ,
    V_SILENTERRORS ,
    V_VALID ,
    V_DISPLAYIF ,
    V_DISABLEIF ,
    CV_TYPE_DISABLE_IF, 
    CV_TYPE_DISPLAY_IF,
    IS_VISIBLE,
    SOME_VISIBLE,
    ALL_VISIBLE,
    IS_HIDDEN,
    SOME_HIDDEN,
    ALL_HIDDEN,
    IS_VALID,
    SOME_VALID,
    ALL_VALID,
    IS_INVALID, SOME_INVALID, ALL_INVALID,
    IS_DISABLED, SOME_DISABLED, ALL_DISABLED,
    IS_ENABLED,
    SOME_ENABLED,
    ALL_ENABLED,
    AND,
    OR,
    NOT,
    IS_EMPTY, SOME_EMPTY, ALL_EMPTY,
    NOT_EMPTY, SOME_NOT_EMPTY, NONE_EMPTY,
    IS_REQUIRED_IF, NOT_REQUIRED_IF
};