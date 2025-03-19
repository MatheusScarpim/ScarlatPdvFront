<template> 
    <div>
        <h1>Produtos</h1>
        <ProdutoList />
    </div>
</template>

<script>

import ProdutoList from './components/ProdutoList.vue';

export default {
    name: 'Produto',
    components: {
        ProdutoList,
    },
};

</script>