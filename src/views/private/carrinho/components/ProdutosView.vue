<template>
  <div class="produtos-view-container">
    <div class="row">
      <div class="col-12">
        <h2>Carrinho de Compras</h2>
      </div>
    </div>
    
    <div v-if="loading" class="row">
      <div class="col-12 text-center">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando produto...</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="errored" class="row">
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle"></i>
          Ocorreu um erro ao carregar o produto.
        </div>
      </div>
    </div>
    
    <div v-else-if="produtoEncontrado" class="row">
      <div class="col-12 col-md-6">
        <div class="card produto-card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-box"></i>
              {{ produtoEncontrado.nome }}
            </h5>
          </div>
          <div class="card-body">
            <div class="produto-info">
              <div class="info-item">
                <strong>Código de Barras:</strong>
                <span>{{ produtoEncontrado.codBarra }}</span>
              </div>
              <div class="info-item">
                <strong>Preço:</strong>
                <span class="price-value">{{ formatCurrency(produtoEncontrado.preco) }}</span>
              </div>
              <div class="info-item">
                <strong>Categoria:</strong>
                <span>{{ produtoEncontrado.categoria?.nome || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <strong>Estoque:</strong>
                <span>{{ produtoEncontrado.qtdMedida }} {{ produtoEncontrado.medida?.abreviacao || '' }}</span>
              </div>
            </div>
            
            <div class="quantidade-section">
              <label for="quantidade" class="form-label">Quantidade:</label>
              <div class="input-group">
                <button class="btn btn-outline-secondary" type="button" @click="diminuirQuantidade">
                  <i class="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  class="form-control text-center" 
                  id="quantidade"
                  v-model.number="quantidade" 
                  min="1" 
                  :max="produtoEncontrado.qtdMedida"
                >
                <button class="btn btn-outline-secondary" type="button" @click="aumentarQuantidade">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div class="total-section">
              <h6>Total: <span class="price-value">{{ formatCurrency(totalItem) }}</span></h6>
            </div>
            
            <button 
              class="btn btn-primary btn-lg w-100" 
              @click="adicionarAoCarrinho"
              :disabled="quantidade <= 0 || quantidade > produtoEncontrado.qtdMedida"
            >
              <i class="fas fa-cart-plus"></i>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-md-6">
        <div class="card carrinho-card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="fas fa-shopping-cart"></i>
              Itens no Carrinho ({{ itensCarrinho.length }})
            </h5>
            <button 
              v-if="itensCarrinho.length > 0" 
              class="btn btn-outline-danger btn-sm" 
              @click="limparCarrinho"
            >
              <i class="fas fa-trash"></i>
              Limpar
            </button>
          </div>
          <div class="card-body">
            <div v-if="itensCarrinho.length === 0" class="text-center text-muted">
              <i class="fas fa-shopping-cart fa-3x mb-3"></i>
              <p>Carrinho vazio</p>
            </div>
            
            <div v-else>
              <div v-for="(item, index) in itensCarrinho" :key="index" class="carrinho-item">
                <div class="item-info">
                  <h6 class="item-nome">{{ item.nome }}</h6>
                  <div class="item-details">
                    <span class="item-quantidade">Qtd: {{ item.quantidade }}</span>
                    <span class="item-preco">{{ formatCurrency(item.preco) }}</span>
                  </div>
                </div>
                <div class="item-actions">
                  <span class="item-total">{{ formatCurrency(item.total) }}</span>
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="removerDoCarrinho(index)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <hr>
              
              <div class="carrinho-total">
                <h5>Total Geral: <span class="price-value">{{ formatCurrency(totalCarrinho) }}</span></h5>
              </div>
              
              <div class="carrinho-actions">
                <button class="btn btn-success btn-lg w-100" @click="finalizarCompra">
                  <i class="fas fa-credit-card"></i>
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="codBarra && !loading" class="row">
      <div class="col-12">
        <div class="alert alert-warning" role="alert">
          <i class="fas fa-search"></i>
          Produto não encontrado para o código: {{ codBarra }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import { useToast } from 'vue-toastification';

export default {
  name: 'ProdutosView',
  props: {
    codBarra: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      produtoEncontrado: null,
      loading: false,
      errored: false,
      quantidade: 1,
      itensCarrinho: [],
      toast: null
    };
  },
  computed: {
    totalItem() {
      if (!this.produtoEncontrado) return 0;
      return this.produtoEncontrado.preco * this.quantidade;
    },
    totalCarrinho() {
      return this.itensCarrinho.reduce((total, item) => total + item.total, 0);
    }
  },
  watch: {
    codBarra: {
      handler(newVal) {
        if (newVal) {
          this.buscarProduto();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.toast = useToast();
    this.carregarCarrinho();
  },
  methods: {
    async buscarProduto() {
      if (!this.codBarra) return;
      
      this.loading = true;
      this.errored = false;
      this.produtoEncontrado = null;
      
      try {
        const response = await ProdutoRepository.GetAll({
          params: { codBarra: this.codBarra }
        });
        
        if (response.data.content && response.data.content.length > 0) {
          this.produtoEncontrado = response.data.content[0];
          this.quantidade = 1;
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        this.errored = true;
        this.toast.error('Erro ao buscar produto');
      } finally {
        this.loading = false;
      }
    },
    
    aumentarQuantidade() {
      if (this.quantidade < this.produtoEncontrado.qtdMedida) {
        this.quantidade++;
      }
    },
    
    diminuirQuantidade() {
      if (this.quantidade > 1) {
        this.quantidade--;
      }
    },
    
    adicionarAoCarrinho() {
      if (!this.produtoEncontrado || this.quantidade <= 0) return;
      
      const itemExistente = this.itensCarrinho.find(
        item => item.codBarra === this.produtoEncontrado.codBarra
      );
      
      if (itemExistente) {
        itemExistente.quantidade += this.quantidade;
        itemExistente.total = itemExistente.quantidade * itemExistente.preco;
      } else {
        this.itensCarrinho.push({
          id: this.produtoEncontrado.id,
          nome: this.produtoEncontrado.nome,
          codBarra: this.produtoEncontrado.codBarra,
          preco: this.produtoEncontrado.preco,
          quantidade: this.quantidade,
          total: this.totalItem
        });
      }
      
      this.salvarCarrinho();
      this.toast.success(`${this.produtoEncontrado.nome} adicionado ao carrinho!`);
      this.quantidade = 1;
    },
    
    removerDoCarrinho(index) {
      const item = this.itensCarrinho[index];
      this.itensCarrinho.splice(index, 1);
      this.salvarCarrinho();
      this.toast.info(`${item.nome} removido do carrinho`);
    },
    
    limparCarrinho() {
      if (confirm('Deseja realmente limpar o carrinho?')) {
        this.itensCarrinho = [];
        this.salvarCarrinho();
        this.toast.info('Carrinho limpo');
      }
    },
    
    finalizarCompra() {
      if (this.itensCarrinho.length === 0) {
        this.toast.warning('Carrinho vazio');
        return;
      }
      
      // Aqui você pode implementar a lógica de finalização da compra
      this.toast.success('Funcionalidade de pagamento será implementada em breve');
      console.log('Itens para finalizar:', this.itensCarrinho);
      console.log('Total:', this.totalCarrinho);
    },
    
    salvarCarrinho() {
      localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
    },
    
    carregarCarrinho() {
      const carrinhoSalvo = localStorage.getItem('carrinho');
      if (carrinhoSalvo) {
        this.itensCarrinho = JSON.parse(carrinhoSalvo);
      }
    },
    
    formatCurrency(value) {
      if (!value) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
  }
};
</script>

<style scoped>
.produtos-view-container {
  padding: 20px;
}

.loading-spinner {
  padding: 40px;
  color: #667eea;
}

.loading-spinner i {
  font-size: 2rem;
  margin-bottom: 10px;
}

.produto-card, .carrinho-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 12px;
  margin-bottom: 20px;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0 !important;
}

.produto-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.price-value {
  color: #48bb78;
  font-weight: 600;
  font-size: 1.1rem;
}

.quantidade-section {
  margin: 20px 0;
}

.quantidade-section .form-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.input-group {
  max-width: 200px;
}

.total-section {
  margin: 20px 0;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
}

.carrinho-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.item-info {
  flex: 1;
}

.item-nome {
  margin: 0 0 5px 0;
  color: #2d3748;
  font-size: 1rem;
}

.item-details {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #718096;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-total {
  font-weight: 600;
  color: #48bb78;
  min-width: 80px;
  text-align: right;
}

.carrinho-total {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 20px;
}

.carrinho-actions {
  margin-top: 15px;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
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

.alert {
  border-radius: 8px;
  border: none;
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
  .produtos-view-container {
    padding: 10px;
  }
  
  .carrinho-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .item-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>