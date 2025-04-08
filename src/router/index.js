import { createRouter, createWebHistory } from 'vue-router'
import { keycloak } from '@/auth'

import Dashboard from '@/views/private/dashboard/dashboard.vue'
import Fornecedor from '@/views/private/fornecedor/Fornecedor.vue'
import Categoria from '@/views/private/Categoria/Categoria.vue'
import Armazem from '@/views/private/armazem/Armazem.vue'
import Medida from '@/views/private/medida/Medida.vue'
import Mercadinho from '@/views/mercadinho/Mercadinho.vue'
import Produto from '@/views/private/produto/Produto.vue'
import VisualizarProduto from '@/views/private/visualizar-produto/VisualizarProduto.vue'
import AccessDenied from '@/views/errors/AccessDenied.vue'

const routes = [
  {
    path: '/',
    beforeEnter: async (to, from, next) => {
      if (!keycloak.authenticated) {
        return keycloak.login({ redirectUri: window.location.origin + to.fullPath });
      }

      const isAdmin = keycloak.hasRealmRole('admin');
      const isCarrinho = keycloak.hasRealmRole('carrinho');
      
      // Aqui verifica se a rota de destino é diferente de '/' e permite o redirecionamento para ela
      if (to.fullPath !== '/') {
        return next();
      }

      if (isAdmin) return next('/produto');
      if (isCarrinho) return next('/mercadinho');

      return next('/acesso-negado');
    },
  },
  { path: '/produto', component: Produto, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/fornecedor', component: Fornecedor, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/categoria', component: Categoria, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/armazem', component: Armazem, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/medida', component: Medida, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/mercadinho', component: Mercadinho, meta: { requiresAuth: true, roles: ['carrinho', 'admin'] } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/visualizar-produto', component: VisualizarProduto, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/acesso-negado', component: AccessDenied },
];
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const urlContainsParams = window.location.hash.includes('state=') || window.location.hash.includes('code=');

  if (urlContainsParams) {
    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState(null, null, cleanUrl);
  }

  if (to.meta.requiresAuth && !keycloak.authenticated) {
    keycloak.login({ redirectUri: window.location.origin + to.fullPath });
  } else if (!keycloak.authenticated) {
    next();
  } else {
    const requiredRoles = to.meta.roles || [];
    const hasAccess = requiredRoles.length === 0 || requiredRoles.some(role => keycloak.hasRealmRole(role));

    if (!hasAccess) {
      next('/acesso-negado');
    } else {
      next();
    }
  }
});

// Adicione um ouvinte para mudanças de URL e limpe os parâmetros indesejados
window.addEventListener('load', () => {
  if (window.location.hash && (window.location.hash.includes('state=') || window.location.hash.includes('code='))) {
    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState(null, null, cleanUrl);
  }
});

export default router
