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
//const calculateDependantFieldState: any = inject('calculateDependantFieldState')

/**
 * If any of the criteria is false, we should hide the calling element.
 * TODO: moet config.hidden of config.systemHidden hier meespelen of moet dat alleen in de rule executioner. 
 * 
 * De volgende overweging zou kunnen gelden: 
 * 1. De rule-engine is de single source of truth mbt rules, wanneer die gerund hebben OF een standaard default, als ze NIET gerund hebben. 
 * 2. Zolang de rules niet gerund worden, krijg je alleen de standaard default terug. Meer weet de rules engine niet.
 * 3. De UI van het form moet eerder iets weten van alleen bepaalde features, zoals visibility en disabling, 
 * maar niet van alle form validatie, en vraagt dat daarom expliciet NOG NIET aan de rules engine: je wil niet initieel alle velden markeren.
 * 
 * 4. De UI van het form kan daarom het beste zelf in de showField of de getDisabled uitrekenen wat er moet gebeuren:
 * OFWEL op basis van overruling door statische metadata, zoals fieldCfg.hidden of fieldCfg.disabled, ofwel op basis van een rule result set.
 * 
 * 5. Maar een beter alternatief is wellicht om in de onMounted eenmaal alle rules te runnen (v$.$validate()) en daara een $reset te vragen.
 * Alle validaties worden dan weer gedemarkeerd MAAR alle custom visibility & disabling rules behouden hun $response data, 
 * want die gelden NOOIT als validatie rules en zijn dus sowieso nooit false voor validatie calls...
 * 
 * export const CFG_PROP_ENTITY_DISPLAY = 'hidden'; // indicates in fieldCfg the optional property 'hidden' decides the field display
export const CFG_PROP_ENTITY_DISPLAY_INVERT = true; // indicates a display rule will have to negate the config prop

 */
function showField(config, pv$){
    return cHelpers.isVisible({ v$: pv$ }, { fieldNames: config.id })
}

async function onBlur(config, pv$){
    return await pv$?.[config?.id]?.$validate?.()
}

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
    //calculateDependantFieldState(field, value)
}
</script>

<style lang="scss">
.FormDefinitionRecursor {
    flex: 1;
    text-align: left;
}
</style>