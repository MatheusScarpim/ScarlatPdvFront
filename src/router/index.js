import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/private/dashboard/dashboard.vue';
import Fornecedor from '@/views/private/fornecedor/Fornecedor.vue';
import Categoria from '@/views/private/categoria/Categoria.vue';
import Armazem from '@/views/private/armazem/Armazem.vue';
import Medida from  '@/views/private/medida/Medida.vue';
import Mercadinho from '@/views/mercadinho/Mercadinho.vue';
import Produto from '@/views/private/produto/Produto.vue';
import VisualizarProduto from '@/views/private/visualizar-produto/VisualizarProduto.vue';
import carrinho from '@/views/private/carrinho/carrinho.vue';


const routes = [
  { path: '/', component: Dashboard },
  {path: '/fornecedor', component: Fornecedor},
  {path: '/categoria', component: Categoria},
  {path: '/armazem', component: Armazem},
  {path: '/medida', component: Medida},
  {path: '/mercadinho', component: Mercadinho},
  {path: '/produto', component: Produto},
  {path: '/vizualizar-produto', component: VisualizarProduto},
  {path: '/carrinho', component: carrinho}
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;