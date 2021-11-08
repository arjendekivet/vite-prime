import Fieldconfig from '@/types/fieldconfig'
import cvh from '@/modules/rules/validateHelpers' //custom vuelidate helpers...
import rc_ from '@/modules/rules/constants'

type FormConfig = {
    [layoutdefinition: string]: Fieldconfig[]
    questions: Fieldconfig[]
}

/**
 *  "_id": "6148453e3a86ae3466fa2759",
  "setting0": 3,
  "setting1": 2,
  "setting2": 0,
  "title": "het pak",
 */
// use the same fields as in storybook for a test ..
let fields = [
    {
        id: '_id',
        isField: true,
        label: 'Id',
        type: 'P_InputText',
        dddefaultValue: "6666666666666",
        disabled: true,
        icon: { type: 'right', name: 'pi-lock' }
    },
    {
        id: 'setting0',
        isField: true,
        label: 'Setting0. Structurally hidden.',
        type: 'P_InputText',
        icon: { type: 'right', name: 'pi-lock' },
        defaultValue: 3,
        hhhidden: true,
        vvalidators: [
            'required',
            //'__cv__alpha',
            //{ type: rc_.CV_TYPE_ALPHA, params: { targetField: { name: 'setting2', label: 'Setting 2 Label mannn' } } }, // meaning: run on field setting 1
            // { type: rc_.CV_TYPE_REQUIREDIF, params: { prop: { $model: 'setting1' } } },
            // { type: rc_.CV_TYPE_REQUIREDUNLESS, params: { prop: { $model: 'setting1' } } },
            // { type: rc_.CV_TYPE_MIN_VALUE, params: { min: 20 } },
            { type: rc_.CV_TYPE_MAX_VALUE, params: { max: 50 } },
            // { type: rc_.CV_TYPE_REQUIREDIF, params: { prop: { $model: 'setting1' } } },
            // { type: rc_.CV_TYPE_BETWEEN, params: { min: 25, max: 40 } },
        ]
    },
    {
        id: 'setting1',
        isField: true,
        label: 'Setting1. Calls a dummy async validator',
        //type: 'P_InputNumber',
        type: 'P_InputText',
        icon: { type: 'right', name: 'pi-lock' },
        defaultValue: 2,
        ddddisabled: true,
        validators: [
            'required',
            // {
            //     type: rc_.CV_TYPE_SET_EXTERNAL_RESULTS,
            //     params: {
            //         protocol: 'https',
            //         host: 'jsonplaceholder.typicode.com',
            //         port: '',
            //         api: "/:entities/:id",
            //         vars: { id: 1, entities: "todos" },
            //         querystring: "", // {/** TODO */}, 
            //         comparisonValue: { externalProperty: '<meaning a property or path on the fetched data...>', fallback: 'pipo' }, // means if we wanted to compare something from somewhere with something else
            //         normValue: { useRunTimeValue: true }, //means use the passed in value, passed in by vuelidate when the rule is being invoked 
            //         //* $model: {} or a static value: value /*
            //     }
            // },
            //{ type: rc_.CV_TYPE_MAX_VALUE, params: { max: 5 } },
        ]
    },
    {
        id: 'setting2',
        isField: true,
        label: 'Setting2. Required & minLength 5 & maxLength 10, both async.',
        type: 'P_InputText',
        icon: { type: 'right', name: 'pi-lock' },
        defaultValue: 10,
        validators: [
            'required',
            // { type: rc_.CV_TYPE_MIN_LENGTH, params: { min: 5 } },
            // { type: rc_.CV_TYPE_MAX_LENGTH, params: { max: 10 } },
        ]
    },
    {
        id: 'title',
        isField: true,
        label: 'Title, disableIf rule with complex indirect async executioners...',
        type: 'P_InputText',
        placeholder: 'Title',
        icon: { type: 'right', name: 'pi-bookmark' },
        validators: [
            //"required",
            //{ type: rc_.CV_TYPE_MIN_LENGTH, params: { min: 10 } }, 
            {
                type: rc_.CV_TYPE_DISABLE_IF,
                params: {
                    dependsOn: {
                        // [rc_.IS_HIDDEN]: ['setting0'],  
                        // [rc_.IS_DISABLED]: ['setting1'], 
                        // 'fetchedResultContainsPipo': { 
                        //     protocol: 'https', 
                        //     host: 'jsonplaceholder.typicode.com', 
                        //     port: '',
                        //     api: "/:entities/:id", 
                        //     // TODO TODO
                        //     vars: { 
                        //         id: 1,          //{ $model: 'setting0', fallback:'pipo' } //id should be dynamiclly invocable too etc etc 
                        //         entities: "albums" ,
                        //     } , // { $model: 'setting0', fallback:'pipo' } //entities should be dynamiclly invocable too etc etc
                        // },
                        //[rc_.V_REQUIREDIF]: { prop: { $model: 'setting1' } }, // meaning: retrieve the runtime value of setting0 and if that is true field title becomes required ...
                        //[rc_.V_REQUIREDIF]: { prop: { $model: 'setting0' , targetField: 'setting1'} }, // meaning: retrieve the runtime value of setting0, and if that is true field title becomes required ...
                        [rc_.V_SET_EXTERNAL_RESULTS]: {
                            protocol: 'https',
                            host: 'jsonplaceholder.typicode.com',
                            port: '',
                            api: "/:entities/:id",
                            vars: { id: 1, entities: "todos" },
                            querystring: "", // {/** TODO */}, 
                            comparisonValue: { externalProperty: '<meaning a property or path on the fetched data...>', fallback: 'pipo' }, // means if we wanted to compare something from somewhere with something else
                            normValue: { useRunTimeValue: true }, //means use the passed in value, passed in by vuelidate when the rule is being invoked 
                            //* $model: {} or a static value: value /*
                        },
                        [rc_.V_MAXLENGTH]: {
                            max: 5,
                            targetField: { name: 'setting1', label: 'Setting1' },
                        },
                        [rc_.V_MINLENGTH]: {
                            min: 3,
                            targetField: { name: 'setting2', label: 'Setting2' },
                        },
                    }
                }
            },
        ],
    },
];

