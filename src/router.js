import { createRouter, createWebHistory } from "vue-router";
import TitleScreen from "./pages/TitleScreen.vue";
import ProjectSelect from "./pages/ProjectSelect.vue";
import EventMap from "./pages/EventMap.vue";

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: "/", name: "title", component: TitleScreen },
    { path: "/projects", name: "projects", component: ProjectSelect },
    { path: "/map", name: "map", component: EventMap },
  ],
});
