import Fieldconfig from '@/types/fieldconfig'
import { ref } from 'vue';
// import { CV_TYPE_DISABLE_IF , CV_TYPE_DISPLAY_IF, IS_VISIBLE , IS_VALID, ALL_VALID} from '@/modules/validateHelpers' //custom vuelidate helpers...
import cvh from '@/modules/rules/validateHelpers' //custom vuelidate helpers...

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
                                            //return (fieldCfg, formData, formDefinition) => {
                                                // fieldCfg is the current field config to which the rule is associated, context is the form-data context (like ref or reactive fieldValues)
                                                // is v$ in scope? 
                                                // console.log('running fn in custom "validator/executor" for "displayIf" for field answer');
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
                        //hidden: false, // due to this the field will remain hidden/shown HARDCODED in the form REGARDLESS of any other rule dependency.
                        validators: [
                            //'required' Only whne the title has been filled out 
                            // AND the description ???
                            // deze builtin geparametriseerde rule werkt dus niet zonder rules as "computed" being recomputed on each change
                            // maar een versie van ons zou wel gaan werken zonder rules being recomputed all the time, als we een wrapper zouden maken die de aanroep opnieuw doet metd e actuele payload van het target field
                            { type: 'requiredIf', params: [{ $model: 'title' }] },
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
                                        and: { 
                                            // required: 'cat_1', // hoe kunnen we dynamisch allerlei bestaande validators koppelen ? Willen we dat??????? zoals requiredIf or between etc etc binnen andere rules!!!!
                                            // TODO de volgorde van processing/evalueren van de rules maakt NIET uit voor de waarheidswaarde, uiteindeijk. 
                                            // Alleen qua performance als je early exit gaat doen zodra dat kan.
                                            // Dus refactoring met lagere prioriteit.
                                            [cvh.IS_VISIBLE]: ['cat_1'],
                                             or: {
                                                 
                                                [cvh.ALL_VISIBLE]: ['test0','title'], 
                                                [cvh.ALL_ENABLED]: ['test0','title'], 
                                                 not: {
                                                        [cvh.IS_HIDDEN]: ['test1'],

                                                        // notice the difference between [cvh.IS_MIN_LENGTH] and [cvh.V_MINLENGTH]!!!!
                                                        [cvh.IS_MIN_LENGTH]: ['test1'], // this will merely / passively retrieve the rule result of an assumed previous run on the minLength rule on field test1.
                                                        //TODO 
                                                        //cvh.V_MINLENGTH is a proper rule that will execute, so it needs proper parametrization, so it needs {params} 
                                                        [cvh.V_MINLENGTH]: [
                                                            { 
                                                                min: { $model: '<getTheMinimumValueasParamFromField:BladieBla>' }, // means: find the value from $model:<bal> as the value for the param for [cvh.V_MINLENGTH]
                                                                // if target is empty, it means run [cvh.V_MINLENGTH] on the requesting field, which is cat_2. 
                                                                // But with a non-empty target, it would try to get the value from the targetField and pass that in as the comparisonValue.
                                                                target: '<runTheMinLengthValidatorOnFieldX>', 
                                                                // ??? a rule can not run properly/truely on behalf of some other field AND properly register the result?
                                                                // so this asValidator property will be redundant for the end user and we MUST programmatically set asValidator to false?
                                                                asValidator: false,
                                                            } 
                                                        ]
                                                    }
                                            },
                                            not: {
                                                [cvh.IS_INVALID]: ['title'],
                                            }
                                        },
                                    }
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
                        //hidden: false, // IF we DELETE/REMOVE the hidden flag, only then the CV_TYPE_DISPLAY_IF rule will kick in!!!!
                        //disabled: true, // // IF we DELETE/REMOVE the disabled flag, only then the CV_TYPE_DISABLE_IF rule will kick in!!!!
                        validators: [
                            //'required', 
                            { type: 'minLength', params: [{ min: 10 }] }, //this should pick up the value of test dynamically, in order to specifiy which dynamical minLength to use ?
                            { type: 'maxLength', params: [{ max: 20 }] }, 
                            { 
                                type: cvh.CV_TYPE_DISPLAY_IF,
                                params: { dependsOn: { [cvh.IS_VISIBLE]: ['cat_2'] } }, // optionally we could add [cvh.IS_VALID]: ['cat_2']
                            },
                            { 
                                type: cvh.CV_TYPE_DISABLE_IF,
                                params: { dependsOn: { [cvh.IS_INVALID]: ['cat_2'] } }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
                            },
                        ],
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
                        validators: [
                            // differs from cat_3: display only depends upon validity, not both visibility and validity of cat_3 ...
                            { 
                                type: cvh.CV_TYPE_DISPLAY_IF,
                                params: { dependsOn: { not: {[cvh.IS_EMPTY]: ['title'] }} }, // equivalent would be SOME_VISIBLE: ['cat_4'] or IS_VISIBLE: 'cat_4' when we are having just one dependency
                            },
                            // differs from cat_3: it does not need to be disabled IF it is NOT visible as long as cat_3 is not VISIBle
                            { 
                                type: cvh.CV_TYPE_DISABLE_IF,
                                params: { dependsOn: { or: { [cvh.IS_EMPTY]: ['cat_3'], [cvh.IS_INVALID]: ['cat_3'] } } }, // or SOME or ALL etc 
                            },        
                        ],
                    }
                ],
            },
        ],
    },
];

export default formConfig