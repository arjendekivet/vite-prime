/**
 * Logica: 
* Qua <Feature> "Validity, Visibility, Mode (Read/ReadOnly/Edit), Calculation/Computation/value" 
(hoe het dan ook gaat heten qua config property en qua html attribute vue component property: display/hidden/show/hide/visible/invisible ) 

* 1. Als een entity configuratie een eigen statische <Feature> config property heeft, is die leading. Die MAG NIET worden overruled. Einde evaluatie.
* 2. Als het veld dat niet heeft, maar wel een "dependency in een rule" heeft, dan bepaalt die dependency rule het resultaat van die feature.
*      Bijvoorbeeld: veld heeft "dependsOn" of upstream heeft "dependents" die op dit veld slaat.
*      Vraagstuk: Moet de genoemde dependent field daadwerkelijk een relevante visibility validator hebben, of gaat dit buiten de verantwoordelijkheid van dit veld om? 
*      In de zin van: geen rule is ook een rule. Geen rule om visibility te negeren betekent toestemming voor visibility. etc.
* 
//TODO: wrapp many of the builtin vuelidate validators in order to be able to OPTIONALLY dynamically parameterize them using $model or refs
{ type: cvh.CV_MIN_LENGTH,  params: { min: 10 } } should work (ofcourse)
{ type: cvh.CV_MIN_LENGTH,  params: { $model: "setting0" } } should work picking up the reactive value of some field "setting0"
{ type: cvh.CV_MIN_LENGTH,  params: { ref: "setting0" } } should also work picking up the ref value of some ref "setting0"

TODO: if we pass in ref instead of $model, we should be able to search all vm.$refs to get to the correct ref and use it's value. For example see the cHelpers.minleghth implementation

TODO: we should also be able to EXECUTE rules via special helper rules, instead of merely retrieving results form previous $validate() calls. 
Perhaps even run rules against dynamical TARGETS.
 If we configure a rule to be executed, with the source coming from ($model or ref) but the target being another field, 
 then that would mean that the comparison value to pass into the rules should not be the currently passed in runtime value, but the value from the target model.
// $model inidicates the source where to retrieve expected "min" argument payload from. 
// if we do NOT mention an additionally a non-empty "target", the MIN_LENGTH validator rule will be executed comparing the value of actual field which is calling. 
// If a non-empty target is specified, the 'validator' will be run against the value of that field! 
// So we could run a rule in field description that runs an on the fly a rule
// against field C (target" "C") for a minLength comparison based on the length of the value of field "setting0". 
 This will work, because we re-use the builtin-validators or our own validators, which accept dynamic parametrizations and thus can be reused on the fly, 
 as long as they are callable and not associated to fields.
*/ 

import _ from 'lodash'
import rc_ from '@/modules/rules/constants'
//import { isAsyncFn, isCustomValidatorType, hofRuleFnGenerator, probeCustomRuleFn, probeCustomRuleFnRecursor } from '@/modules/rules/core' 
import '@/modules/rules/core' 
import { helpers, required, requiredIf, requiredUnless, email, minLength, maxLength, between, maxValue, minValue, and } from '@vuelidate/validators'
import display from '@/modules/rules/features/displayIf' 
import enabling from '@/modules/rules/features/disableIf' 
import validity from '@/modules/rules/features/validity' 
import empty_ from '@/modules/rules/features/empty' 
import { setExternalResults, _setExternalResults } from '@/modules/rules/features/setExternalResults' 
import inbetween from '@/modules/rules/features/between' 
import minlength from '@/modules/rules/features/minLength' 
import maxlength from '@/modules/rules/features/maxLength' 
import requiredif from '@/modules/rules/features/requiredIf' 

// re-export stuff from core
export * from './core';

