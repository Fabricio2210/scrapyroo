import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import 'vue-awesome/icons/flag';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import VueSocketIO from 'vue-socket.io';
import Vuelidate from 'vuelidate';

Vue.use(new VueSocketIO({
  debug: true,
  connection:'http://localhost:3000/'
}))

Vue.use(Vuelidate)
 
Vue.component('v-icon', Icon)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
