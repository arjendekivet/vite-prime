import rc_ from '@/modules/rules/constants'
import _ from 'lodash'
import { makeRule, cHelpers, hofRuleFnGenerator } from '@/modules/rules/core'

// TODO: we could try to device an executioner for disabled, that probes for the static config property, the direction of it and wether it COULD be mitigated/overrules?
// Executioner for rule of type 'disableIf'
export const disableIf = async (pvm, objContext) => {
    const { value, params, p_v$, fieldCfg, defaultTo = false, doInvertRuleResult = false, staticCfg, ...cfg } = objContext
    if (fieldCfg.id === 'title' || fieldCfg.id === 'setting2') {
        debugger
    }
    let defaulted = defaultTo;
    let result = defaulted
    let abort = false
    let ignore = false
    //now prepare the namespace for the code below to reference vm.v$.<paths> !!!
    const vm = pvm?.v$ ? pvm : { v$: p_v$.value }
    const ruleType = params.type
    let hasStaticConfigProperty
    let message
    try {
        // 1. if we have a static configuration property, that decides it all.
        hasStaticConfigProperty = fieldCfg?.[staticCfg]
        debugger
        if (hasStaticConfigProperty !== undefined) {
            result = doInvertRuleResult ? !!!fieldCfg[staticCfg] : !!fieldCfg[staticCfg]
            // since we want this static config property to be leading & decisive & overruling, we flag the result to abort.
            abort = true;
            message = `Rule of type ${ruleType} based to static configuration property (metadata) ${staticCfg} on ${fieldCfg.label} resulted as '${result}' and will be aborted.`
        }
        else {
            // we should flag the result to ignore this particular boolean in the evaluation of the end result in the caller above, 
            // since there was no relevant configuration property and we do not want the logic to return a boolean that will have consequences.
            // if we return true this means disable, but based on what? if we return false we say: enable, but then no other dependency rule following could influence the result.
            // once false, without the 'or' possibility, it can never become true anymore?
            ignore = true;
            message = `Rule of type ${ruleType} based on ABSENCE of static configuration property (metadata) ${staticCfg} on ${fieldCfg.label} resulted as '${result}' and will be ignored!`
        }
    } catch (error) {
        console.warn(error);
    }
    return { result, message, abort, ignore };
}

/**
 * Generates a disableIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
export const _disableIf = (args) => {
    const defaultTo = false;
    const staticCfg = rc_.CFG_DISABLE
    const doInvertRuleResult = rc_.CFG_DISABLE_INVERT
    let resultFunction
    try {
        //resultFunction = makeRule({ defaultTo, staticCfg, doInvertRuleResult }) // args ...????????????????
        resultFunction = hofRuleFnGenerator(args, { defaultTo, staticCfg, doInvertRuleResult })
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

/**
     * Checks for a RESULT for field rule to be disabled. Note: does not EXECUTE a rule.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
export const isDisabled = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    if (fieldName === 'setting2') { debugger }
    const defaulted = false
    let result
    try {
        result = (vm?.v$?.[fieldName]?.[rc_.CV_TYPE_DISABLE_IF]?.$response?.extraParams?.rule_result ?? defaulted)
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const isEnabled = (vm, objContext) => {
    let result, defaulted = true;
    try {
        result = !cHelpers.isDisabled(vm, objContext)
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const someDisabled = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            result = cHelpers.isDisabled(vm, { fieldNames: fieldName })
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

export const allDisabled = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            result = cHelpers.isDisabled(vm, { fieldNames: fieldName })
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

export const someEnabled = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            result = !cHelpers.isDisabled(vm, { fieldNames: fieldName })
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

export const allEnabled = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            result = !cHelpers.isDisabled(vm, { fieldNames: fieldName })
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

export const getDisabledMessage = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result = (vm?.v$?.[fieldName]?.[rc_.CV_TYPE_DISABLE_IF]?.$response?.message ?? '')
    return `Disabled: ${result}`
}

export default {
    //_disableIf,
    disableIf,
    isEnabled,
    someEnabled,
    allEnabled,
    isDisabled,
    someDisabled,
    allDisabled,
    getDisabledMessage
}