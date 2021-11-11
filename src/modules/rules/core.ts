import { unref } from 'vue'
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

// create yet another layer that will invoke generateRule with arguments collected in two steps
export const makeRule = (additionalRuleConfig) => {
    return (overallRuleConfig) => {
        return generateRule(overallRuleConfig, additionalRuleConfig)
    }
}

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
    let fallBackFunction = function ruleFn(value, vm, vmx = xVM) {
 * TODO: get rid of redundant reference if we do not use xVM explicitely, since we pass it on as is, implicitely, in probeCustomRuleFn(args) and we do not -yet- use it in 
 */
//export const makeRule = (...args) => {
export const generateRule = (...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, p_v$, ...params } = args[0]
    const xVM = { v$: p_v$ }
    const { defaultTo = true } = args[1]
    const ruleType = params?.type
    let resultFunction
    // also a simple synchronous Fn... but add in xVM too always to get a reference to v$ 
    let fallBackFunction = function ruleFn(value, vm, vmx = xVM) {
        debugger;
        try {
            let lvm = vmx || xVM
        } catch (e) {
            debugger
        }
        return {
            $valid: true, // We should NEVER "fail" based on a dummy  fallback function, regardless "asValidator" ???
            extraParams: { rule_result: defaultTo, fieldCfg, params, dependsOn, },
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}`
        }
    }
    try {
        // 1. probe for a supported rule function
        resultFunction = probeCustomRuleFn(args)
    } catch (error) {
        console.warn(error);
    }
    // 2. make sure that if we did not have any function yet, we should return a liberal/neutral fallback function 
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
    const { defaultTo = true, staticCfg, invert, asValidator = false, startFn } = arrCfg[1]
    debugger;
    // pass in xVM to be sure to have a reference to v$ ????? or this passes in via arrCfg[0] ...
    return async function ruleFn(value, vm, /**vmX = xVM*/) {
        //let rule_result = await probeCustomRuleFnRecursor(value, vm, arrCfg[0], asLogical, startFn, arrCfg[1]) // ??  defaultTo
        let rule_result = await probeCustomRuleFnRecursor(value, vm, arrCfg, asLogical, startFn) // pass through arrCfg, not onlt arrCfg[0], so that we can use function for disableIf and displayIf just like any other feature...
        rule_result = rule_result ?? defaultTo
        if (fieldCfg.id === 'title' && params.type === rc_.CV_TYPE_DISABLE_IF) {
            debugger
        }
        const boolRuleResult = rule_result?.result ?? rule_result
        const valid = !asValidator ? true : boolRuleResult; // if we do NOT run as validator, we should NOT fail and flag stuff as failed, because we do not want to cause any 'invalid markings' anywhere!
        let message = `Rule of type ${params?.type} for field ${fieldCfg?.label} returned: ${boolRuleResult}.`
        if (rule_result?.message) {
            message = rule_result?.message ?? message //${message} 
        }
        return Promise.resolve({
            $valid: valid,
            extraParams: { rule_result: boolRuleResult, fieldCfg, raw_result: rule_result },
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
    const { dependsOn, fieldCfg, formData, formDefinition, p_v$, ...params } = objCfg?.[0] ?? objCfg //this can be an array on the first level of invocation, but will be a scalar in recursion...
    const { defaultTo = true, staticCfg, invert } = objCfg?.[1] ?? {}

    // let { startFn } = objCfg[1] 
    // for now we can do without this ...
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

    // TODO: should we always/also search for and/or/not iterators first ?
    // if we have a disableIf rule that says false due to an absent config property or due to a present one... 
    // should we "imputate" an "or" and look for more dependencies or what????

    let iterator = dependsOn && typeof dependsOn === 'object' ? Object.entries(dependsOn) : {}
    let doIterate = Object.keys(iterator).length > 0
    let abort = false;
    let ignore = false;
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
                    const objParams = { value, fieldCfg, formData, formDefinition, p_v$, params, metaParams: params, defaultTo, staticCfg, invert }
                    // check for async and if so await it...
                    isAsync = isAsyncFn(cHelpers[fn] ?? "")
                    tmp = isAsync ? await cHelpers[fn]?.(vm, objParams) : cHelpers[fn]?.(vm, objParams)
                    ignore = tmp?.ignore ?? false;
                    debugger
                    if (!ignore) {
                        countAsResult++
                        arrPartials.push(tmp?.result ?? tmp)
                        if (tmp?.message) {
                            arrMessages.push(tmp.message)
                        }
                        abort = tmp?.abort ?? false;
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
            if (startFnUnqualified) { // && asLogical === rc_.AND
                debugger;
                // when called as a logical AND operator, the end result at this level can never become true anymore, so bail out...
                arrPartials.push(undefined)
                arrMessages.push(`Flawed or errored startFn ${startFn} for 'conjunctive' invocation. Aborted.`)
                countAsResult++
                if (asLogical === rc_.AND) {
                    abort = true;
                }
            }
        }
        // should we invoke the recursion iterator 
        // TODO: we could go for promise.all / promise.allSettled ???
        if (!abort && doIterate) {
            for (const [key, entryValue] of iterator) {
                tmp = null
                if (arrToRecurse.includes(key)) {
                    // to correctly recur downwards set the new dependsOn property to the relevant subset!!!!
                    let objCfg2 = { "dependsOn": entryValue, fieldCfg, formData, formDefinition, p_v$, params }
                    try {
                        tmp = await probeCustomRuleFnRecursor(value, vm, objCfg2, key) //always await?????
                        //arrPartials.push(tmp)
                        arrPartials.push(tmp?.result ?? tmp)
                        countAsResult++
                        if (tmp?.message) {
                            arrMessages.push(tmp.message)
                        }
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
                            tmp = isAsync ? await cHelpers[fn]?.(vm, objParams) : cHelpers[fn]?.(vm, objParams)
                            //tmp = cHelpers[fn]?.(vm, objParams)
                            arrPartials.push(tmp?.result ?? tmp)
                            countAsResult++
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
    else {
        debugger;
        console.log(`For field ${fieldCfg.label} probeCustomRuleFnRecursor defaulted at no relevant evaluation results. The 'ignore' was: ${ignore}. For rule ${params.type}`)
        rule_result = defaultTo
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

///////////////// HOF that generates an executioner for each builtin vuelidate validator that takes ZERO OR 1 paramer ....
/**
 * The passed in const { value, fieldName, params, ...cfg } = objContext is augmented to support rerunning of the rule.
 * TODO: get a general defaulted from somewhere?
 * TODO: make an array of supported vuelidate builtins that have ONE param? to know when to invoke this one.
 * 
 * TODO: makeValidator rename to wrapRule. 
 * Where makeRule creates the function that will implement the parsing and resolving and execution of the field validator-configuration:
 * { type: 'maxLength', params: { bla, dependsOn: {and: { [ALL_VALID]:['a','b','c']}}}}
 * wrapRule will wrap the relevant validator / executor such that it could dynamically run (dynamic argument, run 'delegated' on another field)
 * which is all optional and totalley depends on the declarative 'validator-configuration'.
 * 
 * TODO: compareDelegatedNullish
 * if we have targetField !== source field (so delegated rule) AND comparisonValue is undefined should we first do helpers.req(comparisonValue) ?
 * If we do not, and we do minValue(4) or url() or maxLength(100) against an undefined/null optional or non-touched comparison value, it returns true.... Which could be erroneous in the strict sense!
 * On the other hand, we do not want to know how other executors/validators are implemented, so if the vuelidate minlegth(5) on undefined returns true, the user could configure
 * required() and minLength(5) etc etc which is the more flexible option...
 * But for now, let's implement it..
 * 
 * @param vm 
 * @param objParams 
 * @returns 
 */
export const wrapRule = (objCfg) => {
    const compareDelegatedNullish = false; // only consequential when false ...!!!!!
    const { param, type, validator } = objCfg

    return async function (pvm: any, objContext: object) {
        //const { value, params, ...cfg } = objContext
        const { value, params, p_v$, ...cfg } = objContext

        //prepare the namespace for the code below to reference vm.v$.<paths> !!!
        const vm = pvm?.v$ ? pvm : { v$: p_v$.value }

        if (cfg.fieldCfg?.id === 'setting2') {
            debugger;
        }
        // test is v$ een ref of niet? 

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
        // Does it take a param at all, formally?
        // TODO if it supports a function. Could that function have params? How?
        // Does it config to get a $model etc etc?
        if (params?.[param]) {
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
            // if (isAsync) {
            //     // configure the validator, see if we have to invoke it to set it up. Some are without params, like required, alpha, etc
            //     dummyValidator = helpers.withAsync(typeof validator === 'function' ? validator(condition) : validator)
            //     // run the validator against the comparisonvalue or first against req()
            //     if ( !compareDelegatedNullish && _.isEmpty(comparisonValue) ){
            //         result = helpers.req(comparisonValue) && await dummyValidator?.$validator(comparisonValue);
            //     } else {
            //         result = await dummyValidator?.$validator(comparisonValue);
            //     }
            // }
            // else {
            //     // configure the validator, see if we have to invoke it to set it up. Some are without params, like required, alpha, etc
            //     dummyValidator = typeof validator === 'function' ? validator(condition) : validator

            //     // run the validator against the comparisonvalue or first against req()
            //     if ( !compareDelegatedNullish && _.isEmpty(comparisonValue) ){
            //         result = helpers.req(comparisonValue) && dummyValidator?.$validator(comparisonValue);
            //     } else {
            //         result = dummyValidator?.$validator(comparisonValue);
            //     }
            // }

            // shorter notation. configure the validator, see if we have to invoke it to set it up. Some are without params, like required, alpha, etc. And See if we have to do helpers.req() first.
            dummyValidator = isAsync ?
                helpers.withAsync(typeof validator === 'function' ? validator(condition) : validator) :
                typeof validator === 'function' ? validator(condition) : validator

            // run the validator against the comparisonvalue or first against req()
            if (!compareDelegatedNullish && _.isEmpty(comparisonValue)) {
                result = helpers.req(comparisonValue) && (isAsync ? await dummyValidator?.$validator(comparisonValue) : dummyValidator?.$validator(comparisonValue))
            } else {
                result = isAsync ? await dummyValidator?.$validator(comparisonValue) : dummyValidator?.$validator(comparisonValue)
            }

            // Only when resulted in the opposite of the norm result (defaulted), should we compose the feedback message
            if (result !== defaulted) {
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

export const hofRuleFnGenerator = (...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    // can we make sure that, if undefined, defaultTo = true etc
    const { defaultTo = true, invert = false, asValidator = false, staticCfg } = args[1]

    const ruleType = params.type
    let hasStaticConfigProperty
    let resultFunction
    // also a simple synchronous Fn...
    let fallBackFunction = function ruleFn(value, vm) {
        return {
            $valid: true, // We should never "fail" based on a total dummy function, regardless "asValidator" ???
            extraParams: { rule_result: defaultTo, fieldCfg },
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}`
        }
    }
    try {
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticCfg && ((fieldCfg?.[staticCfg] ?? false) !== false)
        if (hasStaticConfigProperty) {
            resultFunction = function ruleFn(value, vm) {
                let rule_result = invert ? !!!fieldCfg?.[staticCfg] : !!fieldCfg?.[staticCfg]
                return {
                    $valid: asValidator ? rule_result : true, // when run as Validator, it should flag/register errors accordingly!
                    extraParams: { rule_result, fieldCfg },
                    message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticCfg} on ${fieldCfg.label}`
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

export const generateRuleBAK = (...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, p_v$, ...params } = args[0]
    const xVM = { v$: p_v$ }
    // can we make sure that, if undefined, defaultTo = true etc
    const { defaultTo = true, invert = false, asValidator = false, staticCfg } = args[1]
    debugger;
    const ruleType = params.type
    let hasStaticConfigProperty
    let resultFunction
    // also a simple synchronous Fn... but add in xVM too always to get a reference to v$ 
    let fallBackFunction = function ruleFn(value, vm, vmx = xVM) {
        return {
            $valid: true, // We should never "fail" based on a total dummy function, regardless "asValidator" ???
            extraParams: { rule_result: defaultTo, fieldCfg },
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}`
        }
    }
    try {
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticCfg && ((fieldCfg?.[staticCfg] ?? false) !== false)
        if (hasStaticConfigProperty) {
            debugger
            //for test purposes set to false...
            hasStaticConfigProperty = false
        }
        if (hasStaticConfigProperty) {
            resultFunction = function ruleFn(value, vm, vmx = xVM) {
                let rule_result = invert ? !!!fieldCfg?.[staticCfg] : !!fieldCfg?.[staticCfg]
                return {
                    $valid: asValidator ? rule_result : true, // when run as Validator, it should flag/register errors accordingly!
                    extraParams: { rule_result, fieldCfg },
                    message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticCfg} on ${fieldCfg.label}`
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
 * makeHelper method for RETRIEVERS
 * generates RETRIEVER helpers for all rule-types for the patterns: IS/HAS vs NOT combined for ONE, SOME/ANY, ALL/NONE
 * the use case: ONE-IS/HAS is considered a "base" helper, and it will be aligned with the direction/connotation of the rule type / feature, monitored by a vuelidate for one specific "field".
 *  
 * E.g. for the rule type "disableIf", the base would be to rule wether a specific field should be DISABLED. The base can have a default of true or false. 
 * If it has a default of false, the base is considered a negatively connotated base.
 * When a "negative" feature cannot be retrieved, we do not want to consider the feature to be "verified", because that would mean a field could be disabled by default.
 * 
 * E.g. for the rule type: displayIf, the base is wether a specific field IS DISPLAYED, and it has a "positive" connotation. 
 * Any positive base will have a default of true. Because if a positive feature cannot be retrieved, we DO want to consider the feature to be "verified", because that would mean a field could be displayed by default.
 * 
  
* to create a base RETRIEVER Fn,  we need on object as argument containing: 
EITHER:
    1) the associated rule type,
    2) the "arity" or "N" (ONE<SOME<ALL) as "ONE/SINGLE/SCALAR" or which ever constant we choose, 
    3) the "direction"/connotation/sign (+,-, pos/neg,affirmative or disaffirmative) and 
    4) the path to get to the result on the vuelidate v$ namespace, put in in an array so that we can walk the array to get down to the endpoint using the optional chaining "?."
    5) the default
OR: 
    6) the intended base helper.

* Once we have created a base retriever, the base retriever should be used directly for the other retrievers in the sextet of RETRIEVERS for that rule type.
* So to create the other RETRIEVERS in that sextet, we should pass in the relevant base helper in the Context argument.
* 

    // if baseFn singleHelperFn is passed in, we only need the arity and the connotation to generate functions for the other X flavours of helpers RETRIEVERS for this rule type, for now these are 5 other flavours.
    // so only by passing in the baseFn singleHelperFn can we create the pother 5 flavours.
    // we need to make sure the helpers are correctly matched to some tag on the helpers object! 
    // we need some validation for that....

    // if baseFn is not passed in, the function will only create a baseFn, and thereforre we NEED the ruletype, the path, the sign and the defaultTo. The arity will be set to SINGLE.

    
 isRequiredIf = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result, defaulted = false;
    try {
        result = vm?.v$?.[fieldName]?.[CV_TYPE_REQUIREDIF]?.$invalid ?? defaulted;
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}
*/
export const makeHelper = ({ baseFn = null, ruleType = "", sign = rc_.POS, N = rc_.SINGLE, defaultTo = true, relate = {}, p_vm = {} }) => {
    debugger
    let helper;
    let message;
    if (!baseFn) {
        // validate the arguments for the creation of a base Fn!
        if (ruleType && sign && (defaultTo !== undefined && defaultTo !== null)) {
            helper = makeBaseHelper({ ruleType, sign, defaultTo, p_vm })
            return helper
        }
        else {
            message = `makeHelper: Invalid input for the generation of a base helper function for ruleType ${ruleType}, sign ${sign}, N ${N}, default ${defaultTo} }` //path ${[].join(path)
            console.warn(message)
        }
    }
    else {
        // we have a singleHelperFn, so we should invoke the correct logic to create an associated helper... 
        // validate the arguments for the creation of a base Fn
        // for SOME & ALL we NEED to know HOW the singleHelper was set up: it's sign/connotation/inclination & it's default
        // because we have to able to invert the result and the default correctly 
        if (sign && N) {
            if (N !== rc_.SINGLE && (!relate || !relate.sign || relate.defaultTo === null || relate.defaultTo === undefined)) {
                message = `makeHelper: Imputating missing 'relate' input for the generation of a "unary" helper function for sign ${sign} and N ${N} regarding .... (function name???) }` //path ${[].join(path)
                console.warn(message)
                debugger
                //relate = sign === rc_.POS ? { sign: rc_.POS, defaultTo: true } : { sign: rc_.NEG, defaultTo: false }
                //relate = sign === rc_.POS ? { sign: rc_.POS, defaultTo: true } : { sign: rc_.NEG, defaultTo: false }
            }
            helper = makeHelperPermutation({ baseFn, sign, N, relate, p_vm })
            return helper
        }
    }
}

// TODO: we have to know if the baseHelperFn was POSITIVE or not, to deduce what to do here. 
// IS_VISIBLE associated to displayIf ??? is aligned in the sense: if the rule_result === true, the field is displayed and aligned with the connotation
// IS_DISABLED the same.

export const makeHelperPermutation = ({ baseFn, sign, N, relate = { sign: rc_.POS, defaultTo: true } }) => { // , p_vm 
    debugger
    let helper;
    let defaulted;

    // when the sign/inclination are aligned, we should align the default and reuse singleHelperFn as is, NOT NEGATING.
    if (relate.sign === sign) {
        defaulted = relate.defaultTo
        // SINGLE for the same sign as the singleHelperFn is REDUNDANT and not allowed ...
        if (N === rc_.SINGLE) {
            debugger
            console.warn('Unallowed attempt to create a helper for the same use case as the already existing baseFn')
        }
        else if (N === rc_.SOME) {
            helper = (vm, objContext) => {
                debugger;
                const { fieldNames } = objContext
                let result;
                let arrResults = [];
                try {
                    _.forEach(fieldNames, function (fieldName) {
                        result = baseFn(vm, { fieldNames: fieldName })
                        arrResults.push(result)
                    })
                    result = _.some(arrResults, Boolean);
                }
                catch (e) {
                    console.warn(e);
                    result = defaulted;
                }
                return result
            }
        }
        else if (N === rc_.ALL) {
            helper = (vm, objContext) => {
                const { fieldNames } = objContext
                let result;
                let arrResults = [];
                try {
                    _.forEach(fieldNames, function (fieldName) {
                        result = baseFn(vm, { fieldNames: fieldName })
                        arrResults.push(result)
                    })
                    result = _.every(arrResults, Boolean);
                }
                catch (e) {
                    console.warn(e);
                    result = defaulted;
                }
                return result
            }
        }
    }
    // when the sign / inclination is opposed, we should OPPOSE the default and re-use singleHelperFn but NEGATING the outcome
    else if (relate.sign !== sign) {
        defaulted = !!!relate.defaultTo;
        if (N === rc_.SINGLE) {
            helper = (vm, objContext) => {
                let result;
                try {
                    result = !!!baseFn(vm, objContext)
                }
                catch (e) {
                    console.warn(e);
                    result = defaulted;
                }
                return result
            }
        }
        else if (N === rc_.SOME) {
            helper = (vm, objContext) => {
                debugger
                const { fieldNames } = objContext
                let result;
                let arrResults = [];
                try {
                    _.forEach(fieldNames, function (fieldName) {
                        result = !!!baseFn(vm, { fieldNames: fieldName })
                        arrResults.push(result)
                    })
                    result = _.some(arrResults, Boolean);
                }
                catch (e) {
                    console.warn(e);
                    result = defaulted;
                }
                return result
            }
        }
        else if (N === rc_.ALL) {
            helper = (vm, objContext) => {
                const { fieldNames } = objContext
                let result;
                let arrResults = [];
                try {
                    _.forEach(fieldNames, function (fieldName) {
                        result = !!!baseFn(vm, { fieldNames: fieldName })
                        arrResults.push(result)
                    })
                    result = _.every(arrResults, Boolean);
                }
                catch (e) {
                    console.warn(e);
                    result = defaulted;
                }
                return result
            }
        }
    }
    return helper
}

/**
 * 0 This one will be invoked to create and return a baseHelper
 * The logic needs ruletype, the sign and the defaultTo. 
 * The N arity will be set to SINGLE.
 * @param param
 */
export const makeBaseHelper = ({ ruleType, sign = rc_.POS, N = rc_.SINGLE, defaultTo = true, p_vm }) => {
    debugger
    const isValidator = rc_.RULE_TYPES_VALIDATORS.includes(ruleType)
    const isExternal = !isValidator ? rc_.RULE_TYPES_EXTERNAL_RESULTS.includes(ruleType) : false
    const isOther = !isValidator && !isExternal ? rc_.RULE_TYPES_OTHER.includes(ruleType) : false

    let helper = function (vm, objContext) {
        debugger
        const { fieldNames: fieldName } = objContext
        let defaulted = defaultTo;
        let result = defaulted;
        //test the vm if we do not pass it in when defining this helper!!!!
        // let test = unref(vm?.v$)
        // console.log('makeBaseHelper test on unref(vm?.v$) from the passed in vm')
        // console.log(test)
        let ns = unref(vm?.v$) ?? unref(p_vm?.v$);
        try {
            if (isValidator) {
                result = ns?.[fieldName]?.[ruleType]?.$invalid ?? defaulted;
            }
            else if (isExternal) {
                result = ns?.[fieldName]?.[ruleType]?.$externalResults?.length ?? defaulted;
            }
            else if (isOther) {
                result = ns?.[fieldName]?.[ruleType]?.$response?.extraParams?.rule_result ?? defaulted;
            }
            else {
                debugger;
                console.warn(`Unmapped rule type ... we can not create a base helper for an unknown rule type: ${ruleType}`)
            }
        }
        catch (e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    }
    debugger;
    return helper
}
