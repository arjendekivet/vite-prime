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
     * * Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
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
    isVisible: (vm, fieldName) => {
        debugger;
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
            console.log(e);
            result = defaulted;
        }
        return result
    },
    isDisabled: (vm, fieldName) => {
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
    isInvalid: (vm,fieldName) => {
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

    someValidSilent:  (vm, arrFieldNames) => {
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
    allValidSilent:  (vm, arrFieldNames) => {        
        let result = false;
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
            console.log(e);
            
        }
        return result
    },
    allInvalidSilent:  (vm, arrFieldNames) => {
        let result = false;
        let arrResults = [];
        try {
            // re-use allValidSilent and negate it
            result = !( cHelpers.allValidSilent(vm, arrFieldNames))
        }
        catch(e)
        {
            console.log(e);
            
        }
        return result
    },
    someValid:  (vm, arrFieldNames) => {
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result =  cHelpers.isValid(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            
        }
        return result
    },
    allValid:  (vm, arrFieldNames) => {
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result =  cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            
        }
        return result
    },
    allInvalid:  (vm, arrFieldNames) => {
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid but inverted
                result =  !cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            // ?????????????????????????????????????????????
            result = _.every(arrResults, Boolean);
            //result = !arrResults.includes(false);
        }
        catch(e)
        {
            console.log(e);
            
        }
        
        return result
    },
    someInvalid:  (vm, arrFieldNames) => {
        
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid and then in the end evalution we 
                result =  cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            //result = !_.every(arrResults, Boolean); // or _.some(arrResults, !false) ????
            result = arrResults.includes(false); // if one entry is true, it indicates "some" are "invalid" ...
        }
        catch(e) {
            console.log(e);
            
        }
        
        return result
    },
    /**
     * 
     * TODO: should this also take into account !!config.hidden? or !!!config.systemHidden or such?
    * from $response?.extraParams?.fieldCfg ...
    * Hoe weet je wat de source of truth is? Stel field.hidden = true komt aanvankelijk binnen vanaf de server.
    * als je niet steeds terug wil naar de server, en een rule execution rekent uit "show", 
    * hoe moet je dan vastleggen dat de rule wint van de statische config?
    * of moet de insteek zijn: als er geen regel is, bepaalt fieldCfg.hidden dat, maar als er wel een regel is dan bepaalt die regel het, omdat de regel dynamisch is ?
    * 
    * oftewel: als een veld, qua visibility, 
    * 1. de eigen systemHidden property mag NIET worden overruled.
    * 2. als het veld een dependsOn heeft, 
    *      ???? EN de genoemde dependent field heeft inderdaad een visibility validator, ???? of gaat dit buiten de verantwoordelijkheid van dit veld ?????
    *   dan bepaalt de dependsOn rule execution de visibility.
    * 3. Als dit niet van toepassing is, dus geen systemHidden en geen dependsOn, dan bepaalt de eigen .hidden property de visibility.
    * 
    * Dezelfde logica zou kunnen gelden voor Read / Edit ( enbaled / disabled)
    * * 1. de eigen readOnly property mag NIET worden overruled. (dat is als systemRead of systemDisabled )
    * 2. als het veld een dependsOn heeft, 
    *      ???? EN de genoemde dependent field heeft inderdaad een visibility validator, ???? of gaat dit buiten de verantwoordelijkheid van dit veld ?????
    *   dan bepaalt de dependsOn rule execution de visibility.
    * 3. Als dit niet van toepassing is, dus geen systemHidden en geen dependsOn, dan bepaalt de eigen .hidden property de visibility.
    * 
     * @param vm 
     * @param fieldName 
     * @returns 
     * 
     */
    someVisible:  (vm, arrFieldNames) => {
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isVisible
                result =  cHelpers.isVisible(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            
        }
        return result
    }, 
    allVisible:  (vm, arrFieldNames) => {
        let result = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isVisible(vm,fieldName)
                
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            
        }
        
        return result
    },
    someDisabled:  (vm, arrFieldNames) => {
        
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result =  cHelpers.isDisabled(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            
        }
        return result
    }, 
    allDisabled:  (vm, arrFieldNames) => {
        
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isDisabled(vm,fieldName)
                
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            
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
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * Supports refering to fields and their visibility-state or disabled-state or validity-state or their value ...
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
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
 * A HOF for type 'disABLERIf', wich returns the parameterized version of a validator fn.
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
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * Supports refering to fields and their visibility-state or disabled-state or validity-state or their value ...
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
 export const disablerIf = ( args ) => {
    debugger;
    // set some specifics for the disabler when it calls hofRuleGenerator ...
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

export const displayerIf = ( args ) => {
    debugger;
    // set some specifics for the disabler when it calls hofRuleGenerator ...
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
export const disablerIfNEW = ( ...args ) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    const ruleType = params.type || CV_TYPE_DISABLE_IF
    const ruleDefaultResult = false; //should be as liberal as possible???
    let resultFunction
    let fallBackFunction = function ruleFn(value, vm){
        return { $valid: true, extraParams: { rule_result: ruleDefaultResult , fieldCfg }, message: `Fallback or ty-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}` }
    }
    let pretest 
    let hasStaticConfigProperty 
    try {
        pretest = fieldCfg?.[CFG_PROP_ENTITY_DISABLE] ?? "dummy"
        hasStaticConfigProperty = !!!( pretest === "dummy")
        
        // 1. do we have a overruling static configuration property? Of: hoort hier niet thuis? Dit IS de ruleFn en die MAG alleen geimplemnteerd worden WANNEER er geen static overruler is? Nee kan wel ...
        if ( hasStaticConfigProperty )
        {
            resultFunction = function ruleFn(value, vm){
                console.log('running displayerIf validator from 1-st branch for ', fieldCfg.id)
                const invert = CFG_PROP_ENTITY_DISABLE_INVERT; // indicates a display rule will have to negate the config prop
                // meaning: the config prop conceptually is the opposite!!! If the config is { hidden: true } this displayerIf should return False.
                let rule_result = invert ? !!!fieldCfg?.[CFG_PROP_ENTITY_DISABLE] : !!fieldCfg?.[CFG_PROP_ENTITY_DISABLE]
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${CFG_PROP_ENTITY_DISABLE} on ${fieldCfg.label}` }
            }
        }
        // probe if we have a call for a supported custom rule function
        if (!resultFunction){
            debugger;
            resultFunction = probeCustomRuleFn(args, ruleType)
        }
        // Again probe to make sure that if we did not have any function yet, we should return a liberal fallback function 
        if (!resultFunction){
            console.log('3-d branch for ', fieldCfg.id)
            // if we did not have anything configured, we should return ruleDefaultResult ??? true or false or ????
            resultFunction = fallBackFunction
        }

    } catch (error) {
        console.log(error)
        resultFunction = fallBackFunction
    }
    return resultFunction
}

const disablerIfBAK = ( ...args ) => {

    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    const ruleDefault = false; // meaning the rule tests such that if true, the rule will implement it.

    let pretest = fieldCfg?.[CFG_PROP_ENTITY_DISABLE] ?? "dummy"
    
    let qualify = !!!(pretest === "dummy")
    try {
        
        // 1. do we have a overruling static configuration property? Of: hoort hier niet thuis? Dit IS de ruleFn en die MAG alleen geimplemnteerd worden WANNEER er geen static overruler is? Nee kan wel ...
        if ( qualify === true ){
            return function ruleFn(value, vm){
                console.log('running disABLERIf validator from 1-st branch for ', fieldCfg.id)
                const invert = CFG_PROP_ENTITY_DISABLE_INVERT; // indicates a display rule will have to negate the config prop
                ; // meaning: the config prop conceptually is the opposite!!! If the config is { hidden: true } this displayerIf should return False.
                let rule_result = invert ? !!!fieldCfg?.[CFG_PROP_ENTITY_DISABLE] : !!fieldCfg?.[CFG_PROP_ENTITY_DISABLE]
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `static disabler rule for ${fieldCfg.label}` }
            }
        }
        // TODO extend for all supported combinations ...
        else if (dependsOn?.[ALL_VISIBLE] || dependsOn?.[IS_VISIBLE] || dependsOn?.[SOME_VISIBLE] || dependsOn?.[ALL_VALID] || dependsOn?.[ALL_INVALID]  || dependsOn?.[SOME_INVALID]  || dependsOn?.[IS_INVALID] ) {
            
            return function ruleFn(value, vm){
            
                console.log('running disABLERIf validator from 2-d branch for ', fieldCfg.id)
                let rule_result = true; // by default we should display stuff ???????????????
                let arrPartials = [];
                // quick & dirty naieve implementation. For each relevant condition invoke it and add the result to the partials.
                // assuming conjunctions we can test with _.every
                let fn = IS_VISIBLE
                let target = dependsOn?.[IS_VISIBLE]
                if (dependsOn?.[IS_VISIBLE]){
                    fn = IS_VISIBLE;
                    target = dependsOn[IS_VISIBLE]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                }
                if (dependsOn?.[ALL_VISIBLE]){
                    fn = ALL_VISIBLE;
                    target = dependsOn[ALL_VISIBLE]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                }   
                if (dependsOn?.[SOME_VISIBLE]){
                    fn = ALL_VISIBLE;
                    target = dependsOn[SOME_VISIBLE]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[ALL_VALID]){
                    fn = ALL_VALID;
                    target = dependsOn[ALL_VALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[ALL_INVALID]){
                    fn = ALL_INVALID;
                    target = dependsOn[ALL_INVALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                    
                } 
                if (dependsOn?.[SOME_INVALID]){
                    fn = SOME_INVALID;
                    target = dependsOn[SOME_INVALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[IS_INVALID]){
                    fn = IS_INVALID;
                    target = dependsOn[IS_INVALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                
                //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

                // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
                if (dependsOn.and){}
                else if(dependsOn.or){}
                else if (dependsOn.not){}
                else {
                    
                    rule_result = _.every(arrPartials, Boolean)
                    
                }
                
                // if ( <all kind og business logic>) { display_result = true/false }
                // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `test DISABLE rule for ${fieldCfg.label} dependent` }
            }
        }
        else {
            
            // if we did not have anything configured, we should return true
            return function ruleFn(value, vm){
                console.log('running disABLERIf validator from 3-d branch for ', fieldCfg.id)
                return { $valid: true, extraParams: { rule_result: ruleDefault , fieldCfg }, message: `Dummy rule. No configured disablerRule for ${fieldCfg.label}` }
            }
        }
    } catch(e){
        
        console.log(error)
        return function ruleFn(value, vm){
            console.log('running disABLERIf validator from error branch for ', fieldCfg.id)        
            return { $valid: true, extraParams: { rule_result: ruleDefault , fieldCfg }, message: `Try-Catch Liberal Fallback rule. Error configuring disablerRule for ${fieldCfg.label}` }
        }
    }
}
/**
 * TODO: write a parser / reducer which can walk the dependsOn object and map it to function invocations and reduce to a return value...
 * 
 * @param args
 * @returns 
 */
export const displayerIfNEW = ( ...args ) => {
    // naieve version, hard coded branching logi, to be replaced with intelligent recursive reducer / resolver ...
    // or something that predefines like X supported combinations ...
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    const ruleType = params.type || CV_TYPE_DISPLAY_IF
    const ruleDefaultResult = true; //should be as liberal as possible???
    let resultFunction
    let fallBackFunction = function ruleFn(value, vm){
        console.log('running displayerIf validator from 3-d branch for ', fieldCfg.id)
        return { $valid: true, extraParams: { rule_result: ruleDefaultResult , fieldCfg }, message: `Fallback or ty-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}` }
    }
    let pretest 
    let hasStaticConfigProperty 
    try {
        pretest = fieldCfg?.[CFG_PROP_ENTITY_DISPLAY] ?? "dummy"
        hasStaticConfigProperty = !!!( pretest === "dummy")
        
        // 1. do we have a overruling static configuration property? Of: hoort hier niet thuis? Dit IS de ruleFn en die MAG alleen geimplemnteerd worden WANNEER er geen static overruler is? Nee kan wel ...
        if ( hasStaticConfigProperty )
        {
            resultFunction = function ruleFn(value, vm){
                console.log('running displayerIf validator from 1-st branch for ', fieldCfg.id)
                const invert = CFG_PROP_ENTITY_DISPLAY_INVERT; // indicates a display rule will have to negate the config prop
                // meaning: the config prop conceptually is the opposite!!! If the config is { hidden: true } this displayerIf should return False.
                let rule_result = invert ? !!!fieldCfg?.[CFG_PROP_ENTITY_DISPLAY] : !!fieldCfg?.[CFG_PROP_ENTITY_DISPLAY]
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${CFG_PROP_ENTITY_DISPLAY} on ${fieldCfg.label}` }
            }
        }
        // probe if we have a call for a supported custom rule function
        if (!resultFunction){
            debugger;
            resultFunction = probeCustomRuleFn(args, ruleType)
        }
        // Again probe to make sure that if we did not have any function yet, we should return a liberal fallback function 
        if (!resultFunction){
            console.log('3-d branch for ', fieldCfg.id)
            // if we did not have anything configured, we should return ruleDefaultResult ??? true or false or ????
            resultFunction = fallBackFunction
        }

    } catch (error) {
        console.log(error)
        resultFunction = fallBackFunction
    }
    return resultFunction
}

