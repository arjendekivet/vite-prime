<template>
    <div class="FormDefinitionRecursor card">
        <template v-if="config.type === 'TabView' || config.type === 'Accordion'">
            <component :is="config.type">
                <component
                    v-for="tab in config.items"
                    :is="tab.type"
                    :key="tab.id"
                    :header="tab.label"
                >
                    <FormDefinitionRecursor
                        v-for="item in tab.items"
                        :key="item.id"
                        :config="item"
                        :label="item.label"
                        :readOnly="readOnly"
                    ></FormDefinitionRecursor>
                </component>
            </component>
        </template>
        <template v-else-if="config.isContainer">
            <component :is="config.type" :key="config.id" :legend="config.label">
                <FormDefinitionRecursor
                    v-for="item in config.items"
                    :key="item.id"
                    :config="item"
                    :label="item.label"
                    :readOnly="readOnly"
                ></FormDefinitionRecursor>
            </component>
        </template>
        <template v-else-if="config.isField">
            <div
                v-if="!config.hidden"
                :class="`p-field p-text-left ${getIconType(config)} p-col-12 p-md-12`"
            >
                <label :for="config.id">{{ config.label }}{{ getRequired(config) }}</label>
                <template v-if="readOnly && config.type !== 'JsonEditor'">
                    <div>{{ fieldValues[config.id] }}</div>
                </template>
                <template v-else>
                    <i v-if="getIconName(config)" :class="`pi ${getIconName(config)}`" />
                    <component
                        v-bind="config"
                        :is="config.type"
                        :modelValue="fieldValues[config.id]"
                        @update:modelValue="updateFieldValue(config, $event)"
                        @blur="v$[config.id].$validate()"
                        :class="v$[config.id]?.$error ? 'p-invalid' : ''"
                        :aria-describedby="`${config.id}-help`"
                        :rows="config.type === 'P_Textarea' ? 5 : undefined"
                        :readOnly="readOnly"
                    ></component>
                    <small
                        :id="`${config.id}-help`"
                        class="p-error"
                    >{{ v$[config.id]?.$errors[0]?.$message }}</small>
                </template>
            </div>
        </template>
        <template v-else>Unknown config !!!</template>
    </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import _ from 'lodash'

type FormProp = {
    config: Fieldconfig,
    fields?: Fieldconfig[],
    dataType?: string,
    id?: string,
    columns?: number,
    title?: string,
    readOnly?: boolean,
}

const props = withDefaults(defineProps<FormProp>(), {})

const emit = defineEmits(['updateFieldValue'])

// inject from Form (provided)
const v$: any = inject('v$')
const fieldValues: any = inject('fieldValues')
const updateFormFieldValue: any = inject('updateFieldValue')
const calculateDependantFieldState: any = inject('calculateDependantFieldState')

function getRequired(field: Fieldconfig) {
    return _.isArray(field.validators) && _.indexOf(field.validators, 'required') > -1 ? ' *' : null
}

function getIconType(field: Fieldconfig) {
    return field.icon && field.icon.type ? 'aki-input-icon-' + field.icon.type : null
}

function getIconName(field: Fieldconfig) {
    return field.icon && field.icon.name
}

function updateFieldValue(field: any, value: any) {
    // injected method on parent
    updateFormFieldValue(field.id, value)
    calculateDependantFieldState(field, value)
}
</script>

<style lang="scss">
.FormDefinitionRecursor {
    flex: 1;
    text-align: left;
}
</style>