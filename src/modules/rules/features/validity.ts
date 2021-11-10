import rc_, { SOME_ENABLED } from '@/modules/rules/constants'
import _ from 'lodash'
import { cHelpers } from '@/modules/rules/core'

/**
 * Note: this module does not yet export an "executioner" rule
 * It merely exporst 'retriever' helpers ...
 */

/**
     * Checks if a field is explicitely -being touched/dirty- valid. 
     * Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
export const isValid = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result, defaulted = true;
    try {
        result = !!!(vm?.v$?.[fieldName]?.[rc_.V_VALID])
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const isInvalid = (vm, objContext) => {
    let result, defaulted = false;
    try {
        // invert the result because we re-use isValid, we returns true if valid
        result = !cHelpers.isValid(vm, objContext)
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

/**
* Checks if a field is silently -eagerly- valid. 
* Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
* @param vm 
* @param fieldName 
* @returns 
*/
export const isValidSilent = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result, defaulted = true;
    try {
        // Test if we can use vm to get to rules to get to a $validator on it to call it or re-use it is a wrapped function?
        // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
        result = !!!(vm?.v$?.[fieldName]?.[rc_.V_SILENTERRORS]?.length > 0)
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const getInvalidMessage = (vm, objContext) => {
    const { fieldNames: fieldName } = objContext
    let result
    let probe = cHelpers.isInvalid(vm, objContext);
    // Only get the message if invalid, since we do not want to have to detect if $response?.message belongs to an actual validator or etc etc
    //if (cHelpers.isInvalid(vm,objContext)) {
    result = vm?.v$?.[fieldName]?.$errors[0]?.$message || vm?.v$?.[fieldName]?.$errors[0]?.$response?.message || ""
    //}
    return result
}

export const isInvalidSilent = (vm, objContext) => {
    let result, defaulted = false;
    try {
        // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
        result = !cHelpers.isValidSilent(vm, objContext)
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const someValidSilent = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    const arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            // re-use isValidSilent
            result = cHelpers.isValidSilent(vm, { fieldNames: fieldName })
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

export const someInvalidSilent = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    const arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            // re-use isValidSilent
            result = !cHelpers.isValidSilent(vm, { fieldNames: fieldName })
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

export const allValidSilent = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            // re-use isValid
            result = cHelpers.isValidSilent(vm, { fieldNames: fieldName })
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

export const allInvalidSilent = (vm, objContext) => {
    let result, defaulted = false;
    try {
        result = !(cHelpers.someValidSilent(vm, objContext))
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

/**
 * TODO Optimize:
 * either rewrite in terms of NOT allInvalid 
 * leave early as soon as one if true
 * @param vm 
 * @param objContext 
 * @returns 
 */
export const someValid = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        result = !(cHelpers.allInvalid(vm, objContext))
        // _.forEach(fieldNames, function(fieldName) {
        //     // re-use isValid
        //     result =  cHelpers.isValid(vm, fieldName)
        //     arrResults.push(result)
        // })
        // result = _.some(arrResults, Boolean);
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export const allValid = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = true;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            // re-use isValid
            result = cHelpers.isValid(vm, { fieldNames: fieldName })
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

export const allInvalid = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        _.forEach(fieldNames, function (fieldName) {
            // re-use isValid but inverted
            result = !cHelpers.isValid(vm, { fieldNames: fieldName })
            arrResults.push(result)
        })
        result = _.every(arrResults, Boolean);
        //result = !arrResults.includes(false);
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }

    return result
}

export const someInvalid = (vm, objContext) => {
    const { fieldNames } = objContext
    let result, defaulted = false;
    let arrResults = [];
    try {
        result = !(cHelpers.allValid(vm, objContext))
        // _.forEach(fieldNames, function(fieldName) {
        //     // re-use isValid
        //     result = cHelpers.isValid(vm,{ fieldNames: fieldName })
        //     arrResults.push(result)
        // })
        // result = arrResults.includes(false);
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

export default {
    isValid,
    someValid,
    allValid,
    isInvalid,
    someInvalid,
    allInvalid,
    isValidSilent,
    someValidSilent,
    allValidSilent,
    isInvalidSilent,
    someInvalidSilent,
    allInvalidSilent,
    getInvalidMessage
}
