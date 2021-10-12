import Fieldconfig from '@/types/fieldconfig'
import { ref } from 'vue';

const formConfig = ref<Fieldconfig[]>()
formConfig.value = [
    {
        id: 'title',
        isField: true,
        label: 'Title',
        type: 'P_InputText',
        placeholder: 'Title',
        validators: ['required'],
        icon: { type: 'right', name: 'pi-bookmark' }
    },
    {
        id: 'formDefinition',
        isField: true,
        label: 'Form Definition',
        type: 'P_Textarea',
        placeholder: 'Form Definition',
    },
];

export default formConfig