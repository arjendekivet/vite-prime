import Fieldconfig from '@/types/fieldconfig'
import { ref } from 'vue';
// import { CV_TYPE_DISABLE_IF , CV_TYPE_DISPLAY_IF, IS_VISIBLE , IS_VALID, ALL_VALID} from '@/modules/validateHelpers' //custom vuelidate helpers...
import cvh from '@/modules/validateHelpers' //custom vuelidate helpers...

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

const formConfigBak = ref<Fieldconfig[]>()
const formConfig = ref<Fieldconfig[]>()

// formConfigBak.value = [
//     {
//         id: "tabview1",
//         label: "TabView 1",
//         type: "TabView",
//         isContainer: true,
//         items: [
//             {
//                 id: "tabpanel1",
//                 label: "TabPanel 1",
//                 type: "TabPanel",
//                 isContainer: true,
//                 items: [
//                     {
//                         id: "FieldSet1",
//                         label: "FieldSet 1",
//                         type: "FieldSet",
//                         isContainer: true,
//                         items: [
//                             {
//                                 id: 'title',
//                                 isField: true,
//                                 label: 'Title',
//                                 type: 'P_InputText',
//                                 placeholder: 'Title',
//                                 validators: [ 
//                                     'required', 
//                                     { type: 'minLength', params: [{ min: 2 }] }, 
//                                     { type: 'maxLength', params: [{ max: 10 }] }, 
//                                 ],
//                                 icon: { type: 'right', name: 'pi-bookmark' }
//                             },
//                         ]
//                     },
//                     {
//                         id: "FieldSet2",
//                         label: "FieldSet 2",
//                         type: "FieldSet",
//                         isContainer: true,
//                         items: [
//                             {
//                                 id: 'due',
//                                 isField: true,
//                                 label: 'Due on',
//                                 type: 'Calendar',
//                                 showIcon: true,
//                             },
//                             {
//                                 id: 'description',
//                                 isField: true,
//                                 label: 'Description',
//                                 type: 'P_Textarea',
//                                 placeholder: 'Description',
//                                 validators: [ 
//                                     'required', 
//                                 { type: 'minLength', params: [{ min: 10 }] }, 
//                                 { type: 'maxLength', params: [{ max: 1000 }] } ],
//                                 maxColumns: 1
//                             },
//                             {
//                                 id: 'answer',
//                                 isField: true,
//                                 label: 'Answer',
//                                 type: 'P_Textarea',
//                                 placeholder: 'Answer',
//                                 maxColumns: 1,
//                                 validators: [ 
//                                     { 
//                                         type: 'displayIf', // for completely dynamic rules we want to map it to the ruleGenerator via isCustom and via params: { type: 'displayIf'

//                                         // property: dependsOn ?????????????????????????????????? 
//                                         // binnen deze validator is duidelijker in de zin van dependentFields op field config nivo. Nu geeft het aan dat mbt display het ding afhangt van bepaalde velden
//                                         // maar bijvoorbeeld tnb disabling zou het van (nog weer) andere veld(en) kunnen afhangen en tbv value calculation/computation van (nog weer andere) velden etc etc
//                                         // dependsOn: ['cat_2'], 
//                                         //isLazy: true, //not used yet
//                                         dependsOn: ['title'], //Note: since we pass in fieldCfg we can get to dependsOn later on?????????
//                                         isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
//                                         params: { fieldCfg: undefined, formData: undefined , formDefinition: undefined },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
//                                         /**
//                                          * 
//                                          * @param field: the invocing field
//                                          * @param formData: the formData in scope 
//                                          * @param formDefinition: the form Definition, this is the container of the field definitions, which should indicate if this field depends on or manages other fields 
//                                         * (value, vm, fieldCfg, formData, formDefinition ) => { 
//                                         * fn: (value, vm) => {
//                                         */
//                                         fn: function(value, vm, fieldCfg, formData, formDefinition ){
//                                             debugger
//                                             //return (fieldCfg, formData, formDefinition) => {
//                                                 // fieldCfg is the current field config to which the rule is associated, context is the form-data context (like ref or reactive fieldValues)
//                                                 debugger
//                                                 // is v$ in scope? 
//                                                 console.log('running fn in custom "validator/executor" for "displayIf"');
//                                                 console.log(vm)
//                                                 console.log('previous log was the passed vm...')
//                                                 // perform all kind of logic using the vm, which is form and should have access to ALL relevant stuff in scope
//                                                 // and the set the boolean result in rule_result
//                                                 //fake some rule which states that 'firstname' is NOT hidden or 'title' does not contain the string 'pipo'?    
//                                                 let rule_result = true;
//                                                 let tmp: String = vm.v$ && vm.v$['title'].$model

