import rc_, { SOME_ENABLED } from '@/modules/rules/constants'
import _ from 'lodash'
import { hofRuleFnGenerator, cHelpers } from '@/modules/rules/core'

/**
 * Generates a disableIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
 export const disableIf = (args) => {
    const defaultRuleResult = false;
    const staticConfigProperty = rc_.CFG_PROP_ENTITY_DISABLE
    const doInvertRuleResult = rc_.CFG_PROP_ENTITY_DISABLE_INVERT
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult, staticConfigProperty , doInvertRuleResult } )
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
    catch(e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const isEnabled = (vm, objContext) => {
    let result, defaulted = true;
    try {
        result = !cHelpers.isDisabled(vm,objContext)
    }
    catch(e) {
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
        _.forEach(fieldNames, function(fieldName) {
            result =  cHelpers.isDisabled(vm, { fieldNames: fieldName })
            arrResults.push(result)
        })
        result = _.some(arrResults, Boolean);
    }
    catch(e) {
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
        _.forEach(fieldNames, function(fieldName) {
            result = cHelpers.isDisabled(vm,{ fieldNames: fieldName })
            arrResults.push(result)
        })
        result = _.every(arrResults, Boolean);
    }
    catch(e) {
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
        _.forEach(fieldNames, function(fieldName) {
            result = !cHelpers.isDisabled(vm, { fieldNames: fieldName })
            arrResults.push(result)
        })
        result = _.some(arrResults, Boolean);
    }
    catch(e) {
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
        _.forEach(fieldNames, function(fieldName) {
            result = !cHelpers.isDisabled(vm,{ fieldNames: fieldName })
            arrResults.push(result)
        })
        result = _.every(arrResults, Boolean);
    }
    catch(e) {
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
    disableIf,
    isEnabled,
    someEnabled,
    allEnabled,
    isDisabled,
    someDisabled,
    allDisabled,
    getDisabledMessage
}