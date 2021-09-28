import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primevue/resources/primevue.min.css"; //core css
import "primeflex/primeflex.css";
import "primeicons/primeicons.css"; //icons

import { app } from "@storybook/vue3";
import PrimeVue from "primevue/config";
app.use(PrimeVue);

import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import Message from "primevue/message";

app.component("P_InputText", InputText);
app.component("Button", Button);
app.component("Toolbar", Toolbar);
app.component("Message", Message);
app.component("P_Dropdown", Dropdown);
app.component("P_Textarea", Textarea);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
