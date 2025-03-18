<template> 
    <div>
        <h1>Fornecedores</h1>
        <FornecedorList />
    </div>
</template>

<script>

import FornecedorList from './components/FornecedorList.vue';

export default {
    name: 'Fornecedores',
    components: {
        FornecedorList,
    },
};

</script>