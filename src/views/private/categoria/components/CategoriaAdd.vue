<template>
  <!-- Modal Bootstrap -->
  <div class="modal fade" :class="{ show: internalDialog }" :style="{ display: internalDialog ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-tags"></i>
            {{ values ? 'Alterar Categoria' : 'Adicionar Categoria' }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="nome" class="form-label">Nome *</label>
              <input
                type="text"
                class="form-control"
                id="nome"
                v-model="form.nome"
                required
                placeholder="Digite o nome da categoria"
              />
            </div>
            <div class="mb-3">
              <label for="descricao" class="form-label">Descrição *</label>
              <textarea
                class="form-control"
                id="descricao"
                v-model="form.descricao"
                required
                rows="3"
                placeholder="Digite a descrição da categoria"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            <i class="fas fa-save"></i>
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Backdrop do modal -->
  <div v-if="internalDialog" class="modal-backdrop fade show"></div>
</template>

<script>
import CategoriaRepository from '@/shared/http/repositories/categoria/categoria';

export default {
  name: 'CategoriaAdd',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    values: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      form: {
        nome: '',
        descricao: ''
      }
    };
  },
  computed: {
    internalDialog: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit('update:dialog', value);
      }
    }
  },
  watch: {
    values: {
      handler() {
        if(this.values) {
          this.form = { ...this.values };
        } else {
          this.form = {
            nome: '',
            descricao: ''
          };
        }
      },
      deep: true
    },
    internalDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto';
  },
  methods: {
    async handleSubmit() {
      if (!this.form.nome.trim() || !this.form.descricao.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      try {
        if(this.values) {
          await CategoriaRepository.Update(this.values.id, this.form);
        } else {
          await CategoriaRepository.Create(this.form);
        }
        this.$emit('update:dialog', false);
      } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria. Tente novamente.');
      }
    },
    close() {
      this.$emit('update:dialog', false);
    }
  }
};
</script>

<style scoped>
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

.btn-secondary {
  background: #6c757d;
  border: none;
}
</style>