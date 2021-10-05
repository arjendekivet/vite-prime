<template>
    <div class="FormLayoutRecursor card">
        <template v-if="config.type === 'TabView' || config.type === 'Accordion'">
            <component :is="config.type">
                <component
                    v-for="tab in config.items"
                    :is="tab.type"
                    :key="tab.id"
                    :header="tab.label"
                >
                    <FormLayoutRecursor
                        v-for="item in tab.items"
                        :key="item.id"
                        :config="item"
                        :label="item.label"
                    ></FormLayoutRecursor>
                </component>
            </component>
        </template>
        <template v-else-if="config.isContainer">
            <component :is="config.type" :key="config.id" :legend="config.label">
                <FormLayoutRecursor
                    v-for="item in config.items"
                    :key="item.id"
                    :config="item"
                    :label="item.label"
                ></FormLayoutRecursor>
            </component>
        </template>
        <template v-else>
            <label :for="config.id">{{ config.label }}</label>
            <component :is="config.type" :key="config.id" v-bind="config"></component>
        </template>
    </div>
</template>
<script setup lang="ts">
import Fieldconfig from '@/types/fieldconfig'

type FormProp = {
    config: Fieldconfig,
}

const props = withDefaults(defineProps<FormProp>(), {})

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