import Vue from "vue";
import Router from "vue-router";
import home from "./views/Home.vue";
// import home from "./pages/Home.vue";
import info from "./views/Info.vue";
import list from "./views/List.vue";
import esa from "./views/Esa.vue";
Vue.use(Router);
export default new Router({
  routes: [
    { path: "/", name: "home", component: home },
    { path: "/info", name: "info", component: info },
    { path: "/esa", name: "esa", component: esa },
    { path: "/list", name: "list", component: list },
  ],
});
