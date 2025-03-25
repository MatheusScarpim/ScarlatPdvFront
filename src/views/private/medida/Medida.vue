<template> 
    <div>
        <h1>Medidas</h1>
        <MedidaList />
    </div>
</template>

<script>

import MedidaList from './components/MedidaList.vue';

export default {
    name: 'Medidas',
    components: {
        MedidaList,
    },
};

</script>