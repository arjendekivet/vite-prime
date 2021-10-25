import Fieldconfig from '@/types/fieldconfig'

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
            validators: ['required'],
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
            "id": "title",
            "isField": true,
            "label": "Key",
            "type": "P_InputText",
            "placeholder": "Key",
            "validators": [
                "required",
                { "type": "minLength", "params": [{ "min": 2 }] },
                { "type": "maxLength", "params": [{ "max": 10 }] }
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
            "maxColumns": 1
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
            "validators": [
                "required"
            ],
            "dependantFields": [
                "cat_2"
            ]
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
            ]
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
            "editable": true
        }
    ]
}

export default formConfig