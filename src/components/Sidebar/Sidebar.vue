<template>
  <div :class="['modern-sidebar', { 'collapsed': !isSidebarVisible }]">
    <div class="sidebar-header">
      <div class="logo">
        <i class="fas fa-store"></i>
        <span v-if="isSidebarVisible" class="logo-text">ScarlatMarket</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="fas fa-home nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Dashboard</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/fornecedor" class="nav-link" active-class="active">
            <i class="fas fa-truck nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Fornecedores</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/armazem" class="nav-link" active-class="active">
            <i class="fas fa-warehouse nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Armazém</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/categoria" class="nav-link" active-class="active">
            <i class="fas fa-tags nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Categorias</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/medida" class="nav-link" active-class="active">
            <i class="fas fa-balance-scale nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Medidas</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/mercadinho" class="nav-link" active-class="active">
            <i class="fas fa-shopping-cart nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Mercadinho</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/produto" class="nav-link" active-class="active">
            <i class="fas fa-box nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Produtos</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/vizualizar-produto" class="nav-link" active-class="active">
            <i class="fas fa-search nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Buscar Produto</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/carrinho" class="nav-link" active-class="active">
            <i class="fas fa-shopping-basket nav-icon"></i>
            <span v-if="isSidebarVisible" class="nav-text">Carrinho</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer" v-if="isSidebarVisible">
      <div class="user-info">
        <i class="fas fa-user-circle"></i>
        <span>Admin</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isSidebarVisible: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
.modern-sidebar {
  position: fixed;
  top: 75px;
  left: 0;
  bottom: 0;
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modern-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.logo i {
  font-size: 1.5rem;
  margin-right: 12px;
  color: #ffd700;
}

.logo-text {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 0 25px 25px 0;
  margin-right: 10px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(5px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ffd700;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  margin-right: 15px;
  transition: transform 0.3s ease;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  font-weight: 500;
  opacity: 1;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.collapsed .nav-link {
  justify-content: center;
  margin-right: 0;
  border-radius: 8px;
  margin: 4px 10px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

.user-info i {
  font-size: 1.5rem;
  margin-right: 10px;
}

/* Scrollbar customization */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .modern-sidebar {
    transform: translateX(-100%);
  }
  
  .modern-sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>

<script>
export default {
  name: 'Sidebar',
  props: {
    isSidebarVisible: {
      type: Boolean,
      required: true
    }
  }
};
</script>