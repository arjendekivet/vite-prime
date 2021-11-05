/**
 * Logic for an executable 'visibility' feature rule, it's associated helpers and constants
*/ 
import rc_ from '@/modules/rules/constants'
import _ from 'lodash'
import { hofRuleFnGenerator, cHelpers } from '@/modules/rules/core'

/**
 * Generates an executioner for rule of type displayIf for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
 export const displayIf = (args) => {
    const defaultRuleResult = true;
    const staticConfigProperty = rc_.CFG_PROP_ENTITY_DISPLAY
    const doInvertRuleResult = rc_.CFG_PROP_ENTITY_DISPLAY_INVERT
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult, staticConfigProperty , doInvertRuleResult } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

/**
 * Checks if two types of rules for display resulted in true.
 * @param vm 
 * @param fieldName 
 * @returns 
 */
 export const isVisible = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let defaulted = true;
    let result, result_1, result_2;
    try {
        // custom rule based on a FUNCTION in the field validators configuration. We do not expect this frequently though.... Functions from external JSON into Javascript Object literal configs is rare. 
        // temporarily, as long as we also use the displayIf with spawned external functions :-)
        result_1 = (vm?.v$?.[fieldName]?.[rc_.V_DISPLAYIF]?.$response?.extraParams?.rule_result ?? true)
        // for now we surely have to take into account CV_TYPE_DISPLAY_IF!!!!
        result_2 = (vm?.v$?.[fieldName]?.[rc_.CV_TYPE_DISPLAY_IF]?.$response?.extraParams?.rule_result ?? true)

        result = result_1 && result_2
    }
    catch(e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const isHidden = (vm, objContext) => {
    let result, defaulted = false;
    try {
        result = !cHelpers.isVisible(vm,objContext)
    }
    catch(e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const someHidden = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = !cHelpers.isVisible(vm, { fieldNames: fieldName })
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

/**
 * @param vm 
 * @param fieldName 
 * @returns 
 */
 export const someVisible = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            // re-use isVisible
            result =  cHelpers.isVisible(vm, { fieldNames: fieldName })
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

export const allVisible = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = cHelpers.isVisible(vm,{ fieldNames: fieldName })
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

export const allHidden = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = !cHelpers.isVisible(vm,{ fieldNames: fieldName })
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

export default { 
    // the executioner, can serve as a validator type.
    displayIf, 
    // helpers/retrievers, can be used within other validators.
    isVisible, 
    someVisible,
    allVisible,
    isHidden,
    someHidden,
    allHidden
};