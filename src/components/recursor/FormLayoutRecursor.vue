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
                        :readOnly="readOnly"
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
                    :readOnly="readOnly"
                ></FormLayoutRecursor>
            </component>
        </template>
        <template v-else-if="config.isField">
            <div
                v-if="!config.hidden"
                :class="`p-field p-text-left ${getIconType(config)} p-col-12 p-md-12`"
            >
                <label :for="config.id">{{ config.label }}{{ getRequired(config) }}</label>
                <template v-if="readOnly">
                    <div>{{ fieldValues[config.id] }}</div>
                </template>
                <template v-else>
                    <i v-if="getIconName(config)" :class="`pi ${getIconName(config)}`" />
                    <component
                        v-bind="config"
                        :is="config.type"
                        :modelValue="fieldValues[config.id]"
                        @update:modelValue="updateFieldValue(config, $event)"
                        @blur="validateField(config, fieldValues[config.id])"
                        :class="errorFields[config.id] ? 'p-invalid' : ''"
                        :aria-describedby="`${config.id}-help`"
                    ></component>
                    <small
                        :id="`${config.id}-help`"
                        class="p-error"
                    >{{ errorFieldsInfo[config.id] }}</small>
                </template>
            </div>
        </template>
        <template v-else>Unknown config !!!</template>
    </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import { validate } from '@/modules/validate'
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
const fieldValues: any = inject('fieldValues')
const fields: any = inject('fields')
const updateFormFieldValue: any = inject('updateFieldValue')
const errorFields: any = inject('errorFields')
const errorFieldsInfo: any = inject('errorFieldsInfo')
const updateFieldErrors: any = inject('updateFieldErrors')
const calculateDependantFieldState: any = inject('calculateDependantFieldState')

// Not needed naymore ?!!! Clean it up !!
// Register field on form for reuse somewhere ....
const addField: any = inject('addField')

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
    // validate UI field
    validateField(field, value)
    calculateDependantFieldState(field, value)
}

function validateField(field: Fieldconfig, value: any) {
    if (field.validators) {
        const returnValue = validate(value, field.validators)
        updateFieldErrors(field.id, returnValue.valid, returnValue.info)
    }
}
</script>

<style lang="scss">
.FormLayoutRecursor {
    flex: 1;
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