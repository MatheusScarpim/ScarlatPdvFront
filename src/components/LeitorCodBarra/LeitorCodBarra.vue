<template>
  <div class="barcode-reader-container">
    <div class="row justify-content-center">
      <div class="col-auto text-center">
        <button @click="toggleMode" class="btn btn-primary mb-3">
          <i :class="isTyping ? 'fas fa-camera' : 'fas fa-keyboard'"></i>
          {{ isTyping ? "Usar Leitor" : "Digitar Código" }}
        </button>
      </div>
    </div>
    
    <div class="barcode-reader" v-if="false">
      <StreamBarcodeReader
        @decode="onBarcodeRead"
        :options="{ video: { facingMode: 'environment' } }"
      />
    </div>
    
    <!-- Modal Bootstrap -->
    <div class="modal fade" :class="{ show: dialog }" :style="{ display: dialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-barcode"></i>
              Digite o Código de Barras
            </h5>
            <button type="button" class="btn-close" @click="closeDialog"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="barcodeInput" class="form-label">Código de barras:</label>
              <input
                type="text"
                class="form-control"
                id="barcodeInput"
                v-model="barcodeInput"
                placeholder="Digite ou escaneie o código de barras"
                @keyup.enter="onBarcodeRead(barcodeInput)"
                ref="barcodeInputRef"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDialog">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button type="button" class="btn btn-success" @click="closeDialog">
              <i class="fas fa-check"></i>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Backdrop do modal -->
    <div v-if="dialog" class="modal-backdrop fade show"></div>
  </div>
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
      } else {
        // Focar no input quando o modal abrir
        this.$nextTick(() => {
          if (this.$refs.barcodeInputRef) {
            this.$refs.barcodeInputRef.focus();
          }
        });
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
    // Prevenir scroll quando modal estiver aberto
    document.body.style.overflow = this.dialog ? 'hidden' : 'auto';
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
    document.body.style.overflow = 'auto';
  },
  methods: {
    toggleMode() {
      this.isTyping = !this.isTyping;
      this.dialog = this.isTyping;
      document.body.style.overflow = this.dialog ? 'hidden' : 'auto';
    },
    closeDialog() {
      if (this.barcodeInput) {
        this.onBarcodeRead(this.barcodeInput);
      }
      this.dialog = false;
      document.body.style.overflow = 'auto';
    },
    onBarcodeRead(barcode) {
      if (this.isReading || !barcode) return;

      this.isReading = true;
      this.barcode = barcode;
      this.dialog = false;
      document.body.style.overflow = 'auto';
      
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
      try {
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
      } catch (error) {
        console.log('Audio context not available');
      }
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

<style scoped>
.barcode-reader-container {
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
}

.btn-secondary {
  background: #6c757d;
  border: none;
}

/* Modal customizado */
.modal {
  z-index: 1050;
}

.modal-backdrop {
  z-index: 1040;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  border-bottom: none;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
  opacity: 0.8;
}

.btn-close:hover {
  opacity: 1;
}

.form-control {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .barcode-reader-container {
    padding: 15px;
  }
  
  .modal-dialog {
    margin: 1rem;
  }
}
</style>