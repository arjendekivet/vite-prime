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
                v-if="doShow(config, v$)"
                :class="`p-field p-text-left ${getIconType(config)} p-col-12 p-md-12`"
            >
                <label :for="config.id">{{ config.label }}{{ getRequired(config) }}</label>
                <template v-if="readOnly && config.type !== 'JsonEditor'">
                    <div>{{ fieldValues[config.id] }}</div>
                </template>
                <template v-else>
                    <i v-if="getIconName(config)" :class="`pi ${getIconName(config)}`" />
                    <component
                        ref="config.id"
                        v-bind="config"
                        :is="config.type"
                        :modelValue="fieldValues[config.id]"
                        @update:modelValue="updateFieldValue(config, $event)"
                        :disabled="doDisable(config, v$)"
                        @blur="doBlur(config, v$)"
                        :class="v$[config.id]?.$error ? 'p-invalid' : ''"
                        :aria-describedby="`${config.id}-help`"
                        :rows="config.type === 'P_Textarea' ? 5 : undefined"
                        :readOnly="readOnly"
                    ></component>
                    <small
                        v-show="showFieldMessage(config, v$)"
                        :id="`${config.id}-help`"
                        class="p-error"
                    >{{ doFieldMessage(config, v$) }}</small>
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
import { cHelpers } from '@/modules/validateHelpers'

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

/**
 * If any of the criteria is false, we should hide the calling element.
 * TODO: moet config.hidden of config.systemHidden hier meespelen of moet dat in 
 */
function doShow(config, pv$){   
    return cHelpers.isVisible({ v$: pv$ }, { fieldNames: config.id })
}

/**
 * Or should this be onChange?
 * TODO: should we get rid of the passed pV$? If it is a global 
 */
function doBlur(config, pv$){   
    let ns = pv$ || v$.value
    let chk
    try {
        chk = ns?.[config?.id]?.$validate?.()
    }
    catch(e){
        console.warn(e)
    }
}

function showFieldMessage(config, pv$){
    let probe = cHelpers.isInvalid({ v$: pv$  }, { fieldNames: config.id })
    // let ns = pv$ || v$.value
    // let result = ns?.[config?.id]?.$errors?.length ?? false
    return probe
}

function doFieldMessage(config, pv$){
    let probe = cHelpers.getInvalidMessage({ v$: pv$ }, { fieldNames: config.id });
    //TODO: relay to a helper function? getInvalidMessage() or such!!!
    // let ns = pv$ || v$.value
    // let result = ns?.[config?.id]?.$errors[0]?.$message || ns?.[config?.id]?.$errors[0]?.$response?.message || ""
    return probe
}

/**
 * Indicates wether to disable.
 * Based on the retrieval of the rule execution result for vuelidate (custom validator) rule of type CV_TYPE_DISABLE_IF via cHelpers to get to it.
 * TODO: should this also take into account !!config.disabled? or !!!config.enabled === false???
 */
function doDisable(config, pv$){
    if (config.id==='title'){
        debugger
    }
    // we need to pass in a dummy object to hold v$ ... in order to comply to the signature of isDisabled, which expects vm as the first argument...
    let result = cHelpers.isDisabled({ v$: pv$ }, { fieldNames: config.id })
    return result
}

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