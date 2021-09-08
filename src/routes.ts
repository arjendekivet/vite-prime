import { createRouter, createWebHistory } from "vue-router";
// import App from "@/App.vue";
import Hello from "@/components/HelloWorld.vue";
import Events from "@/components/EventsTable.vue";
import NavLayout from "@/components/NavLayout.vue";
import QuestionForm from "@/components/QuestionForm.vue";
import AnswerForm from "@/components/AnswerForm.vue";

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
      path: "/answerform",
      name: "answerform",
      component: AnswerForm,
    },
  ],
});

export default router;
