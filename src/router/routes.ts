import { createRouter, createWebHistory } from "vue-router";
import { getUser } from '@/modules/globalState'
import Welcome from "@/pages/Welcome.vue";
import Start from "@/pages/Start.vue";
import Admin from "@/pages/Admin.vue";
import Table from "@/components/Table.vue";
import Form from "@/components/Form.vue";
import AppSignUp from "@/components/AppSignUp.vue";
import AppSignIn from "@/components/AppSignIn.vue";
import AppSignOut from "@/components/AppSignOut.vue";

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
      path: "/signup",
      name: "signup",
      component: AppSignUp,
    },
    {
      path: "/signin",
      name: "signin",
      component: AppSignIn,
    },
    {
      path: "/signout",
      name: "signout",
      component: AppSignOut,
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
          path: "table/:type/:layout?/:formLayoutKey?",
          name: "table",
          component: Table,
          props: route => ({
            dataType: route.params.type,
            layoutKey: route.params.layout,
            formLayoutKey: route.params.formLayoutKey
          })
        },
        {
          path: "form/:type/:id?/:layout?",
          name: "form",
          component: Form,
          props: route => ({
            dataType: route.params.type,
            id: route.params.id === '0' ? null : route.params.id,
            formLayoutKey: route.params.layout,
            readOnly: route.query.readOnly === 'false' || route.params.id === '0' || !route.params.id ? false : true
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

// If not logged in route to signin page
router.beforeEach((to, from, next) => {
  if (!(to.name === 'signin' || to.name === 'signup') && !getUser()) {
    next({ name: 'signin' })
  } else {
    next()
  }
})

export default router;
