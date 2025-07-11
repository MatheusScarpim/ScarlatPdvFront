import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue3 from 'bootstrap-vue-3';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import './assets/style.css';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);

app.use(router);
app.use(Toast);
app.use(BootstrapVue3);
app.mount('#app');