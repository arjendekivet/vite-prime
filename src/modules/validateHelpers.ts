/**
 * Logica: 
* Qua <Feature> "Validity, Visibility, Mode (Read/ReadOnly/Edit), Calculation/Computation/value" 
              (hoe het dan ook gaat heten qua config property en qua html attribute vue component property: display/hidden/show/hide/visible/invisible ) 

* 1. Als een entity configuratie een eigen statische <Feature> config property heeft, is die leading. Die MAG NIET worden overruled. Einde evaluatie.
* 2. Als het veld dat niet heeft, maar wel een "dependency in een rule" heeft, dan bepaalt die dependency rule het resultaat van die feature.
*      Bijvoorbeeld: veld heeft "dependsOn" of upstream heeft "dependents" die op dit veld slaat.
*      Vraagstuk: Moet de genoemde dependent field daadwerkelijk een relevante visibility validator hebben, of gaat dit buiten de verantwoordelijkheid van dit veld om? 
*      In de zin van: geen rule is ook een rule. Geen rule om visibility te negeren betekent toestemming voor visibility.
*
* uitzondering bij validatie: systemrequired voor savedraft versus required, requiredIf etc etc
*/ 
// TODO: if all methods used can come from Array instead of Lodash, drop Lodash dependency
// like myArray =[] myArray.every instead of _.every( myArray, <bla>) etc 

import _ from 'lodash'

//const RULE_GENERATOR = Symbol('__RuleGenerator__');

export const RULE_GENERATOR = "RULE_GENERATOR";
export const VISIBILITY = 'displayIf';
export const SILENTVALIDITY = '$silentErrors'
export const V_SILENTERRORS = '$silentErrors'
export const V_VALID = '$invalid' // or $error NB: test for invalidity in vuelidate so we should invert it ...
export const V_DISPLAYIF = 'displayIf';
export const V_DISABLEIF = 'disableIf';

// terms to be used in the Configuration of validators (in the form definitions / fields definition) 
export const ALL_VISIBLE = "allVisible";
export const ALL_VALID = "allValid";
export const ALL_INVALID = "allInvalid";

export const IS_VISIBLE = "isVisible";
export const SOME_VISIBLE = "someVisible";

// Introduce constants for the validator names/types in order NOT to clash with built-in and other imported working vuelidate validators
export const V_CUSTOM_PREFIX = '__cv__';
export const CV_TYPE_DISABLE_IF = `${V_CUSTOM_PREFIX}${V_DISABLEIF}`;
// todo
export const CV_TYPE_DISPLAY_IF = `${V_CUSTOM_PREFIX}${V_DISPLAYIF}`;
// todo terms for config props

export const CFG_PROP_ENTITY_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
export const CFG_PROP_ENTITY_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

export const CFG_PROP_ENTITY_DISABLE = 'disable'; // indicates in fieldCfg the optional property 'disable' decides the field disabling
export const CFG_PROP_ENTITY_DISABLE_INVERT = false; // indicates a disable rule will NOT ave to negate the config prop


