<template>
  <!-- Modal Bootstrap -->
  <div class="modal fade" :class="{ show: internalDialog }" :style="{ display: internalDialog ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-box"></i>
            {{ values ? 'Alterar Produto' : 'Adicionar Produto' }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nome"
                    v-model="form.nome"
                    required
                    placeholder="Digite o nome do produto"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="codBarra" class="form-label">Código de Barras</label>
                  <input
                    type="text"
                    class="form-control"
                    id="codBarra"
                    v-model="form.codBarra"
                    placeholder="Digite o código de barras"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="preco" class="form-label">Preço *</label>
                  <div class="input-group">
                    <span class="input-group-text">R$</span>
                    <input
                      type="number"
                      class="form-control"
                      id="preco"
                      v-model="form.preco"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="qtdMedida" class="form-label">Quantidade *</label>
                  <input
                    type="number"
                    class="form-control"
                    id="qtdMedida"
                    v-model="form.qtdMedida"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="categoriaId" class="form-label">Categoria *</label>
                  <select
                    class="form-select"
                    id="categoriaId"
                    v-model="form.categoriaId"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option v-for="categoria in categorias" :key="categoria.value" :value="categoria.value">
                      {{ categoria.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="medidaId" class="form-label">Medida *</label>
                  <select
                    class="form-select"
                    id="medidaId"
                    v-model="form.medidaId"
                    required
                  >
                    <option value="">Selecione uma medida</option>
                    <option v-for="medida in medidas" :key="medida.value" :value="medida.value">
                      {{ medida.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="fornecedorId" class="form-label">Fornecedor *</label>
                  <select
                    class="form-select"
                    id="fornecedorId"
                    v-model="form.fornecedorId"
                    required
                  >
                    <option value="">Selecione um fornecedor</option>
                    <option v-for="fornecedor in fornecedores" :key="fornecedor.value" :value="fornecedor.value">
                      {{ fornecedor.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="dataValidade" class="form-label">Data de Validade</label>
                  <input
                    type="date"
                    class="form-control"
                    id="dataValidade"
                    v-model="form.dataValidade"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="ncm" class="form-label">NCM</label>
                  <input
                    type="text"
                    class="form-control"
                    id="ncm"
                    v-model="form.ncm"
                    placeholder="Digite o NCM"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="codCest" class="form-label">Código CEST</label>
                  <input
                    type="text"
                    class="form-control"
                    id="codCest"
                    v-model="form.codCest"
                    placeholder="Digite o código CEST"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="!isFormValid">
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
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import MedidaRepository from '@/shared/http/repositories/medida/medida';
import CategoriaRepository from '@/shared/http/repositories/categoria/categoria';
import FornecedorRepository from '@/shared/http/repositories/fornecedor/fornecedor';

export default {
  name: 'ProdutoAdd',
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
        categoriaId: '',
        medidaId: '',
        fornecedorId: '',
        dataValidade: null,
        qtdMedida: 0.0,  
        preco: 0.0,
        codBarra: '',
        ncm: '',
        codCest: ''
      },
      medidas: [],
      categorias: [],
      fornecedores: []
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
    },
    isFormValid() {
      return this.form.nome.trim() && 
             this.form.categoriaId && 
             this.form.medidaId && 
             this.form.fornecedorId &&
             this.form.preco > 0 &&
             this.form.qtdMedida > 0;
    }
  },
  watch: {
    values: {
      handler() {
        if (this.values) {
          this.form = {
            ...this.values,
            qtdMedida: parseFloat(this.values.qtdMedida) || 0.0,
            preco: parseFloat(this.values.preco) || 0.0
          };
        } else {
          this.form = {
            nome: '',
            categoriaId: '',
            medidaId: '',
            fornecedorId: '',
            dataValidade: null,
            qtdMedida: 0.0,
            preco: 0.0,
            codBarra: '',
            ncm: '',
            codCest: ''
          };
        }
      },
      deep: true
    },
    internalDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    }
  },
  mounted() {
    this.onGetAll();
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto';
  },
  methods: {
    async onGetAll() {
      await Promise.all([
        this.onGetCategorias(),
        this.onGetFornecedores(),
        this.onGetMedidas()
      ]);
    },
    async onGetMedidas() {
      try {
        const req = await MedidaRepository.GetAll();
        this.medidas = req.data.content.map(item => ({
          value: item.id.toString(),
          title: item.tipo
        }));
      } catch (error) {
        console.error('Erro ao carregar medidas:', error);
      }
    },
    async onGetCategorias() {
      try {
        const req = await CategoriaRepository.GetAll();
        this.categorias = req.data.content.map(item => ({
          value: item.id.toString(),
          title: item.nome
        }));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    },
    async onGetFornecedores() {
      try {
        const req = await FornecedorRepository.GetAll();
        this.fornecedores = req.data.content.map(item => ({
          value: item.id,
          title: item.nome
        }));
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      }
    },
    async handleSubmit() {
      if (!this.isFormValid) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      try {
        if (this.values) {
          await ProdutoRepository.Update(this.values.id, this.form);
        } else {
          await ProdutoRepository.Create(this.form);
        }
        this.$emit('update:dialog', false);
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Tente novamente.');
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

.form-control, .form-select {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.input-group-text {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-right: none;
  color: #2d3748;
  font-weight: 600;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover:not(:disabled) {
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>