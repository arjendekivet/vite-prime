import _ from 'lodash'
import Validator from '@/types/validator'
import Fieldconfig from '@/types/fieldconfig'
import { useVuelidate, ValidationRule, ValidationRuleWithParams, ValidatorFn } from '@vuelidate/core'
import { helpers, required, email, minLength, maxLength, between, maxValue } from '@vuelidate/validators'

// create a map to be able to dynamically refer to the vuelidate validators
export const mapValidators = {
    required,
    email,
    minLength,
    maxLength,
    between,
    maxValue
}

/**
 * Alias for useVuelidate such that the form does not have to know which validator package we are using. We would only have to know the signature ...
 */
export const useValidation = useVuelidate

/**
 * Genereer een aantal simpele validators, zoals isVisible('fieldName'), isEnabled('fieldName'), isLazyValid('fieldName'), isValid() (silently!)
 * 
 * De isValid() validator zou eigenlijk NIETS moeten executeren maar alleen moeten uitlezen, hetzelfde geldt voor de 
 * 
 * die als eenvoudige rules afgaan op relevante velden velden voordat ze uitgelezen moeten worden.
 * Bijv als cat_3 aanstuurt de velden cat_4 en cat_5 moet op cat_3 een setje eenvoudige validators afgaan 
 * We focussen pimair op het gebruik van values (formData) en van -silent-Validity, want die zijn standaard al beschikbaar.
 * 
 * Om de benodigde validators op tijd te laten afgaan per veld, moeten we in de velden die dependentFields hebben een aantal validators registreren
 * niet zozeer als hun eigen validators maar zeker ook validators tbv andere velden. Zoals dus de validators die validatie uitrekenen, maar ook visibility.
 * En optioneel ook enabling... 
 * 
 * Als field veld3 geen eigen uitgebreiden validators heeft, voor zijn content en of voor zijn eigen visibility en enabling, dan kan een ander veld dat nooit uitlezen uit v$.veld3 ...
 * en al helemaal niet als de rules voor veld3 pas afgaan NADAT veld5 gecalculeerd wordt, dus de aanname / voorwaarde is dan wel dat die validators er zijn.
 * 
 * Te ondersteunen use case: de functionaliteit die nu in calculateDependentFieldStates wordt geleverd in 1 recursive go:
 * - Wanneer er dependent fields zijn, en de waarde van een current field is veranderd dan moet recursief de hele chain van dependentFields worden afgelopen,
 * - als de verandering was isEmpty() -null of undefined of "" dan moet de visibility van die velden op FALSE gezet worden en de value op null gezet worden
 * - als de verandering NIET isEmpty() dan moet de visibility van die velden op TRUE gezet worden en hun huidige value NIET veranderd worden.
 * 
 * Daaraan voegen we toe, optioneel, als de verandering is naar een invalid waarde, ook dan gaan we recursief hiden en al dan niet resetten.
 * 
 * De bestaande validators / rules kunnen dan met de or / and / not API gechained en gegroupeerd worden, maar deze validators slaan dan op het veld waaraan ze geassocieerd zijn.
 * Je wil noet de rules van andere validators runnen als dat niet hoeft?
 * Er zijn dus ook gewoon helper functies nodig die UITLEZEN wat de state is van andere velden... qua validity qua visibility etc.
 * 
 * Nota bene: kunnen we eventueel collections gebruiken om de 'exotische' rules over visibility en enabling te grouperen i response namespaces?
 * Nota bene: volgens de api moet met een Higher Order Function wel degelijk een hele set van params in scope gebracht kunnen worden voor een validator.
 * 1. De Higher Order Function moet een signatuur hebben waarin de params gerefereerd/gespecificeerd worden en deze moet de reurn value van helper.withParams retourneren!
 * 2. De higher Order Function moet de helpers.withparams() api aanroepen en de inner function daarin moet de validator function zijn.
 * 
 */

/**
 * HOC which adds extra params to the passed validator.
 */