//                                                 if (tmp.includes("pipo")){
//                                                     rule_result = false; 
//                                                 }
                                                
//                                                 // if ( <all kind og business logic>) { display_result = true/false }
//                                                 return { $valid: true, extraParams: { rule_result, vm }, message: "test: although the $valid says this thing is true, so it will not flag as a validation error, we calculated some boolean result for the visisbility/display and we have it in scope in v$[fieldname][<type>].$response.extraParams.rule_result and $message" };
//                                             //}
//                                         }
//                                     }, 
//                                 ],
//                             },
//                         ]
//                     },
//                 ],
//             },
//             {
//                 id: "tabpanel2",
//                 label: "TabPanel 2",
//                 type: "TabPanel",
//                 isContainer: true,
//                 items: [
//                     {
//                         id: "firstname2",
//                         isField: true,
//                         label: "Firstname2",
//                         type: "P_InputText",
//                         placeholder: "Firstname2",
//                     },
//                     {
//                         id: 'cat_1',
//                         isField: true,
//                         label: 'Category 1',
//                         type: 'P_Dropdown',
//                         options: catOne,
//                         optionLabel: "label",
//                         optionValue: "value",
//                         editable: true,
//                         validators: ['required'],
//                         // dependantFields: ['cat_2'],
//                     },
//                     {
//                         id: 'cat_2',
//                         isField: true,
//                         label: 'Category 2',
//                         type: 'P_Dropdown',
//                         options: catTwo,
//                         optionLabel: "label",
//                         optionValue: "value",
//                         editable: true,
//                         // dependantFields: ['cat_3'],
//                         validators: [
//                             { 
//                                 type: CV_TYPE_DISPLAY_IF,
//                                 params: { dependsOn: { ALL_VISIBLE: ['cat_1'] , ALL_VALID: ['cat_1'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
//                             },
//                         ],
//                     },
//                     {
//                         id: 'cat_3',
//                         isField: true,
//                         label: 'Category 3',
//                         type: 'P_Dropdown',
//                         options: catThree,
//                         optionLabel: "label",
//                         optionValue: "value",
//                         editable: true,
//                         validators: [
//                             { 
//                                 type: CV_TYPE_DISPLAY_IF,
//                                 params: { dependsOn: { IS_VISIBLE: ['cat_2'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
//                             },
//                         ],
//                     },
//                     {
//                         id: 'cat_4',
//                         isField: true,
//                         label: 'Category 4',
//                         type: 'P_Dropdown',
//                         options: catThree,
//                         optionLabel: "label",
//                         optionValue: "value",
//                         editable: true,
//                         // TODO with vuelidate validator rule: showIf/hideIf - enableIf/disableIf including specific dependencies via dependsOn ???
//                         validators: [ 
//                             { 
//                                 type: CV_TYPE_DISPLAY_IF,
//                                 params: { dependsOn: { IS_VISIBLE: ['cat_3'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
//                             },
//                             'required'
//                         ],
//                     },
//                     {
//                         id: 'cat_5',
//                         isField: true,
//                         label: 'Category 5',
//                         type: 'P_Dropdown',
//                         options: catThree,
//                         optionLabel: "label",
//                         optionValue: "value",
//                         editable: true,
//                         // TODO with vuelidate validator rule: showIf/hideIf - enableIf/disableIf including specific dependencies via dependsOn ???
//                         validators: [ 
//                             // { 
//                             //     type: 'displayIf', // or: hideIf 

