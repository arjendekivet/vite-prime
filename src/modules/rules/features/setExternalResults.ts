/**
 * Logic for an executable feature rule, it's associated helpers and constants
*/
//const { hofRuleFnGenerator, V_CUSTOM_PREFIX } = await import('@/modules/rules/validateHelpers')

import rc_ from '@/modules/rules/constants'
import { makeRule, hofRuleFnGenerator } from '@/modules/rules/core'

// Executioner for rule of type 'setExternalResults'
export const setExternalResults = async (vm, objContext) => {
    let response, result
    const { value, params, fieldName, ...cfg } = objContext
    try {
        debugger;
        //TODO: find a robust & elegant method that takes the querystring params and safely encodes and appends it to the url...
        //TODO: we should loop through the vars and mutate pathName 
        let pathName = `${params?.api?.replace?.(':entities', params.vars.entities)}`
        pathName = `${pathName.replace?.(':id', params.vars.id)}`
        const url = new URL(`${params.protocol}://${params.host}${params.port ? ':' + params.port : ''}${pathName}/`);

        //TODO: register the results in a designated $externalResults map ....
        let rawResponse = await fetch(url.href)
        let response = await rawResponse.json?.()
        let arrResults = []
        arrResults.push(response) //no need to JSON.stringify(response)), although we could do so
        // set the ref value
        debugger
        let ns = vm?.v$?.[cfg.fieldCfg.id]?.$externalResults.value ?? null
        if (ns) {
            ns = arrResults
        }

        result = rawResponse?.ok
    } catch (e) {
        debugger;
        console.warn(e)
        result = false;
    }
    return result
}

// hof to compose a function to return as executioner for a rule of type setExternalResults
export const _setExternalResults = (args) => {
    const defaultRuleResult = false;
    const doInvertRuleResult = false
    const asValidator = true; // !!!!!!!!!! true to be able to run it as a proper validator, so that failing will flag the field etc, apart from also running it as a helper/executor
    const startFn = rc_.V_SET_EXTERNAL_RESULTS; //this config means that said method should be invoked FIRST 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator(args, { defaultRuleResult, doInvertRuleResult, startFn, asValidator })
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

// no helpers yet, only the executioner is set up
export default {
    _setExternalResults, // will generate the executioner
    setExternalResults,  // called by the executioner
};