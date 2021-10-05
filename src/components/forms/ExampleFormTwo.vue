<template>
  <div>
    <DynamicFormLayoutTwo
      v-for="config in formConfig"
      :config="config"
      :columns="2"
      data-type="examples"
      title="My Title"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicFormLayoutTwo from '@/components/dynamic-form-layout/DynamicFormLayoutTwo.vue'
import Fieldconfig from '@/types/fieldconfig'

const formConfig: Fieldconfig[] = [
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
            id: "firstname",
            label: "Firstname 11111",
            type: "P_InputText",
            placeholder: "Firstname",
          },
          {
            id: "lastname",
            label: "Last Name",
            type: "P_InputText",
            placeholder: "Last name",
          },
          {
            id: "fullname",
            label: "Full Name",
            type: "P_InputText",
            placeholder: "Full name",
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
            label: "Firstname2",
            type: "P_InputText",
            placeholder: "Firstname2",
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
                    label: "Firstnamertx",
                    type: "P_InputText",
                    placeholder: "Firstnamertx",
                    isContainer: false,
                    items: []
                  },
                  {
                    id: "firstnamex",
                    label: "Firstnamex",
                    type: "P_InputText",
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
        type: "TabPanel",
        isContainer: true,
        items: [
          {
            id: "firstname6",
            label: "Firstname666",
            type: "P_InputText",
            placeholder: "Firstname6",
          },
        ],
      },
    ],
  },
];

</script>