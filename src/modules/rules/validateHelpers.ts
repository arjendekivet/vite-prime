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
import { makeRule, wrapRule } from '@/modules/rules/core'
import { helpers, required, requiredIf, requiredUnless, email, minLength, maxLength, between, maxValue, minValue, alpha, alphaNum, numeric, integer, decimal, ipAddress, macAddress, url, sameAs } from '@vuelidate/validators'
import display from '@/modules/rules/features/displayIf'
import enabling from '@/modules/rules/features/disableIf'
import validity from '@/modules/rules/features/validity'
import empty_ from '@/modules/rules/features/empty'

// Test of v$ anders wordt ingepassed als het uit de eigen import komt of hier wordt gedefinieerd of via core wordt gemaakt?
import { setExternalResults, _setExternalResults } from '@/modules/rules/features/setExternalResults'
import inbetween from '@/modules/rules/features/between'
import minlength from '@/modules/rules/features/minLength'
import maxlength from '@/modules/rules/features/maxLength'
import requiredif from '@/modules/rules/features/requiredIf'

// re-export stuff from core
export * from './core';

// create a map to be able to dynamically refer to the rules we need, like builtin vuelidate validators and custom validators
export const mapRules = {
    // custom rules which are validator wrappers that substitute but re-use vuelidate builtins. 
    // These are rule-executioners for validation purposes, so they run when $validate() is called AND they show up in v$ as regular validator results in $errors, $silenterrors, etc
    [rc_.CV_TYPE_REQUIRED]: makeRule({ startFn: rc_.V_REQUIRED, asValidator: true }),
    [rc_.CV_TYPE_REQUIREDIF]: makeRule({ startFn: rc_.V_REQUIREDIF, asValidator: true }),//requiredif._requiredIf,
    [rc_.CV_TYPE_REQUIREDUNLESS]: makeRule({ startFn: rc_.V_REQUIREDUNLESS, asValidator: true }),
    [rc_.CV_TYPE_MIN_LENGTH]: makeRule({ startFn: rc_.V_MINLENGTH, asValidator: true }),//minlength._minLength,
    [rc_.CV_TYPE_MAX_LENGTH]: makeRule({ startFn: rc_.V_MAXLENGTH, asValidator: true }),//maxlength._maxLength,
    [rc_.CV_TYPE_BETWEEN]: makeRule({ startFn: rc_.V_BETWEEN, asValidator: true }),//inbetween._between,
    [rc_.CV_TYPE_MIN_VALUE]: makeRule({ startFn: rc_.V_MINVALUE, asValidator: true }),
    [rc_.CV_TYPE_MAX_VALUE]: makeRule({ startFn: rc_.V_MAXVALUE, asValidator: true }),
    [rc_.CV_TYPE_ALPHA]: makeRule({ startFn: rc_.V_ALPHA, asValidator: true }),
    [rc_.CV_TYPE_EMAIL]: makeRule({ startFn: rc_.V_EMAIL, asValidator: true }),

    // custom cynapps validators which will use wrappers for rule-executioners for NON-validation purposes, like "display", and "disable". So these do not register in $errors etc.
    [rc_.CV_TYPE_DISABLE_IF]: makeRule({ startFn: rc_.V_DISABLEIF, staticCfg: rc_.CFG_DISABLE, invert: rc_.CFG_DISABLE_INVERT, defaultTo: false }), //enabling.disableIf, //TODO: declare via makeRule
    [rc_.CV_TYPE_DISPLAY_IF]: makeRule({ startFn: rc_.V_DISPLAYIF, staticCfg: rc_.CFG_DISPLAY, invert: rc_.CFG_DISPLAY_INVERT, defaultTo: true /* defaultTo is redundant */ }),
    [rc_.CV_TYPE_SET_EXTERNAL_RESULTS]: _setExternalResults, //TODO: declare via makeRule ??????????????
}

/**
 * Note: we should first populate cHelpers with 
 * 1) all the wrapped validators & 
 * 2) custom executors and 
 * 3) all the base (= SINGLE CONNOTATED) RETRIEVER Helpers: like so: 
 * cHelpers[rc_.IS_DISABLED]=makeHelper({ruleType: rc_.CV_TYPE_DISABLE_IF, arity: rc_.SINGLE, })
 * 
 * 4) some odd importedhelpers.
 * 
 * Then we could/should augment cHelpers using the base RETRIEVER helpers like so:
 * 
 * cHelpers[rc_.SOME_HIDDEN] = makeHelper({singleHelperFn: cHelpers[rc_.IS_VISIBLE], etc etc })
 * Note: maybe because of passing in the correct refrence to v$ we want to do this in validate.ts instead of over here?
 * So augment cHelpers on the fly in validate calling a series of 
 * cHelpers[rc_.SOME_HIDDEN] = makeHelper({singleHelperFn: cHelpers[rc_.IS_VISIBLE], N: rc_.SOME, sign: rc_.NEG }) for each necessary helper
 * cHelpers[rc_.ALL_HIDDEN] = makeHelper({singleHelperFn: cHelpers[rc_.IS_VISIBLE], N: rc_.ALL, sign: rc_.NEG })
 */