function addParamsTovalidator(addedParams = {}, validator: ValidationRuleWithParams | ValidationRuleWithParams | ValidatorFn): ValidationRule {
    return helpers.withParams(addedParams, validator)
}
//function visibility(field, formData, formDefinition, params: object, validatorFn: any){
function visibilityX(params: object, validatorFn: any){
    //debugger
    const mergedParams = Object.assign({},{ type: 'visibility' } , params )
    const result = helpers.withParams(
        mergedParams,
        // { $validator: ( value, vm ) => validatorFn }
        validatorFn
    )
    return result
}

// const visibility = (params: object, validatorFn: any) => {
//     const mergedParams = Object.assign({},{ type: 'visibility' } , params )
//   return helpers.withParams(
//     { type: 'contains', value: param },
//     (value) => !helpers.req(value) || value.includes('cool')
//   }
//   )

//   const visibility = (params: object, validatorFn: any) => {
//     const mergedParams = Object.assign({},{ type: 'visibility' } , params )
//     return helpers.withParams(
//         mergedParams,
//         // (value, vm , ...mergedParams) => { //debugger; console.log('hardcoded code'); return true;}
//         (value, vm) => validatorFn(value,vm,...mergedParams)
//         )
//     }

const visibility = (params: object, validatorFn: any, fieldCfg, formDefinition, formData) => {
    //debugger;
    const mergedParams = Object.assign({},{ type: 'displayIf' } , params, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
    return helpers.withParams(
        mergedParams,
        // (value, vm , ...mergedParams) => { //debugger; console.log('hardcoded code'); return true;}
        validatorFn
        )
    }


    const VISIBILITY = 'displayIf';
    const SILENTVALIDITY = '$silentErrors'
    const V_SILENTERRORS = '$silentErrors'
    const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...
    const V_DISPLAYIF = 'displayIf';
    const ALL_VISIBLE = "allVisible"
    const ALL_VALID = "allValid"
    const ALL_INVALID = "allInvalid"

// example of config for field cat_5 to calculate if it should be "enabled or disabled". all conjunctive criteria should be grouped into the same array's and the disjunctive criteria should be in som other array etc etc
//// The logic OR means either disjunctive or conjunctive, when there are more criteria.
const ruleCfg = { 
    dependsOn: [ 
        // rule result depends on cat_5 (which in this case refers to the field cat-5 itself, and it must be visible if it is to be enabled.  the logicOperator states the next critrium must be tru as well.
        // rule result depends on field cat_4 OR cat_3, regarding that ONE OF their's visibility is OK silent validity is OK.
        [
            { 
                field: 'cat_5' , should: [ { have: VISIBILITY, be: true } ], logically: 'AND' ,
            },
            [ 
                { 
                    field: 'cat_4', should: [ { have: VISIBILITY, be: true, logically: 'AND'} , { have: SILENTVALIDITY, be: true } ], 
                    logically: 'OR' ,
                } ,
                { 
                    field: 'cat_3' ,   
                    should: [ 
                        { have: VISIBILITY, be: true, logically: 'AND' } , 
                        { have: SILENTVALIDITY, be: true}
                    ] 
                }
            ]
        ],
    ],
    // Deze boomstructuur van and / or geeft aan hoe de groepen van instructies logisch gegroepeerd moeten worden
    alternativeFormulation: {
        and: {
            and: { ALL_VISIBLE: ['field_1', 'field_2'] , ALL_INVALID: ['field_1'] },
            or: { isPersistent: 'field_4', someEnabled: ['field_5'] } 
        }
    }
    // formData: FormData,
    // formDef: formDef,
    // fieldCfg: fieldCfg
}

    /**
     * For now only support 
     * a) simple direct depency from it's owm visibility (if a field is not visible it does not need to be enabled?)
     * b) direct dependency from the validity of some other fields: if some other field is silently or explicitely invalid, this field might have to be disabled.
     *  
     * 
     * @param ruleCfg Supports refering to fields and their visibility-state or disabled-state or validity-state or their value ...
     * 
     * @returns 
     */
const disablerIfBakkerrrrr = ( ruleCfg ) =>
    helpers.withParams(
        // params for the vuelidate return object
        { type: "disableIf", cfg: ruleCfg },
        // validatorFn to be invoked. Note: only here can we hardcoded refer to stuff inside ruleCfg
        function(
        value,
        parentVm
    ) {
        debugger;
        //TODO create reducers !!!!!!!
        // that calculate the contidition code dynamically? COULD we use a tagged template literal to calculate the outcome?
        // `${}` if we can open up a tagged template literal and populate it with incremental stuff like 
        // `S{ (vm?.v$?.cat_4?.$silentErrors?.length > 0) && ruleCfg[0].criteria[0].criterium && (vm?.v$?.cat_7?.$silentErrors?.length > 0)}`
        // or should we use a new Function() expression ????

        // let target1 = ruleCfg.dependsOn[0][0].field;
        // let criterium1_1 = ruleCfg.dependsOn[0][0].should[0].have
        // let condition1_1 = ruleCfg.dependsOn[0][0].should[0].be
        // let part1_1 = vm?.v$?[target1][criterium1_1].$response.extraParams.rule_result === condition1_1

        // let target2 = ruleCfg.dependsOn[1][0].field; //array in an array ...
        // let criterium2_1 = ruleCfg.dependsOn[1][0].should[0].have
        // let condition2_1 = ruleCfg.dependsOn[1][0].should[0].be
        // let part2_1 = vm?.v$?[target1][criterium2_1].$response.extraParams.rule_result === condition2_1
        
        // // "v$.cat_5.displayIf.$response.extraParams.rule_result"

        // let rule_result = false; // by default we should NOT disable stuff
        // let tmp: Boolean = !!(vm?.v$?[target1][criterium1_1].$response.extraParams.rule_result === condition1_1)
        // debugger;
        // rule_result = tmp;
        
        // if ( <all kind og business logic>) { display_result = true/false }
        return { $valid: true, extraParams: { rule_result: rule_result, vm: vm }, message: "test disabling rule on cat_5, depending on cat_4" }
        return value === helpers.ref(equalTo, this, parentVm);
    });

// define helper functions like isValid, isVisible, isDisabled, that take a fieldname and return a boolean if the retrieved info qualifies.
const v_h_Bak = {
    isValidSilent: (vm, v$, fieldName) => {
        debugger;
        let result = true;
        let ns = vm?.v$ ?? v$ //ns staat voor namespace. Verify of we vm?.v$ moeten prefereren boven v$ !!!
        debugger;
        try {
            // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
            result = !!!(ns?.[fieldName]?.[V_SILENTERRORS]?.length > 0)
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result

    },
    someValidSilent:  (vm, v$, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValidSilent(vm,v$,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    allValidSilent:  (vm, v$, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValidSilent(vm,v$,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    allInvalidSilent:  (vm, v$, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            // re-use allValidSilent and negate it
            result = !(v_h_.allValidSilent(vm, v$, arrFieldNames))
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    isValid: (vm, v$, fieldName) => {
        debugger;
        let result = true;
        let ns = vm?.v$ ?? v$ //ns staat voor namespace. Verify of we vm?.v$ moeten prefereren boven v$ !!!
        debugger;
        try {
            // invert the result becuase vuelidate flags $error or $invalid
            result = !!!(ns?.[fieldName]?.[V_VALID])
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result

    },
    someValid:  (vm, v$, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValid(vm, v$,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    allValid:  (vm, v$,arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValid(vm, v$,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    isVisible: (vm, v$,fieldName) => {
        debugger;
        let result = true;
        let ns = vm?.v$ ?? v$ //ns staat voor namespace. Verify of we vm?.v$ moeten prefereren boven v$ !!!
        //let v$_toPass = vm?.v$ ?? v$;
        debugger;
        try {
            result = !!(ns?.[fieldName]?.[V_DISPLAYIF]?.$response?.extraParams?.rule_result)
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    someVisible:  (vm, v$, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isVisible
                result = v_h_.isVisible(vm, v$,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    }, 
    allVisible:  (vm, v$,arrFieldNames) => {
        debugger;
        let result = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result =  v_h_.isVisible(vm, v$,fieldName)
                debugger;
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        debugger;
        return result
    }, 
}

const v_h_ = {
    isValidSilent: (vm, fieldName) => {
        debugger;
        let result = true;
        let ns = vm?.v$ ?? v$ //ns staat voor namespace. Verify of we vm?.v$ moeten prefereren boven v$ !!!
        debugger;
        try {
            // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
            result = !!!(ns?.[fieldName]?.[V_SILENTERRORS]?.length > 0)
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result

    },
    someValidSilent:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValidSilent(vm,v$,fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    allValidSilent:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValidSilent(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    allInvalidSilent:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            // re-use allValidSilent and negate it
            result = !(v_h_.allValidSilent(vm, arrFieldNames))
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    isValid: (vm,fieldName) => {
        debugger;
        let result = true;
        let ns = vm?.v$ ?? v$ //ns staat voor namespace. Verify of we vm?.v$ moeten prefereren boven v$ !!!
        debugger;
        try {
            // invert the result becuase vuelidate flags $error or $invalid
            result = !!!(ns?.[fieldName]?.[V_VALID])
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result

    },
    someValid:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValid(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    allValid:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isValid
                result = v_h_.isValid(vm,fieldName)
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    isVisible: (vm, fieldName) => {
        debugger;
        let result = true;
        let ns = vm?.v$ ?? v$ //ns staat voor namespace. Verify of we vm?.v$ moeten prefereren boven v$ !!!
        //let v$_toPass = vm?.v$ ?? v$;
        debugger;
        try {
            result = !!(ns?.[fieldName]?.[V_DISPLAYIF]?.$response?.extraParams?.rule_result)
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    someVisible:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                // re-use isVisible
                result = v_h_.isVisible(vm, fieldName)
                arrResults.push(result)
            })
            result = _.some(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    }, 
    allVisible:  (vm, arrFieldNames) => {
        debugger;
        let result = true;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result =  v_h_.isVisible(vm, fieldName)
                debugger;
                arrResults.push(result)
            })
            result = _.every(arrResults, Boolean);
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        debugger;
        return result
    }, 
}
/**
 * OHE Test if we can create HOF wich returns the parameterized versions of the proper validator fn vuelidates expects...
 * Test if we MUST pass in a ref to v$? Rather not, since v$ in runtime will always pass in vm as second argument and vm holds v$????
 * @param args. We expect to pass in one object containing all the necessary parametrizations. 
 * @returns 
 */
const disablerIfBak = ( ...args ) => {
    debugger;
    const { dependsOn, fieldCfg, formData, formDefinition, v$ , ...params } = args[0]

    if (dependsOn.ALL_VISIBLE && dependsOn.ALL_INVALID){
        debugger
        return function validatorFn(value, vm){
            debugger;
            
            let rule_result = false; // by default we should NOT disable stuff
            let arrPartials = [];
            let v$_toPass = vm?.v$ ?? v$;
            debugger
            //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

            // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
            if (dependsOn.and){}
            else if(dependsOn.or){}
            else if (dependsOn.not){}
            else {
                // for now: assume straight "and"-conjunctive instructions
                if (dependsOn.ALL_VISIBLE){
                    arrPartials.push(v_h_.allVisible(vm, v$_toPass , dependsOn.ALL_VISIBLE))
                }
                //Note: we could already bail out if this one is false?
                if (dependsOn.ALL_INVALID){
                    arrPartials.push(v_h_.allInvalidSilent(vm, v$_toPass, dependsOn.ALL_INVALID))
                }
                rule_result = _.every(arrPartials, Boolean)
            }
            debugger;
            
            // if ( <all kind og business logic>) { display_result = true/false }
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result }, message: `test disabling rule on .... cat_5, depending on cat_4`}
        }
    }
    else{
        /**
         * Test rule which states that if 'cat_4' is silently invalid, we will return true. This indirectly will lead to DISABLE this field, cat_5.
         */
        debugger
        return function validatorFn(value, vm){
            debugger;
            let rule_result = false; // by default we should NOT disable stuff
            let arrPartials = [];
            
            //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

            // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
            if (dependsOn.and){

            }
            else if(dependsOn.or){}
            else if (dependsOn.not){}
            else {
                // assume straight "and"-conjunctive instructions
                if (dependsOn.ALL_VISIBLE){
                    arrPartials.push(v_h_.allVisible(vm, dependsOn.ALL_VISIBLE))
                }
                if (dependsOn.ALL_INVALID){
                    arrPartials.push(v_h_.allInvalidSilent(vm, dependsOn.ALL_INVALID))
                }
                rule_result = _.every(arrPartials, Boolean)
            }
            debugger;
            
            // if ( <all kind og business logic>) { display_result = true/false }
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result }, message: "test disabling rule on cat_5, depending on cat_4" }
        }
    }
}

const disablerIf = ( ...args ) => {
    debugger;
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]

    if (dependsOn.ALL_VISIBLE && dependsOn.ALL_INVALID){
        debugger
        return function validatorFn(value, vm){
            debugger;
            
            let rule_result = false; // by default we should NOT disable stuff
            let arrPartials = [];
            
            debugger
            //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

            // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
            if (dependsOn.and){}
            else if(dependsOn.or){}
            else if (dependsOn.not){}
            else {
                // for now: assume straight "and"-conjunctive instructions
                if (dependsOn.ALL_VISIBLE){
                    arrPartials.push(v_h_.allVisible(vm, dependsOn.ALL_VISIBLE))
                }
                //Note: we could already bail out if this one is false?
                if (dependsOn.ALL_INVALID){
                    arrPartials.push(v_h_.allInvalidSilent(vm, dependsOn.ALL_INVALID))
                }
                rule_result = _.every(arrPartials, Boolean)
            }
            debugger;
            
            // if ( <all kind og business logic>) { display_result = true/false }
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result }, message: `test disabling rule on .... cat_5, depending on cat_4`}
        }
    }
    else{
        /**
         * Test rule which states that if 'cat_4' is silently invalid, we will return true. This indirectly will lead to DISABLE this field, cat_5.
         */
        debugger
        return function validatorFn(value, vm){
            debugger;
            let rule_result = false; // by default we should NOT disable stuff
            let arrPartials = [];
            
            //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

            // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
            if (dependsOn.and){

            }
            else if(dependsOn.or){}
            else if (dependsOn.not){}
            else {
                // assume straight "and"-conjunctive instructions
                if (dependsOn.ALL_VISIBLE){
                    arrPartials.push(v_h_.allVisible(vm, dependsOn.ALL_VISIBLE))
                }
                if (dependsOn.ALL_INVALID){
                    arrPartials.push(v_h_.allInvalidSilent(vm, dependsOn.ALL_INVALID))
                }
                rule_result = _.every(arrPartials, Boolean)
            }
            debugger;
            
            // if ( <all kind og business logic>) { display_result = true/false }
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result }, message: "test disabling rule on cat_5, depending on cat_4" }
        }
    }
}

    /**
     * TODO: How should this be configured for the end user
     * TODO: focus on a fixed signature for the disabler function. It should take an array of objects which indicates
     * from which fields the calculation depends and from which property-combination and if all or some of the criteria have to be met.
     * Example: { dependsOn: [ { field: 'cat_3' , criteria: [ { name: 'visibility', logic: 'OR' } ]}]
     * @param params 
     * @param validatorFn 
     * @param fieldCfg 
     * @param formDefinition 
     * @param formData 
     * @returns 
     */
const disabler = (params: object, validatorFn: any, fieldCfg, formDefinition, formData) => {
    //debugger;
    const mergedParams = Object.assign({},{ type: 'disableIf' } , params, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
    return helpers.withParams(
        mergedParams,
        // (value, vm , ...mergedParams) => { //debugger; console.log('hardcoded code'); return true;}
        validatorFn
        )
    }
 
    /**
     * Dynamically creates a validator for vuelidate.
     * @param type String Indicates which validator this should become in vuelidate.
     * @param params Object. Holds the params that should be added to the vuelidate validator function signature. NOTE: IT MUST AT LEAST BE AN EMPTY OBJECT!
     * @param validatorFn. The function to call as the vuelidate internal validator fucntion.
     * @param message. TODO: IF we pass in a message, should we call helper.withMessage and will v$ then NOT use themessage on the $response object???
     * @param fieldCfg 
     * @param formDefinition 
     * @param formData 
     * @returns 
     */
const ruleGenerator = function(type: string, params: object = {} , validatorFn: any, message: string = "dummy message string ohe",  fieldCfg, formDefinition, formData, v$) {
    let validator;
    let preliminaryValidator
    if (fieldCfg.id==='cat_5' && type==='disableIf'){
        debugger;
        try{
            debugger;
            let lParams = { 
                dependsOn: {
                    // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
                    ALL_VISIBLE: ['cat_4', 'cat_5'], 
                    ALL_INVALID: ['cat_4']
                }, 
                // TODO: we can strip these since we will standardly pass these in
                fieldCfg: undefined, 
                formData: undefined , 
                formDefinition: undefined 
            }
            // let objParams = Object.assign({}, params, { type: type }, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
            let objParams = Object.assign({}, lParams, { type: type }, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} , { v$: v$ })
            
            // we cannot assume the JSON config will contains functions, so we have to retrieve these functions from elsewhere ...
            // preliminaryValidator = validatorFn(objParams)
            preliminaryValidator = disablerIf(objParams)
            
            validator = helpers.withParams(
                objParams,
                // validatorFn(objParams, 'pipo???', fieldCfg, formData, formDefinition )
                preliminaryValidator //this should be the proper validator funciton...
                )
            // new Function etc werkt niet
            // let functionBody = validatorFn.toString();
            // fBody = 'debugger; try { let dependsOn = objParams.dependsOn; } catch (e) {debugger;}let rule_result = false; let tmp = !!(vm?.v$?.cat_4?.$silentErrors?.length > 0); debugger; rule_result = tmp; return { $valid: true, extraParams: { rule_result, vm }, message: "test disabling rule on cat_5, depending on cat_4" };'
            
            // // TODO: can we use a new Function expresssion and call it, to populate all passed down parameters inside the function body ?
            // test2 = Function(objParams, "let dependsOn;try{dependsOn = objParams.dependsOn;}catch (ex){console.log(e);}");
            // debugger;
            // result2 = test2()
                //new Function(...args, 'funcBody')
        } catch(e){
            debugger
        }
    }
    // first create the basic validator ???????????????
    // let basic_validator = addParamsTovalidator({ type: type }, { $validator: validatorFn, $message: message } )
    //let invocator = (fieldCfg, formData, formDefinition) => { //debugger; return validatorFn(value, vm, fieldCfg, formData, formDefinition)}
    //let test = () => validatorFn(value, vm, fieldCfg, formData, formDefinition)
    
    try {
        const mergedParams = Object.assign({}, params, { type: type }, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )

        // validator = helpers.withParams(
        //     mergedParams,
        //     { 
        //         $validator: validatorFn, 
        //     })
        if (fieldCfg.id !=='cat_5' && type ==='disableIf'){
            validator = helpers.withParams(
                mergedParams,
                //invocator(fieldCfg, formData, formDefinition)
                //validatorFn(fieldCfg, formData, formDefinition)
                validatorFn
                )
        }
    
        //then add the rest of the params ???
        // const mergedParams = Object.assign({}, params, { fieldCfg: fieldCfg}, { formDefinition: formDefinition} , {formData: formData} )
        // validator = helpers.withParams(
        //     mergedParams,
        //     basic_validator)
    }
    catch(e){
        //debugger
    }
    //debugger;
    return validator
}
   
//const RULE_GENERATOR = Symbol('__RuleGenerator__');
const RULE_GENERATOR = "RULE_GENERATOR";

//add to mapValidators
// mapValidators['displayIf'] = visibility
// mapValidators['disableIf'] = disabler
mapValidators[RULE_GENERATOR] = ruleGenerator

// mapValidators['name_pattern'] = helpers.withParams(
//     { type: 'valid_name' },
//     {  $validator: validName, $message: `Invalid name via custom validator 'name_pattern' via source code` }
//     )
    
export function validName(name) {
    let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
    if (validNamePattern.test(name)){
        return true;
    }
    return false;
}

/**
 * Sets the validators for useVuelidate
 * Iterates the field validators config and populates validatorRules with the mapped -vuelidate/custom- validators.
 * TODO: must validatorRules become a reactive objective itself first?
 * TODO: pass formContext, this could refer to any other data point in scope in the form... for interdependent field validations and form state dependent rule morphing etc
 */
interface formDefinition {
    [key: string]: Fieldconfig
}
export function setValidators(v$, formDefinition: formDefinition, pValidatorRules: Object = {}, pFormContext: Object = {}) {
    const validatorRules = Object.assign({}, pValidatorRules)
    _.forEach(formDefinition, function (field) {
        let mappedValidator
        let fieldName = field.id
        let fieldLabel = field.label
        let objValidator = validatorRules?.[fieldName] || {} // Get previous to augment/overwrite or start freshly.
        let augmentedValidator // to hold the fieldLabel as an extra param, imerged into the original validator

        field.validators?.forEach(function (cfgValidator) {

            augmentedValidator = null //reset
            let isString = typeof cfgValidator === 'string'
            let tag = isString ? cfgValidator : typeof cfgValidator === 'object' && typeof cfgValidator?.type === 'string' ? cfgValidator?.type : null
            if (!tag){
                //debugger;
                console.error('type is missing...')
                return
                //without the type we cannot proceed 
            }
            //for dynamic isCustom validator configs, direct type is not present, instead the type must live inside the params instead of in the direct type
            if ( cfgValidator.isCustom ){
                // we must create the validator dynamically via the rule_generator...
                // must we use a HOC to get the additional parametrization implemented?
                mappedValidator = mapValidators[RULE_GENERATOR](tag, _.clone(cfgValidator.params), cfgValidator.fn, cfgValidator.message || "no message yet", field, formDefinition, pFormContext, v$ )
            }
            else {
                mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-
            }

            let isParam = !isString && tag && Object.keys(cfgValidator.params).length > 0

            // TODO: for isCustom validators, we need to invoke it to pass in the params and the fn ..
            //mappedValidator = mapValidators[tag] // only relevant if we did map it in the first place -for now: the config COULD carry it's own complete implementation???-

            if (mappedValidator) {
                
                if (isString) { // unparameterized validator
                    augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                }
                else if (isParam) { // parameterized validator
                    
                    let paramValues = []
                    let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                    
                    // if (cfgValidator.isCustom ){
                    //     mappedValidator = mapValidators[tag](_.clone(cfgValidator.params), cfgValidator.fn)
                    // }
                    // cfgValidator.params.forEach(function (paramEntry) {
                    _.forIn(cfgValidator.params, function (paramEntry) {
                        //cfgValidator.params.forEach(function (paramEntry) {
                        if (normalize && paramEntry) {
                            //debugger
                            let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                            _.forEach(paramEntry, function (paramValue) {
                                paramValues.push(paramValue)
                            })
                        }
                        else { //push as is
                            paramValues.push(paramEntry)
                        }
                    })
                    //debugger
                    // if the mappedValidator can be invoked, set the validator to the parameterized invocation of it, since apparently we have params ...
                    if (typeof mappedValidator === 'function' && paramValues.length > 0){
                        augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator(paramValues))
                    }
                    // else if we have passed it ourselves, it should already have the correct signature????
                    else {
                        augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                    }
                }
                // if (fieldName === 'firstnamertx'){
                //     objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' using source code from validate.ts`})
                // }        
                objValidator[tag] = augmentedValidator
            }
            else {
                //debugger
                // for totally extraneous rules, say from the server ...
                if (cfgValidator.isCustom ){

                    // map it to visibility hardcoded for now to test...
                    //mappedValidator = visibility(_.clone(cfgValidator.params), cfgValidator.fn , field, formDefinition, pFormContext )
                    //TODO: do we HAVE to clone the params? TODO: pass in the rest of the context like fieldValues/formdata and formdefinition etc ? 
                    //TODO make this dynamically valid code, so that we will support validatrs of type: display, disableIf etc etc 
                    mappedValidator = visibility(_.clone(cfgValidator.params), cfgValidator.fn)

                    if (isParam) { // parameterized custom validator
                        let paramValues = []
                        let normalize = !cfgValidator?.normalizeParams || cfgValidator?.normalizeParams !== false
                        //debugger;
                        let iterator = Array.isArray(cfgValidator.params) ? cfgValidator.params : Object.values(cfgValidator.params)
                            iterator.forEach(function (paramEntry) {
                                if(paramEntry){
                                    //_.forEach(cfgValidator.params, function (paramEntry) {
                                    if (normalize) {
                                        // let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                                        // _.forEach(paramEntry, function (paramValue) {
                                        //     paramValues.push(paramValue)
                                        // })
                                        let iterator = Array.isArray(paramEntry) ? paramEntry : Object.values(paramEntry)
                                        iterator.forEach(function (paramValue) {
                                            paramValues.push(paramValue)
                                        })
                                    }
                                    else { //push as is
                                        paramValues.push(paramEntry)
                                    }
                            }
                        })
                        if (paramValues.length > 0){ 
                            // set the validator to the parameterized invocation of it, since apparently we have params ...
                            augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator(...paramValues))
                        }
                        else {                        
                            augmentedValidator = addParamsTovalidator({ fieldLabel }, mappedValidator)
                        }
                    }
                    // if (fieldName === 'firstnamex'){
                    //     //augmentedValidator = addParamsTovalidator({ fieldLabel }, { $validator: cfgValidator.fn, $message: `Invalid name via custom validator 'name_pattern' from external JSON`})
                    //     augmentedValidator = addParamsTovalidator({ fieldLabel }, { $validator: cfgValidator.fn, $message: cfgValidator.message })
                    // }
                    objValidator[tag] = augmentedValidator
                }
            }
        })

        //for test purposes, for field firstnamertx add hardcoded a name validator
        // if relevant, add these validators
        // if (fieldName === 'firstnamertx'){
        //     objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' `})
        // }
        // this works with validName being a classic Function. Also as arrow funciton?
        if (fieldName === 'firstnamertx'){
            objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' `})
        }

        if ( _.values(objValidator).length>0 ){
            validatorRules[fieldName] = objValidator
        }
    })
    return validatorRules
}

type returnValue = {
    valid: boolean
    info: string
}

/**
 * naive validate.
 * TODO: code all kinds of validators and edge cases or use a proper validation framework 
 * @param value 
 * @param validators 
 * @returns 
 */
const validate = function (value: unknown, validators: Validator[]): returnValue {
    // clone the value deeply (and idealy once) since we might have to change it in some validator...
    let lvalue = _.cloneDeep(value);
    const returnValue = { valid: true, info: '' }
    validators.forEach(function (validator) {
        if (validator === 'required') {
            // when a string, trim, since/if/because a value consisting only out of spaces does not count as a valid value.
            if (typeof lvalue === 'string') {
                lvalue = lvalue.trim()
            }

            if (_.isEmpty(lvalue)) {
                returnValue.valid = false
                returnValue.info = validator
                // break out of the loop at the first invalidati... for now ...
                return
            }
        }
    })
    return returnValue
}

export { validate }