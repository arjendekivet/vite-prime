import _ from 'lodash'
import rc_ from '@/modules/rules/constants'
import { cHelpers } from './validateHelpers'

export const isAsyncFn = (fn: Function) => {
    const fnConstructorName = fn.constructor?.name ?? ""
    const isAsync = fnConstructorName.includes('AsyncFunction')
    return isAsync
}

/*** 
 * Indicates if a validator is a cynapps custom validator, when the type name starts with our constant custom prefix: V_CUSTOM_PREFIX
 */
 export const isCustomValidatorType = (type: string) => {
    return type?.indexOf?.(rc_.V_CUSTOM_PREFIX) > -1 ?? false
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
 export const hofRuleFnGenerator = ( ...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    const { defaultRuleResult, staticConfigProperty , doInvertRuleResult , asValidator = false } = args[1]
    const ruleType = params.type
    let hasStaticConfigProperty 
    let resultFunction
    // also a simple synchronous Fn...
    let fallBackFunction = function ruleFn(value, vm){
        return { 
            $valid: true, // We should never "fail" based on a total dummy function, regardless "asValidator" ???
            extraParams: { rule_result: defaultRuleResult , fieldCfg }, 
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}` 
        }
    }
    try {
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticConfigProperty && ((fieldCfg?.[staticConfigProperty] ?? false)  !== false )
        if ( hasStaticConfigProperty )
        {
            resultFunction = function ruleFn(value, vm){
                let rule_result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
                return { 
                    $valid: asValidator ? rule_result : true, // when run as Validator, it should flag/register errors accordingly!
                    extraParams: { rule_result , fieldCfg }, 
                    message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}` 
                }
            }
        }
        // 2. probe for a supported custom rule function
        else if (!resultFunction){
            resultFunction = probeCustomRuleFn(args)
        }
    } catch (error) {
        console.warn(error);
    }
    // 3. make sure that if we did not have any function yet, we should return a liberal/neutral fallback function 
    if (!resultFunction || typeof resultFunction !== 'function'){
        resultFunction = fallBackFunction
    }
    return resultFunction
}

/**
 * Returns a vuelidate rule function, which returns a response object needed for custom vuelidate validators/rules.
 * Calls a recursive funciton.
 * @param arrCfg 
 * @returns 
 */
 export const probeCustomRuleFn = (arrCfg) => {
    const { dependsOn, asLogical, fieldCfg, formData, formDefinition, ...params } = arrCfg[0]
    const { defaultRuleResult, staticConfigProperty , doInvertRuleResult , asValidator = false , startFn } = arrCfg[1]
    return async function ruleFn(value, vm){
        let rule_result = await probeCustomRuleFnRecursor(value, vm, arrCfg[0], asLogical, startFn) // ??  defaultRuleResult
        rule_result = rule_result ?? defaultRuleResult
        const boolRuleResult = rule_result?.result ?? rule_result
        const valid = asValidator ? boolRuleResult : true;
        let message = `Rule of type ${params?.type} for field ${fieldCfg?.label} returned: ${boolRuleResult}.` 
        if (rule_result?.message){
            message = rule_result?.message ?? message //${message} 
        }
        return Promise.resolve({ 
            $valid: valid, 
            extraParams: { rule_result: boolRuleResult, fieldCfg }, 
            message: message
        })
    }
}

/**
 * Method that attempts to find and run the configured rule executioner or rule helper function(s).
 * If necessary it will act as the inner recursor for the probeCustomRuleFn.
 * It is able to recursively walk all nested conditions and return the correct overall Boolean evaluation result.
 * resulting from calling and evaluating all combined condtions in the entire set of dependsOn criteria.
 * TODO: aborts if it will not qualify the logical norm.
 * @param {any} value. Passed by vuelidate, the runtime value of the field that invoked the rule.
 * @param {Component} vm. Passed by vuelidate. The viewmodel/component instance, on which vuelidate (v$) was brought into scope.
 * @param { Object } cfg. The relevant rule params, including the dependsOn object tree, and context like formData, formdefinition, field definition.
 * @param {Booelan} asLogicalOperator. The and/or/not logical operator for the relevant dependsOn leaf conditions object
 * @param {String | null} startFn. Optional. The name of a supported executioner. This should be run before optionally iterating over (nested) conditions in dependsOn.
 * @returns {Object | Boolean} rule_result. If the return value contains o message, will compose an object with the boolean result and the message, else just the booelan.
 */