export const displayerIfBAK = ( ...args ) => {
    // naieve version, hard coded branching logi, to be replaced with intelligent recursive reducer / resolver ...
    // or something that predefines like X supported combinations ...
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]

    const ruleDefault = true;
    let pretest 
    let qualify 
    try {
        pretest = fieldCfg?.[CFG_PROP_ENTITY_DISPLAY] ?? "dummy"
        qualify = false ;//!!!( pretest === "dummy")
        
        // 1. do we have a overruling static configuration property? Of: hoort hier niet thuis? Dit IS de ruleFn en die MAG alleen geimplemnteerd worden WANNEER er geen static overruler is? Nee kan wel ...
        if ( qualify === true )
        {
            
            return function ruleFn(value, vm){
                console.log('running displayerIf validator from 1-st branch for ', fieldCfg.id)
                const invert = CFG_PROP_ENTITY_DISPLAY_INVERT; // indicates a display rule will have to negate the config prop
                // meaning: the config prop conceptually is the opposite!!! If the config is { hidden: true } this displayerIf should return False.
                let rule_result = invert ? !!!fieldCfg?.[CFG_PROP_ENTITY_DISPLAY] : !!fieldCfg?.[CFG_PROP_ENTITY_DISPLAY]
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `static display rule for ${fieldCfg.label}` }
            }
        }
        // 2. 
        else if (dependsOn?.[ALL_VISIBLE] || dependsOn?.[IS_VISIBLE] || dependsOn?.[SOME_VISIBLE] || dependsOn?.[ALL_VALID] || dependsOn?.[ALL_INVALID] || dependsOn?.[SOME_INVALID] || dependsOn?.[IS_DISABLED]  || dependsOn?.[IS_INVALID]  || dependsOn?.[IS_VALID]){
            debugger;
            return getCustomRuleFn(args[0], params.type || CV_TYPE_DISPLAY_IF )
            
            return function ruleFn(value, vm){
                
                console.log('running displayerIf validator from 2-st branch for ', fieldCfg.id)
                let rule_result = true; // by default we should display stuff ???????????????
                let arrPartials = [];
                // quick & dirty naieve implementation. For each relevant condition invoke it and add the result to the partials.
                // assuming conjunctions we can test with _.every
                let fn = IS_VISIBLE
                let target = dependsOn?.[IS_VISIBLE]
                if (dependsOn?.[IS_VISIBLE]){
                    fn = IS_VISIBLE;
                    target = dependsOn[IS_VISIBLE]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                }
                if (dependsOn?.[ALL_VISIBLE]){
                    fn = ALL_VISIBLE;
                    target = dependsOn[ALL_VISIBLE]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                }   
                if (dependsOn?.[SOME_VISIBLE]){
                    fn = ALL_VISIBLE;
                    target = dependsOn[SOME_VISIBLE]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[ALL_VALID]){
                    fn = ALL_VALID;
                    target = dependsOn[ALL_VALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[ALL_INVALID]){
                    fn = ALL_INVALID;
                    target = dependsOn[ALL_INVALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[SOME_INVALID]){
                    fn = SOME_INVALID;
                    target = dependsOn[SOME_INVALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[IS_DISABLED]){
                    fn = IS_DISABLED;
                    target = dependsOn[IS_DISABLED]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                }
                if (dependsOn?.[IS_INVALID]){
                    fn = IS_INVALID;
                    target = dependsOn[IS_INVALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                if (dependsOn?.[IS_VALID]){
                    fn = IS_VALID;
                    target = dependsOn[IS_VALID]
                    
                    arrPartials.push( cHelpers[fn]?.(vm, target) )
                } 
                
                //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

                // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
                if (dependsOn.and){}
                else if(dependsOn.or){}
                else if (dependsOn.not){}
                else {
                    
                    rule_result = _.every(arrPartials, Boolean)
                }
                
                // if ( <all kind og business logic>) { display_result = true/false }
                // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
                return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `test DISPLAY rule for ${fieldCfg.label} dependent on ${fn}` }
            }
        }
        else {
            // if we did not have anything configured, we should return true
            
            return function ruleFn(value, vm){
                console.log('running displayerIf validator from 3-d branch for ', fieldCfg.id)
                return { $valid: true, extraParams: { rule_result: ruleDefault , fieldCfg }, message: `Dummy rule. No configured displayerRule for ${fieldCfg.label}` }
            }
        }

    } catch (error) {
        console.log(error)
            
             // if we have a runtime error, return a liberal rule?
             
             return function ruleFn(value, vm){
                console.log('running displayerIf validator from error branch for ', fieldCfg.id)
                 return { $valid: true, extraParams: { rule_result: ruleDefault , fieldCfg }, message: `Try-Catch Liberal Fallback rule. Error configuring displayerRule for ${fieldCfg.label}` }
             }
    }
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
            console.log(`running cynapps custom rule validator -type: ${ruleType}- from 2-st branch for ${fieldCfg.id} `)
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

// example of config for field cat_5 to calculate if it should be "enabled or disabled". all conjunctive criteria should be grouped into the same array's and the disjunctive criteria should be in som other array etc etc
//// The logic OR means either disjunctive or conjunctive, when there are more criteria.
const ruleCfgProbeersel = { 
    dependsOn: [ 
        // rule result depends on cat_5 (which in this case refers to the field cat-5 itself, and it must be visible if it is to be enabled.  the logicOperator states the next critrium must be tru as well.
        // rule result depends on field cat_4 OR cat_3, regarding that ONE OF their's visibility is OK silent validity is OK.
        [
            { 
                field: 'cat_5' , should: [ { have: VISIBILITY, be: true } ], logically: 'AND' ,
            },
            [ 
                { 
                    field: 'cat_4', should: [ { have: VISIBILITY, be: true, logically: 'AND'} , { have: SILENTVALIDITY, be: true } ], 
                    logically: 'OR' ,
                } ,
                { 
                    field: 'cat_3' ,   
                    should: [ 
                        { have: VISIBILITY, be: true, logically: 'AND' } , 
                        { have: SILENTVALIDITY, be: true}
                    ] 
                }
            ]
        ],
    ],
    // Deze boomstructuur van and / or geeft aan hoe de groepen van instructies logisch gegroepeerd moeten worden
    alternativeFormulation: {
        and: {
            and: { ALL_VISIBLE: ['field_1', 'field_2'] , ALL_INVALID: ['field_1'] },
            or: { isPersistent: 'field_4', someEnabled: ['field_5'] } 
        }
    },
    // als je niets specificeert, doen we "AND" / conjunctie...
    nogKorter: { ALL_VISIBLE: ['field_1', 'field_2'] , ALL_INVALID: ['field_1'] }
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