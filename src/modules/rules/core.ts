import _ from 'lodash'
import { helpers } from '@vuelidate/validators'
import rc_ from '@/modules/rules/constants'
import { cHelpers } from './validateHelpers'

// re-export cHelpers and stuff for other helper modules!!!
export * from './validateHelpers';

export const isAsyncFn = (fn: Function) => {
    const fnConstructorName = fn?.constructor?.name ?? ""
    const result = fnConstructorName?.includes?.('AsyncFunction') ?? false
    return result
}

/*** 
 * Indicates if a validator is a cynapps custom validator, when the type name starts with our constant custom prefix: V_CUSTOM_PREFIX
 */
export const isCustomValidatorType = (type: string) => {
    const result = type?.indexOf?.(rc_.V_CUSTOM_PREFIX) > -1 ?? false
    return result
}

// create yet another layer that will invoke the former hofRuleFnGenerator
// (args) => makeRule(args, { startFn: rc_.V_MINVALUE, asValidator: true }),
export const makeRule = (...args) => generateRule(...args)

/**
 * hofRuleFnGenerator
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
//export const makeRule = (...args) => {
export const generateRule = (...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, p_v$, ...params } = args[0]
    const xVM = { v$: p_v$ }
    // can we make sure that, if undefined, defaultRuleResult = true etc
    const { defaultRuleResult = true, doInvertRuleResult = false, asValidator = false, staticConfigProperty } = args[1]

    const ruleType = params.type
    let hasStaticConfigProperty
    let resultFunction
    // also a simple synchronous Fn... but add in xVM too always to get a reference to v$ 
    let fallBackFunction = function ruleFn(value, vm, vmx = xVM) {
        return {
            $valid: true, // We should never "fail" based on a total dummy function, regardless "asValidator" ???
            extraParams: { rule_result: defaultRuleResult, fieldCfg },
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}`
        }
    }
    try {
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticConfigProperty && ((fieldCfg?.[staticConfigProperty] ?? false) !== false)
        if (hasStaticConfigProperty) {
            resultFunction = function ruleFn(value, vm, vmx = xVM) {
                let rule_result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
                return {
                    $valid: asValidator ? rule_result : true, // when run as Validator, it should flag/register errors accordingly!
                    extraParams: { rule_result, fieldCfg },
                    message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}`
                }
            }
        }
        // 2. probe for a supported custom rule function
        else if (!resultFunction) {
            resultFunction = probeCustomRuleFn(args)
        }
    } catch (error) {
        console.warn(error);
    }
    // 3. make sure that if we did not have any function yet, we should return a liberal/neutral fallback function 
    if (!resultFunction || typeof resultFunction !== 'function') {
        resultFunction = fallBackFunction
    }
    return resultFunction
}

export const hofRuleFnGenerator = (...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    // can we make sure that, if undefined, defaultRuleResult = true etc
    const { defaultRuleResult = true, doInvertRuleResult = false, asValidator = false, staticConfigProperty } = args[1]
    debugger;

    const ruleType = params.type
    let hasStaticConfigProperty
    let resultFunction
    // also a simple synchronous Fn...
    let fallBackFunction = function ruleFn(value, vm) {
        return {
            $valid: true, // We should never "fail" based on a total dummy function, regardless "asValidator" ???
            extraParams: { rule_result: defaultRuleResult, fieldCfg },
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}`
        }
    }
    try {
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticConfigProperty && ((fieldCfg?.[staticConfigProperty] ?? false) !== false)
        if (hasStaticConfigProperty) {
            resultFunction = function ruleFn(value, vm) {
                let rule_result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
                return {
                    $valid: asValidator ? rule_result : true, // when run as Validator, it should flag/register errors accordingly!
                    extraParams: { rule_result, fieldCfg },
                    message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}`
                }
            }
        }
        // 2. probe for a supported custom rule function
        else if (!resultFunction) {
            resultFunction = probeCustomRuleFn(args)
        }
    } catch (error) {
        console.warn(error);
    }
    // 3. make sure that if we did not have any function yet, we should return a liberal/neutral fallback function 
    if (!resultFunction || typeof resultFunction !== 'function') {
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
    const { dependsOn, asLogical, fieldCfg, formData, formDefinition, p_v$, ...params } = arrCfg[0]
    const xVM = { v$: p_v$ }
    const { defaultRuleResult, staticConfigProperty, doInvertRuleResult, asValidator = false, startFn } = arrCfg[1]
    debugger;
    //we should make sure value or vm are not shadowed here? How come in setExternalResults we appear to receive a data-object as the vm ????
    if (fieldCfg.id === 'title') { debugger }
    // pass in xVM to be sure to have a reference to v$ ????? or this passes in via arrCfg[0] ...
    return async function ruleFn(value, vm, /**vmX = xVM*/) {
        if (fieldCfg.id === 'title') { debugger }
        let rule_result = await probeCustomRuleFnRecursor(value, vm, arrCfg[0], asLogical, startFn) // ??  defaultRuleResult
        rule_result = rule_result ?? defaultRuleResult
        const boolRuleResult = rule_result?.result ?? rule_result
        const valid = asValidator ? boolRuleResult : true;
        let message = `Rule of type ${params?.type} for field ${fieldCfg?.label} returned: ${boolRuleResult}.`
        if (rule_result?.message) {
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
export const probeCustomRuleFnRecursor = async (value, vm, objCfg, asLogical = rc_.AND, startFn = null) => {
    const { dependsOn, fieldCfg, formData, formDefinition, p_v$, ...params } = objCfg
    debugger // for now we can do without this ...
    //const xVM = { v$: p_v$ }
    //const vm = pvm?.v$ ? pvm : xVM
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
    try {
        //before probing the recursion for nested conditions, we should first check if there is an INDEPENDENT/AUTONOMOUS rule executioner to invoke.
        if (startFn) {
            if (arrExecutioners.includes(startFn)) {
                let fn = startFn;
                try {
                    if (startFn === rc_.V_SET_EXTERNAL_RESULTS) {
                        debugger
                    }
                    const objParams = { value, fieldCfg, formData, formDefinition, p_v$, params }
                    // check for async and if so await it...
                    isAsync = isAsyncFn(cHelpers[fn] ?? "")
                    tmp = isAsync ? await cHelpers[fn]?.(vm, objParams) : cHelpers[fn]?.(vm, objParams)
                    countAsResult++
                    arrPartials.push(tmp?.result ?? tmp) // if we have tmp.result grab that, else grab tmp
                    if (tmp?.message) {
                        arrMessages.push(tmp.message)
                    }
                }
                catch (e) {
                    startFnUnqualified = true
                    console.warn(e)
                }
            }
            else {
                startFnUnqualified = true
            }
            if (startFnUnqualified && asLogical === rc_.AND) {
                // when called as a logical AND operator, the end result at this level can never become true anymore, so bail out...
                arrPartials.push(undefined)
                arrMessages.push(`Flawed or errored startFn ${startFn} for 'conjunctive' invocation. Aborted.`)
                countAsResult++
                if (asLogical === rc_.AND) {
                    breakout = true;
                }
            }
        }
        // should we invoke the recursion iterator
        if (!breakout && doIterate) {
            for (const [key, entryValue] of iterator) {
                tmp = null
                if (arrToRecurse.includes(key)) {
                    // to correctly recur downwards set the new dependsOn property to the relevant subset!!!!
                    let objCfg2 = { "dependsOn": entryValue, fieldCfg, formData, formDefinition, p_v$, params }
                    try {
                        tmp = await probeCustomRuleFnRecursor(value, vm, objCfg2, key) //always await?????
                        //arrPartials.push(tmp)
                        arrPartials.push(tmp?.result ?? tmp)
                        if (tmp?.message) {
                            arrMessages.push(tmp.message)
                        }
                        countAsResult++
                    }
                    catch (e) {
                        console.warn(e)
                    }
                }
                else {
                    isExecutioner = arrExecutioners.includes(key);
                    isRetriever = arrRetrievers.includes(key);
                    if (isExecutioner || isRetriever) {
                        let fn = key;
                        try {
                            let objParams
                            if (isRetriever) {
                                // TODO is the name params over here still comprehensible and unambiguous? 
                                objParams = { fieldNames: entryValue, value, fieldCfg, formData, formDefinition, p_v$, params }
                            }
                            else {
                                // we should make entryValue the new params, since executioners may need complete parametrization instructions. 
                                // We must be cautious and introduce metaParams to make sure we do not overwrite stuff from entryValue with stuff from the previous params
                                objParams = { params: entryValue, value, fieldCfg, formData, formDefinition, p_v$, metaParams: params }
                            }
                            // check for async and if so await it...
                            isAsync = isAsyncFn(cHelpers[fn] ?? "")
                            if (isAsync) {
                                debugger
                            }
                            tmp = isAsync ? await cHelpers[fn]?.(vm, objParams) : cHelpers[fn]?.(vm, objParams)
                            //tmp = cHelpers[fn]?.(vm, objParams)
                            countAsResult++
                            arrPartials.push(tmp?.result ?? tmp)
                            if (tmp?.message) {
                                arrMessages.push(tmp.message)
                            }
                        }
                        catch (e) {
                            console.warn(e)
                        }
                    }
                }
            }
        }
    }
    catch (e) {
        console.warn(e)
    }

    // depending upon asLogicalOperator, we reduce arrPartials to a boolean via _.some. _.every or !_.every
    if (countAsResult) {
        rule_result = asLogical === rc_.AND ? _.every(arrPartials, Boolean) : asLogical === rc_.OR ? _.some(arrPartials, Boolean) : !(_.some(arrPartials, Boolean))
    }
    if (arrMessages.length > 0) {
        return { result: rule_result, message: arrMessages.join("; ") }
    }
    else {
        return rule_result
    }
}

export const composeRuleFeedbackMessage = (pContext) => {
    const { dummyValidator, targetFieldName, params, cfg, comparisonValue, type, criteria } = pContext
    let preMessage = `(Rule '${type}')`
    let targetFieldLabel
    let partMessage;
    let message;
    let metaType
    let inputArgs = criteria?.join?.(',') ?? ""
    try {
        //Only compose a hefty message if the execution was triggered indirectly
        if (typeof targetFieldName === 'string') {
            targetFieldLabel = params?.targetField?.label ?? targetFieldName
            if (cfg?.fieldCfg?.label && targetFieldName.toLowerCase() !== cfg.fieldCfg.label.toLowerCase()) {
                metaType = cfg?.metaParams?.type ?? cfg?.metaParams?.params?.type
                metaType = metaType ?? cfg?.metaParams?.params?.params?.type
                preMessage = `(Field '${cfg.fieldCfg.label}' by rule '${metaType}' indirectly tested field '${targetFieldLabel}' 
                    with value '${comparisonValue}' against rule '${type}(${criteria})')`;
            }
        }
        if (dummyValidator?.$message && typeof (dummyValidator.$message) === 'function') {
            partMessage = dummyValidator.$message({ $params: dummyValidator.$params })
        }
        else { partMessage = dummyValidator.$message }
    }
    catch (e) {
        console.warn(e)
    }
    message = `${partMessage}. ${preMessage ?? ''}`;
    return message;
}

///////////////// HOF that generates an executioner for each builtin vuelidate validator that takes 1 paramer ....
/**
 * The passed in const { value, fieldName, params, ...cfg } = objContext is augmented to support rerunning of the rule.
 * TODO: get a general defaulted from somewhere?
 * TODO: make an array of supported vuelidate builtins that have ONE param? to know when to invoke this one.
 * @param vm 
 * @param objParams 
 * @returns 
 */
export const makeValidator = (objCfg) => {
    const { param, type, validator } = objCfg

    return async function (pvm: any, objContext: object) {
        //const { value, params, ...cfg } = objContext
        const { value, params, p_v$, ...cfg } = objContext
        //now prepare the namespace for the code below to reference vm.v$.<paths> !!!
        const vm = pvm?.v$ ? pvm : { v$: p_v$.value }
        debugger;
        // the runtime value against which usually a rule will be executed. If however a targetField is specified, then that field should provide the runtime comparisonValue... 
        let comparisonValue = value;
        let condition; // this param should contain the single argument for the invocation of the validator
        let isAsync = false;
        // all validators have as norm: true. Else they do not qualify and need to return a feedback message.
        let defaulted = true;
        let result = defaulted;
        let dummyValidator;
        let message = "";
        let fn;
        let sourceFieldName, targetFieldName, targetFieldLabel, metaType;
        let refName
        let probe

        // TODO: parse the invocation configuration in params.
        // TODO if it supports a function. Could that function have params? How?
        // Does it config to get a $model etc etc?
        if (params?.[param]?.staticValue) {
            condition = params[param].staticValue
        }
        else if (params?.[param]?.$model) {
            sourceFieldName = params[param].$model
            if (sourceFieldName && typeof sourceFieldName === 'string') {
                condition = vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName]
            }
        }
        else if (params?.[param]?.ref) {
            refName = params[param].ref
            if (refName && typeof refName === 'string') {
                condition = vm?.$refs?.[refName]?.value
            }
        }
        else if (params?.[param]?.fn) {
            // is it a fn Name get the reference from either the executors or the retrievers?
            fn = params[param].fn
            if (fn && typeof fn === 'string') {
                condition = cHelpers?.[fn]
            }
            else if (typeof fn === 'function') {
                condition = fn
                isAsync = isAsyncFn(fn)
            }
        }
        else {
            // assume we received a direct, static value, whatever it is (object, array, scalar)
            condition = params?.[param]
        }
        //condition could be optional OR deliberately undefined?
        //if (condition !== undefined){
        try {
            //check if we have to run on another target instead of on the requesting field!!!
            targetFieldName = params?.targetField && params.targetField.name
            if (targetFieldName && typeof targetFieldName === 'string') {
                comparisonValue = vm?.v$?.[targetFieldName]?.$model ?? vm?.fieldValues?.value?.[targetFieldName]
            }
            // Note: here we are using the builtin vuelidate requiredIf -aliassed 'requiredif' in the import- validator, without having to know it's implementation
            if (isAsync) {
                // configure the validator
                dummyValidator = helpers.withAsync(validator(condition))
                // run the validator against the comparisonvalue
                result = await dummyValidator?.$validator(comparisonValue);
            }
            else {
                // configure the validator
                dummyValidator = validator(condition);
                // run the validator against the comparisonvalue
                result = dummyValidator?.$validator(comparisonValue);
            }

            // Only when resulted in the opposite of the norm result (defaulted), should we compose the feedback message
            if (result !== defaulted) {
                debugger;
                let cfgMessage = { dummyValidator, targetFieldName, params, cfg, comparisonValue, type, criteria: [condition] };
                message = composeRuleFeedbackMessage(cfgMessage)
            }
        }
        catch (e) {
            console.warn(e);
        }
        //}
        // only output the message when failed
        // Trivially use Promise.resolve, to support it being async, to test out the whole async rules chaining principle...
        return Promise.resolve(result || { result, message })
    }
}

