import Fieldconfig from '@/types/fieldconfig'
import { ref } from 'vue';

const formConfig = ref<Fieldconfig[]>()
formConfig.value = [
    {
        "id": "tabview1",
        "label": "TabView 1",
        "type": "TabView",
        "isContainer": true,
        "items": [
            {
                "id": "tabpanel1",
                "label": "TabPanel 1",
                "type": "TabPanel",
                "isContainer": true,
                "items": [
                    {
                        "id": "FieldSet1",
                        "label": "FieldSet 1",
                        "type": "FieldSet",
                        "isContainer": true,
                        "items": [
                            {
                                "id": "title",
                                "isField": true,
                                "label": "Title",
                                "type": "P_InputText",
                                "placeholder": "Title",
                                "validators": [
                                    "required",
                                    {
                                        "type": "minLength",
                                        "params": [
                                            {
                                                "min": 2
                                            }
                                        ]
                                    },
                                    {
                                        "type": "maxLength",
                                        "params": [
                                            {
                                                "max": 10
                                            }
                                        ]
                                    }
                                ],
                                "icon": {
                                    "type": "right",
                                    "name": "pi-bookmark"
                                }
                            }
                        ]
                    },
                    {
                        "id": "FieldSet2",
                        "label": "FieldSet 2",
                        "type": "FieldSet",
                        "isContainer": true,
                        "items": [
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
                            }
                        ]
                    }
                ]
            },
            {
                "id": "tabpanel2",
                "label": "TabPanel 2",
                "type": "TabPanel",
                "isContainer": true,
                "items": [
                    {
                        "id": "firstname2",
                        "isField": true,
                        "label": "Firstname2",
                        "type": "P_InputText",
                        "placeholder": "Firstname2"
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
            },
            {
                "id": "tabpanel3",
                "label": "TabPanel 3",
                "type": "TabPanel",
                "isContainer": true,
                "items": [
                    {
                        "id": "acordion1",
                        "label": "Accordion XXXXX",
                        "type": "Accordion",
                        "isContainer": false,
                        "items": [
                            {
                                "id": "acordiontab1",
                                "label": "Accordion Tab XXX",
                                "type": "AccordionTab",
                                "isContainer": true,
                                "items": [
                                    {
                                        "id": "firstnamertx",
                                        "isField": true,
                                        "label": "Firstnamertx",
                                        "type": "P_InputText",
                                        "placeholder": "Firstnamertx",
                                        "isContainer": false,
                                        "items": []
                                    },
                                    {
                                        "id": "firstnamex",
                                        "isField": true,
                                        "label": "Firstnamex",
                                        "type": "P_InputText",
                                        "placeholder": "Firstnamex",
                                        "isContainer": false,
                                        "items": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "id": "tabpanel4",
                "label": "TabPanel 4",
                "type": "TabPanel",
                "isContainer": true,
                "items": [
                    {
                        "id": "firstname6",
                        "isField": true,
                        "label": "Firstname666",
                        "type": "P_InputText",
                        "placeholder": "Firstname6"
                    }
                ]
            }
        ]
    }
]

export default formConfig