const formConfig: FormConfig = {
    layoutdefinition: [
        {
            id: 'title',
            isField: true,
            label: 'Title',
            type: 'P_InputText',
            placeholder: 'Title',
            validators: ['required',
                { type: 'minLength', params: [{ min: 10 }] },
                { type: 'maxLength', params: [{ max: 200 }] },
            ],
            icon: { type: 'right', name: 'pi-bookmark' }
        },
        {
            id: 'label',
            isField: true,
            label: 'Label',
            type: 'P_InputText',
            placeholder: 'Label',
            validators: ['required']
        },
        {
            "id": "type",
            "isField": true,
            "label": "Type",
            "type": "P_Dropdown",
            "options": [
                {
                    "label": "Form",
                    "value": "FORM"
                },
                {
                    "label": "Table",
                    "value": "TABLE"
                }
            ],
            "optionLabel": "label",
            "optionValue": "value",
            "editable": true,
            validators: ['required']
        },
        {
            id: 'layoutKey',
            isField: true,
            label: 'Layout key',
            type: 'P_InputText',
            placeholder: 'Form Layout key',
        },
        {
            id: 'config',
            isField: true,
            label: 'Layout configuration',
            type: 'JsonEditor',
        }
    ],
    questions: fields,
    qqqqquestions: [
        {
            "id": "setting00",
            "isField": true,
            "label": "Setting00 Man",
            "type": "P_InputText",
            "hidden": true
        },
        {
            "id": "setting0",
            "isField": true,
            "label": "Setting0 (Note: Zou moeten disablen omdat setting00 'hidden' is)",
            "type": "P_InputText",
            "defaultValue": 5,
            //"placeholder": "setting0. Should implement a static 'between' validator with range 3-15.",
            //"placeholder": "setting0. Should implement a static MIN_LENGTH validator (2).",
            //"hidden": true,
            //"disabled": true,
            "validators": [
                "required",
                //{ "type": rc_.CV_TYPE_BETWEEN, params: { min: 3 , max: 15 } },
                { "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: 2 } },
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] }
                {
                    type: rc_.CV_TYPE_DISABLE_IF,
                    params: {
                        dependsOn:
                        {
                            not: {
                                [rc_.ALL_VISIBLE]: ['setting00'],
                                // [rc_.V_MINLENGTH]: { 
                                //       min: { $model: 'setting0' },
                                //       targetField: { name:'setting1', label:'Setting1' },
                                //     },
                                // [rc_.V_MAXLENGTH]: { 
                                //       max: { $model: 'setting1' },
                                //       targetField: { name:'setting2', label:'Setting2' },
                                //     },  
                                // }
                            }
                        }
                    },
                }
            ]
        },
        {
            "id": "setting1",
            "isField": true,
            "label": "Setting1 Man",
            "type": "P_InputText",
            //"defaultValue": 15,
            //"placeholder": "setting1. Should implement a static 'between' validator with range 16-30.",
            //"hidden": true,
            //"disabled": true,
            "validators": [
                //{ "type": rc_.CV_TYPE_BETWEEN, params: { min: 16 , max: 30 } },
                { "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'setting0' } } },
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] },
            ]
        },
        {
            "id": "setting2",
            "isField": true,
            "label": "Setting2",
            "type": "P_InputText",
            //"defaultValue": 15,
            //"placeholder": "setting1. Should implement a static 'between' validator with range 16-30.",
            //"hidden": true,
            //"disabled": true,
            "validators": [
                //{ "type": rc_.CV_TYPE_BETWEEN, params: { min: 16 , max: 30 } },
                //{ "type": rc_.CV_TYPE_MAX_LENGTH, params: { max: { $model: 'setting1'} } }, 
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] }
            ]
        },
        {
            "id": "title",
            "isField": true,
            "label": "Title (Zou disabled moeten zijn obv setting0)",
            "type": "P_InputText",
            //"placeholder": "TITLE. Note: Should also be disables when setting0 has minLength compliancy!!!", //Should implement a fully DYNAMIC 'between' validator with range 'min' from setting0 and 'max' from setting1.",
            "validators": [
                "required",
                { "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: 10 } },
                //{ "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: { ref: 'setting0'} } }, 
                //{ "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'setting0'} } },
                //{ "type": rc_.CV_TYPE_MAX_LENGTH, params: { max: { $model: 'setting1'} } },
                //{ "type": rc_.CV_TYPE_BETWEEN, params: { min: { $model: 'setting0'} , max: { $model: 'setting1'} } },
                // { 
                //     type: rc_.CV_TYPE_DISABLE_IF,
                //     params: { dependsOn: { not: { [rc_.IS_MIN_LENGTH]: ["setting0"] } } },
                // },
                {
                    type: rc_.CV_TYPE_DISABLE_IF,
                    //params: { dependsOn: { [rc_.ALL_VISIBLE]: ['cat_1'] , [rc_.ALL_VALID]: ['cat_1'] } }, // equivalent would be SOME_<> or IS_ when there is only 1 dependecy mentioned
                    params: {
                        dependsOn: {
                            and: {
                                [rc_.IS_DISABLED]: ['setting0'],
                                [rc_.ALL_VISIBLE]: ['setting1', 'setting2'],
                                not: {
                                    [rc_.V_MINLENGTH]: {
                                        min: { $model: 'setting0' }, // means: find the value for min from $model:<setting0> as the param for the invocation.
                                        // if target is empty, it means run [rc_.V_MINLENGTH] on the requesting field, which is cat_2. 
                                        // But with a non-empty target, it would TEST targetField instead of the invocing field!!! So it will try to get the value from the targetField and pass that in as the comparisonValue!
                                        targetField: { name: 'setting1', label: 'Setting 1' }, // optional!
                                    },
                                    [rc_.V_MAXLENGTH]: {
                                        max: { $model: 'setting1' }, // means: find the value for min from $model:<setting0> as the param for the invocation.
                                        // if target is empty, it means run [rc_.V_MINLENGTH] on the requesting field, which is cat_2. 
                                        // But with a non-empty target, it would TEST targetField instead of the invocing field!!! So it will try to get the value from the targetField and pass that in as the comparisonValue!
                                        targetField: { name: 'setting2', label: 'Setting 2' }, // optional!
                                    }
                                }
                            }
                        },
                    },
                },
            ],
            "icon": { "type": "right", "name": "pi-bookmark" }
        },
        // {
        //     "id": "due",
        //     "isField": true,
        //     "label": "Due on",
        //     "type": "Calendar",
        //     "showIcon": true,
        //     //"placeholder": "Due. Should implement a fully DYNAMIC 'between' validator with range 'min' from setting0 and 'max' from setting1.",
        //     "validators": [
        //         //{ "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: 10 } }, 
        //         //{ "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: { ref: 'setting0'} } }, 
        //         //{ "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'setting0'} } },
        //         //{ "type": rc_.CV_TYPE_MAX_LENGTH, params: { max: { $model: 'setting1'} } },
        //         { "type": rc_.CV_TYPE_BETWEEN, params: { min: { $model: 'setting0'} , max: { $model: 'setting1'} } },
        //     ],
        // },
    ]
}

