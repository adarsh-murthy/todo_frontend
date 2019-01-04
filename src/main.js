import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';

Vue.use(VueResource);
Vue.http.options.root = 'http://127.0.0.1:8000/todo_list/';
Vue.http.headers.common['Authorization'] = 'Basic YW00NDE3OjEyMzQ=';

export const eventBus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
})
