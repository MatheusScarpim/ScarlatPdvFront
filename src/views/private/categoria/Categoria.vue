<template> 
    <div>
        <h1>Categorias</h1>
        <CategoriaList />
    </div>
</template>

<script>

import CategoriaList from './components/CategoriaList.vue';

export default {
    name: 'Categorias',
    components: {
        CategoriaList,
    },
};

</script>