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
 This will work, because we re-use the builtin-validators or our won validators, which accept dynamic parametrizations and thus can be reused on the fly, 
 as long as they are callable and not associated to fields.
*/ 
// TODO: if all methods used can come from Array instead of Lodash, drop Lodash dependency
// like myArray =[] myArray.every instead of _.every( myArray, <bla>) etc 

import _ from 'lodash'
// import { helpers } from '@vuelidate/validators'
import { helpers, required, requiredIf, requiredUnless, email, minLength, maxLength, between, maxValue , and } from '@vuelidate/validators'

debugger;

export const RULE_GENERATOR = "RULE_GENERATOR";
export const VISIBILITY = 'displayIf';
export const SILENTVALIDITY = '$silentErrors'
export const V_SILENTERRORS = '$silentErrors'
export const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...
export const V_DISPLAYIF = 'displayIf'; ////sort of legacy, for rules that bring fn:Function() from the JSON, which we do not support ideally
export const V_DISABLEIF = 'disableIf'; //sort of legacy, for rules that bring fn:Function() from the JSON, which we do not support ideally

export const V_MINLENGTH = 'minLength'; //now it holds the name of the method to invoke on cHelpers for wrapped builtin vuelidate validators ...
export const V_MAXLENGTH = 'maxLength';
export const V_BETWEEN = 'between';

// Introduce constants for the validator names/types in order NOT to clash with built-in and other imported working vuelidate validators
export const V_CUSTOM_PREFIX = '__cv__';
export const CV_TYPE_DISABLE_IF = `${V_CUSTOM_PREFIX}${V_DISABLEIF}`;
export const CV_TYPE_DISPLAY_IF = `${V_CUSTOM_PREFIX}${V_DISPLAYIF}`;
export const CV_TYPE_MIN_LENGTH = `${V_CUSTOM_PREFIX}${V_MINLENGTH}`;
export const CV_TYPE_MAX_LENGTH = `${V_CUSTOM_PREFIX}${V_MAXLENGTH}`;
export const CV_TYPE_BETWEEN = `${V_CUSTOM_PREFIX}${V_BETWEEN}`;

export const AND = "and";
export const OR = "or";
export const NOT = "not";

export const CFG_PROP_ENTITY_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
export const CFG_PROP_ENTITY_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

export const CFG_PROP_ENTITY_DISABLE = 'disabled'; // indicates in fieldCfg the optional property 'disabled' decides the field disabling
export const CFG_PROP_ENTITY_DISABLE_INVERT = false; // indicates a disable rule will NOT ave to negate the config prop

// terms to be used in the Configuration of validators (in the form definitions / fields definition) pointing to the supported retriever functions
export const IS_VALID = "isValidSilent"
export const SOME_VALID = "someValidSilent"
export const ALL_VALID = "allValidSilent";

export const IS_INVALID = "isInvalidSilent"
export const SOME_INVALID = "someInvalidSilent";
export const ALL_INVALID = "allInvalidSilent";

export const IS_VALID_LAZY = "isValid"
export const SOME_VALID_LAZY = "someValid"
export const ALL_VALID_LAZY = "allValid";

export const IS_INVALID_LAZY = "isInvalid"
export const SOME_INVALID_LAZY = "someInvalid";
export const ALL_INVALID_LAZY = "allInvalid";

export const IS_VISIBLE = "isVisible";
export const SOME_VISIBLE = "someVisible";
export const ALL_VISIBLE = "allVisible";

export const IS_HIDDEN = "isHidden";
export const SOME_HIDDEN = "someHidden";
export const ALL_HIDDEN = "allHidden";

export const IS_DISABLED = "isDisabled";
export const SOME_DISABLED = "someDisabled";
export const ALL_DISABLED = "allDisabled";

export const IS_ENABLED = "isEnabled";
export const SOME_ENABLED = "someEnabled";
export const ALL_ENABLED = "allEnabled";

// note: "empty" rules depend on the $model of the specified field. This assumes the two-way binding AND a dummy rule for a field when NO built in validator was specified at all. 
// We already use two of such dummy rules, namely for visibility and for enabling for each field, so $model should be present for each field.
export const IS_EMPTY = "isEmpty";
export const SOME_EMPTY = "someEmpty";
export const ALL_EMPTY = "allEmpty";

