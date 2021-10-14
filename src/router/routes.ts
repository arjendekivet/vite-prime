import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/pages/Welcome.vue";
import Start from "@/pages/Start.vue";
import Admin from "@/pages/Admin.vue";
import Table from "@/components/Table.vue";
import Form from "@/components/Form.vue";

import ExampleForm from "@/components/forms/ExampleForm.vue";
import ExampleFormTwo from "@/components/forms/ExampleFormTwo.vue";
import AnswerForm from "@/components/forms/AnswerForm.vue";
import Test from "@/pages/Test.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: { name: "home" },
    },
    {
      path: "/home",
      name: "home",
      component: Start,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      redirect: { name: "admin_welcome" },
      children: [
        {
          path: 'welcome',
          name: "admin_welcome",
          component: Welcome
        },
        {
          path: "table/:type/:layout",
          name: "table",
          component: Table,
          props: route => ({
            dataType: route.params.type,
            layoutKey: route.params.layout,
          })
        },
        {
          path: "form/:type/:id/:layout?",
          name: "formbyid",
          component: Form,
          props: route => ({
            dataType: route.params.type,
            id: route.params.id,
            formLayoutKey: route.params.layout,
            readOnly: route.query.readOnly === 'false' ? false : true
          })
        },
        {
          path: "form/:type",
          name: "newform",
          component: Form,
          props: route => ({
            dataType: route.params.type,
            formLayoutKey: route.params.type === 'questions' ? 'question02' : 'formDefinition',
            readOnly: false
          })
        },
        {
          path: "answerform",
          name: "answerform",
          component: AnswerForm,
        },
        {
          path: "exampleform",
          name: "exampleform",
          component: ExampleForm,
        },
        {
          path: "exampleform2",
          name: "exampleform2",
          component: ExampleFormTwo,
        },
      ]
    },
    {
      path: "/test",
      name: "test",
      component: Test,
    },
  ],
});

export default router;
