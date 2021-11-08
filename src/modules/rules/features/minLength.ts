import rc_ from '@/modules/rules/constants'
import _ from 'lodash'
import { makeRule, cHelpers, isAsyncFn, composeRuleFeedbackMessage } from '@/modules/rules/core'
import { minLength as minlength } from '@vuelidate/validators' //aliassed as minlength

/**
 * 
 * How should we indicate minLength acts as an executable rule? as opposed to a retrieval rule?   
 * Perhaps we should store the executioners on a separate object, like cExecs or such?
 * 
 * @param value Wrapper for the builtin vuelidate wrapper for the minLength validator.
 * We need this wrapper to be able to call the paraetrization in runtime based on a static configuration, without passing in a Fn function from the static configuration.
 * Since we do not want to morph entire rulessets we need this to give rules dynamical invocation behavior. 
 * @param vm 
 * @param params 
 */
export const minLength = async (vm: any, objContext: object) => {
    const { value, params, ...cfg } = objContext
    let comparisonValue = value;
    let minimum: number;
    let defaulted = true;
    let result
    let dummyValidator;
    let message = "";
    let preMessage: string;
    let partMessage: string;

    let sourceFieldName, targetFieldName, targetFieldLabel, metaType;
    let refName
    let probe

    try {
        //min = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
        minimum = Number(params?.min)
    }
    catch (e) {
        console.warn(e)
    }
    // if we did not receive a number straight away, we should have received a $model to retrieve it from or some other method to invoke...
    if (isNaN(minimum)) {
        sourceFieldName = params?.min?.$model //typeOf(min) === 'object' && min?.$model
        if (sourceFieldName && typeof sourceFieldName === 'string') {
            minimum = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
        }
        else {
            refName = params?.min?.ref
            if (refName && typeof refName === 'string') {
                probe = vm?.$refs?.[refName]?.value
                minimum = Number(probe)
            }
        }
    }
    if (!isNaN(minimum)) {
        try {
            //check if we have to run on another target instead of on the requesting field!!!
            targetFieldName = params?.targetField && params.targetField.name
            if (targetFieldName && typeof targetFieldName === 'string') {
                comparisonValue = vm?.v$?.[targetFieldName]?.$model ?? vm?.fieldValues?.value?.[targetFieldName]
            }

            // Note: here we are using the builtin vuelidate minLength -aliassed 'minlength' in the import- validator, without having to know it's implementation
            dummyValidator = minlength(minimum);
            result = dummyValidator?.$validator(comparisonValue); // Note: when comparisonValue is empty/undefined,{},[]  it will PASS / QUALIFY

            // Only if contrary to 'defaulted', compose the message.
            if (result !== defaulted) {
                preMessage = `(Rule '${rc_.V_MINLENGTH}')`
                //Only compose a hefty message if the execution was triggered indirectly
                if (typeof targetFieldName === 'string') {
                    targetFieldLabel = params?.targetField?.label ?? targetFieldName
                    if (cfg?.fieldCfg?.label && targetFieldName.toLowerCase() !== cfg.fieldCfg.label.toLowerCase()) {
                        metaType = cfg?.metaParams?.type ?? cfg?.metaParams?.params?.type
                        metaType = metaType ?? cfg?.metaParams?.params?.params?.type
                        preMessage = `(Field '${cfg.fieldCfg.label}' by rule '${metaType}' indirectly tested field '${targetFieldLabel}' with value '${comparisonValue}' against rule '${rc_.V_MINLENGTH}(${minimum})')`;
                    }
                }
                partMessage = dummyValidator?.$message?.({ $params: dummyValidator.$params }) ?? dummyValidator?.$message
                message = `${partMessage}. ${preMessage ?? ''}`;
            }
        }
        catch (e) {
            console.warn(e);
        }
    }
    // only output the message when failed
    // return result || { result, message }
    // Trivially use Promise.resolve, to support it being async, to test out the whole async rules chaining principle...
    return Promise.resolve(result || { result, message })
}

/**
 * Retrieves the rule result from a supposed previous run of a rule of type CV_TYPE_MIN_LENGTH on field objparams.fieldName or such
 * The passed in const { value, fieldName, params, ...cfg } = objContext is augmented to support rerunning of the rule.
 * For now we only retrieve info but we could opt to rerun rules. Note: if 1 call is async we should make the entire chain async.
 * @param vm 
 * @param objParams 
 * @returns 
 */
export const isMinLength = (vm, objContext: object) => {
    const { fieldName } = objContext
    let result, defaulted = true
    try {
        result = (vm?.v$?.[fieldName]?.[rc_.CV_TYPE_MIN_LENGTH]?.$response?.extraParams?.rule_result ?? defaulted)
    }
    catch (e) {
        console.warn(e);
        return defaulted;
    }
    return result;
}

// TEST to wrap a builtin vuelidate validator for dynamic parametrization
/**
 * Generates a wrapped minLength validator for vuelidate supporting dynamic parametrization.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
export const _minLength = (args) => {
    const defaultRuleResult = true;
    // const staticConfigProperty; // absent, we do support any static config property to set minlength statically to true / false. That would be incomprehensible.
    const doInvertRuleResult = false
    const asValidator = true; // !!!!!!!!!! Since this one is to replace the builtin vuelidate validator, it should act as a proper validator.
    const startFn = rc_.V_MINLENGTH; //this config means that said method should be invoked FIRSTLY, from allways, before probing for dependencies, 
    let resultFunction
    try {
        //resultFunction = makeRule(args, { defaultRuleResult, doInvertRuleResult, startFn, asValidator })
        resultFunction = makeRule(args)({ defaultRuleResult, doInvertRuleResult, startFn, asValidator })
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

export default {
    minLength,
    isMinLength,
    _minLength
}