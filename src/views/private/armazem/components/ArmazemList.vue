<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0">
          <i class="fas fa-warehouse"></i>
          Gerenciar Armazéns
        </h3>
        <button class="btn btn-primary" @click="openAddWarehouseModal">
          <i class="fas fa-plus"></i>
          Novo Armazém
        </button>
      </div>
      
      <div class="card-body">
        <ArmazemTable
          :warehouses="armazens"
          @add-product="openAddProductModal"
          @view-products="openViewProductsModal"
          @edit="editArmazem"
          @delete="deleteArmazem"
        />
      </div>
    </div>

    <!-- Modal Adicionar/Editar Armazém -->
    <ArmazemAdd 
      :values="editValues" 
      v-model:dialog="addWarehouseDialog" 
      @update:dialog="onDialogUpdate" 
    />

    <!-- Modal Adicionar Produto ao Armazém -->
    <div class="modal fade" :class="{ show: addProductDialog }" :style="{ display: addProductDialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus-circle"></i>
              Adicionar Produto ao Armazém: {{ selectedWarehouse?.nome }}
            </h5>
            <button type="button" class="btn-close" @click="addProductDialog = false"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-12">
                <label class="form-label">Buscar Produto:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchProduct"
                  placeholder="Digite o nome do produto para buscar..."
                  @input="searchProdutos"
                />
              </div>
            </div>
            
            <div v-if="loadingProducts" class="text-center py-4">
              <i class="fas fa-spinner fa-spin"></i>
              <p>Carregando produtos...</p>
            </div>
            
            <div v-else-if="availableProducts.length === 0" class="alert alert-info">
              <i class="fas fa-info-circle"></i>
              {{ searchProduct ? 'Nenhum produto encontrado com esse nome.' : 'Digite algo para buscar produtos.' }}
            </div>
            
            <div v-else class="products-list">
              <div class="row">
                <div v-for="produto in availableProducts" :key="produto.id" class="col-12 col-md-6 mb-3">
                  <div class="card product-card" :class="{ 'selected': selectedProduct?.id === produto.id }" @click="selectProduct(produto)">
                    <div class="card-body">
                      <h6 class="card-title">{{ produto.nome }}</h6>
                      <div class="product-info">
                        <small class="text-muted">
                          <i class="fas fa-tags"></i> {{ produto.categoria?.nome || 'Sem categoria' }}
                        </small>
                        <br>
                        <small class="text-muted">
                          <i class="fas fa-dollar-sign"></i> {{ formatCurrency(produto.preco) }}
                        </small>
                        <br>
                        <small class="text-muted">
                          <i class="fas fa-barcode"></i> {{ produto.codBarra || 'Sem código' }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="selectedProduct" class="mt-4">
              <div class="card selected-product-card">
                <div class="card-header">
                  <h6 class="mb-0">Produto Selecionado: {{ selectedProduct.nome }}</h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <label for="quantidade" class="form-label">Quantidade no Armazém:</label>
                      <input
                        type="number"
                        class="form-control"
                        id="quantidade"
                        v-model="productQuantity"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Unidade de Medida:</label>
                      <p class="form-control-plaintext">{{ selectedProduct.medida?.tipo || 'N/A' }} ({{ selectedProduct.medida?.abreviacao || '' }})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAddProductModal">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="addProductToWarehouse"
              :disabled="!selectedProduct || !productQuantity || productQuantity <= 0"
            >
              <i class="fas fa-plus"></i>
              Adicionar Produto
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Visualizar Produtos do Armazém -->
    <div class="modal fade" :class="{ show: viewProductsDialog }" :style="{ display: viewProductsDialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-eye"></i>
              Produtos do Armazém: {{ selectedWarehouse?.nome }}
            </h5>
            <button type="button" class="btn-close" @click="viewProductsDialog = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="loadingWarehouseProducts" class="text-center py-4">
              <i class="fas fa-spinner fa-spin"></i>
              <p>Carregando produtos do armazém...</p>
            </div>
            
            <div v-else-if="warehouseProducts.length === 0" class="alert alert-info">
              <i class="fas fa-info-circle"></i>
              Nenhum produto cadastrado neste armazém.
            </div>
            
            <div v-else>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Preço Unitário</th>
                      <th>Quantidade</th>
                      <th>Valor Total</th>
                      <th class="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in warehouseProducts" :key="item.id">
                      <td>
                        <div>
                          <strong>{{ item.produto.nome }}</strong>
                          <br>
                          <small class="text-muted">
                            <i class="fas fa-barcode"></i> {{ item.produto.codBarra || 'Sem código' }}
                          </small>
                        </div>
                      </td>
                      <td>{{ item.produto.categoria?.nome || 'N/A' }}</td>
                      <td>{{ formatCurrency(item.produto.preco) }}</td>
                      <td>
                        <span class="badge bg-primary">
                          {{ item.quantidade }} {{ item.produto.medida?.abreviacao || '' }}
                        </span>
                      </td>
                      <td>
                        <strong class="text-success">
                          {{ formatCurrency(item.produto.preco * item.quantidade) }}
                        </strong>
                      </td>
                      <td class="text-center">
                        <button 
                          class="btn btn-sm btn-outline-primary me-1" 
                          @click="editWarehouseProduct(item)"
                          title="Editar Quantidade"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-danger" 
                          @click="removeProductFromWarehouse(item)"
                          title="Remover do Armazém"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="table-info">
                      <td colspan="4"><strong>Total do Armazém:</strong></td>
                      <td><strong>{{ formatCurrency(totalWarehouseValue) }}</strong></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="viewProductsDialog = false">
              <i class="fas fa-times"></i>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Quantidade do Produto -->
    <div class="modal fade" :class="{ show: editQuantityDialog }" :style="{ display: editQuantityDialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-edit"></i>
              Editar Quantidade - {{ editingProduct?.produto?.nome }}
            </h5>
            <button type="button" class="btn-close" @click="editQuantityDialog = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="editQuantidade" class="form-label">Nova Quantidade:</label>
              <input
                type="number"
                class="form-control"
                id="editQuantidade"
                v-model="editQuantity"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <small class="form-text text-muted">
                Unidade: {{ editingProduct?.produto?.medida?.tipo }} ({{ editingProduct?.produto?.medida?.abreviacao }})
              </small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="editQuantityDialog = false">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="updateProductQuantity"
              :disabled="!editQuantity || editQuantity < 0"
            >
              <i class="fas fa-save"></i>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop dos modais -->
    <div v-if="addWarehouseDialog || addProductDialog || viewProductsDialog || editQuantityDialog" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import ArmazemTable from './ArmazemTable.vue';
import ArmazemAdd from './ArmazemAdd.vue';
import ArmazemRepository from '@/shared/http/repositories/armazem/armazem';
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import { useToast } from 'vue-toastification';

export default {
  name: 'ArmazemList',
  components: {
    ArmazemTable,
    ArmazemAdd
  },
  data() {
    return {
      armazens: [],
      addWarehouseDialog: false,
      addProductDialog: false,
      viewProductsDialog: false,
      editQuantityDialog: false,
      selectedWarehouse: null,
      editValues: null,
      
      // Produtos disponíveis para adicionar
      availableProducts: [],
      selectedProduct: null,
      productQuantity: 0,
      searchProduct: '',
      loadingProducts: false,
      
      // Produtos do armazém
      warehouseProducts: [],
      loadingWarehouseProducts: false,
      
      // Edição de quantidade
      editingProduct: null,
      editQuantity: 0,
      
      toast: null
    };
  },
  computed: {
    totalWarehouseValue() {
      return this.warehouseProducts.reduce((total, item) => {
        return total + (item.produto.preco * item.quantidade);
      }, 0);
    }
  },
  mounted() {
    this.toast = useToast();
    this.fetchArmazens();
  },
  methods: {
    async fetchArmazens() {
      try {
        const response = await ArmazemRepository.GetAll();
        this.armazens = response.data.content || [];
      } catch (error) {
        console.error('Erro ao buscar armazéns:', error);
        this.toast.error('Erro ao carregar armazéns');
      }
    },

    async searchProdutos() {
      if (!this.searchProduct.trim()) {
        this.availableProducts = [];
        return;
      }

      this.loadingProducts = true;
      try {
        const response = await ProdutoRepository.GetAll({
          params: { search: this.searchProduct }
        });
        this.availableProducts = response.data.content || [];
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        this.toast.error('Erro ao buscar produtos');
      } finally {
        this.loadingProducts = false;
      }
    },

    selectProduct(produto) {
      this.selectedProduct = produto;
      this.productQuantity = 0;
    },

    async addProductToWarehouse() {
      if (!this.selectedProduct || !this.productQuantity || this.productQuantity <= 0) {
        this.toast.warning('Selecione um produto e informe a quantidade');
        return;
      }

      try {
        const data = {
          armazemId: this.selectedWarehouse.id,
          produtoId: this.selectedProduct.id,
          quantidade: parseFloat(this.productQuantity)
        };

        // Aqui você faria a chamada para a API para adicionar o produto ao armazém
        // await ArmazemRepository.AddProduct(data);
        
        // Por enquanto, vamos simular localmente
        this.toast.success(`${this.selectedProduct.nome} adicionado ao armazém com sucesso!`);
        this.closeAddProductModal();
        
        // Se o modal de visualização estiver aberto, recarregar os produtos
        if (this.viewProductsDialog) {
          this.loadWarehouseProducts();
        }
      } catch (error) {
        console.error('Erro ao adicionar produto ao armazém:', error);
        this.toast.error('Erro ao adicionar produto ao armazém');
      }
    },

    async loadWarehouseProducts() {
      if (!this.selectedWarehouse) return;

      this.loadingWarehouseProducts = true;
      try {
        // Aqui você faria a chamada para a API para buscar os produtos do armazém
        // const response = await ArmazemRepository.GetProducts(this.selectedWarehouse.id);
        // this.warehouseProducts = response.data;
        
        // Por enquanto, vamos simular alguns dados
        this.warehouseProducts = [
          {
            id: 1,
            quantidade: 50,
            produto: {
              id: 1,
              nome: 'Arroz Branco 5kg',
              preco: 25.90,
              codBarra: '7891234567890',
              categoria: { nome: 'Grãos' },
              medida: { tipo: 'Quilograma', abreviacao: 'kg' }
            }
          },
          {
            id: 2,
            quantidade: 30,
            produto: {
              id: 2,
              nome: 'Feijão Preto 1kg',
              preco: 8.50,
              codBarra: '7891234567891',
              categoria: { nome: 'Grãos' },
              medida: { tipo: 'Quilograma', abreviacao: 'kg' }
            }
          }
        ];
      } catch (error) {
        console.error('Erro ao carregar produtos do armazém:', error);
        this.toast.error('Erro ao carregar produtos do armazém');
      } finally {
        this.loadingWarehouseProducts = false;
      }
    },

    editWarehouseProduct(item) {
      this.editingProduct = item;
      this.editQuantity = item.quantidade;
      this.editQuantityDialog = true;
    },

    async updateProductQuantity() {
      if (!this.editingProduct || this.editQuantity < 0) return;

      try {
        // Aqui você faria a chamada para a API para atualizar a quantidade
        // await ArmazemRepository.UpdateProductQuantity(this.editingProduct.id, this.editQuantity);
        
        // Por enquanto, vamos atualizar localmente
        this.editingProduct.quantidade = parseFloat(this.editQuantity);
        this.toast.success('Quantidade atualizada com sucesso!');
        this.editQuantityDialog = false;
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        this.toast.error('Erro ao atualizar quantidade');
      }
    },

    async removeProductFromWarehouse(item) {
      if (!confirm(`Deseja realmente remover ${item.produto.nome} do armazém?`)) return;

      try {
        // Aqui você faria a chamada para a API para remover o produto do armazém
        // await ArmazemRepository.RemoveProduct(item.id);
        
        // Por enquanto, vamos remover localmente
        const index = this.warehouseProducts.findIndex(p => p.id === item.id);
        if (index > -1) {
          this.warehouseProducts.splice(index, 1);
        }
        this.toast.success(`${item.produto.nome} removido do armazém`);
      } catch (error) {
        console.error('Erro ao remover produto do armazém:', error);
        this.toast.error('Erro ao remover produto do armazém');
      }
    },

    openAddWarehouseModal() {
      this.editValues = null;
      this.addWarehouseDialog = true;
    },

    openAddProductModal(warehouse) {
      this.selectedWarehouse = warehouse;
      this.selectedProduct = null;
      this.productQuantity = 0;
      this.searchProduct = '';
      this.availableProducts = [];
      this.addProductDialog = true;
      document.body.style.overflow = 'hidden';
    },

    openViewProductsModal(warehouse) {
      this.selectedWarehouse = warehouse;
      this.viewProductsDialog = true;
      this.loadWarehouseProducts();
      document.body.style.overflow = 'hidden';
    },

    closeAddProductModal() {
      this.addProductDialog = false;
      this.selectedProduct = null;
      this.productQuantity = 0;
      this.searchProduct = '';
      this.availableProducts = [];
      document.body.style.overflow = 'auto';
    },

    editArmazem(item) {
      this.editValues = { ...item };
      this.addWarehouseDialog = true;
    },

    async deleteArmazem(item) {
      if (!confirm('Deseja realmente excluir este armazém?')) return;

      try {
        await ArmazemRepository.Delete(item.id);
        this.fetchArmazens();
        this.toast.success('Armazém excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir armazém:', error);
        this.toast.error('Erro ao excluir armazém');
      }
    },

    onDialogUpdate(value) {
      this.addWarehouseDialog = value;
      if (!value) {
        this.fetchArmazens();
      }
    },

    formatCurrency(value) {
      if (!value) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
  },
  watch: {
    addProductDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    },
    viewProductsDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    },
    editQuantityDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto';
  }
};
</script>

<style scoped>
.container-fluid {
  padding: 20px;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0 !important;
  border-bottom: none;
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

.products-list {
  max-height: 400px;
  overflow-y: auto;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
}

.product-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card.selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.selected-product-card {
  border: 2px solid #667eea;
  background: #f0f4ff;
}

.table {
  margin-bottom: 0;
}

.table th {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;
  padding: 16px;
}

.table td {
  padding: 16px;
  vertical-align: middle;
  border-bottom: 1px solid #e2e8f0;
}

.table tbody tr:hover {
  background: #f7fafc;
}

.alert {
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-info {
  background: #e6fffa;
  color: #234e52;
}

.badge {
  font-size: 0.8rem;
  padding: 6px 10px;
  border-radius: 12px;
}

.text-success {
  color: #48bb78 !important;
}
</style>