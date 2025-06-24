<template>
    <div class="dashboard">
        <h2>Dashboard</h2>
        
        <!-- Cards de Resumo -->
        <div class="dashboard-cards">
            <div class="dashboard-card primary">
                <div class="card-content">
                    <div class="card-value">
                        R$ {{ Number(resumo.totalVendas).toFixed(2) }}
                    </div>
                    <div class="card-label">Total de Vendas</div>
                </div>
                <div class="card-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
            </div>
            
            <div class="dashboard-card success">
                <div class="card-content">
                    <div class="card-value">
                        R$ {{ Number(resumo.vendasMes).toFixed(2) }}
                    </div>
                    <div class="card-label">Vendas do Mês</div>
                </div>
                <div class="card-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
            </div>
            
            <div class="dashboard-card info">
                <div class="card-content">
                    <div class="card-value">
                        {{ Number(resumo.quantidadeVendas) }}
                    </div>
                    <div class="card-label">Quantidade de Vendas</div>
                </div>
                <div class="card-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
            </div>
            
            <div class="dashboard-card warning">
                <div class="card-content">
                    <div class="card-value">
                        R$ {{ Number(resumo.ticketMedio).toFixed(2) }}
                    </div>
                    <div class="card-label">Ticket Médio</div>
                </div>
                <div class="card-icon">
                    <i class="fas fa-receipt"></i>
                </div>
            </div>
        </div>

        <!-- Tabela de Vendas Recentes -->
        <div class="dashboard-table">
            <DataGrid
                title="Vendas Recentes"
                :items="vendas"
                :columns="columns"
                :loading="isLoading"
                :items-per-page="5"
                :show-pagination="false"
                :show-filters="false"
                :show-actions="false"
                :show-add-button="false"
                :show-refresh-button="true"
                @refresh="loadDashboardData"
            >
                <!-- Slot customizado para valor total -->
                <template #item.valor_total="{ value }">
                    <span class="price-value">{{ formatCurrency(value) }}</span>
                </template>
                
                <!-- Slot customizado para data -->
                <template #item.data_venda="{ value }">
                    {{ formatDate(value) }}
                </template>
            </DataGrid>
        </div>
    </div>
</template>

<script>
import PagamentoRepository from '@/shared/http/repositories/pagamento/pagamento';
import { DataGrid } from '@/components/Grid';

export default {
    name: 'Dashboard',
    components: {
        DataGrid
    },
    data() {
        return {
            resumo: {
                totalVendas: 0,
                vendasMes: 0,
                quantidadeVendas: 0,
                mediaVendas: 0,
                ticketMedio: 0
            },
            columns: [
                { key: 'id', title: 'ID' },
                { key: 'data_venda', title: 'Data' },
                { key: 'mercadinho.nome', title: 'Mercadinho' },
                { key: 'valor_total', title: 'Valor Total' },
                { key: 'produto.quantidade', title: 'Quantidade' }
            ],
            vendas: [],
            isLoading: true
        };
    },
    methods: {
        async loadDashboardData() {
            try {
                this.isLoading = true;
                const response = await PagamentoRepository.GetDashboardData();
                console.log('Resposta da API:', response.data);

                if (response.data && response.data.resumo) {
                    this.resumo = {
                        totalVendas: Number(response.data.resumo.totalVendas) || 0,
                        vendasMes: Number(response.data.resumo.vendasMes) || 0,
                        quantidadeVendas: Number(response.data.resumo.quantidadeVendas) || 0,
                        mediaVendas: Number(response.data.resumo.mediaVendas) || 0,
                        ticketMedio: Number(response.data.resumo.ticketMedio) || 0
                    };
                    
                    this.vendas = response.data.vendas || [];
                }
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
                this.resetData();
            } finally {
                this.isLoading = false;
            }
        },
        resetData() {
            this.resumo = {
                totalVendas: 0,
                vendasMes: 0,
                quantidadeVendas: 0,
                mediaVendas: 0,
                ticketMedio: 0
            };
            this.vendas = [];
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            });
        },
        formatCurrency(value) {
            if (!value) return 'R$ 0,00';
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }
    },
    mounted() {
        this.loadDashboardData();
        setInterval(this.loadDashboardData, 300000);
    }
};
</script>

<style scoped>
.dashboard {
    padding: 0;
}

.dashboard h2 {
    margin-bottom: 2rem;
    color: #2d3748;
}

.dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.dashboard-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-left: 4px solid;
}

.dashboard-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dashboard-card.primary {
    border-left-color: #667eea;
}

.dashboard-card.success {
    border-left-color: #48bb78;
}

.dashboard-card.info {
    border-left-color: #4299e1;
}

.dashboard-card.warning {
    border-left-color: #ed8936;
}

.card-content {
    flex: 1;
}

.card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 4px;
}

.card-label {
    font-size: 0.9rem;
    color: #718096;
    font-weight: 500;
}

.card-icon {
    font-size: 2.5rem;
    opacity: 0.3;
    margin-left: 16px;
}

.dashboard-card.primary .card-icon {
    color: #667eea;
}

.dashboard-card.success .card-icon {
    color: #48bb78;
}

.dashboard-card.info .card-icon {
    color: #4299e1;
}

.dashboard-card.warning .card-icon {
    color: #ed8936;
}

.dashboard-table {
    margin-top: 20px;
}

.price-value {
    font-weight: 600;
    color: #48bb78;
}

/* Responsividade */
@media (max-width: 768px) {
    .dashboard-cards {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .dashboard-card {
        padding: 20px;
    }
    
    .card-value {
        font-size: 1.5rem;
    }
    
    .card-icon {
        font-size: 2rem;
    }
}
</style>