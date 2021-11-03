import rc_ from '@/modules/rules/constants'
import _ from 'lodash'
import { hofRuleFnGenerator, cHelpers } from '@/modules/rules/core'
import { maxLength as maxlength } from '@vuelidate/validators' //aliassed as maxlength

/**
 * Retrieves the rule result from a supposed previous run of a rule of type CV_TYPE_MAX_LENGTH on field objparams.fieldName or such
 * The passed in const { value, fieldName, params, ...cfg } = objContext is augmented to support rerunning of the rule.
 * For now we only retrieve info but we could opt to rerun rules. Note: if 1 call is async we should make the entire chain async.
 * @param vm 
 * @param objParams 
 * @returns 
 */
 export const maxLength = async (vm, objContext ) => {
    // test if we have vm.fieldValues always or should we use params.formData ????
    //destructure the params into some crucial variables
    const { value , params, ...cfg } = objContext // contains the source field name, from where to grab the payload for the max argumen
    let comparisonValue = value;
    let maximum: number;
    let defaulted = true; // ????????????????????? how would we know what to default to?
    let result
    let dummyValidator;
    let message="";
    let preMessage: string;
    let partMessage: string;
    
    let sourceFieldName, targetFieldName, targetFieldLabel, metaType;
    let refName
    let probe
    
    try{
        maximum = Number(params?.max)
    }
    catch(e){
        console.warn(e)
    }
    // if we did not receive a number straight away, we should have received a $model to retrieve it from or some other method to invoke...
    if ( isNaN(maximum) ){
        sourceFieldName = params?.max?.$model
        if (sourceFieldName && typeof sourceFieldName === 'string'){
            maximum = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
        }
        else { 
            refName = params?.max?.ref
            if (refName && typeof refName === 'string'){
                probe = vm?.$refs?.[refName]?.value
                maximum = Number(probe)
            }
        }
    }
    if ( !isNaN(maximum)){
        try { 
            //check if we have to run on another target instead of on the requesting field!!!
            targetFieldName = params?.targetField && params.targetField.name
            if (targetFieldName && typeof targetFieldName === 'string'){
                comparisonValue = vm?.v$?.[targetFieldName]?.$model ?? vm?.fieldValues?.value?.[targetFieldName]
            }
            // Note: here we are re-using the builtin vuelidate maxLength validator -aliassed as maxlength- without having to know exactly how it is implemented or generates it's message
            dummyValidator = maxlength(maximum); 
            result = dummyValidator?.$validator(comparisonValue);
            
            // Only if failed, compose the message.
            if (!result){ 
                preMessage = `(Rule '${rc_.V_MAXLENGTH}')`
                //Only compose a full fledged message if the execution was triggered indirectly
                //TODO; translate i18n ...
                if (typeof targetFieldName === 'string'){
                    targetFieldLabel = params?.targetField?.label ?? targetFieldName
                    if (cfg?.fieldCfg?.label && targetFieldName.toLowerCase() !== cfg.fieldCfg.label.toLowerCase() ){
                        metaType = cfg?.metaParams?.type ?? cfg?.metaParams?.params?.type
                        metaType = metaType ?? cfg?.metaParams?.params?.params?.type
                        preMessage = `(Field '${cfg.fieldCfg.label}' by rule '${metaType}' indirectly 'tested' field '${targetFieldLabel}' with value ${comparisonValue} in rule '${rc_.V_MAXLENGTH}(${maximum})')`;
                    }
                }
                partMessage = dummyValidator?.$message?.({$params: dummyValidator.$params}) ?? dummyValidator?.$message
                message = `${partMessage}. ${preMessage??''}`;
            }
        }
        catch(e) {
            console.warn(e); 
        }
    }
    // return result || { result, message } ; // only output the message when failed
    return Promise.resolve(result || { result, message }) 
}

/**
 * Receives //const { value, fieldName, params, ...cfg } = objContext
 * @param vm 
 * @param objContext 
 * @returns 
 */
export const isMaxLength = (vm, objContext: object) => {
    const { fieldName } = objContext
    let result, defaulted = true
    try { 
        result = (vm?.v$?.[fieldName]?.[CV_TYPE_MAX_LENGTH]?.$response?.extraParams?.rule_result ?? defaulted)
    }
    catch(e) {
        console.warn(e); 
        return defaulted;
    }
    return result;
}

/**
 * Generates a maxLength validator wrapper for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
 export const _maxLength = (args) => {
    const defaultRuleResult = true;
    // const staticConfigProperty; // absent, we do support any static config property to set minlength statically to true / false. That would be incomprehensible.
    const doInvertRuleResult = false
    const asValidator = true; // !!!!!!!!!! Since this one is to replace the builtin vuelidate validator, it should act as a proper validator.
    const startFn = rc_.V_MAXLENGTH; //this config means that said method should be invoked from allways, before probing for dependencies, 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult , doInvertRuleResult, startFn, asValidator } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

export default {
    maxLength,
    isMaxLength,
    _maxLength
}
