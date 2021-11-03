
import rc_ from '@/modules/rules/constants'
import _ from 'lodash'
import { hofRuleFnGenerator, cHelpers } from '@/modules/rules/core'
import { between as inbetween } from '@vuelidate/validators'

export const between = (vm, objContext ) => {
    let defaulted = true; // ????????????????????? how would we know what to default to?
    let result
    let dummyValidator;
    let message: string
    let minimum: number;
    let maximum: number;
    let sourceFieldName
    let refName
    let probe
    // test if we have vm.fieldValues always or should we use params.formData ????
    //destructure the params into some crucial variables
    const { value , params, ...cfg } = objContext // contains the source field name, from where to grab the payload for the min argument.
    // check if we did receive numbers directly
    try{
        minimum = Number(params?.min)
        maximum = Number(params?.max)
    }
    catch(e){
        console.warn(e)
    }
    if ( isNaN(minimum) ){
        sourceFieldName = params?.min?.$model //typeOf(min) === 'object' && min?.$model
        if (sourceFieldName && typeof sourceFieldName === 'string'){
            minimum = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
        }
        refName = params?.min?.ref
        if (refName && typeof refName === 'string'){
            probe = vm?.$refs?.[refName]?.value
            minimum = Number(probe)
        }
    }
    // if we did not receive a number straight away, we could have received a $model to retrieve it from or a ref or TODO... some other method to invoke to get the numer param...
    if ( isNaN(maximum) ){
        sourceFieldName = params?.max?.$model //typeOf(min) === 'object' && min?.$model
        if (sourceFieldName && typeof sourceFieldName === 'string'){
            maximum = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
        }
        refName = params?.max?.ref
        if (refName && typeof refName === 'string'){
            probe = vm?.$refs?.[refName]?.value
            maximum = Number(probe)
        }
    }
    // if we have both parametrisations... invoke the vuelidate builtin between validator
    if ( !isNaN(minimum) && !isNaN(maximum) ){
        try { 
            // Note: here we are re-using the builtin vuelidate 'between' -aliassed in the import as inbetween- validator, without having to know exactly how it is implemented or how it generates it's message
            dummyValidator = inbetween(minimum,maximum); 
            result = dummyValidator?.$validator(value);
            message = dummyValidator?.$message?.({$params: dummyValidator.$params}) ?? dummyValidator?.$message
        }
        catch(e) {
            console.warn(e); 
        }
    }
    return { result, message } ;
}

/**
 * Generates a between validator for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
 export const _between = (args) => {
    const defaultRuleResult = true;
    // const staticConfigProperty; // absent, we do support any static config property to set minlength statically to true / false. That would be incomprehensible.
    const doInvertRuleResult = false
    const asValidator = true; // !!!!!!!!!! Since this one is to replace the builtin vuelidate validator, it should act as a proper validator, meaning it should flag errors etc.
    const startFn = rc_.V_BETWEEN; //this config means that said method should be invoked from allways, before probing for dependencies, 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult , doInvertRuleResult, startFn, asValidator } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

export default {
    between,
    _between
}