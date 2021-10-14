import Fieldconfig from '@/types/fieldconfig'
import { ref } from 'vue';

import OptionType from '@/types/Option'
const catOne: OptionType[] = [
    { label: 'Duits', value: 'DE' },
    { label: 'Engels', value: 'EN' },
    { label: 'Frans', value: 'FR' },
];

const catTwo: OptionType[] = [
    { label: 'Chapter one', value: 'Ch-1' },
    { label: 'Chapter two', value: 'Ch-2' },
    { label: 'Chapter five', value: 'Ch-5' },
];

const catThree: OptionType[] = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
    { label: 'G', value: 'G' },
];

const formConfig = ref<Fieldconfig[]>()
formConfig.value = [
    {
        id: "tabview1",
        label: "TabView 1",
        type: "TabView",
        isContainer: true,
        items: [
            {
                id: "tabpanel1",
                label: "TabPanel 1",
                type: "TabPanel",
                isContainer: true,
                items: [
                    {
                        id: "FieldSet1",
                        label: "FieldSet 1",
                        type: "FieldSet",
                        isContainer: true,
                        items: [
                            {
                                id: 'title',
                                isField: true,
                                label: 'Title',
                                type: 'P_InputText',
                                placeholder: 'Title',
                                validators: [ 
                                    'required', 
                                    { type: 'minLength', params: [{ min: 2 }] }, 
                                    { type: 'maxLength', params: [{ max: 10 }] }, 
                                ],
                                icon: { type: 'right', name: 'pi-bookmark' }
                            },
                        ]
                    },
                    {
                        id: "FieldSet2",
                        label: "FieldSet 2",
                        type: "FieldSet",
                        isContainer: true,
                        items: [
                            {
                                id: 'due',
                                isField: true,
                                label: 'Due on',
                                type: 'Calendar',
                                showIcon: true,
                            },
                            {
                                id: 'description',
                                isField: true,
                                label: 'Description',
                                type: 'P_Textarea',
                                placeholder: 'Description',
                                validators: [ 
                                    'required', 
                                { type: 'minLength', params: [{ min: 10 }] }, 
                                { type: 'maxLength', params: [{ max: 1000 }] } ],
                                maxColumns: 1
                            },
                            {
                                id: 'answer',
                                isField: true,
                                label: 'Answer',
                                type: 'P_Textarea',
                                placeholder: 'Answer',
                                maxColumns: 1,
                                validators: [ 
                                    { 
                                        type: 'displayIf', // for completely dynamic rules we want to map it to the ruleGenerator via isCustom and via params: { type: 'displayIf'

                                        // property: dependsOn ?????????????????????????????????? 
                                        // binnen deze validator is duidelijker in de zin van dependentFields op field config nivo. Nu geeft het aan dat mbt display het ding afhangt van bepaalde velden
                                        // maar bijvoorbeeld tnb disabling zou het van (nog weer) andere veld(en) kunnen afhangen en tbv value calculation/computation van (nog weer andere) velden etc etc
                                        // dependsOn: ['cat_2'], 
                                        //isLazy: true, //not used yet
                                        dependsOn: ['title'], //Note: since we pass in fieldCfg we can get to dependsOn later on?????????
                                        isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
                                        params: { fieldCfg: undefined, formData: undefined , formDefinition: undefined },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
                                        /**
                                         * 
                                         * @param field: the invocing field
                                         * @param formData: the formData in scope 
                                         * @param formDefinition: the form Definition, this is the container of the field definitions, which should indicate if this field depends on or manages other fields 
                                        * (value, vm, fieldCfg, formData, formDefinition ) => { 
                                        * fn: (value, vm) => {
                                        */
                                        fn: function(value, vm, fieldCfg, formData, formDefinition ){
                                            debugger
                                            //return (fieldCfg, formData, formDefinition) => {
                                                // fieldCfg is the current field config to which the rule is associated, context is the form-data context (like ref or reactive fieldValues)
                                                debugger
                                                // is v$ in scope? 
                                                console.log('running fn in custom "validator/executor" for "displayIf"');
                                                console.log(vm)
                                                console.log('previous log was the passed vm...')
                                                // perform all kind of logic using the vm, which is form and should have access to ALL relevant stuff in scope
                                                // and the set the boolean result in rule_result
                                                //fake some rule which states that 'firstname' is NOT hidden or 'title' does not contain the string 'pipo'?    
                                                let rule_result = true;
                                                let tmp: String = vm.v$ && vm.v$['title'].$model

                                                if (tmp.includes("pipo")){
                                                    rule_result = false; 
                                                }
                                                
                                                // if ( <all kind og business logic>) { display_result = true/false }
                                                return { $valid: true, extraParams: { rule_result, vm }, message: "test: although the $valid says this thing is true, so it will not flag as a validation error, we calculated some boolean result for the visisbility/display and we have it in scope in v$[fieldname][<type>].$response.extraParams.rule_result and $message" };
                                            //}
                                        }
                                    }, 
                                ],
                            },
                        ]
                    },
                ],
            },
            {
                id: "tabpanel2",
                label: "TabPanel 2",
                type: "TabPanel",
                isContainer: true,
                items: [
                    {
                        id: "firstname2",
                        isField: true,
                        label: "Firstname2",
                        type: "P_InputText",
                        placeholder: "Firstname2",
                    },
                    {
                        id: 'cat_1',
                        isField: true,
                        label: 'Category 1',
                        type: 'P_Dropdown',
                        options: catOne,
                        optionLabel: "label",
                        optionValue: "value",
                        editable: true,
                        validators: ['required'],
                        dependantFields: ['cat_2'],
                    },
                    {
                        id: 'cat_2',
                        isField: true,
                        label: 'Category 2',
                        type: 'P_Dropdown',
                        options: catTwo,
                        optionLabel: "label",
                        optionValue: "value",
                        editable: true,
                        dependantFields: ['cat_3'],
                    },
                    {
                        id: 'cat_3',
                        isField: true,
                        label: 'Category 3',
                        type: 'P_Dropdown',
                        options: catThree,
                        optionLabel: "label",
                        optionValue: "value",
                        editable: true,
                        validators: ['required'],
                    },
                    {
                        id: 'cat_4',
                        isField: true,
                        label: 'Category 4',
                        type: 'P_Dropdown',
                        options: catThree,
                        optionLabel: "label",
                        optionValue: "value",
                        editable: true,
                        
                        // TODO with vuelidate validator rule: showIf/hideIf - enableIf/disableIf including specific dependencies via dependsOn ???
                        validators: [ 
                            { 
                                type: 'displayIf', // or: displayIf or 'visibility' or showIf ?? or hideIf 
                                // property: dependsOn ?????????????????????????????????? 
                                // binnen deze validator is duidelijker in de zin van dependentFields op field config nivo. Nu geeft het aan dat mbt display het ding afhangt van bepaalde velden
                                // maar bijvoorbeeld tnb disabling zou het van (nog weer) andere veld(en) kunnen afhangen en tbv value calculation/computation van (nog weer andere) velden etc etc
                                dependsOn: ['cat_3'], 
                                //isLazy: true, //not used yet
                                isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
                                params: { fieldCfg: undefined, formData: undefined , formDefinition: undefined },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
                                // /**
                                //  * TODO: figure out how extra paras will be passed to the fn after value and vm. If we have vm and say fieldValues / formdata object, we would be rather independent of v$
                                //  * and would not need v$ to model EACH field separately? Altough we might need that for display / enabling / multiPurpose rules!!!
                                //  function(value, vm, fieldCfg, formdata, formDefinition , field_vm){ 
                                // */
                                fn: (value, vm) => {
                                    debugger
                                    // In order for this to work, we must FIRST associate a dummy validator with EACH field, so that it will be monitored by v$!!!!! Else we can not use v$ for interdependcies as is 
                                    // fake some rule which states that if 'cat_3' is empty ... we should HIDE cat_4
                                    // or ... can we get to fieldCfg to check which dependesOn there are and then compose a dynamical rule like
                                    // forall dependsOn that thing must be visible?
                                    let rule_result = true;
                                    
                                    let tmp: String = vm?.v$?.cat_3?.$model
                                    debugger;
                                    if (tmp && tmp.toString().length < 1){
                                          rule_result = false  
                                    }
                                    
                                    // if ( <all kind og business logic>) { display_result = true/false }
                                    return { $valid: true, extraParams: { rule_result: rule_result, vm: vm }, message: "test visibility rule on cat_4" }
                                }
                            }, 
                            'required'
                        ],
                    },
                    {
                        id: 'cat_5',
                        isField: true,
                        label: 'Category 5',
                        type: 'P_Dropdown',
                        options: catThree,
                        optionLabel: "label",
                        optionValue: "value",
                        editable: true,
                        // TODO with vuelidate validator rule: showIf/hideIf - enableIf/disableIf including specific dependencies via dependsOn ???
                        validators: [ 
                            { 
                                type: 'displayIf', // or: hideIf 

                                // property: dependsOn ?????????????????????????????????? 
                                // binnen deze validator is duidelijker in de zin van dependentFields op field config nivo. Nu geeft het aan dat mbt display het ding afhangt van bepaalde velden
                                // maar bijvoorbeeld tnb disabling zou het van (nog weer) andere veld(en) kunnen afhangen en tbv value calculation/computation van (nog weer andere) velden etc etc
                                // dependsOn: ['cat_4'],
                                //isLazy: true, //not used yet
                                dependsOn: ['cat_4'], 
                                isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
                                params: { fieldCfg: undefined, formData: undefined , formDefinition: undefined },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
                                /**
                                 * 
                                 */
                                fn: function(value, vm){
                                    debugger
                                    // fake some rule which states that if 'cat_3' is NOT CALCULATED as visible based on a vuelidate rule ... we will HIDE cat_4
                                    let rule_result = true;
                                    let tmp: Boolean = vm?.v$ && vm.v$ && vm.v$['cat_4'] && vm.v$['cat_4'].displayIf?.$response?.extraParams?.rule_result
                                    debugger;
                                    if (tmp !== true){
                                          rule_result = false  
                                    }
                                    
                                    // if ( <all kind og business logic>) { display_result = true/false }
                                    return { $valid: true, extraParams: { rule_result: rule_result, vm: vm }, message: "test displayIf rule on cat_5, depending on cat_4" }
                                }
                            }, 
                            { 
                                type: 'disableIf',
                                // property: dependsOn ?????????????????????????????????? 
                                // binnen deze validator is duidelijker in de zin van dependentFields op field config nivo. Nu geeft het aan dat mbt display het ding afhangt van bepaalde velden
                                // maar bijvoorbeeld tnb disabling zou het van (nog weer) andere veld(en) kunnen afhangen en tbv value calculation/computation van (nog weer andere) velden etc etc
                                dependsOn: ['cat_4'], 
                                //isLazy: true, //not used yet
                                isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
                                params: { 
                                    dependsOn: {
                                        // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
                                        ALL_VISIBLE: ['cat_4', 'cat_5'], 
                                        ALL_INVALID: ['cat_4']
                                    }, 
                                    // TODO: we can strip these since we will standardly pass these in
                                    fieldCfg: undefined, 
                                    formData: undefined , 
                                    formDefinition: undefined 
                                },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
                                /**
                                 * try out how a functionBody would work????? Nope. 
                                 * try out a HOF which returns the validator but with an object populated ... yep, that works
                                 * Now figure out what is the best way of passing in and destructuring!!!
                                 */
                                fn: ( ...args ) => {
                                    debugger;
                                    const { dependsOn, fieldCfg, formData, formDefinition, ...params } = args[0]
                                    console.log(args[0])


                                    /**
                                     * Test rule which states that if 'cat_4' is silently invalid, we will return true. This indirectly will lead to DISABLE this field, cat_5.
                                     */
                                    return function validatorFn(value, vm){
                                        debugger;
                                        let rule_result = false; // by default we should NOT disable stuff
                                        // let tmp: Boolean = !!(vm?.v$?.cat_4?.$silentErrors?.length > 0);
                                        let tmp2: Boolean = !! vm?.v$[dependsOn]?.$silentErrors.length > 0
                                        debugger;
                                        rule_result = tmp2;
                                        
                                        // if ( <all kind og business logic>) { display_result = true/false }
                                        // todo: message kan ook een function zijn ... dus daar kunnen we alles in passen?
                                        return { $valid: true, extraParams: { rule_result }, message: "test disabling rule on cat_5, depending on cat_4" }
                                    }
                                },
                                // experimental notation to indicate which validators should be implemented ... 
                                cfgBak: {
                                    // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
                                    and: { ALL_VISIBLE: ['cat_4', 'cat_5'] , ALL_INVALID: ['cat_4'] }
                                },
                                // convention: without any and / or / not property, we assume and
                                cfg: {
                                    // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
                                    ALL_VISIBLE: ['cat_4', 'cat_5'], 
                                    ALL_INVALID: ['cat_4']
                                }
                            },
                        ],
                    },
                ],
            },
            {
                id: "tabpanel3",
                label: "TabPanel 3",
                type: "TabPanel",
                isContainer: true,
                items: [
                    {
                        id: "acordion1",
                        label: "Accordion XXXXX",
                        type: "Accordion",
                        isContainer: false,
                        items: [
                            {
                                id: "acordiontab1",
                                label: "Accordion Tab XXX",
                                type: "AccordionTab",
                                isContainer: true,
                                items: [
                                    {
                                        id: "firstnamertx",
                                        isField: true,
                                        label: "Firstnamertx",
                                        type: "P_InputText",
                                        placeholder: "Firstnamertx",
                                        isContainer: false,
                                        items: [],
                            
                                    },
                                    {
                                        id: "firstnamex",
                                        isField: true,
                                        label: "Firstnamex",
                                        type: "P_InputText",
                                        placeholder: "Firstnamex",
                                        isContainer: false,
                                        items: [],
                                        // this works: a fn is passed in to a vuelidate validator object { $validator: fn, $message: message } 
                                        // this breaks everything because type 'name_pattern' is not recognized as a vuelidate validator
                                        // this does not via mapping it to mapvalidators ...
                                        // it only works as an on the fly rule like so, for example
                                        // objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' `})
                                        vvalidators: [ 
                                            {
                                                type: 'name_pattern', 
                                                isCustom: true,
                                                params: {}, 
                                                fn: function validName(name) {
                                                    debugger
                                                    let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
                                                    if (validNamePattern.test(name)){return true;}
                                                    return false;
                                                },
                                                message: 'Invalid name via custom validator name_pattern from external JSON',
                                            }, 
                                            { type: 'minLength', params: [{ min: 10 }] }, 
                                            { type: 'maxLength', params: [{ max: 1000 }] }, 
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: "tabpanel4",
                label: "TabPanel 4",
                type: "TabPanel",
                isContainer: true,
                items: [
                    {
                        id: "firstname6",
                        isField: true,
                        label: "Firstname666",
                        type: "P_InputText",
                        placeholder: "Firstname6",
                    },
                    {
                        id: "firstnameOZAR",
                        isField: true,
                        label: "Firstname OZAR",
                        type: "P_InputText",
                        placeholder: "Firstname Ozar",
                        vvalidators: [ 
                            {
                                type: 'custom_dynamic_from_json', 
                                isCustom: true,
                                params: {pipo: undefined, cows: undefined }, // deze worden in runtime gepopuleerd door de rule_generator routine 
                                /**
                                 * De higher Order Function "rule_Generator" in runtime in validate.ts moet de aanroep verzorgen.
                                 * Deze functie moet gewoon de echte validator function zijn die de boolean retoruneert
                                 * @returns 
                                 */
                                fn: (value, vm) => {
                                    debugger
                                    let lPipo = pipo; // Deze zou in runtime door de higher order component gepopueerd moeten worden...
                                    let lCow = cow; // Deze zou in runtime door de higher order component gepopueerd moeten worden...
                                    let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
                                    if (validNamePattern.test(name)){return true;}
                                    return false;
                                },
                                message: 'Invalid name via custom validator name_pattern from external JSON',
                            }, 
                            { type: 'minLength', params: [{ min: 10 }] }, 
                            { type: 'maxLength', params: [{ max: 1000 }] }, 
                        ],
                    },
                ],
            },
        ],
    },
];

export default formConfig