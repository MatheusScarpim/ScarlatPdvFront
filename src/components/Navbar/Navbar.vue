<template>
  <div class="navbar">
    <div class="navbar-brand">
      <button @click="$emit('toggle-sidebar')" class="sidebar-toggle">
        <i class="fas fa-bars"></i>
      </button>
      <router-link to="/"> ScarlatMarket</router-link>
    </div>
    <nav class="navbar-nav">
      <ul>
        <li>
          <button @click="logout">Logout</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { keycloak } from "@/auth";

export default {
  name: "Navbar",
  methods: {
    logout() {
      keycloak
        .logout({
          redirectUri: window.location.origin + "/",
        })
        .catch((error) => {
          console.error("Erro ao fazer logout:", error);
        });
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--cor-navbar-fundo);
  color: white;
  padding: 6px 20px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-brand {
  font-size: 1.5em;
}

.navbar-brand a {
  color: white;
  text-decoration: none;
}

.navbar-nav ul {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.navbar-nav ul li {
  margin-left: 20px;
}

.navbar-nav ul li a {
  color: white;
  text-decoration: none;
}

.navbar-nav ul li a:hover {
  text-decoration: underline;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
}

.sidebar-toggle:hover {
  color: var(--cor-hover-link); /* Adicione a cor desejada para o hover */
}
</style>
