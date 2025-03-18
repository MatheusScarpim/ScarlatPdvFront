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
      <Sidebar v-if="isSidebarVisible" class="sidebar" />
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
  width: 250px;
  background-color: #333;
  color: white;
  position: fixed;
  top: 75px; /* Ajuste conforme a altura da sua navbar */
  bottom: 0;
  z-index: 1000;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  padding-left: 80px;
  padding-right: 80px;
  padding-top: 200px; /* Ajuste conforme a altura da sua navbar */
  transition: margin-left 0.3s;
}

.ml-0 {
  margin-left: 0;
}

.ml-250 {
  margin-left: 250px;
}
</style>