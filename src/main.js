// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import { serverUrl } from './assets/js/const'

Vue.config.productionTip = false
Vue.prototype.axios = axios

axios.defaults.baseURL = serverUrl[process.env.NODE_ENV]
axios.defaults.withCredentials = true
// axios.defaults.headers.common['content-type'] = 'application/json'

/* 自定义指令 */
Vue.directive('superClick',{
  inserted: function(el,binding){
    console.log(el);
    console.log(binding);
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
