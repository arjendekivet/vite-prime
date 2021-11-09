import rc_, { SOME_ENABLED } from '@/modules/rules/constants'
import _ from 'lodash'
import { makeRule, cHelpers, hofRuleFnGenerator } from '@/modules/rules/core'

// TODO: we could try to device an executioner for disabled, that probes for the static config property, the direction of it and wether it COULD be mitigated/overrules?
// Executioner for rule of type 'disableIf'
export const disableIf = async (pvm, objContext) => {
    debugger
    const { value, params, p_v$, fieldCfg, defaultRuleResult = true, doInvertRuleResult = false, staticConfigProperty, ...cfg } = objContext
    debugger
    let message
    let defaulted = defaultRuleResult;
    let result = defaulted
    //now prepare the namespace for the code below to reference vm.v$.<paths> !!!
    const vm = pvm?.v$ ? pvm : { v$: p_v$.value }
    const ruleType = params.type
    let hasStaticConfigProperty
    //////////////////////
    try {
        message = `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}`
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticConfigProperty && ((fieldCfg?.[staticConfigProperty] ?? false) !== false)
        if (hasStaticConfigProperty) {
            result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
        }
    } catch (error) {
        console.warn(error);
    }
    return { result, message };
}

/**
 * Generates a disableIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
export const _disableIf = (args) => {
    const defaultRuleResult = false;
    const staticConfigProperty = rc_.CFG_PROP_ENTITY_DISABLE
    const doInvertRuleResult = rc_.CFG_PROP_ENTITY_DISABLE_INVERT
    let resultFunction
    try {
        //resultFunction = makeRule({ defaultRuleResult, staticConfigProperty, doInvertRuleResult }) // args ...????????????????
        resultFunction = hofRuleFnGenerator(args, { defaultRuleResult, staticConfigProperty, doInvertRuleResult })
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