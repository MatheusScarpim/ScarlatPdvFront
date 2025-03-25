<template> 
    <div>
        <h1>Armazens</h1>
        <ArmazemList />
    </div>
</template>

<script>

import ArmazemList from './components/ArmazemList.vue';

export default {
    name: 'Armazens',
    components: {
        ArmazemList,
    },
};

</script>