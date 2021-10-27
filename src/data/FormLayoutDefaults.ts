import Fieldconfig from '@/types/fieldconfig'
import cvh from '@/modules/validateHelpers' //custom vuelidate helpers...

type FormConfig = {
    [layoutdefinition: string]: Fieldconfig[]
    questions: Fieldconfig[]
}

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
    questions: [
        {
            "id": "setting0",
            "isField": true,
            "label": "Setting0",
            "type": "P_InputText",
            //"defaultValue": 5,
            //"placeholder": "setting0. Should implement a static 'between' validator with range 3-15.",
            //"placeholder": "setting0. Should implement a static MIN_LENGTH validator (2).",
            //"hidden": true,
            //"disabled": true,
            "validators": [
                //"required",
                //{ "type": cvh.CV_TYPE_BETWEEN, params: { min: 3 , max: 15 } },
                { "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: 2 } }, 
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] }
                
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
                //{ "type": cvh.CV_TYPE_BETWEEN, params: { min: 16 , max: 30 } },
                { "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'setting0'} } }, 
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] }
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
                //{ "type": cvh.CV_TYPE_BETWEEN, params: { min: 16 , max: 30 } },
                //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'title'} } }, 
                //{ "type": "between", "params": [{ "min": 10 }, { "max": 20 }] }
            ]
        },
        {
            "id": "title",
            "isField": true,
            "label": "Title",
            "type": "P_InputText",
            //"placeholder": "TITLE. Note: Should also be disables when setting0 has minLength compliancy!!!", //Should implement a fully DYNAMIC 'between' validator with range 'min' from setting0 and 'max' from setting1.",
            "validators": [
                "required",
                { "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: 10 } }, 
                //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { ref: 'setting0'} } }, 
                //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'setting0'} } },
                //{ "type": cvh.CV_TYPE_MAX_LENGTH, params: { max: { $model: 'setting1'} } },
                //{ "type": cvh.CV_TYPE_BETWEEN, params: { min: { $model: 'setting0'} , max: { $model: 'setting1'} } },
                // { 
                //     type: cvh.CV_TYPE_DISABLE_IF,
                //     params: { dependsOn: { not: { [cvh.IS_MIN_LENGTH]: ["setting0"] } } },
                // },
                { 
                    type: cvh.CV_TYPE_DISABLE_IF,
                    //params: { dependsOn: { [cvh.ALL_VISIBLE]: ['cat_1'] , [cvh.ALL_VALID]: ['cat_1'] } }, // equivalent would be SOME_<> or IS_ when there is only 1 dependecy mentioned
                    params: { 
                        dependsOn: {
                            [cvh.ALL_VISIBLE]: ['setting1','setting2'],
                            not: {[cvh.V_MINLENGTH]: { 
                                    min: { $model: 'setting0' }, // means: find the value for min from $model:<setting0> as the param for the invocation.
                                    // if target is empty, it means run [cvh.V_MINLENGTH] on the requesting field, which is cat_2. 
                                    // But with a non-empty target, it would TEST targetField instead of the invocing field!!! So it will try to get the value from the targetField and pass that in as the comparisonValue!
                                    targetField: { name:'setting1', label:'Setting1 Man' }, // optional!
                                }}
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
        //         //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: 10 } }, 
        //         //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { ref: 'setting0'} } }, 
        //         //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'setting0'} } },
        //         //{ "type": cvh.CV_TYPE_MAX_LENGTH, params: { max: { $model: 'setting1'} } },
        //         { "type": cvh.CV_TYPE_BETWEEN, params: { min: { $model: 'setting0'} , max: { $model: 'setting1'} } },
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
                { "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: 5 } }, 
                //{ "type": cvh.CV_TYPE_MIN_LENGTH, params: { min: { $model: 'title'} } }, 
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
                    type: cvh.CV_TYPE_DISABLE_IF,
                    params: { 
                        dependsOn: { 
                            [cvh.IS_INVALID]: ["title"], 
                            //
                            // $model inidicates the source where to retrieve expected "min" argument payload from. 
                            // if we do NOT mention an additionally a non-empty "target", the MIN_LENGTH validator rule will be executed comparing the value of actual field which is calling. 
                            // If a non-empty target is specified, the 'validator' will be run against the value of that field! 
                            // So we could run a rule in field description that runs an on the fly a rule
                            // against field C (target" "C") for a minLength comparison based on the length of the value of field "setting0". 
                            //not: {[cvh.MIN_LENGTH]: [{ $model: "setting0" , target: undefined,  }]} 
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
                    type: cvh.CV_TYPE_DISPLAY_IF,
                    params: { dependsOn: { or: { [cvh.IS_VALID]: ["description"] , [cvh.NOT_EMPTY]: ["cat_1"] } } },
                },
                { 
                    type: cvh.CV_TYPE_DISABLE_IF,
                    params: { 
                        dependsOn: { 
                            or: { 
                                [cvh.IS_DISABLED]: ["description"], 
                                [cvh.IS_EMPTY]: ["description"], 
                                [cvh.IS_INVALID]: ["description"],
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
                    type: cvh.CV_TYPE_DISPLAY_IF,
                    params: { dependsOn: { or: { [cvh.IS_VALID]: ["cat_1"] , [cvh.NOT_EMPTY]: ["cat_2"] } } },
                },
                { 
                    type: cvh.CV_TYPE_DISABLE_IF,
                    params: { dependsOn: { or: { [cvh.IS_EMPTY]: ["cat_1"] , [cvh.IS_INVALID]: ["cat_1"], [cvh.IS_DISABLED]: ["cat_1"] } } },
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
                    type: cvh.CV_TYPE_DISPLAY_IF,
                    params: { dependsOn: { [cvh.NONE_EMPTY]: ["cat_2"],[cvh.IS_VALID]: ["cat_2"] } }, // + [cvh.NONE_EMPTY]: ["cat_2"],
                },
                { 
                    type: cvh.CV_TYPE_DISABLE_IF,
                    params: { dependsOn: { or: { [cvh.IS_EMPTY]: ["cat_2"] , [cvh.IS_INVALID]: ["cat_2"] , [cvh.IS_DISABLED]: ["cat_2"] } } },
                }
            ],
        }
    ]
 */
export default formConfig