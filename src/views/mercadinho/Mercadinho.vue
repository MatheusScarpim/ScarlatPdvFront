<template> 
    <div>
        <h1>Mercadinhos</h1>
        <MercadinhoList />
    </div>
</template>

<script>

import MercadinhoList from './components/MercadinhoList.vue';

export default {
    name: 'Mercadinho',
    components: {
        MercadinhoList,
    },
};

</script>