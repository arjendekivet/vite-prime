import { createRouter, createWebHistory } from "vue-router";
// import { getUser } from '@/modules/globalState'
import Welcome from "@/pages/Welcome.vue";
import AppLayout from '@/components/AppLayout.vue'
import Pick from "@/pages/Pick.vue";
import Questionnaire from "@/components/Questionnaire.vue"
import QuestionnaireFilter from '@/components/QuestionnaireFilter.vue'

import Table from "@/components/Table.vue";
import Form from "@/components/Form.vue";
import AppNavBar from '@/components/AppNavBar.vue';
import AppSignUp from "@/components/AppSignUp.vue";
import AppSignIn from "@/components/AppSignIn.vue";
import AppSignOut from "@/components/AppSignOut.vue";

import Test from "@/pages/Test.vue";

import Store from '@/store'

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
      component: AppLayout,
      props: { navBar: true },
      redirect: { name: "home_welcome" },
      children: [
        {
          path: 'welcome',
          name: "home_welcome",
          components: {
            default: Welcome,
            LeftSidebar: QuestionnaireFilter,
          },
        },
        {
          path: 'pick',
          name: "home_pick",
          components: {
            default: Pick,
          },
        },
        {
          path: 'questionnaire/:categoryOne/:categoryTwo?/:categoryThree?',
          name: "questionnaire",
          components: {
            default: Questionnaire,
            LeftSidebar: QuestionnaireFilter,
          },
          props: {
            default: route => ({
              categoryOne: route.params.categoryOne,
              categoryTwo: route.params.categoryTwo,
              categoryThree: route.params.categoryThree
            })
          }
        },
      ]
    },
    {
      path: "/admin",
      name: "admin",
      component: AppLayout,
      redirect: { name: "admin_welcome" },
      children: [
        {
          path: 'welcome',
          name: "admin_welcome",
          components: {
            default: Welcome,
            LeftSidebar: AppNavBar,
          },
        },
        {
          path: "table/:type/:layout?/:formLayoutKey?",
          name: "table",
          components: {
            default: Table,
            LeftSidebar: AppNavBar,
          },
          props: {
            default: route => ({
              dataType: route.params.type,
              layoutKey: route.params.layout,
              formLayoutKey: route.params.formLayoutKey
            })
          }
        },
        {
          path: "form/:type/:id?/:layout?",
          name: "form",
          components: {
            default: Form,
            LeftSidebar: AppNavBar,
          },
          props: {
            default: route => ({
              dataType: route.params.type,
              id: route.params.id === '0' ? null : route.params.id,
              formLayoutKey: route.params.layout,
              readOnly: route.query.readOnly === 'false' || route.params.id === '0' || !route.params.id ? false : true
            })
          }
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
  // if (!(to.name === 'signin' || to.name === 'signup') && !getUser()) {
  const user = Store?.getters['user/getUser']
  if (!(to.name === 'signin' || to.name === 'signup' || to.name === 'signout') && !user) {
    next({ name: 'signin' })
  } else {
    next()
  }
})

export default router;
