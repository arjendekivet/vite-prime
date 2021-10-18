/**
 * Logica: 
* Qua <Feature> "Validity, Visibility, Mode (Read/ReadOnly/Edit), Calculation/Computation/value" 
              (hoe het dan ook gaat heten qua config property en qua html attribute vue component property: display/hidden/show/hide/visible/invisible ) 

* 1. Als een entity configuratie een eigen statische <Feature> config property heeft, is die leading. Die MAG NIET worden overruled. Einde evaluatie.
* 2. Als het veld dat niet heeft, maar wel een "dependency in een rule" heeft, dan bepaalt die dependency rule het resultaat van die feature.
*      Bijvoorbeeld: veld heeft "dependsOn" of upstream heeft "dependents" die op dit veld slaat.
*      Vraagstuk: Moet de genoemde dependent field daadwerkelijk een relevante visibility validator hebben, of gaat dit buiten de verantwoordelijkheid van dit veld om? 
*      In de zin van: geen rule is ook een rule. Geen rule om visibility te negeren betekent toestemming voor visibility.
*
* uitzondering bij validatie: systemrequired voor savedraft versus required, requiredIf etc etc
*/ 
// TODO: if all methods used can come from Array instead of Lodash, drop Lodash dependency
// like myArray =[] myArray.every instead of _.every( myArray, <bla>) etc 

import { def } from '@vue/shared';
import _ from 'lodash'
import { matchedRouteKey } from 'vue-router';

//const RULE_GENERATOR = Symbol('__RuleGenerator__');

export const RULE_GENERATOR = "RULE_GENERATOR";
export const VISIBILITY = 'displayIf';
export const SILENTVALIDITY = '$silentErrors'
export const V_SILENTERRORS = '$silentErrors'
export const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...
export const V_DISPLAYIF = 'displayIf';
export const V_DISABLEIF = 'disableIf';

// terms to be used in the Configuration of validators (in the form definitions / fields definition) 
export const ALL_VISIBLE = "allVisible";
export const ALL_VALID = "allValid";
export const IS_VALID = "isValid"
export const IS_INVALID = "isInvalid"
export const ALL_INVALID = "allInvalid";
export const SOME_INVALID = "someInvalid";

export const IS_VISIBLE = "isVisible";
export const SOME_VISIBLE = "someVisible";

export const IS_DISABLED = "isDisabled";

// Introduce constants for the validator names/types in order NOT to clash with built-in and other imported working vuelidate validators
export const V_CUSTOM_PREFIX = '__cv__';
export const CV_TYPE_DISABLE_IF = `${V_CUSTOM_PREFIX}${V_DISABLEIF}`;
// todo
export const CV_TYPE_DISPLAY_IF = `${V_CUSTOM_PREFIX}${V_DISPLAYIF}`;
// todo terms for config props

export const CFG_PROP_ENTITY_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
export const CFG_PROP_ENTITY_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

export const CFG_PROP_ENTITY_DISABLE = 'disabled'; // indicates in fieldCfg the optional property 'disabled' decides the field disabling
export const CFG_PROP_ENTITY_DISABLE_INVERT = false; // indicates a disable rule will NOT ave to negate the config prop


// define helper functions like isValid, isVisible, isDisabled, that take a fieldname and return a boolean if the retrieved info qualifies.
export const cHelpers = {
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
    //TODO make isEnabled based on re-use inverted isDisabled
    //TODO make isHidden based on re-use inverted isVisible
    //TODO make isInvalid based on re-use inverted isValid
    // etcetera etcetera etcetera 
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
}

