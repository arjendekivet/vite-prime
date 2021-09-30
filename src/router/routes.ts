import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/pages/Welcome.vue";
import Start from "@/pages/Start.vue";
import Admin from "@/pages/Admin.vue";
import Events from "@/components/tables/EventsTable.vue";
import Questions from "@/components/tables/QuestionsTable.vue";
import QuestionForm from "@/components/forms/QuestionForm.vue";
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
      redirect: { name: "questions" },
      children: [
        {
          path: 'welcome',
          name: "admin_welcome",
          component: Welcome
        },
        {
          path: "events",
          name: "events",
          component: Events,
        },
        {
          path: "questions",
          name: "questions",
          component: Questions,
        },
        {
          path: "questions/search/:searchText",
          name: "questionsSearch",
          component: Questions,
        },
        {
          path: "questionform",
          name: "questionform",
          component: QuestionForm,
        },
        {
          path: "questionform/:id",
          name: "questionformbyid",
          component: QuestionForm,
          props: route => ({ id: route.params.id, readOnly: route.query.readOnly === 'false' ? false : true })
        },
        {
          path: "answerform",
          name: "answerform",
          component: AnswerForm,
        },]
    },
    {
      path: "/test",
      name: "test",
      component: Test,
    },
  ],
});

export default router;