export const probeCustomRuleFnRecursor = async ( value, vm, objCfg, asLogical = rc_.AND, startFn = null) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = objCfg
    const arrRetrievers = rc_.SUPPORTED_RETRIEVERS;
    const arrExecutioners = rc_.SUPPORTED_EXECUTIONERS;
    const arrToRecurse = [rc_.AND, rc_.OR, rc_.NOT]

    let countAsResult = 0;
    let rule_result;
    let arrPartials = [];
    let arrMessages = [];
    let tmp
    let iterator = dependsOn && typeof dependsOn === 'object' ? Object.entries(dependsOn) : {}
    let doIterate = Object.keys(iterator).length > 0
    let breakout = false;
    let startFnUnqualified = false;
    let isExecutioner = false;
    let isRetriever = false;
    let fnConstructorName = "";
    let isAsync = false;
    try{
        //before probing the recursion for nested conditions, we should first check if there is an INDEPENDENT/AUTONOMOUS rule executioner to invoke.
        if (startFn) {
            if (arrExecutioners.includes(startFn)) {
                let fn = startFn;
                try {
                    const objParams = { value, fieldCfg, formData, formDefinition, params }
                    // check for async and if so await it...
                    isAsync = isAsyncFn(cHelpers[fn] ?? "")
                    tmp = isAsync ? await cHelpers[fn]?.(vm, objParams) : cHelpers[fn]?.(vm, objParams)
                    countAsResult++
                    arrPartials.push(tmp?.result ?? tmp) // if we have tmp.result grab that, else grab tmp
                    if (tmp?.message){
                        arrMessages.push(tmp.message)
                    }
                }
                catch(e) {
                    startFnUnqualified = true
                    console.warn(e)
                }
            }
            else {
                startFnUnqualified = true
            }
            if (startFnUnqualified && asLogical === rc_.AND){
                // when called as a logical AND operator, the end result at this level can never become true anymore, so bail out...
                arrPartials.push(undefined)
                arrMessages.push(`Flawed or errored startFn ${startFn} for 'conjunctive' invocation. Aborted.`)
                countAsResult++
                if (asLogical === rc_.AND){
                    breakout = true;
                }
            }
        }
        // should we invoke the recursion iterator
        if (!breakout && doIterate){
            for (const [key, entryValue] of iterator) {
                tmp = null
                if (arrToRecurse.includes(key)){
                    // to correctly recur downwards set the new dependsOn property to the relevant subset!!!!
                    let objCfg2 = { "dependsOn": entryValue, fieldCfg, formData, formDefinition, params }
                    try { 
                        tmp = await probeCustomRuleFnRecursor(value, vm, objCfg2, key) //always await?????
                        //arrPartials.push(tmp)
                        arrPartials.push(tmp?.result ?? tmp)
                        if (tmp?.message){
                            arrMessages.push(tmp.message)
                        }
                        countAsResult++
                    }
                    catch(e) {
                        console.warn(e)
                    }
                }
                else {
                    isExecutioner = arrExecutioners.includes(key);
                    isRetriever = arrRetrievers.includes(key);
                    if ( isExecutioner || isRetriever ) {
                        let fn = key;
                        try {
                            let objParams
                            if (isRetriever){
                                // TODO is the name params over here still comprehensible and unambiguous? 
                                objParams = { fieldNames: entryValue, value, fieldCfg, formData, formDefinition, params }        
                            }
                            else
                            {
                                // we should make entryValue the new params, since executioners may need complete parametrization instructions. 
                                // We must be cautious and introduce metaParams to make sure we do not overwrite stuff from entryValue with stuff from the previous params
                                objParams = { params: entryValue, value, fieldCfg, formData, formDefinition, metaParams: params }        
                            }
                            // check for async and if so await it...
                            isAsync = isAsyncFn(cHelpers[fn] ?? "")
                            tmp = isAsync ? await cHelpers[fn]?.(vm, objParams) : cHelpers[fn]?.(vm, objParams)
                            //tmp = cHelpers[fn]?.(vm, objParams)
                            countAsResult++
                            arrPartials.push(tmp?.result ?? tmp)
                            if (tmp?.message){
                                arrMessages.push(tmp.message)
                            }
                        }
                        catch(e) {
                            console.warn(e)
                        }
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
        rule_result = asLogical === rc_.AND ? _.every(arrPartials,Boolean) : asLogical === rc_.OR ? _.some(arrPartials,Boolean) : !(_.some(arrPartials,Boolean))
    }
    if (arrMessages.length>0){
        return { result: rule_result, message: arrMessages.join("; ") }
    }
    else {
        return rule_result
    }
}

// can we re-export cHelpers and stuff for other helper modules
export * from './validateHelpers';
