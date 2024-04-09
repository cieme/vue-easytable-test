import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/1.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/2",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/2.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
