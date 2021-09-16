import { createRouter, createWebHistory } from "vue-router";
import Hello from "@/components/other/Home.vue";
import Events from "@/components/tables/EventsTable.vue";
import Questions from "@/components/tables/QuestionsTable.vue";
import NavLayout from "@/components/navigation/NavLayout.vue";
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
      component: Hello,
    },
    {
      path: "/events",
      name: "events",
      component: Events,
    },
    {
      path: "/questions",
      name: "questions",
      component: Questions,
    },
    {
      path: "/nav",
      name: "nav",
      component: NavLayout,
    },
    {
      path: "/questionform",
      name: "questionform",
      component: QuestionForm,
    },
    {
      path: "/questionform/:id",
      name: "questionformbyid",
      component: QuestionForm,
      props: true,
    },
    {
      path: "/answerform",
      name: "answerform",
      component: AnswerForm,
    },
    {
      path: "/test",
      name: "test",
      component: Test,
    },
  ],
});

export default router;
