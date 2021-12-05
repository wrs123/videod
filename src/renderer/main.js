import Vue from 'vue'
import axios from 'axios'
import ViewUI from 'view-design';

import App from './App'
import router from './router'
import store from './store'

import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')


