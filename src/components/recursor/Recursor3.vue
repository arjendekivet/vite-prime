<!-- This Component should act as a recursive component to resolve hierarchical dynamic components -->
<template>
    <div class="card">
        <div>{{ label || "uhhh???" }}</div>
      
        <!-- define a slot to be able to receive any kind of dynamical content as well ????? -->
        <!-- slot v-bind="slotProps?????????????" ></slot -->
        <!-- it requests to render it's own tag again -->
        <!-- should we render a component AND if it has nodes recurse any further ?? -->
        
        <Recursor3 
            v-for="item in items"
            :key="item.id"
            :items="items"
            :label="item.label || 'uhhhhh'"
            ><slot v-bind="item" >
                <p>{{ id }}</p>
                <p>{{ type }}</p>
            </slot>
        </Recursor3>
    </div>
</template>
<script setup lang="ts">
import { ref , defineProps } from 'vue'

//These should be brought into scope again explicitely for the :is bindings?....

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import NavSplitter from '../navigation/NavSplitter.vue';

const dynamicComponentMapper = {
  "accordion": Accordion,
  "accordiontab": AccordionTab,
  "tabview": TabView,
  "tabpanel": TabPanel,
  "inputtext": InputText
  };

const props = defineProps({
    id: () => "" ,
    type: () => "",
    level: () => 0,
    isContainer: () => false,
    placeholder: () => "",
    items: () => <any>[],
    label: () => ""
})

</script>