export const NOT_EMPTY = "notEmpty";
export const SOME_NOT_EMPTY = "someNotEmpty";
export const NONE_EMPTY = "noneEmpty";

// EXPERIMENT: helpers to retrieve the rule results of the built-in vuelidate requiredIf validator
export const IS_REQUIRED_IF = "isRequiredIf"
export const NOT_REQUIRED_IF = "notRequiredIf"

// TODO EXPERIMENT: helpers to retrieve the rule results of the built-in vuelidate minLength validator
export const IS_MIN_LENGTH = "isMinLength";

const SUPPORTED_RETRIEVERS = [
    IS_VISIBLE, SOME_VISIBLE, ALL_VISIBLE, 
    IS_VALID, SOME_VALID, ALL_VALID, 
    IS_INVALID, SOME_INVALID, ALL_INVALID, 
    IS_DISABLED, SOME_DISABLED, ALL_DISABLED, 
    IS_HIDDEN, SOME_HIDDEN, ALL_HIDDEN ,
    IS_EMPTY, SOME_EMPTY, ALL_EMPTY,
    NOT_EMPTY, SOME_NOT_EMPTY, NONE_EMPTY,
    // these search for the results for builtin vuelidate validators!!!! They do not -yet- rerun proper validators thmeselves.
    IS_REQUIRED_IF, NOT_REQUIRED_IF,
    IS_MIN_LENGTH, 
    V_MINLENGTH,
    V_MAXLENGTH,
    V_BETWEEN,
]
/**
 * define helper functions like isValid, isVisible, isDisabled, that take a fieldname and return a boolean if the retrieved info qualifies.
 * // TODO: if these helpers all work robustly, rewrite them to the shortest possible format? Voorbeeld
 * isEnabled: (vm, fieldName: string) => {
        let result, defaulted = true;
        try {
            result = !cHelpers.isDisabled(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    * kunnen we -wat- korter schrijven als:
    isEnabled: (vm, fieldName: string) => {
        try {
            return !cHelpers.isDisabled(vm,fieldName)
        }
        catch(e) { 
            return true 
        }
    },
 */
