<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import Navbar from './components/Navbar/Navbar.vue';

const isSidebarVisible = ref(true);

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value;
}
</script>

<template>
  <div class="app-container">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isSidebarVisible="isSidebarVisible" />
    <main :class="['main-content', { 'sidebar-collapsed': !isSidebarVisible }]">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  margin-left: 280px;
  margin-top: 75px;
  padding: 30px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: calc(100vh - 75px);
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px 15px;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import Navbar from './components/Navbar/Navbar.vue';

const isSidebarVisible = ref(true);

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value;
}
</script>