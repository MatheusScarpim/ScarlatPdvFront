<template>
  <div class="container">
    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-collapsed': !isSidebarVisible }]">
      <nav>
        <ul>
          <li>
            <router-link to="/">
              <i class="fa fa-home"></i>
              <span v-if="isSidebarVisible">Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/fornecedor">
              <i class="fa fa-info-circle"></i>
              <span v-if="isSidebarVisible">Fornecedor</span>
            </router-link>
          </li>
          <li>
            <router-link to="/armazem">
              <i class="fa fa-warehouse"></i>
              <span v-if="isSidebarVisible">Armazem</span>
            </router-link>
          </li>
          <li>
            <router-link to="/categoria">
              <i class="fa fa-list-alt"></i>
              <span v-if="isSidebarVisible">Categoria</span>
            </router-link>
          </li>
          <li>
            <router-link to="/medida">
              <i class="fa fa-balance-scale"></i>
              <span v-if="isSidebarVisible">Medida</span>
            </router-link>
          </li>
          <li>
            <router-link to="/mercadinho">
              <i class="fa fa-store"></i>
              <span v-if="isSidebarVisible">Mercadinho</span>
            </router-link>
          </li>
          <li>
            <router-link to="/produto">
              <i class="fa fa-box"></i>
              <span v-if="isSidebarVisible">Produto</span>
            </router-link>
          </li>
          <li>
            <router-link to="/visualizar-produto">
              <i class="fa fa-eye"></i>
              <span v-if="isSidebarVisible">Ver Produto</span>
            </router-link>
          </li>
        </ul>
      </nav>
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
.container {
  display: flex;
}

.sidebar {
  padding-top: 20px;
  width: 250px;
  height: 100vh;
  background-color: var(--cor-sidebar-fundo);
  color: white;
  z-index: 1000;
  transition: width 0.3s;
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar nav ul {
  list-style-type: none;
  padding: 0;
}

.sidebar nav ul li {
  padding: 15px 10px;
  text-align: center;
}

.sidebar nav ul li a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar nav ul li a:hover {
  color: var(--cor-hover-link); 
}

.sidebar nav ul li a span {
  margin-left: 10px;
}
</style>  