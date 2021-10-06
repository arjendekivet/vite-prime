import { ref } from 'vue'
import Fieldconfig from '@/types/fieldconfig'
import MessageType from '@/types/message'
import { validate } from '@/modules/validate'
import EventService from '@/services/EventService'
import _ from 'lodash'

const messages = ref<MessageType[]>([]);
const count = ref(0);
// const fieldValues: any = ref<object>({})
const errorFields: any = ref<object>({})
const errorFieldsInfo: any = ref<object>({})

const formactions = {
    getRequired(field: Fieldconfig) {
        return _.isArray(field.validators) && _.indexOf(field.validators, 'required') > -1 ? ' *' : null
    },

    getColumns(columns: number, maxColumns: number | undefined) {
        return maxColumns && maxColumns < columns ? maxColumns : columns
    },

    getIconType(field: Fieldconfig) {
        return field.icon && field.icon.type ? 'aki-input-icon-' + field.icon.type : null
    },

    getIconName(field: Fieldconfig) {
        return field.icon && field.icon.name
    },

    // calculateDependantFieldState(props: any, field: Fieldconfig, fieldValue: any) {
    //     field.dependantFields?.forEach(function (fieldId: string) {
    //         const myField = _.find(props.fields, { id: fieldId })
    //         if (myField) {
    //             myField.hidden = fieldValue ? false : true

    //             if (!fieldValue) {
    //                 fieldValues.value[fieldId] = null

    //                 // current field could have dependantFields which have to be hidden now, so call recursively ...
    //                 formactions.calculateDependantFieldState(props, myField, null)
    //             }
    //         }
    //     })
    // },

    /**
     * TODO: do we want to call this update always, id est also when the field does not qualify?
     */
    // fieldUpdateHandler(payload: any, field: Fieldconfig) {
    //     formactions.validateField(field)
    //     // console.log(field, payload)
    //     // emit('updateFieldValue', field, payload)
    //     // formactions.calculateDependantFieldState(props, field, payload)
    // },

    validateField(field: Fieldconfig, value: any) {
        // const value = fieldValues.value[field.id]
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
    },

    // convertResponseData(props: any, responseData: object): object {
    //     const converted: any = {}
    //     _.each(responseData, function (fieldValue: any, key: string) {
    //         const field = _.find(props.fields, { 'id': key })
    //         const fieldType: string | undefined = field && field.type

    //         if (fieldType === 'Calendar') {
    //             converted[key] = Date.parse(fieldValue) !== NaN ? new Date(fieldValue) : fieldValue
    //         } else {
    //             converted[key] = fieldValue
    //         }
    //     });
    //     return converted
    // },

    addSubmitMessage() {
        messages.value.push(
            { severity: 'success', sticky: false, content: 'Form succesfully saved', id: count.value++ },
        )
    },

    addErrorMessage(error: any) {
        messages.value.push(
            { severity: 'error', sticky: true, content: error, id: count.value++ },
        )
    },

    submitForm(dataType: string) {
        const hasErrors = Object.keys(errorFields.value).length > 0
        if (hasErrors) {
            formactions.addErrorMessage(`The following fields have issues: ${Object.keys(errorFields.value).join(', ')}`)
            return
        }

        // const submitValue: any = getSubmitValue(fieldValues._rawValue)
        const submitValue: any = fieldValues._rawValue
        const id: string = submitValue._id

        if (id) {
            EventService.putForm(dataType, id, submitValue)
                .then((response) => {
                    // const convertedResponseData = formactions.convertResponseData(props, response.data)
                    // fieldValues.value = convertedResponseData
                    fieldValues.value = response.data
                    formactions.addSubmitMessage()
                })
                .catch((error) => {
                    formactions.addErrorMessage(
                        error.response && error.response.data && error.response.data.error
                            ? error + " ==> " + error.response.data.error
                            : error)
                })
        } else {
            EventService.postForm(dataType, submitValue)
                .then((response) => {
                    // const convertedResponseData = formactions.convertResponseData(props, response.data)
                    // fieldValues.value = convertedResponseData
                    fieldValues.value = response.data
                    formactions.addSubmitMessage()
                })
                .catch((error) => {
                    formactions.addErrorMessage(
                        error.response && error.response.data && error.response.data.error
                            ? error + " ==> " + error.response.data.error
                            : error)
                })
        }
    },
}

export { formactions, messages, count, errorFields, errorFieldsInfo }