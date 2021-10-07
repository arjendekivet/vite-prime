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
    getColumns(columns: number, maxColumns: number | undefined) {
        return maxColumns && maxColumns < columns ? maxColumns : columns
    },

    calculateDependantFieldState(props: any, field: Fieldconfig, fieldValue: any) {
        field.dependantFields?.forEach(function (fieldId: string) {
            const myField = _.find(props.fields, { id: fieldId })
            if (myField) {
                myField.hidden = fieldValue ? false : true

                if (!fieldValue) {
                    fieldValues.value[fieldId] = null

                    // current field could have dependantFields which have to be hidden now, so call recursively ...
                    formactions.calculateDependantFieldState(props, myField, null)
                }
            }
        })
    },

    convertResponseData(props: any, responseData: object): object {
        const converted: any = {}
        _.each(responseData, function (fieldValue: any, key: string) {
            const field = _.find(props.fields, { 'id': key })
            const fieldType: string | undefined = field && field.type

            if (fieldType === 'Calendar') {
                converted[key] = Date.parse(fieldValue) !== NaN ? new Date(fieldValue) : fieldValue
            } else {
                converted[key] = fieldValue
            }
        });
        return converted
    },
}

export { formactions, messages, count, errorFields, errorFieldsInfo }