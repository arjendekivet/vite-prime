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
                v-if="showField(config, v$)"
                :class="`p-field p-text-left ${getIconType(config)} p-col-12 p-md-12`"
            >
                <label :for="config.id">{{ config.label }}{{ getRequired(config) }}</label>
                <template v-if="readOnly && config.type !== 'JsonEditor'">
                    <div>{{ fieldValues[config.id] }}</div>
                </template>
                <template v-else>
                    <i v-if="getIconName(config)" :class="`pi ${getIconName(config)}`" />
                    <!-- @change="onChange(config, v$)" -->
                    <component
                        ref="config.id"
                        v-bind="config"
                        :is="config.type"
                        :modelValue="fieldValues[config.id]"
                        @update:modelValue="updateFieldValue(config, $event)"
                        :disabled="getDisabled(config, v$)"
                        @blur="onBlur(config, v$)"
                        :class="v$[config.id]?.$error ? 'p-invalid' : ''"
                        :aria-describedby="`${config.id}-help`"
                        :rows="config.type === 'P_Textarea' ? 5 : undefined"
                        :readOnly="readOnly"
                    ></component>
                    <small
                        v-show="showInvalidMsg(config, v$)"
                        :id="`${config.id}-help`"
                        class="p-error"
                    >{{ getInvalidMsg(config, v$) }}
                    </small>
                    <div v-show="showDisabledMsg(config, v$)">
                        <small 
                            :id="`${config.id}-disabled-msg`"
                            class="p-info"
                        >{{ getDisabledMsg(config, v$) }}
                        </small>
                    </div>
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
function showField(config, pv$){
    return cHelpers.isVisible({ v$: pv$ }, { fieldNames: config.id })
}

async function wrapValidate(config, pv$, caller){
    let result
    try {
        //console.log('Running wrapValidate called by: ', caller);
        await pv$?.[config?.id]?.$validate?.()
            .then((value) => { 
                debugger;
                //console.log('the $validate promise resolved & will return: ', value);
                result = value;
                return value;
                })
            .catch((error) => {
                console.error(error);
            })    
    } catch(e){
        console.warn(e)
    }
    finally {
        return result
    }
}

async function onBlur(config, pv$){
    await pv$?.[config?.id]?.$validate?.()
}

/**
 * TODO: Is it even necessary using v-model plus having vuelidate monitoring the field state regarding validity, display, enabling, and ... ? 
 * TODO: Should be debounced?
 * TODO: should we get rid of the passed pV$? If it is a global we might as well simply decide in the doBlur itself to use v$.value.
 * Why should the invoker of doBlur have to know we are using vuelidate for rules execution? 
 */
async function handleOnChange(config, pv$){   
    console.log('running handleOnChange');
    let result = await wrapValidate(config,pv$,'onChange');
    console.log('handleOnChange returns: ', result);
}
/**
 * Is only called after the onBlur and after leaving a field? Redundant then compared to onBlur?
 */
const onChange = _.debounce(async (config, pv$) => { handleOnChange(config,pv$)}, 500);

function showInvalidMsg(config, pv$){
    return cHelpers.isInvalid({ v$: pv$  }, { fieldNames: config.id }) 
}

function getInvalidMsg(config, pv$){
    return cHelpers.getInvalidMessage({ v$: pv$ }, { fieldNames: config.id });
}

function showDisabledMsg(config, pv$){
    return cHelpers.isDisabled({ v$: pv$ }, { fieldNames: config.id })
}

function getDisabledMsg(config, pv$){
    return cHelpers.getDisabledMessage({ v$: pv$ }, { fieldNames: config.id })    
}

/**
 * Indicates wether to disable.
 * Needs to pass in a dummy object to hold v$ ... in order to comply to the signature of isDisabled, which expects some kind of vm as the first argument.
 * Based on the retrieval of the rule execution result for vuelidate (custom validator) rule of type CV_TYPE_DISABLE_IF via cHelpers to get to it.
 */
function getDisabled(config, pv$){
    return cHelpers.isDisabled({ v$: pv$ }, { fieldNames: config.id })
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