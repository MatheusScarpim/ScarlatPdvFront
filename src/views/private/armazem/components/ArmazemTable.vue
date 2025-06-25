<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Nome</th>
          <th scope="col">Localização</th>
          <th scope="col">Qtd. Produtos</th>
          <th scope="col" class="text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="warehouse in warehouses" :key="warehouse.id">
          <td>
            <div class="d-flex align-items-center">
              <i class="fas fa-warehouse text-primary me-2"></i>
              <strong>{{ warehouse.nome }}</strong>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <i class="fas fa-map-marker-alt text-muted me-2"></i>
              {{ warehouse.localizacao || 'Não informado' }}
            </div>
          </td>
          <td>
            <span class="badge bg-info">{{ warehouse.totalProdutos || 0 }}</span>
          </td>
          <td class="text-center">
            <div class="btn-group" role="group">
              <button
                class="btn btn-sm btn-outline-success"
                @click="$emit('add-product', warehouse)"
                title="Adicionar Produto"
              >
                <i class="fas fa-plus"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="$emit('view-products', warehouse)"
                title="Visualizar Produtos"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-warning"
                @click="$emit('edit', warehouse)"
                title="Editar Armazém"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="$emit('delete', warehouse)"
                title="Excluir Armazém"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="warehouses.length === 0">
          <td colspan="4" class="text-center text-muted py-4">
            <i class="fas fa-warehouse fa-2x mb-2"></i>
            <p>Nenhum armazém cadastrado</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ArmazemTable',
  props: {
    warehouses: {
      type: Array,
      required: true,
    },
  },
  emits: ['add-product', 'view-products', 'edit', 'delete']
};
</script>

<style scoped>
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

.btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-outline-primary:hover {
  background: #667eea;
  border-color: #667eea;
}

.btn-outline-success:hover {
  background: #48bb78;
  border-color: #48bb78;
}

.btn-outline-warning:hover {
  background: #ed8936;
  border-color: #ed8936;
}

.btn-outline-danger:hover {
  background: #f56565;
  border-color: #f56565;
}

.badge {
  font-size: 0.8rem;
  padding: 6px 10px;
  border-radius: 12px;
}

.text-primary {
  color: #667eea !important;
}

.text-muted {
  color: #718096 !important;
}
</style>