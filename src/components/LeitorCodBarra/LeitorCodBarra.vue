<template>
  <v-container class="barcode-reader-container" fluid>
    <v-row justify="center" no-gutters>
      <v-col cols="auto" class="text-center">
        <v-btn @click="toggleMode" class="ma-2">{{
          isTyping ? "Usar Leitor" : "Digitar Código"
        }}</v-btn>
      </v-col>
    </v-row>
    <div class="barcode-reader" v-if="false">
      <StreamBarcodeReader
        @decode="onBarcodeRead"
        :options="{ video: { facingMode: 'environment' } }"
      />
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Digite o Código de Barras</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="barcodeInput"
            label="Digite o código de barras"
            @keyup.enter="onBarcodeRead(barcodeInput)"
          ></v-text-field>
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
import { StreamBarcodeReader } from "vue-barcode-reader";
import { useToast } from "vue-toastification";

export default {
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {
      barcode: null,
      barcodeInput: "",
      isTyping: false,
      isReading: false,
      dialog: false,
      inputBuffer: "",
    };
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.isTyping = false;
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    toggleMode() {
      this.isTyping = !this.isTyping;
      this.dialog = this.isTyping;
    },
    closeDialog() {
      if (this.barcodeInput) {
        this.onBarcodeRead(this.barcodeInput);
      }
      this.dialog = false;
    },
    onBarcodeRead(barcode) {
      if (this.isReading) return;

      this.isReading = true;
      this.barcode = barcode;
      this.dialog = false;
      this.$emit("barcode-read", barcode);
      this.playBeep();
      this.showToast(`Código de barras lido: ${barcode}`);
      setTimeout(() => {
        this.barcode = null;
        this.barcodeInput = "";
        this.isReading = false;
        this.inputBuffer = "";
      }, 2000);
    },
    playBeep() {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1000, context.currentTime);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        context.currentTime + 0.5
      );
      oscillator.stop(context.currentTime + 0.5);
    },
    showToast(message) {
      const toast = useToast();
      toast.success(message, {
        position: "top-right",
        timeout: 1300,
      });
    },
    handleKeydown(event) {
      if (!this.isTyping && !this.dialog) {
        const validKeys = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]$/;
        if (validKeys.test(event.key)) {
          this.inputBuffer += event.key;
        }
        if (event.key === "Enter" && this.inputBuffer) {
          console.log("Enter key pressed:", this.inputBuffer);
          this.onBarcodeRead(this.inputBuffer);
        }
      }
    },
  },
};
</script>

<style>
.barcode-reader-container {
  padding: 10px;
  font-family: Arial, sans-serif;
}

.barcode-reader {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  position: relative;
}

.barcode-reader video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
