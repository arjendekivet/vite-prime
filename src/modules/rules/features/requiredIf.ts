import _ from 'lodash'
import rc_ from '@/modules/rules/constants'
import { makeRule, cHelpers, isAsyncFn, composeRuleFeedbackMessage, wrapRule } from '@/modules/rules/core'
import { requiredIf as requiredif } from '@vuelidate/validators' // aliassed to requiredif

// executioner...
export const requiredIfBak = wrapRule({ param: "prop", type: rc_.V_REQUIREDIF, validator: requiredif });

export const requiredIfBakkerOhe = async (pvm: any, objContext: object) => {
    debugger
    const { value, params, p_v$, ...cfg } = objContext

    //now prepare the namespace for the code below to reference vm.v$.<paths> !!!
    const vm = pvm?.v$ ? pvm : { v$: p_v$ }

    debugger;
    try {
        let comparisonValue = value;
        let condition; // this param should contain the 'prop' argument for the requiredIf invocation
        let isAsync = false;
        let defaulted = true;
        let result = defaulted //preset result for if the prop / condition cannot be retrieved ... The ftarget ield will NOT be required then
        let dummyValidator;
        let message = "";
        let preMessage: string;
        let partMessage: string;

        let sourceFieldName, targetFieldName, targetFieldLabel, metaType;
        let refName
        let probe

        // TODO: parse prop. Is it a config for a function. Does that funciton have params? How?
        // Does it config to get a $model etc etc?
        condition = params?.prop

        if (params?.prop && typeof params.prop !== 'object') {
            // assume we received a striaght value
            condition = params?.prop
        }
        else if (params?.prop?.$model) {
            sourceFieldName = params.prop.$model
            if (sourceFieldName && typeof sourceFieldName === 'string') {
                condition = vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName]
            }
        }
        else if (params?.prop?.ref) {
            refName = params.prop.ref
            if (refName && typeof refName === 'string') {
                condition = vm?.$refs?.[refName]?.value
            }
        }
        else if (params?.prop?.fn) {
            // is it a fn Name get the reference from either the executors or the retrievers?
            fn = params?.prop?.fn
            if (fn && typeof fn === 'string') {
                condition = cHelpers?.[fn]
            }
            else if (typeof fn === 'function') {
                condition = fn
                isAsync = isAsyncFn(fn)
            }
        }

        // if prop is not set, the function will return false and we can short circuit???

        if (condition !== undefined) {
            try {
                //check if we have to run on another target instead of on the requesting field!!!
                targetFieldName = params?.targetField && params.targetField.name
                if (targetFieldName && typeof targetFieldName === 'string') {
                    comparisonValue = vm?.v$?.[targetFieldName]?.$model ?? vm?.fieldValues?.value?.[targetFieldName]
                }
                // Note: here we are using the builtin vuelidate requiredIf -aliassed 'requiredif' in the import- validator, without having to know it's implementation
                if (isAsync) {
                    // configure the validator
                    dummyValidator = helpers.withAsync(requiredif(condition))
                    // run the validator against the comparisonvalue
                    result = await dummyValidator?.$validator(comparisonValue);
                }
                else {
                    // configure the validator
                    dummyValidator = requiredif(condition);
                    // run the validator against the comparisonvalue
                    result = dummyValidator?.$validator(comparisonValue);
                }

                // Only when failing compose the message?
                // if opposite to the norm result (defaulted) we should compose the message
                if (result !== defaulted) {
                    debugger;
                    let cfgMessage = { dummyValidator, targetFieldName, params, cfg, comparisonValue, ruleType: rc_.V_REQUIREDIF, argInput: [condition] };
                    let message = composeRuleFeedbackMessage(cfgMessage)

                    // preMessage = `(Rule '${rc_.V_REQUIREDIF}')`
                    // //Only compose a hefty message if the execution was triggered indirectly
                    // if (typeof targetFieldName === 'string'){
                    //     targetFieldLabel = params?.targetField?.label ?? targetFieldName
                    //     if (cfg?.fieldCfg?.label && targetFieldName.toLowerCase() !== cfg.fieldCfg.label.toLowerCase() ){
                    //         metaType = cfg?.metaParams?.type ?? cfg?.metaParams?.params?.type
                    //         metaType = metaType ?? cfg?.metaParams?.params?.params?.type
                    //         preMessage = `(Field '${cfg.fieldCfg.label}' by rule '${metaType}' indirectly tested field '${targetFieldLabel}' 
                    //         with value '${comparisonValue}' against rule '${rc_.V_REQUIREDIF}(${condition})')`;
                    //     }
                    // }
                    // if (dummyValidator?.$message && typeof(dummyValidator.$message) === 'function' ){
                    //     partMessage = dummyValidator.$message({$params: dummyValidator.$params}) 
                    // } 
                    // else { partMessage = dummyValidator.$message }
                    // message = `${partMessage}. ${preMessage??''}`;
                }
            }
            catch (e) {
                console.warn(e);
            }
        }
    }
    catch (e) {
        console.warn(e);
        debugger;
    }
    // only output the message when failed
    // return result || { result, message }
    // Trivially use Promise.resolve, to support it being async, to test out the whole async rules chaining principle...
    return Promise.resolve(result || { result, message })
}

//TODO: make extra helpers for some/all/none for the positive & negative directions.

/**
 * Checks if for a field the -builtin- requiredIf validator resulted true.
 * Note: this is only a retriever of a rule result, it does not calculate or execute a rule itself.
 * This result will only indeed exist IF for that field the builtIn requiredIf rule existed AND was called & registered, before this retrieval helper method is called. 
 * @param vm 
 * @param fieldName 
 * @returns 
 */
export const isRequiredIf = (vm, objContext) => {
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

export const notRequiredIf = (vm, objContext) => {
    let result, defaulted = true;
    try {
        result = !cHelpers.isRequiredIf(vm, objContext)
    }
    catch (e) {
        console.warn(e);
        result = defaulted;
    }
    return result
}

/**
 * Generates a required validator for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
export const _requiredIf = (args) => {
    const defaultTo = true;
    // const staticConfigProperty; // absent, we do support any static config property to set this.
    const doInvertRuleResult = false
    const asValidator = true; // !!!!!!!!!! Since this one is to wrap/replace the builtin vuelidate validator, it should act as a proper validator, meaning it should flag errors etc.
    const startFn = rc_.V_REQUIREDIF; //this config means that said method should be invoked first / allways, id est, before probing for dependencies.
    let resultFunction
    try {
        resultFunction = makeRule(args, { defaultTo, doInvertRuleResult, startFn, asValidator })
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

export default {
    //requiredIf, // the executioner
    requiredIfBakkerOhe,
    isRequiredIf, //helper
    notRequiredIf, //helper
    _requiredIf //hof to generate the wrapper to invoke our custom requiredIf
}