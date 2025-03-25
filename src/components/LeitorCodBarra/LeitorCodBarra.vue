<template>
    <v-container class="barcode-reader-container" fluid>
        <v-row justify="center" no-gutters>
            <v-col cols="auto" class="text-center">
                <v-btn @click="toggleMode" class="ma-2">{{ isTyping ? 'Usar Leitor' : 'Digitar Código' }}</v-btn>
            </v-col>
        </v-row>
        <div class="hidden-barcode-reader" v-if="false">
            <StreamBarcodeReader @decode="onBarcodeRead" :options="{ video: { facingMode: 'environment' } }" />
        </div>
        <v-dialog v-model="dialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Digite o Código de Barras</v-card-title>
                <v-card-text>
                    <v-text-field v-model="barcodeInput" label="Digite o código de barras" @keyup.enter="onBarcodeRead(barcodeInput)"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeDialog">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { StreamBarcodeReader } from 'vue-barcode-reader';
import { useToast } from 'vue-toastification';

export default {
    components: {
        StreamBarcodeReader,
    },
    data() {
        return {
            barcode: null,
            barcodeInput: '',
            isTyping: false,
            isReading: false, // Variável de controle
            dialog: false, // Controle do dialog
            inputBuffer: '', // Buffer para capturar a entrada do teclado
        };
    },
    watch: {
        dialog(val) {
            if (!val) {
                this.isTyping = false; // Volta para o leitor quando o dialog é fechado
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        toggleMode() {
            this.isTyping = !this.isTyping;
            this.dialog = this.isTyping; // Abre o dialog se estiver digitando
        },
        closeDialog() {
            this.dialog = false;
        },
        onBarcodeRead(barcode) {
            if (this.isReading) return; // Bloqueia a leitura se já estiver lendo

            this.isReading = true; // Define como lendo
            this.barcode = barcode;
            this.dialog = false; // Fecha o dialog
            this.$emit('barcode-read', barcode);
            this.playBeep();
            this.showToast(`Código de barras lido: ${barcode}`);
            setTimeout(() => {
                this.barcode = null;
                this.barcodeInput = '';
                this.isReading = false; // Libera a leitura após 3 segundos
                this.inputBuffer = '';
            }, 1000); // Bloqueia a leitura por 3 segundos
        },
        playBeep() {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, context.currentTime);
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.5);
            oscillator.stop(context.currentTime + 0.5);
        },
        showToast(message) {
            const toast = useToast();
            toast.success(message, {
                position: "top-right",
                timeout: 1300, // Tempo da notificação reduzido
            });
        },
        handleKeydown(event) {
            if (!this.isTyping) {
                const validKeys = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]$/;
                if (validKeys.test(event.key)) {
                    this.inputBuffer += event.key;
                }
                if (event.key === 'Enter') {
                    console.log('Enter key pressed:', this.inputBuffer);
                    this.onBarcodeRead(this.inputBuffer);
                }
            }
        }
    },
};
</script>

<style>
.barcode-reader-container {
    padding: 10px;
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