import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/private/dashboard/dashboard.vue';
import Fornecedor from '../views/private/fornecedor/Fornecedor.vue';
import Categoria from '../views/private/Categoria/Categoria.vue';
import Armazem from '../views/private/armazem/Armazem.vue';


const routes = [
  { path: '/', component: Dashboard },
  {path: '/fornecedor', component: Fornecedor},
  {path: '/categoria', component: Categoria},
  {path: '/armazem', component: Armazem}

];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
