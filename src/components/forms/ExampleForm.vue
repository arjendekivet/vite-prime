<template>
  <div>
    <DynamicForm :fields="fields" data-type="examples" :columns="2" />
    <p>Hieronder dynamic form ...</p><br> -->
    <DynamicFormLayout :fields="formConfig2" :columns="2" data-type="examples" title="My Title">
    </DynamicFormLayout>

  </div>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'
import DynamicFormLayout from '@/components/dynamic-form-layout/DynamicFormLayout.vue'
import Fieldconfig from '@/types/fieldconfig'
import Option from '@/types/Option'

import Recursor from '@/components/recursor/Recursor.vue'

//These should be brought into scope again explicitely for the :is bindings?....
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';

const dynamicComponentMapper = {
  "accordion": Accordion,
  "accordiontab": AccordionTab,
  "tabview": TabView,
  "tabpanel": TabPanel,
  "inputtext": InputText
  };


const states: Option[] = [
  { label: 'Arizona', value: 'Arizona' },
  { label: 'California', value: 'California' },
  { label: 'Florida', value: 'Florida' },
  { label: 'Ohio', value: 'Ohio' },
  { label: 'Washington', value: 'Washington' }
];

const fields: Fieldconfig[] =
  [
    {
      id: 'firstname',
      label: 'Firstname',
      type: 'P_InputText',
      placeholder: 'Firstname'
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P_InputText',
      placeholder: 'Lastname'
    },
    {
      id: 'state',
      label: 'State',
      type: 'P_Dropdown',
      options: states,
      optionLabel: "label",
      optionValue: "value",
      placeholder: 'States'
    },
    {
      id: 'fastname',
      label: 'Fastname',
      type: 'P_InputText',
      placeholder: 'Fastname'
    },
  ]

const fields2: Fieldconfig[] =
  [
    {
      id: 'firstname',
      label: 'Firstname',
      type: 'P_InputText',
      placeholder: 'Firstname'
    },
    {
      id: 'lastname',
      label: 'Lastname',
      type: 'P_InputText',
      placeholder: 'Lastname'
    },
    {
      id: 'state',
      label: 'State',
      type: 'P_Dropdown',
      options: states,
      optionLabel: "label",
      optionValue: "value",
      placeholder: 'States'
    },
    {
      id: 'fastname',
      label: 'Fastname',
      type: 'P_InputText',
      placeholder: 'Fastname'
    },
  ]

const formConfig2 = [
  {
    id: "tabview1",
    label: "TabView 1", //label to be mapped onto prop 'header' for the tabPanel
    type: "TabView",
    level: 1,
    isContainer: true,
    items: [
      {
        id: "tabpanel1",
        label: "TabPanel 1", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname",
            label: "Firstname 11111",
            type: "InputText",

            level: 3,
            placeholder: "Firstname",
          },
          {
            id: "lastname",
            label: "Last Name",
            type: "InputText",
            level: 3,
            placeholder: "Last name",
          },
        ],
      },
      {
        id: "tabpanel2",
        label: "TabPanel 2", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",

        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname2",
            label: "Firstname2",
            type: "InputText",
            level: 3,
            placeholder: "Firstname2",
          },
        ],
      },
      {
        id: "tabpanel3",
        label: "TabPanel 3", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "acordion1",
            label: "Accordion XXXXX",
            type: "Accordion",
            level: 3,
            isContainer: false,
            items: [
              {
                id: "acordiontab1",
                label: "Accordion Tab XXX",
                type: "AccordionTab",
                level: 4,
                isContainer: true,
                items: [
                  {
                    id: "firstnamertx",
                    label: "Firstnamertx",
                    type: "input",
                    level: 5,
                    placeholder: "Firstnamertx",
                    isContainer: false,
                    items: []
                  },
                  {
                    id: "firstnamex",
                    label: "Firstnamex",
                    type: "InputText",
                    level: 5,
                    placeholder: "Firstnamex",
                    isContainer: false,
                    items: []
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "tabpanel4",
        label: "TabPanel 4", //label to be mapped onto prop 'header' for the tabPanel
        type: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname6",
            label: "Firstname666",
            type: "InputText",
            level: 3,
            placeholder: "Firstname6",
          },
        ],
      },
    ],
  },
];

</script>