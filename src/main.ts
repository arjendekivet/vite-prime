import { createApp } from 'vue';
import router from '@/routes'
import App from '@/App.vue';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
// import 'primevue/resources/themes/saga-blue/theme.css'  //theme
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

const app = createApp(App);

app.use(router)
app.use(PrimeVue);

app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('P-InputText', InputText);
app.component('P-Dropdown', Dropdown);
app.component('P-Textarea', Textarea);
app.component('PanelMenu', PanelMenu);
app.component('Menubar', Menubar);

app.mount('#app')
