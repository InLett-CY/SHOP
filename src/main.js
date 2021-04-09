import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '../src/assets/global.css'
import axios from 'axios'
import '../src/fonts/iconfont.css';
import TreeTable from "vue-table-with-tree-grid";

Vue.component("tree-table", TreeTable);

Vue.config.productionTip = false

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use(config => {
  // 使用请求拦截器给接口请求添加token
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
