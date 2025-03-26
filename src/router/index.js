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
        return keycloak.login({ redirectUri: window.location.origin + '/' })
      }

      const isAdmin = keycloak.hasRealmRole('admin')
      const isMercado = keycloak.hasRealmRole('Mercado')

      if (isAdmin) return next('/produto')
      if (isMercado) return next('/mercadinho')

      return next('/acesso-negado')
    }
  },

  { path: '/produto', component: Produto, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/fornecedor', component: Fornecedor, meta: { requiresAuth: true, roles: ['Mercado'] } },
  { path: '/categoria', component: Categoria, meta: { requiresAuth: true } },
  { path: '/armazem', component: Armazem, meta: { requiresAuth: true } },
  { path: '/medida', component: Medida, meta: { requiresAuth: true } },
  { path: '/mercadinho', component: Mercadinho, meta: { requiresAuth: true, roles: ['Mercado'] } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/vizualizar-produto', component: VisualizarProduto, meta: { requiresAuth: true } },
  { path: '/acesso-negado', component: AccessDenied }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Verifica se o usuário tem a role exigida
function hasRequiredRoles(requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) return true
  return requiredRoles.some(role => keycloak.hasRealmRole(role))
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!keycloak.authenticated) {
      return keycloak.login({
        redirectUri: window.location.origin + to.fullPath
      })
    }

    const requiredRoles = to.meta.roles
    const hasAccess = !requiredRoles || requiredRoles.some(role => keycloak.hasRealmRole(role))

    if (!hasAccess) {
      return next('/acesso-negado')
    }
  }

  next()
})


export default router
