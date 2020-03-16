import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import io from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import Storage from 'vue-ls';

// LocalStorage setup
const options = {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
};

Vue.use(Storage, options);

// Web Socket setup
const socket = io('http://10.236.131.152:81');
Vue.use(VueSocketIOExt, socket);

// Production setting
Vue.config.productionTip = false;

// Vue Instance setup
new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
