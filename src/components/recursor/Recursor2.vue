<!-- This Component should act as a recursive component to resolve hierarchical dynamic components -->
<template>
    <div class="card recursor">
        <!-- <div>{{ $attrs.label }}</div> -->
        <!-- define a slot to be able to receive any kind of dynamical content as well ????? -->
        <!-- slot v-bind="slotProps?????????????" ></slot -->
        <!-- it requests to render it's own tag again -->
        <!-- should we render a component AND if it has nodes recurse any further ?? -->
        
        <Recursor2 v-for="item in nodes"
            :key="item.id"
            :nodes="nodes"
            :label="item.label || 'uhhhhh'">
            >
                <slot v-bind="item" > -->
                    <!-- <component
                        v-bind="item"
                        v-if="item && item.type"
                        :is="dynamicComponentMapper[item.type.toLowerCase()]"
                        :header="item.label"
                        >{{ label }}
                    </component> -->
                {{ label }}
                </slot>
        </Recursor2>
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
    isContainer: () => true,
    placeholder: () => "",
    nodes: () => <any>[],
    label: () => "deffffff"
})

</script>