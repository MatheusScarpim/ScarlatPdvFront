// filepath: c:\Users\mathe\Documents\Github\ScarlatPdvFront\src\main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue3 from 'bootstrap-vue-3';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import '@mdi/font/css/materialdesignicons.css';


const vuetify = createVuetify({
  components,
  directives,
  theme: {
    dark: true,
  },
  icons: {
    defaultSet: 'mdi', // Certifique-se de definir o conjunto de ícones
  },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(BootstrapVue3);
app.mount('#app');