//                             //     // property: dependsOn ?????????????????????????????????? 
//                             //     // binnen deze validator is duidelijker in de zin van dependentFields op field config nivo. Nu geeft het aan dat mbt display het ding afhangt van bepaalde velden
//                             //     // maar bijvoorbeeld tnb disabling zou het van (nog weer) andere veld(en) kunnen afhangen en tbv value calculation/computation van (nog weer andere) velden etc etc
//                             //     // dependsOn: ['cat_4'],
//                             //     //isLazy: true, //not used yet
//                             //     dependsOn: ['cat_4'], 
//                             //     isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
//                             //     params: { fieldCfg: undefined, formData: undefined , formDefinition: undefined },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
//                             //     /**
//                             //      * 
//                             //      */
//                             //     fn: function(value, vm){
//                             //         debugger
//                             //         // fake some rule which states that if 'cat_3' is NOT CALCULATED as visible based on a vuelidate rule ... we will HIDE cat_4
//                             //         let rule_result = true;
//                             //         let tmp: Boolean = vm?.v$ && vm.v$ && vm.v$['cat_4'] && vm.v$['cat_4'].displayIf?.$response?.extraParams?.rule_result
//                             //         debugger;
//                             //         if (tmp !== true){
//                             //               rule_result = false  
//                             //         }
                                    
//                             //         // if ( <all kind og business logic>) { display_result = true/false }
//                             //         return { $valid: true, extraParams: { rule_result: rule_result, vm: vm }, message: "test displayIf rule on cat_5, depending on cat_4" }
//                             //     }
//                             // },
//                             { 
//                                 type: CV_TYPE_DISPLAY_IF,
//                                 params: { dependsOn: { IS_VISIBLE: ['cat_4'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
//                             },  
//                             //TODO: type should be used to unambiguously map to either a builtin validator or a custom validator we need a HOF for this one
//                             // V_CUSTOM_PREFIX is used ... 'cv__' means 'custom validator_'
//                             //in order NOT to clash with built in validators, we use a prefix V_CUSTOM_PREFIX
//                             //or should we use a global symbol for that     ??????                       
//                             { 
//                                 type: CV_TYPE_DISABLE_IF, // ' should resolve to something like ... __cv__DisableIf',
//                                 //isCustom: true, //indicates this 'validator' or rules-engine rule should be treated as an entirely autonomous rule (as opposed to not injecting some $validator function in an existing validator)
//                                 params: { 
//                                     dependsOn: {
//                                         // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
//                                         ALL_VISIBLE: ['cat_5'], 
//                                         ALL_INVALID: ['cat_4']
//                                     }
//                                 },  // TODO special object format instead of array??? also ??? if lazy false it is calculated immediately, to determine if the field should be displayed
                                
//                                 // experimental notation to indicate which validators should be implemented ... 
//                                 cfgBak: {
//                                     // and indicates all cfgs instructions within this object should give TRUE, no matter how these are composed 9id est: they could hold nested conditions that result false etc
//                                     and: { ALL_VISIBLE: ['cat_4', 'cat_5'] , ALL_INVALID: ['cat_4'] }
//                                 },
//                                 // convention: without any 'and' / 'or' / 'not' property, we assume 'and' (conjunctive) for easiest configuration?
//                                 cfg: {
//                                     ALL_VISIBLE: ['cat_4', 'cat_5'], 
//                                     ALL_INVALID: ['cat_4']
//                                 }
//                             },
//                             { type: 'minLength', params: [{ min: 10 }] }, 
//                             { type: 'maxLength', params: [{ max: 15 }] }, 
//                         ],
//                     },
//                 ],
//             },
//             {
//                 id: "tabpanel3",
//                 label: "TabPanel 3",
//                 type: "TabPanel",
//                 isContainer: true,
//                 items: [
//                     {
//                         id: "acordion1",
//                         label: "Accordion XXXXX",
//                         type: "Accordion",
//                         isContainer: false,
//                         items: [
//                             {
//                                 id: "acordiontab1",
//                                 label: "Accordion Tab XXX",
//                                 type: "AccordionTab",
//                                 isContainer: true,
//                                 items: [
//                                     {
//                                         id: "firstnamertx",
//                                         isField: true,
//                                         label: "Firstnamertx",
//                                         type: "P_InputText",
//                                         placeholder: "Firstnamertx",
//                                         isContainer: false,
//                                         items: [],
                            
