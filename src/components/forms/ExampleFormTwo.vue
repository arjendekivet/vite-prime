<template>
  <div>
    <DynamicFormLayoutTwo
      :fields="formConfig2[0]"
      :columns="2"
      data-type="examples"
      title="My Title"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicFormLayoutTwo from '@/components/dynamic-form-layout/DynamicFormLayoutTwo.vue'

const formConfig2 = [
  {
    id: "tabview1",
    label: "TabView 1", //label to be mapped onto prop 'header' for the tabPanel
    componentType: "TabView",
    level: 1,
    isContainer: true,
    items: [
      {
        id: "tabpanel1",
        label: "TabPanel 1", //label to be mapped onto prop 'header' for the tabPanel
        componentType: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname",
            label: "Firstname 11111",
            componentType: "P_InputText",
            level: 3,
            placeholder: "Firstname",
          },
          {
            id: "lastname",
            label: "Last Name",
            componentType: "P_InputText",
            level: 3,
            placeholder: "Last name",
          },
          {
            id: "fullname",
            label: "Full Name",
            componentType: "P_InputText",
            level: 3,
            placeholder: "Full name",
          },
        ],
      },
      {
        id: "tabpanel2",
        label: "TabPanel 2", //label to be mapped onto prop 'header' for the tabPanel
        componentType: "TabPanel",

        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname2",
            label: "Firstname2",
            componentType: "P_InputText",
            level: 3,
            placeholder: "Firstname2",
          },
        ],
      },
      {
        id: "tabpanel3",
        label: "TabPanel 3", //label to be mapped onto prop 'header' for the tabPanel
        componentType: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "acordion1",
            label: "Accordion XXXXX",
            componentType: "Accordion",
            level: 3,
            isContainer: false,
            items: [
              {
                id: "acordiontab1",
                label: "Accordion Tab XXX",
                componentType: "AccordionTab",
                level: 4,
                isContainer: true,
                items: [
                  {
                    id: "firstnamertx",
                    label: "Firstnamertx",
                    componentType: "P_InputText",
                    level: 5,
                    placeholder: "Firstnamertx",
                    isContainer: false,
                    items: []
                  },
                  {
                    id: "firstnamex",
                    label: "Firstnamex",
                    componentType: "P_InputText",
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
        componentType: "TabPanel",
        level: 2,
        isContainer: true,
        // header: "TabView 1 TabPanel 1",
        items: [
          {
            id: "firstname6",
            label: "Firstname666",
            componentType: "P_InputText",
            level: 3,
            placeholder: "Firstname6",
          },
        ],
      },
    ],
  },
];

</script>