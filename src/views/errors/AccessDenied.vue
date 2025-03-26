<template>
  <div class="access-denied">
    <h1>403 - Acesso Negado</h1>
    <p>Você não tem permissão para acessar esta página.</p>
    <router-link to="/">Voltar para o início</router-link>
  </div>
</template>

<style scoped>
.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.access-denied h1 {
  font-size: 3rem;
  color: #ff5252;
}

.access-denied p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>