/**
 *     questions: [
        {
            "id": "setting0",
            "isField": true,
            "label": "Setting0",
            "type": "P_InputText",
            "defaultValue": 10,
            //"hidden": true,
            //"disabled": true,
            "validators": [
                { "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: 5 } }, 
                //{ "type": rc_.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'title'} } }, 
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] }
            ]
        },
        {
            "id": "title",
            "isField": true,
            "label": "Title",
            "type": "P_InputText",
            "placeholder": "Title",
            "validators": [
                "required",
                { "type": "maxLength", "params": [{ "max": 200 }] }
            ],
            "icon": { "type": "right", "name": "pi-bookmark" }
        },
        {
            "id": "due",
            "isField": true,
            "label": "Due on",
            "type": "Calendar",
            "showIcon": true
        },
        {
            "id": "description",
            "isField": true,
            "label": "Description",
            "type": "P_Textarea",
            "placeholder": "Description",
            "maxColumns": 1,
            "validators":[
                "required", 
                //{ type: 'minLength', params: [{ $model: 'setting0' }] },
                //{ type: 'minLength', params: [{ min: 10 }] },
                { type: 'maxLength', params: [{ max: 500 }] }, 
                { 
                    type: rc_.CV_TYPE_DISABLE_IF,
                    params: { 
                        dependsOn: { 
                            [rc_.IS_INVALID]: ["title"], 
                            //
                            // $model inidicates the source where to retrieve expected "min" argument payload from. 
                            // if we do NOT mention an additionally a non-empty "target", the MIN_LENGTH validator rule will be executed comparing the value of actual field which is calling. 
                            // If a non-empty target is specified, the 'validator' will be run against the value of that field! 
                            // So we could run a rule in field description that runs an on the fly a rule
                            // against field C (target" "C") for a minLength comparison based on the length of the value of field "setting0". 
                            //not: {[rc_.MIN_LENGTH]: [{ $model: "setting0" , target: undefined,  }]} 
                        } //
                    },
                }
            ]
        },
        {
            "id": "answer",
            "isField": true,
            "label": "Answer",
            "type": "P_Textarea",
            "placeholder": "Answer",
            "maxColumns": 1
        },
        {
            "id": "cat_1",
            "isField": true,
            "label": "Category 1",
            "type": "P_Dropdown",
            "options": [
                {
                    "label": "Duits",
                    "value": "DE"
                },
                {
                    "label": "Engels",
                    "value": "EN"
                },
                {
                    "label": "Frans",
                    "value": "FR"
                }
            ],
            "optionLabel": "label",
            "optionValue": "value",
            "editable": true,
            "dependantFields": [
                "cat_2"
            ],
            "validators": [
                "required", 
                { 
                    type: rc_.CV_TYPE_DISPLAY_IF,
                    params: { dependsOn: { or: { [rc_.IS_VALID]: ["description"] , [rc_.NOT_EMPTY]: ["cat_1"] } } },
                },
                { 
                    type: rc_.CV_TYPE_DISABLE_IF,
                    params: { 
                        dependsOn: { 
                            or: { 
                                [rc_.IS_DISABLED]: ["description"], 
                                [rc_.IS_EMPTY]: ["description"], 
                                [rc_.IS_INVALID]: ["description"],
                            } 
                        } 
                    },
                }
            ],
        },
        {
            "id": "cat_2",
            "isField": true,
            "label": "Category 2",
            "type": "P_Dropdown",
            "options": [
                {
                    "label": "Chapter one",
                    "value": "Ch-1"
                },
                {
                    "label": "Chapter two",
                    "value": "Ch-2"
                },
                {
                    "label": "Chapter five",
                    "value": "Ch-5"
                }
            ],
            "optionLabel": "label",
            "optionValue": "value",
            "editable": true,
            "dependantFields": [
                "cat_3"
            ],
            "validators": [
                { 
                    type: rc_.CV_TYPE_DISPLAY_IF,
                    params: { dependsOn: { or: { [rc_.IS_VALID]: ["cat_1"] , [rc_.NOT_EMPTY]: ["cat_2"] } } },
                },
                { 
                    type: rc_.CV_TYPE_DISABLE_IF,
                    params: { dependsOn: { or: { [rc_.IS_EMPTY]: ["cat_1"] , [rc_.IS_INVALID]: ["cat_1"], [rc_.IS_DISABLED]: ["cat_1"] } } },
                }
            ],
        },
        {
            "id": "cat_3",
            "isField": true,
            "label": "Category 3",
            "type": "P_Dropdown",
            "options": [
                {
                    "label": "A",
                    "value": "A"
                },
                {
                    "label": "B",
                    "value": "B"
                },
                {
                    "label": "D",
                    "value": "D"
                },
                {
                    "label": "F",
                    "value": "F"
                },
                {
                    "label": "G",
                    "value": "G"
                }
            ],
            "optionLabel": "label",
            "optionValue": "value",
            "editable": true, 
            //disabled: false 
            //hidden: true
            "validators": [
                { 
                    type: rc_.CV_TYPE_DISPLAY_IF,
                    params: { dependsOn: { [rc_.NONE_EMPTY]: ["cat_2"],[rc_.IS_VALID]: ["cat_2"] } }, // + [rc_.NONE_EMPTY]: ["cat_2"],
                },
                { 
                    type: rc_.CV_TYPE_DISABLE_IF,
                    params: { dependsOn: { or: { [rc_.IS_EMPTY]: ["cat_2"] , [rc_.IS_INVALID]: ["cat_2"] , [rc_.IS_DISABLED]: ["cat_2"] } } },
                }
            ],
        }
    ]
 */
export default formConfig