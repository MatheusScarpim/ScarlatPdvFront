<template> 
    <div>
        <h1>Visualizar Produto</h1>
        <LeitorCodBarra width="300px" height="200px" @barcode-read="onBarcodeRead"/>
        <ProdutoView :codBarra="barcode"/>
    </div>
</template>

<script>

import LeitorCodBarra from '@/components/LeitorCodBarra/LeitorCodBarra.vue';
import ProdutoView from './components/ProdutoView.vue';

export default {
    name: 'Compras',
    components: {
        LeitorCodBarra,
        ProdutoView,
    },
    data() {
        return {
            barcode: null,
        };
    },
    methods: {
        onBarcodeRead(barcode) {
            this.barcode = barcode;
        },
    },
};

</script>