export const cHelpers = {
    // wrapped vuelidate minLength
    [rc_.V_MINLENGTH]: minlength.minLength, //executioner
    [rc_.IS_MIN_LENGTH]: minlength.isMinLength, //a retriever
    // wrapped vuelidate maxLength
    [rc_.V_MAXLENGTH]: maxlength.maxLength, //executioner
    [rc_.IS_MAX_LENGTH]: maxlength.isMaxLength, //a retriever
    [rc_.V_BETWEEN]: inbetween.between,
    // custom, about 'show/hide', non-validation
    [rc_.IS_VISIBLE]: display.isVisible,
    [rc_.SOME_VISIBLE]: display.someVisible,
    [rc_.ALL_VISIBLE]: display.allVisible,
    [rc_.IS_HIDDEN]: display.isHidden,
    [rc_.SOME_HIDDEN]: display.someHidden,
    [rc_.ALL_HIDDEN]: display.allHidden,
    // custom, about 'enabling/disabling', non-validation
    [rc_.IS_ENABLED]: enabling.isEnabled,
    [rc_.SOME_ENABLED]: enabling.someEnabled,
    [rc_.ALL_ENABLED]: enabling.allEnabled,
    [rc_.IS_DISABLED]: enabling.isDisabled,
    [rc_.SOME_DISABLED]: enabling.someDisabled,
    [rc_.ALL_DISABLED]: enabling.allDisabled,
    // about 'eager' validity
    [rc_.IS_VALID]: validity.isValidSilent,
    [rc_.SOME_VALID]: validity.someValidSilent,
    [rc_.ALL_VALID]: validity.allValidSilent,
    [rc_.IS_INVALID]: validity.isInvalidSilent,
    [rc_.SOME_INVALID]: validity.someInvalidSilent,
    [rc_.ALL_INVALID]: validity.allInvalidSilent,
    // about 'lazy' validity
    [rc_.IS_VALID_LAZY]: validity.isValid,
    [rc_.SOME_VALID_LAZY]: validity.someValid,
    [rc_.ALL_VALID_LAZY]: validity.allValid,
    [rc_.IS_INVALID_LAZY]: validity.isInvalid,
    [rc_.SOME_INVALID_LAZY]: validity.someInvalid,
    [rc_.ALL_INVALID_LAZY]: validity.allInvalid,
    // about 'empty'
    [rc_.IS_EMPTY]: empty_.isEmpty,
    [rc_.SOME_EMPTY]: empty_.someEmpty,
    [rc_.ALL_EMPTY]: empty_.allEmpty,
    [rc_.NOT_EMPTY]: empty_.notEmpty,
    [rc_.SOME_NOT_EMPTY]: empty_.someNotEmpty,
    [rc_.NONE_EMPTY]: empty_.noneEmpty,
    // about external api calls
    [rc_.V_SET_EXTERNAL_RESULTS]: setExternalResults,
    // about requiredIf
    [rc_.V_REQUIREDIF]: requiredif.requiredIf,
    [rc_.IS_REQUIRED_IF]: requiredif.isRequiredIf,
    [rc_.NOT_REQUIRED_IF]: requiredif.isRequiredIf,
    // TODO: two odd helpers ...
    [rc_.GET_INVALID_MESSAGE]: validity.getInvalidMessage,
    [rc_.GET_DISABLED_MESSAGE]: enabling.getDisabledMessage,
}

// create a map to be able to dynamically refer to the vuelidate validators
export const mapValidators = {
    // builtin vuelidate validators...
    required,
    requiredUnless,
    email,
    minValue,
    maxValue, 
    // custom cynapps validators which are wrappers for rule-executioners for NON-validation purposes, like "display", and "disable". So these do not register in $errors etc.
    [rc_.CV_TYPE_DISABLE_IF]: enabling.disableIf,
    [rc_.CV_TYPE_DISPLAY_IF]: display.displayIf,
    [rc_.CV_TYPE_SET_EXTERNAL_RESULTS]: _setExternalResults,
    // custom cynapps validators which are wrappers that substitute but re-use vuelidate builtins. 
    // These are rule-executioners for validation purposes, so they run when $validate() is called AND they show up in v$ as regular validator results in $errors, $silenterrors, etc
    [rc_.CV_TYPE_MIN_LENGTH]: minlength._minLength,
    [rc_.CV_TYPE_MAX_LENGTH]: maxlength._maxLength,
    [rc_.CV_TYPE_BETWEEN]: inbetween._between,
    [rc_.CV_TYPE_REQUIREDIF]: requiredif._requiredIf,
    //['__cv__fetchedResultContainsPipo']: _fetchedResultContainsPipo,
    //[rc_.CV_TYPE_SET_EXTERNAL_RESULTS_BAK]: _setExternalResultsBak,
}
export default { mapValidators, cHelpers };