/**
 * A HOF for type 'disABLERIf' and diplayerIf .... and ????
 * Returns the parameterized version of a validator fn.
 * For now supports: 
 * conditioning on the eager validity of some/all fields.
 * conditioning on the lazy validity of some/all fields.
 * conditioning on the visibility of some/all fields.
 * conditioning on the disabled of some/all fields.
 * etcetera
 * * TODO: write a parser / reducer which can walk the dependsOn object and map it to function invocations and reduce to a return value...
 * * TODO: write a parser / reducer which can walk the dependsOn object and map it to function invocations and reduce to a return value...
 * * TODO: write a parser / reducer which can walk the dependsOn object and map it to function invocations and reduce to a return value...
 * * TODO: write a parser / reducer which can walk the dependsOn object and map it to function invocations and reduce to a return value...
 * 
 * @param args. Array.  We expect to get passed in all the necessary parametrizations. 
 * Supports refering to fields and their visibility-state or disabled-state or validity-state or their value ...
 * @returns a parameterized ruleFn for vuelidate, to be used as a custom rule executioner for vuelidate (as opposed to only built-in ones and only for validation purposes).
 */
const hofRuleFnGenerator = ( ...args) => {
    debugger
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
        pretest = fieldCfg?.[staticConfigProperty] ?? "dummy"
        hasStaticConfigProperty = !!!( pretest === "dummy")
        
        // 1. do we have a overruling static configuration property? Of: hoort hier niet thuis? Dit IS de ruleFn en die MAG alleen geimplemnteerd worden WANNEER er geen static overruler is? Nee kan wel ...
        if ( hasStaticConfigProperty )
        {
            resultFunction = function ruleFn(value, vm){
                console.log('running displayerIf validator from 1-st branch for ', fieldCfg.id)
                let rule_result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}` }
            }
        }
        // probe if we have a call for a supported custom rule function
        if (!resultFunction){
            debugger;
            resultFunction = probeCustomRuleFn(args, ruleType)
        }
        // Again probe to make sure that if we did not have any function yet, we should return a liberal fallback function 
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
 * Configures and calls a Higher Order Function to generate a displayerIf rule-function for vuelidate.
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * Supports refering to fields and their visibility-state or disabled-state or validity-state or their value ...
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
 export const disablerIf = (args) => {
    debugger;
    const defaultRuleResult = false
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
 * Configures and calls a Higher Order Function to generate a disablerIf rule-function for vuelidate.
 * @param args 
 * @returns 
 */
export const displayerIf = (args) => {
    debugger;
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

const probeCustomRuleFn = (arrCfg, pType) => {
    debugger
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = arrCfg[0]
    const ruleType = params?.type ?? pType
    const arrSupported = [ ALL_VISIBLE, IS_VISIBLE, SOME_VISIBLE, ALL_VALID, ALL_INVALID, SOME_INVALID, IS_DISABLED, IS_INVALID, IS_VALID ]
    const fnKeys = _.keys(dependsOn)
    const matched = []
    fnKeys.forEach((key) => ( _.includes(arrSupported, key) ) ? matched.push(dependsOn[key]) : null)
    if ( matched.length ){
        debugger
        return function ruleFn(value, vm){
            //console.log(`running cynapps custom rule validator -type: ${ruleType}- from 2-st branch for ${fieldCfg.id} `)
            let rule_result = true; // by default we should display stuff ???????????????
            let arrPartials = [];
            let fn, target
            // we should iterate all matched fn and deal with them ...   FOR NOW assume only conjunctions!!!!
            fnKeys.forEach((key) => { 
                if ( _.includes(arrSupported, key) ) {
                    fn = key;
                    target = dependsOn[key]
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                }       
            })
            rule_result = _.every(arrPartials, Boolean)
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `Rule ${ruleType} for ${fieldCfg.label} dependent on ${fn}` }
        }
    }
}
/**
 * 
 * @param type Returns true is the type name starts with our constant custom prefix: V_CUSTOM_PREFIX
 */
export const isCustomValidatorType = (type: string) => {
    const result = type?.indexOf(V_CUSTOM_PREFIX) > -1 ?? false
    return result
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
    ALL_VISIBLE ,
    ALL_VALID ,
    IS_VALID ,
    IS_INVALID,
    ALL_INVALID ,
    SOME_INVALID ,
    CV_TYPE_DISABLE_IF, 
    CV_TYPE_DISPLAY_IF,
    IS_VISIBLE,
    IS_DISABLED,
};