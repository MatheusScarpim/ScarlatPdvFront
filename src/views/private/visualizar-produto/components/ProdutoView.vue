<template>
  <div class="produto-view-container">
    <div class="row">
      <div class="col-12">
        <h2>Buscar Produtos</h2>
      </div>
    </div>
    
    <div v-if="loading" class="row">
      <div class="col-12 text-center">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando produtos...</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="errored" class="row">
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle"></i>
          Ocorreu um erro ao carregar os produtos.
        </div>
      </div>
    </div>
    
    <div v-else class="row">
      <div class="col-12" v-if="produtos.length === 0 && codBarra">
        <div class="alert alert-warning" role="alert">
          <i class="fas fa-search"></i>
          Nenhum produto encontrado para o código: <strong>{{ codBarra }}</strong>
        </div>
      </div>
      
      <div class="col-12" v-else-if="produtos.length === 0">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-barcode"></i>
          Escaneie ou digite um código de barras para buscar produtos.
        </div>
      </div>
      
      <div v-else v-for="produto in produtos" :key="produto.id" class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card produto-card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-box"></i>
              {{ produto.nome }}
            </h5>
          </div>
          <div class="card-body">
            <div class="produto-info">
              <div class="info-item">
                <i class="fas fa-barcode"></i>
                <span class="info-label">Código:</span>
                <span class="info-value">{{ produto.codBarra }}</span>
              </div>
              
              <div class="info-item">
                <i class="fas fa-dollar-sign"></i>
                <span class="info-label">Preço:</span>
                <span class="info-value price-value">{{ formatCurrency(produto.preco) }}</span>
              </div>
              
              <div class="info-item" v-if="produto.categoria">
                <i class="fas fa-tags"></i>
                <span class="info-label">Categoria:</span>
                <span class="info-value">{{ produto.categoria.nome }}</span>
              </div>
              
              <div class="info-item" v-if="produto.qtdMedida">
                <i class="fas fa-balance-scale"></i>
                <span class="info-label">Estoque:</span>
                <span class="info-value">{{ produto.qtdMedida }} {{ produto.medida?.abreviacao || '' }}</span>
              </div>
              
              <div class="info-item" v-if="produto.fornecedor">
                <i class="fas fa-truck"></i>
                <span class="info-label">Fornecedor:</span>
                <span class="info-value">{{ produto.fornecedor.nome }}</span>
              </div>
              
              <div class="info-item" v-if="produto.dataValidade">
                <i class="fas fa-calendar-alt"></i>
                <span class="info-label">Validade:</span>
                <span class="info-value">{{ formatDate(produto.dataValidade) }}</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary w-100" @click="adicionarAoCarrinho(produto)">
              <i class="fas fa-cart-plus"></i>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import { useToast } from 'vue-toastification';

export default {
  name: 'ProdutoView',
  props: {
    codBarra: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      produtos: [],
      loading: false,
      errored: false,
      toast: null
    };
  },
  watch: {
    codBarra: {
      handler(newVal) {
        if (newVal) {
          this.getProdutoByCodBarra();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.toast = useToast();
  },
  methods: {
    async getProdutoByCodBarra() {
      if (!this.codBarra) return;
      
      this.loading = true;
      this.errored = false;
      
      try {
        const filter = { params: { codBarra: this.codBarra } };
        const response = await ProdutoRepository.GetAll(filter);
        this.produtos = response.data.content || [];
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        this.errored = true;
        this.toast.error('Erro ao buscar produto');
      } finally {
        this.loading = false;
      }
    },
    
    adicionarAoCarrinho(produto) {
      // Salvar no localStorage para o carrinho
      let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
      
      const itemExistente = carrinho.find(item => item.codBarra === produto.codBarra);
      
      if (itemExistente) {
        itemExistente.quantidade += 1;
        itemExistente.total = itemExistente.quantidade * itemExistente.preco;
      } else {
        carrinho.push({
          id: produto.id,
          nome: produto.nome,
          codBarra: produto.codBarra,
          preco: produto.preco,
          quantidade: 1,
          total: produto.preco
        });
      }
      
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      this.toast.success(`${produto.nome} adicionado ao carrinho!`);
    },
    
    formatCurrency(value) {
      if (!value) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    }
  }
};
</script>

<style scoped>
.produto-view-container {
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loading-spinner {
  padding: 60px;
  color: #667eea;
}

.loading-spinner i {
  font-size: 2rem;
  margin-bottom: 15px;
}

.produto-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.produto-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0 !important;
  border-bottom: none;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.produto-info {
  padding: 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 10px;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item i {
  color: #667eea;
  width: 16px;
  text-align: center;
}

.info-label {
  font-weight: 600;
  color: #2d3748;
  min-width: 80px;
}

.info-value {
  color: #4a5568;
  flex: 1;
}

.price-value {
  color: #48bb78;
  font-weight: 600;
  font-size: 1.1rem;
}

.card-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
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

.alert-warning {
  background: #fef5e7;
  color: #744210;
}

.alert-danger {
  background: #fed7d7;
  color: #742a2a;
}

@media (max-width: 768px) {
  .produto-view-container {
    padding: 15px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    min-width: auto;
  }
}
</style>