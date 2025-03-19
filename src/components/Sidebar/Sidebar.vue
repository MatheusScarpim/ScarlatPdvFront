<template>
    <div class="container">
      <!-- Sidebar -->
      <div class="sidebar">
        <nav>
          <ul>
            <li><router-link to="/">🏠 Home</router-link></li>
            <li><router-link to="/fornecedor">ℹ️ Fornecedor</router-link></li>
            <li><router-link to="/armazem">📞 Armazem</router-link></li>
            <li><router-link to="/categoria">ℹ️ Categoria</router-link></li>
            <li><router-link to="/medida">ℹ️ Medida</router-link></li>
            <li><router-link to="/mercadinho">📞 Mercadinho</router-link></li>
            <li><router-link to="/produto">📞 Produto</router-link></li>
          </ul>
        </nav>
      </div>
    </div>
</template>

<script>
export default {
    name: 'Sidebar'
};
</script>

<style scoped>
.container {
    display: flex;
}

.sidebar {
    width: 130px;
    height: 100vh;
    background-color: #333;
    color: white;
    position: fixed;
    left: 0;
    z-index: 1000;
}

.sidebar nav ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.sidebar nav ul li {
    padding: 10px;
    text-align: center;
}

.sidebar nav ul li a {
    color: white;
    text-decoration: none;
    display: block;
}

.sidebar nav ul li a:hover {
    background-color: #575757;
}

</style>