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
    label: "TabView 1",
    componentType: "TabView",
    isContainer: true,
    items: [
      {
        id: "tabpanel1",
        label: "TabPanel 1",
        componentType: "TabPanel",
        isContainer: true,
        items: [
          {
            id: "firstname",
            label: "Firstname 11111",
            componentType: "P_InputText",
            placeholder: "Firstname",
          },
          {
            id: "lastname",
            label: "Last Name",
            componentType: "P_InputText",
            placeholder: "Last name",
          },
          {
            id: "fullname",
            label: "Full Name",
            componentType: "P_InputText",
            placeholder: "Full name",
          },
        ],
      },
      {
        id: "tabpanel2",
        label: "TabPanel 2",
        componentType: "TabPanel",
        isContainer: true,
        items: [
          {
            id: "firstname2",
            label: "Firstname2",
            componentType: "P_InputText",
            placeholder: "Firstname2",
          },
        ],
      },
      {
        id: "tabpanel3",
        label: "TabPanel 3",
        componentType: "TabPanel",
        isContainer: true,
        items: [
          {
            id: "acordion1",
            label: "Accordion XXXXX",
            componentType: "Accordion",
            isContainer: false,
            items: [
              {
                id: "acordiontab1",
                label: "Accordion Tab XXX",
                componentType: "AccordionTab",
                isContainer: true,
                items: [
                  {
                    id: "firstnamertx",
                    label: "Firstnamertx",
                    componentType: "P_InputText",
                    placeholder: "Firstnamertx",
                    isContainer: false,
                    items: []
                  },
                  {
                    id: "firstnamex",
                    label: "Firstnamex",
                    componentType: "P_InputText",
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
        label: "TabPanel 4",
        componentType: "TabPanel",
        isContainer: true,
        items: [
          {
            id: "firstname6",
            label: "Firstname666",
            componentType: "P_InputText",
            placeholder: "Firstname6",
          },
        ],
      },
    ],
  },
];

</script>