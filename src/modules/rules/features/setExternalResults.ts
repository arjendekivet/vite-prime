/**
 * Logic for an executable feature rule, it's associated helpers and constants
*/
//const { hofRuleFnGenerator, V_CUSTOM_PREFIX } = await import('@/modules/rules/validateHelpers')

import rc_ from '@/modules/rules/constants'
import { hofRuleFnGenerator, makeRule } from '@/modules/rules/core'

// Executioner for rule of type 'setExternalResults'
export const setExternalResults = async (pvm, objContext) => {
    debugger
    let response, result
    const { value, params, p_v$, ...cfg } = objContext

    //now prepare the namespace for the code below to reference vm.v$.<paths> !!!
    const vm = pvm?.v$ ? pvm : { v$: p_v$.value }

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
        // set the ref value Is this a ref or what? Can be directly set it?
        debugger
        //try { vm?.v$?.[cfg.fieldCfg.id]?.$externalResults.push(response) } catch (e) { console.warn(e) }
        let ns = vm?.v$?.value ?? vm?.v$
        if (ns) {
            try { ns[cfg.fieldCfg.id]?.$externalResults.push(response) } catch (e) { console.warn(e) }
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
    const defaultTo = false;
    const doInvertRuleResult = false
    const asValidator = true; // !!!!!!!!!! true to be able to run it as a proper validator, so that failing will flag the field etc, apart from also running it as a helper/executor
    const startFn = rc_.V_SET_EXTERNAL_RESULTS; //this config means that said method should be invoked FIRST 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator(args, { defaultTo, doInvertRuleResult, startFn, asValidator })
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