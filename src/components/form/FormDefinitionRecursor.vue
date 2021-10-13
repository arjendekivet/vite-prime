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
                        :class="v$[config.id]?.$error ? 'p-invalid' : ''"
                        :aria-describedby="`${config.id}-help`"
                        :disabled="doDisable(config, v$)"
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
const v$: any = inject('v$')
const fieldValues: any = inject('fieldValues')
const updateFormFieldValue: any = inject('updateFieldValue')
const calculateDependantFieldState: any = inject('calculateDependantFieldState')

/**
 * If any of the criteria is false, we should hide the calling element.
 */
function doShow(config, pv$){
    
    if (config.id === 'answer')
    {
        debugger
    }
    //await $nextTick ??????
    // unwrap the passed v$ ?? 
    let v$2 = pv$

    let crit_1 = true
    let crit_2 = true
    let endResult
    try{
        crit_1 = !!!config?.hidden 
        crit_2 = (v$2[config.id] && v$2[config.id]['displayIf'] && v$2[config.id]['displayIf'].$response?.extraParams?.rule_result)
    }
    catch(e)
    {
        crit_2 = true
    }
    
    // if any one is false, we should return false
    // endResult = ( _.some([crit_1,crit_2], false)) ? false : true
    // endResult = ( crit_1===false || crit_2===false) ? false : true
    endResult = !( crit_1===false || crit_2===false )
    
    console.log('called doShow for ' + config.id + ": " + endResult)
    return endResult
}

function doDisable(config, pv$){
    
    if (config.id === 'cat_5')
    {
        debugger
    }
    //await $nextTick ??????
    // unwrap the passed v$ ?? 
    //let v$2 = pv$

    let result
    try{
        result = !!(pv$ && pv$[config.id] && pv$[config.id]['disableIf'] && pv$[config.id]['disableIf'].$response?.extraParams?.rule_result)
        //debugger
    }
    catch(e)
    {
        debugger;
        result = false;
    }
    //debugger
    console.log(`called doEnable for '${config.id}' resulted in: ${result}`)
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