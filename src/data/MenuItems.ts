import MenuItem from '@/types/menuitem'
import { ref } from 'vue';

const menuItems = ref<MenuItem[]>()
menuItems.value = [{
    key: '0',
    label: 'Welcome',
    icon: 'pi pi-fw pi-home',
    to: { name: 'admin_welcome' }
},
{
    key: '1',
    label: 'Admin tables',
    icon: 'pi pi-fw pi-user',
    items: [
        {
            key: '1_1',
            label: 'Questions',
            icon: 'pi pi-fw pi-list',
            to: { name: 'table', params: { type: 'questions', layout: 'question-table', formLayoutKey: 'question' } }
        },
        {
            key: '1_3',
            label: 'Layout Definition',
            icon: 'pi pi-fw pi-list',
            to: { name: 'table', params: { type: 'layoutdefinition', layout: 'layoutdefinition-table', formLayoutKey: 'layoutdefinition' } }
        }
    ]
},
];

export default menuItems