export const cHelpers = {
    // EXECUTIONERS. These re-use vuelidate builtin validators, like MaxValue, minValue, etc.
    [rc_.V_MAXVALUE]: wrapRule({ validator: maxValue, type: rc_.CV_TYPE_MAX_VALUE, param: "max" }),
    [rc_.V_MINVALUE]: wrapRule({ validator: minValue, type: rc_.CV_TYPE_MIN_VALUE, param: "min" }),
    [rc_.V_MINLENGTH]: wrapRule({ validator: minLength, type: rc_.CV_TYPE_MIN_LENGTH, param: "min" }),
    [rc_.V_MAXLENGTH]: wrapRule({ validator: maxLength, type: rc_.CV_TYPE_MAX_LENGTH, param: "max" }),
    [rc_.V_BETWEEN]: inbetween.between, //todo via wrapRule, but this one has TWO parameters....
    [rc_.V_REQUIRED]: wrapRule({ validator: required, type: rc_.CV_TYPE_REQUIRED }),
    [rc_.V_REQUIREDIF]: wrapRule({ validator: requiredIf, type: rc_.CV_TYPE_REQUIREDIF, param: "prop" }),
    [rc_.V_REQUIREDUNLESS]: wrapRule({ validator: requiredUnless, type: rc_.CV_TYPE_REQUIREDUNLESS, param: "prop" }),
    [rc_.V_ALPHA]: wrapRule({ validator: alpha, type: rc_.CV_TYPE_ALPHA }),
    [rc_.V_EMAIL]: wrapRule({ validator: email, type: rc_.CV_TYPE_EMAIL }),

    // EXECUTIONERS. Custom! 
    // about display/show/hide
    [rc_.V_DISPLAYIF]: display.displayIf, //todo via wrapRule ?????? But we need the actual/proper rule executioner, so that cannot be generalized.  and it is ok to import them from their own module!!!
    // about external api call
    [rc_.V_SET_EXTERNAL_RESULTS]: setExternalResults, //todo via wrapRule ?????? But this is so exotic/custom it cannot be generalized and it is ok to import them from their own module!!!
    // about disable/enable
    [rc_.V_DISABLEIF]: enabling.disableIf, //todo via wrapRule ?????? But this is so exotic it cannot be generalized  and it is ok to import them from their own module!!!

    // RETRIEVERS, these read results of the associated executioners.
    [rc_.IS_MIN_LENGTH]: minlength.isMinLength, //a retriever
    [rc_.IS_MAX_LENGTH]: maxlength.isMaxLength, //a retriever
    // RETRIEVERS of custom executioners about 'show/hide', non-validation
    //[rc_.IS_VISIBLE]: display.isVisible,  //toevoegen in validate.ts ... eenmalig via setRules for now ...
    //[rc_.SOME_VISIBLE]: display.someVisible, //toevoegen in validate.ts ... eenmalig via setRules for now ...TODO: move it to core or so or validateHelpers, because vm will be passed in correctly runtime???
    //[rc_.ALL_VISIBLE]: display.allVisible, ////toevoegen in validate.ts ... eenmalig via setRules for now ...TODO: move it to core or so or validateHelpers, because vm will be passed in correctly runtime???
    //[rc_.IS_HIDDEN]: display.isHidden,
    //[rc_.SOME_HIDDEN]: display.someHidden,
    //[rc_.ALL_HIDDEN]: display.allHidden,
    // custom, about 'enabling/disabling', non-validation
    [rc_.IS_ENABLED]: enabling.isEnabled,
    [rc_.SOME_ENABLED]: enabling.someEnabled,
    [rc_.ALL_ENABLED]: enabling.allEnabled,
    // [rc_.IS_DISABLED]: enabling.isDisabled, //toevoegen in validate.ts ... eenmalig via setRules for now ...
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
    // about requiredIf
    [rc_.IS_REQUIRED_IF]: requiredif.isRequiredIf,
    [rc_.NOT_REQUIRED_IF]: requiredif.notRequiredIf,
    // TODO: two odd helpers ...
    [rc_.GET_INVALID_MESSAGE]: validity.getInvalidMessage,
    [rc_.GET_DISABLED_MESSAGE]: enabling.getDisabledMessage,
}


function createRulesHelpers(p_v$) {
    //before we generate rules which will invoke helpers, augment the cvh.cHelpers
    //test! 
    try {
        debugger
        let ns = cvh.cHelpers
        //do this only once
        if (!ns.didCreateHelpers) {
            ns[rc_.IS_DISABLED] = makeHelper({ ruleType: rc_.CV_TYPE_DISABLE_IF, defaultTo: false, sign: rc_.NEG, p_vm: { v$: p_v$ } })

            // make the sextet of visibility helpers
            // 1. First create the baseFn
            ns[rc_.IS_VISIBLE] = makeHelper({ ruleType: rc_.CV_TYPE_DISPLAY_IF, p_vm: { v$: p_v$ } }) //baseFn
            // 2. then create the 5 derived helpers, passing in the baseFn ...
            ns[rc_.SOME_VISIBLE] = makeHelper({ baseFn: ns[rc_.IS_VISIBLE], sign: rc_.POS, N: rc_.SOME })
            ns[rc_.ALL_VISIBLE] = makeHelper({ baseFn: ns[rc_.IS_VISIBLE], sign: rc_.POS, N: rc_.ALL }) //relate: { sign: rc_.POS, defaultTo: true }, p_vm: { v$: p_v$ } 
            ns[rc_.IS_HIDDEN] = makeHelper({ baseFn: ns[rc_.IS_VISIBLE], sign: rc_.NEG, N: rc_.SINGLE })
            ns[rc_.SOME_HIDDEN] = makeHelper({ baseFn: ns[rc_.IS_VISIBLE], sign: rc_.NEG, N: rc_.SOME })
            ns[rc_.ALL_HIDDEN] = makeHelper({ baseFn: ns[rc_.IS_VISIBLE], sign: rc_.NEG, N: rc_.ALL }) //relate: { sign: rc_.POS, defaultTo: true }, p_vm: { v$: p_v$ } 

            ns.didCreateHelpers = true
        }
    } catch (e) {
        debugger
    }
}

export default { mapRules, cHelpers };