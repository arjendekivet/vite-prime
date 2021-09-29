import MenuItem from '@/types/menuitem'
import { ref } from 'vue';

const menuItems = ref<MenuItem[]>()
menuItems.value = [{
    key: '0',
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    to: { name: 'home' }
},
{
    key: '1',
    label: 'Admin',
    icon: 'pi pi-fw pi-user',
    items: [
        {
            key: '1_1',
            label: 'Questions',
            icon: 'pi pi-fw pi-list',
            to: { name: 'questions' }
        },
        {
            key: '1_2',
            label: 'Events',
            icon: 'pi pi-fw pi-list',
            to: { name: 'events' }
        },
    ]
},
{
    key: '4',
    label: 'Forms',
    icon: 'pi pi-fw pi-file',
    items: [{
        key: '4_0',
        label: 'Question form',
        icon: 'pi pi-fw pi-list',
        to: { name: 'questionform' }
    },
    {
        key: '4_1',
        label: 'Answer form',
        icon: 'pi pi-fw pi-list',
        to: { name: 'answerform' }
    }
    ]
},
{
    key: '2',
    label: 'Test',
    icon: 'pi pi-fw pi-user',
    items: [{
        key: '2_0',
        label: 'Event',
        icon: 'pi pi-fw pi-user-plus',

    },
    {
        key: '2_1',
        label: 'Delete',
        icon: 'pi pi-fw pi-user-minus',
    },
    {
        key: '2_2',
        label: 'Search',
        icon: 'pi pi-fw pi-users',
        items: [{
            key: '2_2_0',
            label: 'Filter',
            icon: 'pi pi-fw pi-filter',
            items: [{
                key: '2_2_0_0',
                label: 'Print',
                icon: 'pi pi-fw pi-print'
            }]
        },
        {
            key: '2_2_1',
            icon: 'pi pi-fw pi-bars',
            label: 'List'
        }
        ]
    }
    ]
},
];

export default menuItems