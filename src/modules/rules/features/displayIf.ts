/**
 * Logic for an executable 'visibility' feature rule, it's associated helpers and constants
*/
import rc_ from '@/modules/rules/constants'
import _ from 'lodash'
import { makeRule, cHelpers, hofRuleFnGenerator } from '@/modules/rules/core'

// TODO: we could try to device an executioner for hidden, that probes for the static config property, the direction of it and wether it COULD be mitigated/overrules?
// Executioner for rule of type 'displayIf'
export const displayIf = async (pvm, objContext) => {
    const { value, params, p_v$, fieldCfg, defaultTo = true, staticCfg, ...cfg } = objContext
    const doInvertRuleResult = cfg.invert ?? true // the thing is called displayIf, but the property is hidden: true/false
    //so if hidden: true we should invert it so displayIf will return false 

    let message
    let defaulted = defaultTo;
    let result = defaulted
    //now prepare the namespace for the code below to reference vm.v$.<paths> !!!
    const vm = pvm?.v$ ? pvm : { v$: p_v$.value }
    const ruleType = params.type
    let hasStaticConfigProperty
    //////////////////////
    try {
        message = `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticCfg} on ${fieldCfg.label}`
        // 1. if we have an overruling static configuration property, use a simple & synchronous ruleFn
        hasStaticConfigProperty = staticCfg && ((fieldCfg?.[staticCfg] ?? false) !== false)
        if (hasStaticConfigProperty) {
            debugger
            result = doInvertRuleResult ? !!!fieldCfg?.[staticCfg] : !!fieldCfg?.[staticCfg]
        }
    } catch (error) {
        console.warn(error);
    }
    debugger;
    return { result, message };
}

/**
 * Generates an executioner for rule of type displayIf for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 * 
 */
// export const _displayIf = (args) => {
//     const defaultTo = true;
//     const staticCfg = rc_.CFG_PROP_ENTITY_DISPLAY
//     const doInvertRuleResult = rc_.CFG_PROP_ENTITY_DISPLAY_INVERT
//     let resultFunction
//     try {
//         resultFunction = hofRuleFnGenerator(args, { defaultTo, staticCfg, doInvertRuleResult })
//     } catch (error) {
//         console.warn(error)
//     }
//     return resultFunction
// }

/**
 * Checks if two types of rules for display resulted in true.
 * @param vm 
 * @param fieldName 
 * @returns 
 */
export const isVisible = (vm, objContext) => {
    debugger
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
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const isHidden = (vm, objContext) => {
    let result, defaulted = false;
    try {
        result = !cHelpers.isVisible(vm, objContext)
    }
    catch (e) {
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
        _.forEach(fieldNames, function (fieldName) {
            result = !cHelpers.isVisible(vm, { fieldNames: fieldName })
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
        _.forEach(fieldNames, function (fieldName) {
            // re-use isVisible
            result = cHelpers.isVisible(vm, { fieldNames: fieldName })
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

export const allVisible = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            result = cHelpers.isVisible(vm, { fieldNames: fieldName })
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

export const allHidden = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            result = !cHelpers.isVisible(vm, { fieldNames: fieldName })
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

export default {
    // the executioner, can serve as a rule type.
    displayIf,
    // helpers/retrievers, can be used within other validators.
    isVisible,
    someVisible,
    allVisible,
    isHidden,
    someHidden,
    allHidden
};