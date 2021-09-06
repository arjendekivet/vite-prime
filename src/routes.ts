import { createRouter, createWebHistory } from "vue-router";
// import App from "@/App.vue";
import Hello from "@/components/HelloWorld.vue";
import Events from "@/components/Events.vue";

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
  ],
});

export default router;
