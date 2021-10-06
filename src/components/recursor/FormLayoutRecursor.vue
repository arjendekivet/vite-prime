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
        <template v-else>
            <div
                v-if="!config.hidden"
                :class="`p-field p-text-left ${formactions.getIconType(config)} p-col-12 p-md-12`"
            >
                <label :for="config.id">{{ config.label }}{{ formactions.getRequired(config) }}</label>
                <template v-if="readOnly">
                    <div>{{ fieldValues[config.id] }}</div>
                </template>
                <template v-else>
                    <i
                        v-if="formactions.getIconName(config)"
                        :class="`pi ${formactions.getIconName(config)}`"
                    />
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
    </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import { validate } from '@/modules/validate'
import { formactions, errorFields, errorFieldsInfo } from '@/modules/formactionsrecursor'

type FormProp = {
    config: Fieldconfig,
    fields?: Fieldconfig[],
    dataType?: string,
    id?: string,
    columns?: number,
    title?: string,
    readOnly?: boolean,
}

const props = withDefaults(defineProps<FormProp>(), {
    columns: 2
})

const emit = defineEmits(['updateFieldValue'])

// inject from Form (provided)
const fieldValues: any = inject('fieldValues')
const updateFormFieldValue: any = inject('updateFieldValue')

function updateFieldValue(field: any, value: any) {
    // injected method on parent
    updateFormFieldValue(field.id, value)
    // validate UI field
    validateField(field, value)
}

function validateField(field: Fieldconfig, value: any) {
    if (field.validators) {
        const returnValue = validate(value, field.validators)
        if (!returnValue.valid) {
            errorFieldsInfo.value[field.id] = returnValue.info
            errorFields.value[field.id] = !returnValue.valid
        } else {
            delete errorFieldsInfo.value[field.id]
            delete errorFields.value[field.id]
        }
    }
}
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