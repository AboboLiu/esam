import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
Vue.config.productionTip = false;
import axios from 'axios';
Vue.prototype.$http = axios;
import 'element-ui/lib/theme-chalk/index.css';
import './wt/old';
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
