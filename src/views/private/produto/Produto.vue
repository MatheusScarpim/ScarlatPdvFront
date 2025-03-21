<template> 
    <div>
        <h1>Produtos</h1>
        <ProdutoList />
        <LeitorCodBarra />
    </div>
</template>

<script>

import ProdutoList from './components/ProdutoList.vue';
import LeitorCodBarra from '../../../components/LeitorCodBarra/LeitorCodBarra.vue';

export default {
    name: 'Produto',
    components: {
        ProdutoList,
        LeitorCodBarra,
    },
};

</script>