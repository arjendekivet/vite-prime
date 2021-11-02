import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import router from '@/router/routes'
import App from '@/App.vue'
import PrimeVue from 'primevue/config'

// import 'primevue/resources/themes/bootstrap4-light-blue/theme.css' //theme
// import '@/themes/nova-vue/theme.css' // local theme 01
import '@/themes/bootstrap4-light-blue/theme.css' // local theme 02
import 'primevue/resources/primevue.min.css'            //core css
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';                     //icons

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import JsonEditor from '@/components/JsonEditor.vue'
import PanelMenu from 'primevue/panelmenu';
import Menubar from 'primevue/menubar';
import Calendar from 'primevue/calendar';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Toolbar from 'primevue/toolbar';
import Message from 'primevue/message';

// Form "layout" components:
import FieldSet from 'primevue/fieldset';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import ProgressSpinner from 'primevue/progressspinner';
import Password from 'primevue/password';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import SplitButton from 'primevue/splitbutton'
import Tooltip from 'primevue/tooltip'

// Override logic to add close emit
Message.mounted = function () {
    if (!this.sticky) {
        setTimeout(() => {
            this.visible = false;
            this.$emit('close', event);
        }, this.life);
    }
}

const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: 'en',
    messages
})
const app = createApp(App);

app.use(router)
app.use(i18n)
app.use(PrimeVue)

app.directive('tooltip', Tooltip)

app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('P_InputText', InputText);
app.component('P_Dropdown', Dropdown);
app.component('P_Textarea', Textarea);
app.component('JsonEditor', JsonEditor);
app.component('PanelMenu', PanelMenu);
app.component('Menubar', Menubar);
app.component('Calendar', Calendar);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Toolbar', Toolbar);
app.component('Message', Message);

// Form "layout" components:
app.component('FieldSet', FieldSet);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);

app.component('ProgressSpinner', ProgressSpinner);
app.component('Password', Password);
app.component('MultiSelect', MultiSelect);
app.component('Checkbox', Checkbox);
app.component('SplitButton', SplitButton);

app.mount('#app')
