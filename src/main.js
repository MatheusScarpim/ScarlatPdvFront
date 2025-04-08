// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeKeycloak, keycloak } from './auth'

import BootstrapVue3 from 'bootstrap-vue-3'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import './assets/style.css';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: { dark: true },
  icons: { defaultSet: 'mdi' }
})

initializeKeycloak().then(() => {
  const app = createApp(App)
  app.use(router)
  app.use(vuetify)
  app.use(BootstrapVue3)
  app.mount('#app')

  const roles = keycloak.tokenParsed?.realm_access?.roles || []
  if (window.location.pathname === '/' || window.location.pathname === '/login') {
    if (roles.includes('admin')) {
      router.replace('/produto')
    } else if (roles.includes('carrinho')) {
      router.replace('/mercadinho')
    } else {
      router.replace('/unauthorized') // ou outra página padrão
    }
  }
})
