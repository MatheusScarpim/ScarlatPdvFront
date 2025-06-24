<template>
  <div class="data-grid">
    <!-- Header com título e ações -->
    <div class="grid-header">
      <div class="grid-title">
        <h2>{{ title }}</h2>
      </div>
      <div class="grid-actions">
        <button 
          v-if="showAddButton" 
          @click="$emit('add')" 
          class="btn btn-primary"
        >
          <i class="fas fa-plus"></i>
          {{ addButtonText }}
        </button>
        <button 
          v-if="showRefreshButton" 
          @click="$emit('refresh')" 
          class="btn btn-secondary"
        >
          <i class="fas fa-sync-alt"></i>
          {{ refreshButtonText }}
        </button>
        <slot name="custom-actions"></slot>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="showFilters" class="grid-filters">
      <div class="filter-row">
        <div class="filter-item">
          <input 
            v-model="searchTerm" 
            @input="onSearch"
            type="text" 
            :placeholder="searchPlaceholder"
            class="form-control"
          >
        </div>
        <slot name="custom-filters"></slot>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid-loading">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Carregando...</span>
      </div>
    </div>

    <!-- Tabela -->
    <div v-else class="grid-table-container">
      <table class="table">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              :class="{ 'sortable': column.sortable !== false }"
              @click="column.sortable !== false ? sort(column.key) : null"
            >
              {{ column.title }}
              <i 
                v-if="column.sortable !== false && sortBy === column.key" 
                :class="['fas', sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down']"
              ></i>
              <i 
                v-else-if="column.sortable !== false" 
                class="fas fa-sort opacity-50"
              ></i>
            </th>
            <th v-if="showActions" class="actions-column">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center">
              {{ emptyMessage }}
            </td>
          </tr>
          <tr v-for="item in items" :key="getItemKey(item)">
            <td v-for="column in columns" :key="column.key">
              <slot 
                :name="`item.${column.key}`" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
              >
                {{ formatValue(getNestedValue(item, column.key), column) }}
              </slot>
            </td>
            <td v-if="showActions" class="actions-cell">
              <div class="action-buttons">
                <button 
                  v-if="showEditAction"
                  @click="$emit('edit', item)" 
                  class="btn-action btn-edit"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  v-if="showDeleteAction"
                  @click="$emit('delete', item)" 
                  class="btn-action btn-delete"
                  title="Excluir"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <slot name="custom-actions" :item="item"></slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div v-if="showPagination && totalItems > 0" class="grid-pagination">
      <div class="pagination-info">
        Mostrando {{ startItem }} a {{ endItem }} de {{ totalItems }} registros
      </div>
      <div class="pagination-controls">
        <select v-model="itemsPerPage" @change="onItemsPerPageChange" class="form-control">
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }} por página
          </option>
        </select>
        
        <div class="pagination-buttons">
          <button 
            @click="goToPage(1)" 
            :disabled="currentPage === 1"
            class="btn btn-pagination"
          >
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="btn btn-pagination"
          >
            <i class="fas fa-angle-left"></i>
          </button>
          
          <span class="pagination-current">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="btn btn-pagination"
          >
            <i class="fas fa-angle-right"></i>
          </button>
          <button 
            @click="goToPage(totalPages)" 
            :disabled="currentPage === totalPages"
            class="btn btn-pagination"
          >
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataGrid',
  props: {
    // Dados
    items: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    
    // Configurações gerais
    title: {
      type: String,
      default: 'Lista'
    },
    emptyMessage: {
      type: String,
      default: 'Nenhum registro encontrado'
    },
    keyField: {
      type: String,
      default: 'id'
    },
    
    // Botões do header
    showAddButton: {
      type: Boolean,
      default: true
    },
    addButtonText: {
      type: String,
      default: 'Adicionar'
    },
    showRefreshButton: {
      type: Boolean,
      default: true
    },
    refreshButtonText: {
      type: String,
      default: 'Atualizar'
    },
    
    // Filtros
    showFilters: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: 'Buscar...'
    },
    
    // Ações
    showActions: {
      type: Boolean,
      default: true
    },
    showEditAction: {
      type: Boolean,
      default: true
    },
    showDeleteAction: {
      type: Boolean,
      default: true
    },
    
    // Paginação
    showPagination: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    totalItems: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: () => [5, 10, 15, 25, 50]
    },
    
    // Ordenação
    sortBy: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: String,
      default: 'asc'
    }
  },
  
  data() {
    return {
      searchTerm: ''
    };
  },
  
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.totalItems ? this.totalItems : end;
    }
  },
  
  methods: {
    getItemKey(item) {
      return item[this.keyField] || item.id || Math.random();
    },
    
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    
    formatValue(value, column) {
      if (value === null || value === undefined) return '';
      
      // Formatação personalizada baseada no tipo da coluna
      if (column.type === 'currency') {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      }
      
      if (column.type === 'date') {
        return new Date(value).toLocaleDateString('pt-BR');
      }
      
      if (column.type === 'datetime') {
        return new Date(value).toLocaleString('pt-BR');
      }
      
      if (column.type === 'number') {
        return new Intl.NumberFormat('pt-BR').format(value);
      }
      
      return value;
    },
    
    sort(key) {
      const newOrder = this.sortBy === key && this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.$emit('sort', { key, order: newOrder });
    },
    
    onSearch() {
      this.$emit('search', this.searchTerm);
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    },
    
    onItemsPerPageChange() {
      this.$emit('items-per-page-change', this.itemsPerPage);
    }
  }
};
</script>

<style scoped>
.data-grid {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.grid-title h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
}

.grid-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.grid-filters {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-item {
  flex: 1;
  max-width: 300px;
}

.grid-loading {
  padding: 60px 24px;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #667eea;
}

.loading-spinner i {
  font-size: 2rem;
}

.grid-table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.table th {
  background: #f7fafc;
  padding: 16px;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.table th.sortable:hover {
  background: #edf2f7;
}

.table th i {
  margin-left: 8px;
  font-size: 0.8rem;
}

.table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.table tr:hover {
  background: #f7fafc;
}

.actions-column {
  width: 120px;
  text-align: center;
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-action {
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-edit {
  background: #48bb78;
  color: white;
}

.btn-edit:hover {
  background: #38a169;
  transform: translateY(-1px);
}

.btn-delete {
  background: #f56565;
  color: white;
}

.btn-delete:hover {
  background: #e53e3e;
  transform: translateY(-1px);
}

.grid-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.pagination-info {
  color: #718096;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.pagination-controls select {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.pagination-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}

.btn-pagination {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-pagination:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-current {
  margin: 0 12px;
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9rem;
}

.opacity-50 {
  opacity: 0.5;
}

/* Responsividade */
@media (max-width: 768px) {
  .grid-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .grid-actions {
    justify-content: center;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .filter-item {
    max-width: none;
  }
  
  .grid-pagination {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .table {
    font-size: 0.9rem;
  }
  
  .table th,
  .table td {
    padding: 12px 8px;
  }
}
</style>