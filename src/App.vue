<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import Navbar from './components/Navbar/Navbar.vue';

const isSidebarVisible = ref(false);

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value;
}
</script>

<template>
  <div class="app-container d-flex flex-column">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <div class="d-flex flex-grow-1">
      <Sidebar :isSidebarVisible="isSidebarVisible" :style="{ width: isSidebarVisible ? '200px' : '65px' }" class="sidebar" />
      <div :class="['main-content', { 'ml-0': !isSidebarVisible, 'ml-250': isSidebarVisible }]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.sidebar {
  background-color: var(--cor-sidebar-fundo);
  color: white;
  position: fixed;
  top: 75px; 
  bottom: 0;
  z-index: 1000;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  padding-left: 80px;
  padding-top: 150px; 
  transition: margin-left 0.3s;
  margin-left: 250;
}

.ml-0 {
  padding-left: 80px;
}

.ml-250 {
  margin-left: 150px;
}
</style>