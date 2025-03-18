<template>
    <div class="navbar">
      <div class="navbar-brand">
        <button @click="$emit('toggle-sidebar')" class="sidebar-toggle">☰</button>
        <router-link to="/">MyProject</router-link>
      </div>
      <nav class="navbar-nav">
        <ul>
          <li><router-link to="/">🏠</router-link></li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: white;
    padding: 10px 20px;
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
  </style>