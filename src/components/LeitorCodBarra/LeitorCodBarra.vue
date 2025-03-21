<template>
    <v-container class="barcode-reader-container">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <v-btn @click="toggleMode">{{ isTyping ? 'Usar Leitor' : 'Digitar Código' }}</v-btn>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="isTyping">
            <v-col cols="12" md="6" class="text-center">
                <v-text-field v-model="barcodeInput" label="Digite o código de barras" @keyup.enter="onBarcodeRead(barcodeInput)"></v-text-field>
            </v-col>
        </v-row>
        <div class="hidden-barcode-reader">
            <StreamBarcodeReader @decode="onBarcodeRead" :options="{ video: { facingMode: 'environment' } }" />
        </div>
        <v-row justify="center" v-if="barcode">
            <v-col cols="12" class="text-center">
                <v-alert type="success">Código de barras lido: {{ barcode }}</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { StreamBarcodeReader } from 'vue-barcode-reader';

export default {
    components: {
        StreamBarcodeReader,
    },
    data() {
        return {
            barcode: null,
            barcodeInput: '',
            isTyping: false,
        };
    },
    methods: {
        toggleMode() {
            this.isTyping = !this.isTyping;
        },
        onBarcodeRead(barcode) {
            this.barcode = barcode;
            this.$emit('barcode-read', barcode);
        },
    },
};
</script>

<style>
.barcode-reader-container {
    padding: 20px;
    font-family: Arial, sans-serif;
}

.hidden-barcode-reader {
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
</style>