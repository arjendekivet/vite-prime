<template>
    <div class="FormLayoutRecursor card">
        <!-- {{ config.label || "No Label ..." }} ({{ config.type || "No Type ..." }}) -->
        <template v-if="config.type === 'TabView'">
            <TabView>
                <TabPanel v-for="tab in config.items" :key="tab.id" :header="tab.label">
                    <FormLayoutRecursor
                        v-for="item in tab.items"
                        :key="tab.id"
                        :config="tab"
                        :label="tab.label"
                    ></FormLayoutRecursor>
                </TabPanel>
            </TabView>
        </template>
        <template v-if="config.type === 'Accordion'">
            <Accordion>
                <AccordionTab v-for="tab in config.items" :key="tab.id" :header="tab.label">
                    <FormLayoutRecursor
                        v-for="item in tab.items"
                        :key="tab.id"
                        :config="tab"
                        :label="tab.label"
                    ></FormLayoutRecursor>
                </AccordionTab>
            </Accordion>
        </template>
        <template v-else>
            <label v-if="!config.isContainer" :for="config.id">{{ config.label }}</label>
            <component :is="config.type">
                <FormLayoutRecursor
                    v-for="item in config.items"
                    :key="item.id"
                    :config="item"
                    :label="item.label"
                ></FormLayoutRecursor>
            </component>
        </template>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import SlotTest from '@/components/SlotTest.vue'

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
.FormLayoutRecursor {
    text-align: left;
    // margin: 5px 0px 0px 15px;

    label {
        display: inline-block;
        margin-bottom: 0.5rem;
        margin-left: 0.25rem;
    }

    input {
        display: block;
        margin-bottom: 0.5rem;
        margin-left: 0.25rem;
    }
}
</style>