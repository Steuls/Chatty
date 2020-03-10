import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import io from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

// Chat Setup

// Web Socket setup
const socket = io('http://localhost:81');
Vue.use(VueSocketIOExt, socket);

// Production setting
Vue.config.productionTip = false;

// Vue Instance setup
new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
