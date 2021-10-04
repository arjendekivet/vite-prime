<!-- This Component should act as a recursive component to resolve hierarchical dynamic components -->
<template>
    <div class="recursor3 card">
        <div>{{ config.label || "No Label ..." }} ({{ config.type || "No Type ..." }})</div>
        <component :is="config.type">
            <slot>PIPO</slot>
        </component>

        <FormLayoutRecursor
            v-for="item in config.items"
            :key="item.id"
            :config="item"
            :label="item.label || 'uhhhhh'"
        >
            <slot>Recursor</slot>
        </FormLayoutRecursor>
    </div>
</template>
<script setup lang="ts">
import { ref, defineProps } from 'vue'

//These should be brought into scope again explicitely for the :is bindings?....

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
// import InputText from 'primevue/inputtext';

// const dynamicComponentMapper = {
//     "accordion": Accordion,
//     "accordiontab": AccordionTab,
//     "tabview": TabView,
//     "tabpanel": TabPanel,
//     "inputtext": InputText
// };

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
    config: configContainer,
    id?: string,
    type?: string,
    level?: number,
    isContainer?: boolean,
    placeholder?: string,
    label?: string,
}

const props = withDefaults(defineProps<FormProp>(), {
    level: 0,
})

</script>

<style lang="scss">
.recursor3 {
    text-align: left;
    margin: 5px 0px 0px 15px;
}
</style>