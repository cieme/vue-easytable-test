import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入样式
import "vue-easytable/libs/theme-default/index.css";
// 引入组件库
import VueEasytable from "vue-easytable/packages/index";

Vue.use(VueEasytable);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
