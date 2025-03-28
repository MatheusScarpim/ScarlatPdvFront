@ -0,0 +1,34 @@
<template> 
    <div>
        <LeitorCodBarra @barcode-read="onBarcodeRead"/>
        <ProdutosView :codBarra="barcode"/>
    </div>
</template>

<script>

import LeitorCodBarra from '@/components/LeitorCodBarra/LeitorCodBarra.vue';
import ProdutosView from './components/ProdutosView.vue';

export default {
    name: 'Carrinho',
    components: {
        LeitorCodBarra,
        ProdutosView,
    },
    data() {
        return {
            barcode: null,
        };
    },
    methods: {
        onBarcodeRead(barcode) {
            this.barcode = barcode;
            setTimeout(() => {
                this.barcode = null;
            }, 1000); 
        },
    },
};

</script>