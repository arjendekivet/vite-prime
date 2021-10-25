import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primevue/resources/primevue.min.css"; //core css
import "primeflex/primeflex.css";
import "primeicons/primeicons.css"; //icons

import { app } from "@storybook/vue3";
import router from "@/router/routes";
import PrimeVue from "primevue/config";

import StoryBookApp from "@/stories/StorybookApp.vue";

app.use(router);
app.use(PrimeVue);

import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import Message from "primevue/message";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

app.component("P_InputText", InputText);
app.component("Button", Button);
app.component("Toolbar", Toolbar);
app.component("Message", Message);
app.component("P_Dropdown", Dropdown);
app.component("P_Textarea", Textarea);
app.component("DataTable", DataTable);
app.component("Column", Column);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (story) => ({
    components: { story, StoryBookApp },
    template: "<StoryBookApp><story /></StoryBookApp>",
  }),
];
