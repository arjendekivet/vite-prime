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
{
    key: '2',
    label: 'Test forms',
    icon: 'pi pi-fw pi-file',
    items: [
        {
            key: '2_1',
            label: 'Answer form',
            icon: 'pi pi-fw pi-list',
            to: { name: 'answerform' }
        },
        {
            key: '2_2',
            label: 'Example form',
            icon: 'pi pi-fw pi-list',
            to: { name: 'exampleform' }
        },
        {
            key: '4_3',
            label: 'Example form 2',
            icon: 'pi pi-fw pi-list',
            to: { name: 'exampleform2' }
        }
    ]
},
];

export default menuItems