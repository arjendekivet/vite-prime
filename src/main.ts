import { createApp } from 'vue';
import router from '@/router/routes'
import App from '@/App.vue';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css' //theme
import 'primevue/resources/primevue.min.css'            //core css
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';                     //icons

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
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

const app = createApp(App);

app.use(router)
app.use(PrimeVue);

app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('P_InputText', InputText);
app.component('P_Dropdown', Dropdown);
app.component('P_Textarea', Textarea);
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

app.mount('#app')