// define helper functions like isValid, isVisible, isDisabled, that take a fieldname and return a boolean if the retrieved info qualifies.
export const cHelpers = {
    isValidSilent: (vm, fieldName) => {
        debugger;
        let result = true;
        debugger;
        try {
            // inverts: (if lenght > 0) then there are errors. primary result = true. (!result => false) !!result=true !!!result=false 
            result = !!!(vm?.v$?.[fieldName]?.[V_SILENTERRORS]?.length > 0)
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
                result =  cHelpers.isValidSilent(vm,fieldName)
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
                result = cHelpers.isValidSilent(vm,fieldName)
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
            result = !( cHelpers.allValidSilent(vm, arrFieldNames))
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
        debugger;
        try {
            // invert the result becuase vuelidate flags $error or $invalid
            result = !!!(vm?.v$?.[fieldName]?.[V_VALID])
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
                result =  cHelpers.isValid(vm, fieldName)
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
                result =  cHelpers.isValid(vm,fieldName)
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
    /**
     * 
     * TODO: should this also take into account !!config.hidden? or !!!config.systemHidden or such?
    * from $response?.extraParams?.fieldCfg ...
    * Hoe weet je wat de source of truth is? Stel field.hidden = true komt aanvankelijk binnen vanaf de server.
    * als je niet steeds terug wil naar de server, en een rule execution rekent uit "show", 
    * hoe moet je dan vastleggen dat de rule wint van de statische config?
    * of moet de insteek zijn: als er geen regel is, bepaalt fieldCfg.hidden dat, maar als er wel een regel is dan bepaalt die regel het, omdat de regel dynamisch is ?
    * 
    * oftewel: als een veld, qua visibility, 
    * 1. de eigen systemHidden property mag NIET worden overruled.
    * 2. als het veld een dependsOn heeft, 
    *      ???? EN de genoemde dependent field heeft inderdaad een visibility validator, ???? of gaat dit buiten de verantwoordelijkheid van dit veld ?????
    *   dan bepaalt de dependsOn rule execution de visibility.
    * 3. Als dit niet van toepassing is, dus geen systemHidden en geen dependsOn, dan bepaalt de eigen .hidden property de visibility.
    * 
    * Dezelfde logica zou kunnen gelden voor Read / Edit ( enbaled / disabled)
    * * 1. de eigen readOnly property mag NIET worden overruled. (dat is als systemRead of systemDisabled )
    * 2. als het veld een dependsOn heeft, 
    *      ???? EN de genoemde dependent field heeft inderdaad een visibility validator, ???? of gaat dit buiten de verantwoordelijkheid van dit veld ?????
    *   dan bepaalt de dependsOn rule execution de visibility.
    * 3. Als dit niet van toepassing is, dus geen systemHidden en geen dependsOn, dan bepaalt de eigen .hidden property de visibility.
    * 
     * @param vm 
     * @param fieldName 
     * @returns 
     * 
     */
    isVisible: (vm, fieldName) => {
        debugger;
        let result = true;
        try {
            // 1. Does the field have a leading static config property to decide? CFG_PROP_ENTITY_DISPLAY
            // if ()
            // 2. If not, does the field have rule results that decide.
            //result = !!(vm?.v$?.[fieldName]?.[V_DISPLAYIF]?.$response?.extraParams?.rule_result ?? true)
            result = (vm?.v$?.[fieldName]?.[V_DISPLAYIF]?.$response?.extraParams?.rule_result ?? true)
            // for now we also have to take into account CV_TYPE_DISPLAY_IF!!!! temporarily, as long as we also use the displayIf with spawned external functions :-)
            result = result ? (vm?.v$?.[fieldName]?.[CV_TYPE_DISPLAY_IF]?.$response?.extraParams?.rule_result ?? true) : result
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
                result =  cHelpers.isVisible(vm, fieldName)
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
                result = cHelpers.isVisible(vm,fieldName)
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
    // TODO: should this also take into account !!config.disabled? or !!!config.enabled === false???
    // from $response?.extraParams?.fieldCfg ...
    isDisabled: (vm, fieldName) => {
        debugger;
        let result = false;
        try {
            result = !!(vm?.v$?.[fieldName]?.[CV_TYPE_DISABLE_IF]?.$response?.extraParams?.rule_result)
        }
        catch(e)
        {
            console.log(e);
            debugger;
        }
        return result
    },
    someDisabled:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result =  cHelpers.isDisabled(vm, fieldName)
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
    allDisabled:  (vm, arrFieldNames) => {
        debugger;
        let result = false;
        let arrResults = [];
        try {
            _.forEach(arrFieldNames, function(fieldName) {
                result = cHelpers.isDisabled(vm,fieldName)
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
 * A HOF for type 'displayIf', wich returns the parameterized version of a validator fn.
 * For now supports: 
 * conditioning on the eager validity of some/all fields.
 * conditioning on the lazy validity of some/all fields.
 * conditioning on the visibility of some/all fields.
 * conditioning on the disabled of some/all fields.
 * 
 * @param args. Array.  We expect to pass in one object containing all the necessary parametrizations. 
 * Supports refering to fields and their visibility-state or disabled-state or validity-state or their value ...
 * @returns a parameterized ruleFn for vuelidateto be used as a custom validator for vuelidate (as opposed to not a built-in one).
 */
export const disablerIf = ( ...args ) => {
    debugger;
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]

    if ( fieldCg?.[CFG_PROP_ENTITY_DISABLE ] !== undefined )
    {
        return function ruleFn(value, vm){
            debugger;
            const invert = CFG_PROP_ENTITY_DISABLE_INVERT; // indicates a display rule will have to negate the config prop
            ; // meaning: the config prop conceptually is the opposite!!! If the config is { hidden: true } this displayerIf should return False.
            let rule_result = invert ? !!!fieldCg?.[CFG_PROP_ENTITY_DISABLE] : !!fieldCg?.[CFG_PROP_ENTITY_DISABLE]
            return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `static disabler rule for ${fieldCfg.label}` }
        }
    }
    else if (dependsOn.ALL_VISIBLE && dependsOn.ALL_INVALID){
        debugger
        return function ruleFn(value, vm){
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
                debugger
                // for now: assume straight "and"-conjunctive instructions
                if (dependsOn.ALL_VISIBLE){
                    arrPartials.push( cHelpers.allVisible(vm, dependsOn.ALL_VISIBLE))
                }
                //Note: we could already bail out if this one is false?
                if (dependsOn.ALL_INVALID){
                    arrPartials.push( cHelpers.allInvalidSilent(vm, dependsOn.ALL_INVALID))
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
        return function ruleFn(value, vm){
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
                    arrPartials.push( cHelpers.allVisible(vm, dependsOn.ALL_VISIBLE))
                }
                if (dependsOn.ALL_INVALID){
                    arrPartials.push( cHelpers.allInvalidSilent(vm, dependsOn.ALL_INVALID))
                }
                rule_result = _.every(arrPartials, Boolean)
            }
            debugger;
            
            // if ( <all kind og business logic>) { display_result = true/false }
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result , fieldCfg }, message: "test disabling rule on cat_5, depending on cat_4" }
        }
    }
}

/**
 * TODO: write a parser / reducer which can walk the dependsOn object and map it to function invocations and reduce to a return value...
 * 
 * @param args
 * @returns 
 */
export const displayerIf = ( ...args ) => {
    debugger;
    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]

    // naieve version
    // 1. do we have a overruling static configuration property? Of: hoort hier niet thuis. Dit IS de ruleFn en die MAG alleen geimplemnteerd worden WANNEER er geen static overruler is.
    if ( fieldCfg?.[CFG_PROP_ENTITY_DISPLAY] !== undefined )
    {
        return function ruleFn(value, vm){
            debugger;
            const invert = CFG_PROP_ENTITY_DISPLAY_INVERT; // indicates a display rule will have to negate the config prop
            ; // meaning: the config prop conceptually is the opposite!!! If the config is { hidden: true } this displayerIf should return False.
            let rule_result = invert ? !!!fieldCg?.[CFG_PROP_ENTITY_DISPLAY] : !!fieldCg?.[CFG_PROP_ENTITY_DISPLAY]
            return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `static display rule for ${fieldCfg.label}` }
        }
    }
    // 2. 
    else if (dependsOn?.[ALL_VISIBLE] || dependsOn?.[IS_VISIBLE] || dependsOn?.[SOME_VISIBLE]){
        debugger
        return function ruleFn(value, vm){

            debugger;
            // default
            let fn = IS_VISIBLE
            let target = dependsOn?.[IS_VISIBLE]
            if (dependsOn?.[ALL_VISIBLE]){
                fn = ALL_VISIBLE;
                target = dependsOn[ALL_VISIBLE]
            }   
            else if (dependsOn?.[SOME_VISIBLE]){
                fn = ALL_VISIBLE;
                target = dependsOn[SOME_VISIBLE]
            } 
            
            let rule_result = false; // by default we should NOT disable stuff
            let arrPartials = [];
            debugger
            //TODO: write a parse which can walk the dependsOn object and map it to function invocations ...

            // 1. If the dependsOn object contains an "and" property ...ALL_VISIBLE
            if (dependsOn.and){}
            else if(dependsOn.or){}
            else if (dependsOn.not){}
            else {
                debugger
                arrPartials.push( cHelpers[fn]?.(vm, target) )
                rule_result = _.every(arrPartials, Boolean)
            }
            debugger;
            // if ( <all kind og business logic>) { display_result = true/false }
            // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
            return { $valid: true, extraParams: { rule_result , fieldCfg }, message: `test display rule for ${fieldCfg.label} dependent on ${_.join(dependsOn.ALL_VISIBLE)}` }
        }
    }
}

/**
 * 
 * @param type Returns true is the type name starts with our constant custom prefix: V_CUSTOM_PREFIX
 */
export const isCustomValidatorType = (type: string) => {
    const result = type?.indexOf(V_CUSTOM_PREFIX) > -1 ?? false
    if (result){
        debugger
    }
    return result
}

// example of config for field cat_5 to calculate if it should be "enabled or disabled". all conjunctive criteria should be grouped into the same array's and the disjunctive criteria should be in som other array etc etc
//// The logic OR means either disjunctive or conjunctive, when there are more criteria.
const ruleCfgProbeersel = { 
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
    },
    // als je niets specificeert, doen we "AND" / conjunctie...
    nogKorter: { ALL_VISIBLE: ['field_1', 'field_2'] , ALL_INVALID: ['field_1'] }
}

export default { 
    cHelpers, 
    disablerIf, 
    displayerIf,
    isCustomValidatorType, 
    V_CUSTOM_PREFIX,
    RULE_GENERATOR ,
    VISIBILITY ,
    SILENTVALIDITY ,
    V_SILENTERRORS ,
    V_VALID ,
    V_DISPLAYIF ,
    V_DISABLEIF ,
    ALL_VISIBLE ,
    ALL_VALID ,
    ALL_INVALID ,
    CV_TYPE_DISABLE_IF, 
    CV_TYPE_DISPLAY_IF,
};