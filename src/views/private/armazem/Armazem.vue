<template>
  <div>
    <h1>Gerenciamento de Armazéns</h1>
    <ArmazemList />
  </div>
</template>

<script>
import ArmazemList from './components/ArmazemList.vue';

export default {
  name: 'Armazem',
  components: {
    ArmazemList,
  },
};
</script>
