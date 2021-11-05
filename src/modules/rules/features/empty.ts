import rc_, { SOME_ENABLED } from '@/modules/rules/constants'
import _ from 'lodash'
import { hofRuleFnGenerator, cHelpers } from '@/modules/rules/core'

/**
 * Note: this module does not yet export an "executioner" rule
 * It merely exporst 'retriever' helpers ...
 */

/**
     * Checks if a field is empty.
     * Note: this is only a retriever of a rule result, it does not calculate or execute a rule itself!
     * Since every field will have at least two rules ( for visibility and for disabling ) every field will be mapped and will have $model to consult!
     * @param vm 
     * @param fieldName 
     * @returns 
     */
 export const isEmpty = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result, defaulted = true;
    try { 
        result = helpers.len( (vm?.v$?.[fieldName]?.$model ) ?? "" ) === 0;
    }
    catch(e) {
        console.warn(e); 
        result = defaulted;
    }
    return result
}
export const someEmpty = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = cHelpers.isEmpty(vm, { fieldNames: fieldName })
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

export const allEmpty = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = cHelpers.isEmpty(vm, { fieldNames: fieldName })
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

export const notEmpty = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result, defaulted = false;
    try { 
        result = !(cHelpers.isEmpty(vm, { fieldNames: fieldName }))
    }
    catch(e) {
        console.warn(e); 
        result = defaulted;
    }
    return result
}

export const someNotEmpty = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = !cHelpers.isEmpty(vm, { fieldNames: fieldName })
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

export const noneEmpty = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function(fieldName) {
            result = !cHelpers.isEmpty(vm, { fieldNames: fieldName })
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
    isEmpty,
    someEmpty,
    allEmpty,
    notEmpty,
    someNotEmpty,
    noneEmpty
}