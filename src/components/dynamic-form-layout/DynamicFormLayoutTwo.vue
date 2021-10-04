<template>
  <div class="dynamicformlayout">
    <FormLayoutRecursor :config="fields"></FormLayoutRecursor>

    <!-- <Recursor3
      v-for="item in fields.items"
      :key="item.id"
      :config="item"
      :label="item.label || 'uhhhhh'"
    ></Recursor3>-->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MessageType from '@/types/message'
import _ from 'lodash'

import FormLayoutRecursor from '@/components/recursor/FormLayoutRecursor.vue'

//These should be brought into scope again explicitely for the :is bindings?....
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';

const messages = ref<MessageType[]>([]);
const count = ref(0);

const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

const dynamicComponentMapper = {
  "accordion": Accordion,
  "accordiontab": AccordionTab,
  "tabview": TabView,
  "tabpanel": TabPanel,
  "inputtext": InputText
};

type configContainer = {
  items?: configContainer[],
  id?: string,
  type: string,
  level?: number,
  isContainer?: boolean,
  placeholder?: string,
  label?: string,
}

type FormProp = {
  fields: configContainer,
}

const props = withDefaults(defineProps<FormProp>(), {})


</script>

<style lang="scss">
@import "./fieldicons.scss";

.dynamicformlayout {
  textarea {
    resize: none;
  }

  .pi {
    z-index: 1;
  }

  .p-field > label {
    margin-left: 0.25rem;
  }
}
</style>