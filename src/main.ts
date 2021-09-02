import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
// import 'primevue/resources/themes/saga-blue/theme.css'  //theme
import 'primevue/resources/primevue.min.css'            //core css

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';                     //icons

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const app = createApp(App);

app.use(PrimeVue);

app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);

app.mount('#app')
