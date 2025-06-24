<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0">
          <i class="fas fa-warehouse"></i>
          Gerenciar Armazéns
        </h3>
        <button class="btn btn-primary" @click="addWarehouseDialog = true">
          <i class="fas fa-plus"></i>
          Novo Armazém
        </button>
      </div>
      
      <div class="card-body">
        <ArmazemTable
          :warehouses="warehouses"
          @add-product="openAddDialog"
          @view-products="openViewDialog"
        />
      </div>
    </div>

    <!-- Modal Adicionar Produto -->
    <div class="modal fade" :class="{ show: addDialog }" :style="{ display: addDialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adicionar Produto ao Armazém: {{ selectedWarehouse?.name }}</h5>
            <button type="button" class="btn-close" @click="addDialog = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addProduct">
              <div class="mb-3">
                <label for="productName" class="form-label">Nome do Produto</label>
                <input
                  type="text"
                  class="form-control"
                  id="productName"
                  v-model="newProduct.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="productQuantity" class="form-label">Quantidade</label>
                <input
                  type="number"
                  class="form-control"
                  id="productQuantity"
                  v-model="newProduct.quantity"
                  min="1"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="productCategory" class="form-label">Categoria</label>
                <input
                  type="text"
                  class="form-control"
                  id="productCategory"
                  v-model="newProduct.category"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="addDialog = false">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="addProduct">
              <i class="fas fa-plus"></i>
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Visualizar Produtos -->
    <div class="modal fade" :class="{ show: viewDialog }" :style="{ display: viewDialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Produtos do Armazém: {{ selectedWarehouse?.name }}</h5>
            <button type="button" class="btn-close" @click="viewDialog = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedWarehouse?.products.length" class="list-group">
              <div v-for="(product, index) in selectedWarehouse.products" :key="index" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">{{ product.name }}</h6>
                    <small class="text-muted">
                      Quantidade: {{ product.quantity }} | Categoria: {{ product.category || 'N/A' }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-info">
              <i class="fas fa-info-circle"></i>
              Nenhum produto cadastrado neste armazém.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="viewDialog = false">
              <i class="fas fa-times"></i>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Adicionar Armazém -->
    <div class="modal fade" :class="{ show: addWarehouseDialog }" :style="{ display: addWarehouseDialog ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Criar Novo Armazém</h5>
            <button type="button" class="btn-close" @click="addWarehouseDialog = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addWarehouse">
              <div class="mb-3">
                <label for="warehouseName" class="form-label">Nome do Armazém</label>
                <input
                  type="text"
                  class="form-control"
                  id="warehouseName"
                  v-model="newWarehouse.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="warehouseLocation" class="form-label">Localização</label>
                <input
                  type="text"
                  class="form-control"
                  id="warehouseLocation"
                  v-model="newWarehouse.location"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="addWarehouseDialog = false">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="addWarehouse">
              <i class="fas fa-plus"></i>
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop dos modais -->
    <div v-if="addDialog || viewDialog || addWarehouseDialog" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import ArmazemTable from './ArmazemTable.vue';

export default {
  name: 'ArmazemList',
  components: {
    ArmazemTable
  },
  data() {
    return {
      warehouses: [
        { id: 1, name: 'Armazém Central', location: 'São Paulo', products: [], productCount: 0 },
        { id: 2, name: 'Armazém Norte', location: 'Manaus', products: [], productCount: 0 },
        { id: 3, name: 'Armazém Sul', location: 'Porto Alegre', products: [], productCount: 0 },
      ],
      addDialog: false,
      viewDialog: false,
      addWarehouseDialog: false,
      selectedWarehouse: null,
      newProduct: {
        name: '',
        quantity: 1,
        category: ''
      },
      newWarehouse: {
        name: '',
        location: ''
      }
    };
  },
  methods: {
    openAddDialog(warehouse) {
      this.selectedWarehouse = warehouse;
      this.addDialog = true;
      document.body.style.overflow = 'hidden';
    },
    openViewDialog(warehouse) {
      this.selectedWarehouse = warehouse;
      this.viewDialog = true;
      document.body.style.overflow = 'hidden';
    },
    addProduct() {
      if (this.selectedWarehouse && this.newProduct.name && this.newProduct.quantity) {
        this.selectedWarehouse.products.push({ ...this.newProduct });
        this.selectedWarehouse.productCount = this.selectedWarehouse.products.length;
        
        // Reset form
        this.newProduct = { name: '', quantity: 1, category: '' };
        this.addDialog = false;
        document.body.style.overflow = 'auto';
      } else {
        alert('Preencha os campos obrigatórios!');
      }
    },
    addWarehouse() {
      if (this.newWarehouse.name && this.newWarehouse.location) {
        const newId = this.warehouses.length + 1;
        this.warehouses.push({
          id: newId,
          name: this.newWarehouse.name,
          location: this.newWarehouse.location,
          products: [],
          productCount: 0,
        });
        
        // Reset form
        this.newWarehouse = { name: '', location: '' };
        this.addWarehouseDialog = false;
        document.body.style.overflow = 'auto';
      } else {
        alert('Preencha os campos obrigatórios!');
      }
    }
  },
  watch: {
    addDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    },
    viewDialog(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto';
    },
    addWarehouseDialog(val) {
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

.list-group-item {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
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
</style>