export const cHelpers = {
    /**
     * 
     * TODO: ???either import all vuelidate validators or get them from a dummy field that is populated with all the supported helpers ...
     * 
     * @param value Wrapper for the builtin vuelidate wrapper for the minLength validator.
     * We need this wrapper to be able to call the paraetrization in runtime based on a static configuration, without passing in function form the static configuration.
     * Since we do not want to morph entire rulessets we need this to give rules dynamical invocation behavior. 
     * @param vm 
     * @param params 
     */
    minLength: (vm, objContext ) => {
        debugger
        let defaulted = true; // ????????????????????? how would we know what to default to?
        let result
        let dummyValidator;
        let message: string
        let minimum: number;
        let sourceFieldName
        let refName
        let probe
        // test if we have vm.fieldValues always or should we use params.formData ????
        //destructure the params into some crucial variables
        const { value , params, ...cfg } = objContext // contains the source field name, from where to grab the payload for the min argument.
        
        try{
            //min = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
            minimum = Number(params?.min)
        }
        catch(e){
            console.warn(e)
        }
        // if we did not receive a number straight away, we should have received a $model to retrieve it from or some other method to invoke...
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
        if ( !isNaN(minimum)){
            try { 
                // Note: here we are re-using the builtin vuelidate minLength validator, without having to know exactly how it is implemented or generates it's message
                dummyValidator = minLength(minimum); 
                result = dummyValidator?.$validator(value);
                //message = typeOf(dummyValidator?.$message) === "function" ? dummyValidator?.$message(dummyValidator.$params) : dummyValidator?.$message
                message = dummyValidator?.$message?.({$params: dummyValidator.$params}) ?? dummyValidator?.$message
            }
            catch(e) {
                console.warn(e); 
            }
        }
        return { result, message } ;
    },
    /**
     * Retrieves the rule result from a supposed previous run of a rule of type CV_TYPE_MIN_LENGTH on field objparams.fieldName or such
     * @param vm 
     * @param objParams 
     * @returns 
     */
    isMinLength: (vm, objContext: object) => {
        const { value, fieldName, params, ...cfg } = objContext
        let result, defaulted = true
        try { 
            if (!fieldName){
                debugger;
            }
            result = (vm?.v$?.[fieldName]?.[CV_TYPE_MIN_LENGTH]?.$response?.extraParams?.rule_result ?? defaulted)
        }
        catch(e) {
            console.warn(e); 
            return defaulted;
        }
        return result;
    },
    maxLength: (vm, objContext ) => {
        debugger
        let defaulted = true; // ????????????????????? how would we know what to default to?
        let result
        let dummyValidator;
        let message: string
        let maximum: number;
        let sourceFieldName
        let refName
        let probe
        // test if we have vm.fieldValues always or should we use params.formData ????
        //destructure the params into some crucial variables
        const { value , params, ...cfg } = objContext // contains the source field name, from where to grab the payload for the min argument.
        
        try{
            //min = Number(vm?.v$?.[sourceFieldName]?.$model ?? vm?.fieldValues?.value?.[sourceFieldName])
            maximum = Number(params?.max)
        }
        catch(e){
            console.warn(e)
        }
        // if we did not receive a number straight away, we should have received a $model to retrieve it from or some other method to invoke...
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
        if ( !isNaN(maximum)){
            try { 
                // Note: here we are re-using the builtin vuelidate maxLength validator, without having to know exactly how it is implemented or how it generates it's message
                dummyValidator = maxLength(maximum); 
                result = dummyValidator?.$validator(value);
                //message = typeOf(dummyValidator?.$message) === "function" ? dummyValidator?.$message(dummyValidator.$params) : dummyValidator?.$message
                message = dummyValidator?.$message?.({$params: dummyValidator.$params}) ?? dummyValidator?.$message
            }
            catch(e) {
                console.warn(e); 
            }
        }
        return { result, message } ;
    },
    between: (vm, objContext ) => {
        debugger
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
                // Note: here we are re-using the builtin vuelidate between validator, without having to know exactly how it is implemented or how it generates it's message
                dummyValidator = between(minimum,maximum); 
                result = dummyValidator?.$validator(value);
                message = dummyValidator?.$message?.({$params: dummyValidator.$params}) ?? dummyValidator?.$message
            }
            catch(e) {
                console.warn(e); 
            }
        }
        return { result, message } ;
    },
    /**
     * Checks if for a field the -builtin- requiredIf validator resulted true.
     * Note: this is only a retriever of a rule result, it does not calculate or execute a rule itself.
     * This result will only indeed exist IF for that field the builtIn requiredIf rule existed AND was called & registered, before this retrieval helper method is called. 
     * @param vm 
     * @param fieldName 
     * @returns 
     */
     isRequiredIf: (vm,fieldName: string) => {
        let result, defaulted = false;
        try { 
            result = vm?.v$?.[fieldName]?.requiredIf?.$invalid ?? defaulted;
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    notRequiredIf: (vm,fieldName: string) => {
        let result, defaulted = true;
        try { 
            result = !cHelpers.isRequiredIf(vm,fieldName)
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is empty.
     * Note: this is only a retriever of a rule result, it does not calculate or execute a rule itself!
     * Since every field will have at least two rules ( for visibility and for disabling ) every field will be mapped and will have $model to consult!
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isEmpty: (vm,fieldName: string) => {
        let result, defaulted = true;
        try { 
            result = helpers.len( (vm?.v$?.[fieldName]?.$model ) ?? "" ) === 0;
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    someEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    notEmpty: (vm,fieldName: string) => {
        let result, defaulted = false;
        try { 
            result = !(cHelpers.isEmpty(vm, fieldName))
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    someNotEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    noneEmpty: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isEmpty(vm, fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is silently -eagerly- valid. 
     * Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isValidSilent: (vm, fieldName: string) => {
        let result, defaulted = true;
        try {
            // Test if we can use vm to get to rules to get to a $validator on it to call it or re-use it is a wrapped function?
            // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
            result = !!!(vm?.v$?.[fieldName]?.[V_SILENTERRORS]?.length > 0)
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is explicitely -being touched/dirty- valid. 
     * Inverts the result because vuelidate flags $error or $invalid, which is the opposite of what we test here.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isValid: (vm,fieldName: string) => {
        let result, defaulted = true;
        try { 
            result = !!!(vm?.v$?.[fieldName]?.[V_VALID]) 
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if two types of rules for display resulted in true.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isVisible: (vm, fieldName: string) => {
        let defaulted = true;
        let result, result_1, result_2;
        try {
            // custom rule based on a FUNCTION in the field validators configuration. We do not expect this frequently though.... Functions from external JSON into Javascript Object literal configs is rare. 
            // temporarily, as long as we also use the displayIf with spawned external functions :-)
            result_1 = (vm?.v$?.[fieldName]?.[V_DISPLAYIF]?.$response?.extraParams?.rule_result ?? true)
            // for now we surely have to take into account CV_TYPE_DISPLAY_IF!!!!
            result_2 = (vm?.v$?.[fieldName]?.[CV_TYPE_DISPLAY_IF]?.$response?.extraParams?.rule_result ?? true)

            result = result_1 && result_2
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    /**
     * Checks if a field is ruled to be disabled.
     * @param vm 
     * @param fieldName 
     * @returns 
     */
    isDisabled: (vm, fieldName: string) => {
        let result, defaulted = false;
        try {
            result = !!(vm?.v$?.[fieldName]?.[CV_TYPE_DISABLE_IF]?.$response?.extraParams?.rule_result)
            //result = (vm?.v$?.[fieldName]?.[CV_TYPE_DISABLED_IF]?.$response?.extraParams?.rule_result ?? false)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    isEnabled: (vm, fieldName: string) => {
        let result, defaulted = true;
        try {
            result = !cHelpers.isDisabled(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    isInvalid: (vm,fieldName: string) => {
        let result, defaulted = false;
        try {
            // invert the result because we re-use isValid, we returns true if valid
            result = !cHelpers.isValid(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    isInvalidSilent: (vm, fieldName: string) => {
        let result, defaulted = false;
        try {
            // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
            result = !cHelpers.isValidSilent(vm,fieldName)
        }
        catch(e) {
            console.warn(e); 
            result = defaulted;
        }
        return result
    },
    isHidden: (vm,fieldName: string) => {
        let result, defaulted = false;
        try {
            result = !cHelpers.isVisible(vm,fieldName)
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    someHidden: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isVisible(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allHidden: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isVisible(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    someValidSilent:  (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        const arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValidSilent
                result =  cHelpers.isValidSilent(vm,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e){
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    someInvalidSilent:  (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        const arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValidSilent
                result = !cHelpers.isValidSilent(vm,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e){
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allValidSilent:  (vm, arrFieldNames: string[]) => {        
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = cHelpers.isValidSilent(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allInvalidSilent: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        try {
            // re-use allValidSilent and negate it
            result = !( cHelpers.allValidSilent(vm, arrFieldNames))
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    },
    someValid: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result =  cHelpers.isValid(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allValid: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result =  cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        return result
    },
    allInvalid: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid but inverted
                result = !cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
            //result = !arrResults.includes(false);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }
        
        return result
    },
    someInvalid:  (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = cHelpers.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = arrResults.includes(false);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }     
        return result
    },
    /**
     * @param vm 
     * @param fieldName 
     * @returns 
     * 
     */
    someVisible: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isVisible
                result =  cHelpers.isVisible(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }  
        return result
    }, 
    allVisible: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isVisible(vm,fieldName)
                
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        }  
        return result
    },
    someDisabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result =  cHelpers.isDisabled(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    }, 
    allDisabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isDisabled(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    },
    someEnabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isDisabled(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    }, 
    allEnabled: (vm, arrFieldNames: string[]) => {
        let result, defaulted = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = !cHelpers.isDisabled(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e) {
            console.warn(e);
            result = defaulted;
        } 
        return result
    },
}

/**
 * A HOF that composes the parameterized version of a validator fn.
 * For now used by custom validators of type 'disABLERIf' and diplayerIf .... and ????
 * For now supports: 
 * conditioning on the eager validity of some/all fields.
 * conditioning on the lazy validity of some/all fields.
 * conditioning on the visibility of some/all fields.
 * conditioning on the disabled of some/all fields.
 * conditioning on the empty / not-empty of some/all fields.
 * @param args. Array.  We expect to get passed in all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidate, to be used as a custom rule executioner for vuelidate (as opposed to only built-in ones and only for validation purposes).
 * TODO: make async?
 */
const hofRuleFnGenerator = ( ...args) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
    const { defaultRuleResult, staticConfigProperty , doInvertRuleResult , asValidator = false } = args[1]
    const ruleType = params.type
    let resultFunction
    let fallBackFunction = function ruleFn(value, vm){
        return { 
            $valid: true, // We should never "fail" based on a total dummy function, regardless "asValidator" ???
            extraParams: { rule_result: defaultRuleResult , fieldCfg }, 
            message: `Fallback or try-catch rule. Either an error occurred or neither static config property nor any configured rule of type ${ruleType} for ${fieldCfg.label}` 
        }
    }
    let pretest 
    let hasStaticConfigProperty 
    try {
        // 1. do we have a overruling static configuration property?
        hasStaticConfigProperty = staticConfigProperty && ((fieldCfg?.[staticConfigProperty] ?? false)  !== false )
        if ( hasStaticConfigProperty )
        {
            resultFunction = function ruleFn(value, vm){
                let rule_result = doInvertRuleResult ? !!!fieldCfg?.[staticConfigProperty] : !!fieldCfg?.[staticConfigProperty]
                return { 
                    $valid: asValidator ? rule_result : true, // when run as Validator, it should flag/register errors accordingly!
                    extraParams: { rule_result , fieldCfg }, 
                    message: `Message for rule of type ${ruleType} based to static configuration property (metadata) ${staticConfigProperty} on ${fieldCfg.label}` }
            }
        }
        // 2. probe for a supported custom rule function
        else if (!resultFunction){
            resultFunction = probeCustomRuleFn(args)
        }
        // 3. make sure that if we did not have any function yet, we should return a liberal/neutral fallback function 
        if (!resultFunction){
            resultFunction = fallBackFunction
        }

    } catch (error) {
        console.warn(error);
        resultFunction = fallBackFunction;
    }
    return resultFunction
}

/**
 * Generates a disablerIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
 export const disablerIf = (args) => {
    const defaultRuleResult = false;
    const staticConfigProperty = CFG_PROP_ENTITY_DISABLE
    const doInvertRuleResult = CFG_PROP_ENTITY_DISABLE_INVERT
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult, staticConfigProperty , doInvertRuleResult } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

/**
 * Generates a displayerIf rule-function for vuelidate.
 * Supports refering to (other) field(s) regarding their visibility-state and/or disabled-state and/or validity-state or their value ...
 * Configures a part of the arguments to call a Higher Order Function for that.
 * @param args 
 * @returns 
 */
export const displayerIf = (args) => {
    const defaultRuleResult = true;
    const staticConfigProperty = CFG_PROP_ENTITY_DISPLAY
    const doInvertRuleResult = CFG_PROP_ENTITY_DISPLAY_INVERT
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult, staticConfigProperty , doInvertRuleResult } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

//TEST to wrap a builtin vuelidate validator for dynamic parametrization
/**
 * Generates a minLength validator for vuelidate.
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
    const startFn = V_MINLENGTH; //this config means that said method should be invoked from allways, before probing for dependencies, 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult , doInvertRuleResult, startFn, asValidator } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}

/**
 * Generates a maxLength validator for vuelidate.
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
    const startFn = V_MAXLENGTH; //this config means that said method should be invoked from allways, before probing for dependencies, 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult , doInvertRuleResult, startFn, asValidator } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
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
    const startFn = V_BETWEEN; //this config means that said method should be invoked from allways, before probing for dependencies, 
    let resultFunction
    try {
        resultFunction = hofRuleFnGenerator( args, { defaultRuleResult , doInvertRuleResult, startFn, asValidator } )
    } catch (error) {
        console.warn(error)
    }
    return resultFunction
}
/**
 * Returns a vuelidate rule function, which returns a response object needed for custom vuelidate validators/rules.
 * Calls a recursive funciton.
 * @param arrCfg 
 * @returns 
 */
const probeCustomRuleFn = (arrCfg) => {
    const { dependsOn, asLogical, fieldCfg, formData, formDefinition, ...params } = arrCfg[0]
    const { defaultRuleResult, staticConfigProperty , doInvertRuleResult , asValidator = false , startFn } = arrCfg[1]
    return function ruleFn(value, vm){
        let rule_result = probeCustomRuleFnRecursor(value, vm, arrCfg[0], asLogical, startFn) ?? defaultRuleResult
        const valid = asValidator ? (rule_result?.result ?? rule_result) : true;
        const message = rule_result?.message ?? `Rule of type ${params?.type} for field ${fieldCfg?.label} returned: ${rule_result}.` 
        // console.log(`running cynapps custom rule validator -type: ${params?.type} - from probeCustomRuleFn called via 2-st branch of hofRuleFnGenerator via ${params?.type?.indexOf('disable')>-1 ? 'disablerIf' : 'displayerIf' } for ${fieldCfg?.id} resulted: ${rule_result}`)
        return { 
            $valid: valid, 
            extraParams: { rule_result , fieldCfg }, 
            message: message
        }
    }
}

/**
 * Inner recursor for the probeCustomRuleFn.
 * It should be able to recursively walk all nested conditions and return the correct Boolean evaluation result
 * resulting from calling and evalutaing all combined condtions in the entire set of dependsOn criteria.
 * @param value. Passed by vuelidate.
 * @param vm. Passed by vuelidate. The viewmodel/component instance, which brought vuelidate (v$) into scope.
 * @param cfg. The passed in rule evaluation params, including the dependsOn object tree.
 * @param asLogicalOperator. The and/or/not logical operator for the relevant dependsOn leaf conditions object
 * @returns rule_result Boolean.
 */
const probeCustomRuleFnRecursor = ( value, vm, objCfg, asLogical = AND, startFn = null) => {
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = objCfg
    const arrSupported = SUPPORTED_RETRIEVERS;
    const arrToRecurse = [AND, OR, NOT]

    let countAsResult = 0;
    let rule_result;
    let arrPartials = [];
    let arrMessages = [];
    let tmp
    let iterator = dependsOn && typeof dependsOn === 'object' ? Object.entries(dependsOn) : {}
    let doIterate = Object.keys(iterator).length > 0
    let breakout = false;
    let startFnUnqualified = false;
    try{
        //before probing the recursion for nested conditions, we should first check if there is an INDEPENDENT/AUTONOMOUS method to invoke!
        //for example:  { "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: 5 } },  or { "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'title'} } }, 
        //these should run unambiguously simply implementing the minLength ... since dependsOn is totally OPTIONAL!!! 
        if (startFn) {
            if (arrSupported.includes(startFn)) {
                let fn = startFn;
                try {
                    debugger;
                    const objParams = { value, fieldCfg, formData, formDefinition, params }
                    tmp = cHelpers[fn]?.(vm, objParams)    
                    countAsResult++
                    arrPartials.push(tmp?.result ?? tmp) // if we have tmp.result grab that, else grab tmp
                    if (tmp?.message){
                        arrMessages.push(tmp.message)
                    }
                }
                catch(e) {
                    startFnUnqualified = true
                    console.warn(e)
                }
            }
            else {
                startFnUnqualified = true
            }
            if (startFnUnqualified && asLogical === AND){
                // when called as a logical AND operator, the end result at this level can never become true anymore, so bail out...
                arrPartials.push(undefined)
                arrMessages.push(`Flawed or errored startFn ${startFn} for conjunctive invovation. Aborted.`)
                countAsResult++
                if (asLogical === AND){
                    breakout = true;
                }
            }
        }
        // should we invoke the recursion iterator
        if (!breakout && doIterate){
            for (const [key, entryValue] of iterator) {
                tmp = null
                if (arrToRecurse.includes(key)){
                    // to correctly recur downwards set the new dependsOn property to the relevant subset!!!!
                    let objCfg2 = { "dependsOn": entryValue, fieldCfg, formData, formDefinition, params }
                    try { 
                        tmp = probeCustomRuleFnRecursor(value, vm, objCfg2, key) 
                        //arrPartials.push(tmp)
                        arrPartials.push(tmp?.result ?? tmp)
                        if (tmp?.message){
                            arrMessages.push(tmp.message)
                        }
                        countAsResult++
                    }
                    catch(e) {
                        console.warn(e)
                    }
                }
                else if (arrSupported.includes(key)) {
                    let fn = key;
                    try {
                        if (fn === "isMinLength"){
                            // TODO: we should change the signature for all helpers below to pass in more than entryValue, like the complete context
                            // IN ORDER for these rules to be able to OPTIONALLY RERUN OTHER RULES instead of MERELY retrieving the previous results...
                            debugger
                            const objParams = { fieldName: entryValue, value, fieldCfg, formData, formDefinition, params }
                            tmp = cHelpers[fn]?.(vm, objParams)    
                        }
                        else {
                            tmp = cHelpers[fn]?.(vm, entryValue)    
                        }
                        //tmp = cHelpers[fn]?.(vm, entryValue)
                        countAsResult++
                        //arrPartials.push(tmp)
                        arrPartials.push(tmp?.result ?? tmp)
                        if (tmp?.message){
                            arrMessages.push(tmp.message)
                        }
                    }
                    catch(e) {
                        console.warn(e)
                    }
                }  
            }
        }
    }
    catch(e){
        console.warn(e)
    }

    // depending upon asLogicalOperator, we reduce arrPartials to a boolean via _.some. _.every or !_.every
    if (countAsResult){
        rule_result = asLogical === AND ? _.every(arrPartials,Boolean) : asLogical === OR ? _.some(arrPartials,Boolean) : !(_.some(arrPartials,Boolean))
    }
    if (arrMessages.length>0){
        return { result: rule_result, message: arrMessages.join("\n") }
    }
    else {
        return rule_result
    }
}

/*** 
 * Indicates if a validator is a cynapps custom validator, when the type name starts with our constant custom prefix: V_CUSTOM_PREFIX
 */
export const isCustomValidatorType = (type: string) => {
    return type?.indexOf?.(V_CUSTOM_PREFIX) > -1 ?? false
}

export default { 
    cHelpers, 
    disablerIf, 
    displayerIf,
    _minLength,
    _maxLength,
    _between,
    isCustomValidatorType, 
    V_CUSTOM_PREFIX,
    RULE_GENERATOR,
    VISIBILITY,
    SILENTVALIDITY,
    V_SILENTERRORS,
    V_VALID,
    V_DISPLAYIF,
    V_DISABLEIF,
    V_MINLENGTH,
    V_MAXLENGTH,
    V_BETWEEN,
    // custom validators that support dynamical parametrizations
    CV_TYPE_DISABLE_IF, 
    CV_TYPE_DISPLAY_IF,
    CV_TYPE_MIN_LENGTH,
    CV_TYPE_MAX_LENGTH,
    CV_TYPE_BETWEEN,
    // Helpers that merely "read" rule results, as opposed to "execute" other rules:
    IS_VISIBLE,SOME_VISIBLE,ALL_VISIBLE,
    IS_HIDDEN,SOME_HIDDEN,ALL_HIDDEN,
    IS_VALID,SOME_VALID,ALL_VALID,
    IS_INVALID,SOME_INVALID, ALL_INVALID,
    IS_VALID_LAZY,SOME_VALID_LAZY,ALL_VALID_LAZY,
    IS_INVALID_LAZY,SOME_INVALID_LAZY,ALL_INVALID_LAZY,
    IS_DISABLED,SOME_DISABLED,ALL_DISABLED,
    IS_ENABLED,SOME_ENABLED,ALL_ENABLED,
    AND,
    OR,
    NOT,
    IS_EMPTY,SOME_EMPTY,ALL_EMPTY,
    NOT_EMPTY,SOME_NOT_EMPTY,NONE_EMPTY,
    IS_REQUIRED_IF, NOT_REQUIRED_IF,
    // TODO ...
    IS_MIN_LENGTH, //SOME_MIN_LENGTH, ALL_MIN_LENGTH, NOT_MIN_LENGTH, SOME_NOT_MIN_LENGTH, NONE_MIN_LENGTH ???? terminology 
    // IS_MAX_LENGTH,
    // IS_BETWEEN, etc
};