//                                     },
//                                     {
//                                         id: "firstnamex",
//                                         isField: true,
//                                         label: "Firstnamex",
//                                         type: "P_InputText",
//                                         placeholder: "Firstnamex",
//                                         isContainer: false,
//                                         items: [],
//                                         // this works: a fn is passed in to a vuelidate validator object { $validator: fn, $message: message } 
//                                         // this breaks everything because type 'name_pattern' is not recognized as a vuelidate validator
//                                         // this does not via mapping it to mapvalidators ...
//                                         // it only works as an on the fly rule like so, for example
//                                         // objValidator['valid_name'] = addParamsTovalidator({ fieldLabel }, { $validator: validName, $message: `Invalid name via custom validator 'valid_name' `})
//                                         vvalidators: [ 
//                                             {
//                                                 type: 'name_pattern', 
//                                                 isCustom: true,
//                                                 params: {}, 
//                                                 fn: function validName(name) {
//                                                     debugger
//                                                     let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
//                                                     if (validNamePattern.test(name)){return true;}
//                                                     return false;
//                                                 },
//                                                 message: 'Invalid name via custom validator name_pattern from external JSON',
//                                             }, 
//                                             { type: 'minLength', params: [{ min: 10 }] }, 
//                                             { type: 'maxLength', params: [{ max: 1000 }] }, 
//                                         ],
//                                     },
//                                 ],
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 id: "tabpanel4",
//                 label: "TabPanel 4",
//                 type: "TabPanel",
//                 isContainer: true,
//                 items: [
//                     {
//                         id: "firstname6",
//                         isField: true,
//                         label: "Firstname666",
//                         type: "P_InputText",
//                         placeholder: "Firstname6",
//                     },
//                     {
//                         id: "firstnameOZAR",
//                         isField: true,
//                         label: "Firstname OZAR",
//                         type: "P_InputText",
//                         placeholder: "Firstname Ozar",
//                         vvalidators: [ 
//                             {
//                                 type: 'custom_dynamic_from_json', 
//                                 isCustom: true,
//                                 params: {pipo: undefined, cows: undefined }, // deze worden in runtime gepopuleerd door de rule_generator routine 
//                                 /**
//                                  * De higher Order Function "rule_Generator" in runtime in validate.ts moet de aanroep verzorgen.
//                                  * Deze functie moet gewoon de echte validator function zijn die de boolean retoruneert
//                                  * @returns 
//                                  */
//                                 fn: (value, vm) => {
//                                     debugger
//                                     let lPipo = pipo; // Deze zou in runtime door de higher order component gepopueerd moeten worden...
//                                     let lCow = cow; // Deze zou in runtime door de higher order component gepopueerd moeten worden...
//                                     let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
//                                     if (validNamePattern.test(name)){return true;}
//                                     return false;
//                                 },
//                                 message: 'Invalid name via custom validator name_pattern from external JSON',
//                             }, 
//                             { type: 'minLength', params: [{ min: 10 }] }, 
//                             { type: 'maxLength', params: [{ max: 1000 }] }, 
//                         ],
//                     },
//                 ],
//             },
//         ],
//     },
// ];

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
                                id: 'test0',
                                isField: true,
                                label: 'Test 0',
                                type: 'P_InputText',
                                placeholder: 'Test 0',
                                defaultValue: 5,
                                validators: [ 
                                    { 
                                        type: 'between', 
                                        params: [ {min: 0}, {max: 10} ] 
                                    } 
                                ]
                            },
                            {
                                id: 'test1',
                                isField: true,
                                label: 'Test 1',
                                type: 'P_InputText',
                                placeholder: 'Test 1',
                                defaultValue: 15,
                                validators: [ 
                                    { 
                                        type: 'between', 
                                        params: [ {min: 11}, {max: 20} ] 
                                    } 
                                ]
                            },
                            {
                                id: 'testbetween',
                                isField: true,
                                label: 'Test Between',
                                type: 'P_InputText',
                                placeholder: 'Test Between x & y from Test0 & Test1',
                                validators: [ 
                                    { 
                                        type: 'between', 
                                        params: [ { $model: 'test0' }, { $model: 'test1' } ] 
                                    } 
                                ]
                            },
                            {
                                id: 'title',
                                isField: true,
                                label: 'Title',
                                type: 'P_InputText',
                                placeholder: 'Title',
                                validators: [ 
                                    //'required', 
                                    { type: 'minLength', params: [{ $model: 'test0' }] }, //this should pick up the value of test dynamically, in order to specifiy which dynamical minLength to use ?
                                    { type: 'maxLength', params: [{ $model: 'test1' }] }, 
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
                                        fn: function(value, vm){
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
                        id: 'cat_1',
                        isField: true,
                        label: 'Category 1',
                        type: 'P_Dropdown',
                        options: catOne,
                        optionLabel: "label",
                        optionValue: "value",
                        editable: true,
                        validators: [
                            //'required' Only whne the title has been filled out 
                            // AND the description ???
                            { type: 'requiredIf', params: [{ $model: 'title' }] }
                        ]
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
                        // dependantFields: ['cat_3'],
                        validators: [
                            //'required',
                            { type: 'requiredIf', params: [{ $model: 'cat_1' }] }, //how to dynamically insert the value of field cat_2 as the condition for requiredIf ??????
                            { 
                                type: cvh.CV_TYPE_DISPLAY_IF,
                                //params: { dependsOn: { [cvh.ALL_VISIBLE]: ['cat_1'] , [cvh.ALL_VALID]: ['cat_1'] } }, // equivalent would be SOME_<> or IS_ when there is only 1 dependecy mentioned
                                params: { 
                                    dependsOn: { 
                                        // required: 'cat_1', // hoe kunnen we dynamisch allerlei bestaande validators koppelen ? Willen we dat??????? zoals requiredIf or between etc etc binnen andere rules!!!!
                                        [cvh.IS_VISIBLE]: ['cat_1'] } 
                                }, 
                            },
                            { 
                                type: cvh.CV_TYPE_DISABLE_IF,
                                params: { dependsOn: { [cvh.ALL_INVALID]: ['cat_1'] } },
                            },
                        ],
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
                        validators: [
                            //'required', 
                            { type: 'minLength', params: [{ min: 10 }] }, //this should pick up the value of test dynamically, in order to specifiy which dynamical minLength to use ?
                            { type: 'maxLength', params: [{ max: 20 }] }, 
                            { 
                                type: cvh.CV_TYPE_DISPLAY_IF,
                                params: { dependsOn: { [cvh.IS_VALID]: ['title'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
                            },
                            // { 
                            //     type: cvh.CV_TYPE_DISPLAY_IF,
                            //     params: { dependsOn: { [cvh.IS_VISIBLE]: ['cat_2'] } }, // optionally we could add [cvh.IS_VALID]: ['cat_2']
                            // },
                            { 
                                type: cvh.CV_TYPE_DISABLE_IF,
                                params: { dependsOn: { [cvh.SOME_INVALID]: ['cat_2'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
                            },
                        ],
                    },
                    // {
                    //     id: 'cat_4',
                    //     isField: true,
                    //     label: 'Category 4',
                    //     type: 'P_Dropdown',
                    //     options: catThree,
                    //     optionLabel: "label",
                    //     optionValue: "value", 
                    //     editable: true,
                    //     validators: [
                    //         // differs from cat_3: display only depends upon validity, not both visibility and validity of cat_3 ...
                    //         { 
                    //             type: cvh.CV_TYPE_DISPLAY_IF,
                    //             params: { dependsOn: { [cvh.IS_VALID]: ['cat_3'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
                    //         },
                    //         // { 
                    //         //     type: cvh.CV_TYPE_DISPLAY_IF,
                    //         //     params: { dependsOn: { [cvh.IS_VISIBLE]: ['cat_3'] , [cvh.ALL_VALID]: ['cat_3'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
                    //         // },
                    //         // differs from cat_3: it does not need to be disabled IF it is NOT visible as long as cat_3 is not VISIBle
                    //         { 
                    //             type: cvh.CV_TYPE_DISABLE_IF,
                    //             params: { dependsOn: { [cvh.IS_INVALID]: ['cat_3'] } }, // or SOME or ALL etc 
                    //         },
                    //     ],
                    // }
                ],
            },
        ],
    },
];
export default formConfig