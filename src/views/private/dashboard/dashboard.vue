<template>
    <h2>Dashboard</h2>
    <v-container fluid>
        <!-- Cards de Resumo -->
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card class="mx-auto" color="primary" dark>
                    <v-card-text>
                        <div class="text-h4 font-weight-bold">
                            R$ {{ Number(resumo.totalVendas).toFixed(2) }}
                        </div>
                        <div class="text-subtitle-1">Total de Vendas</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card class="mx-auto" color="success" dark>
                    <v-card-text>
                        <div class="text-h4 font-weight-bold">
                            R$ {{ Number(resumo.vendasMes).toFixed(2) }}
                        </div>
                        <div class="text-subtitle-1">Vendas do Mês</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card class="mx-auto" color="info" dark>
                    <v-card-text>
                        <div class="text-h4 font-weight-bold">
                            {{ Number(resumo.quantidadeVendas) }}
                        </div>
                        <div class="text-subtitle-1">Quantidade de Vendas</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card class="mx-auto" color="warning" dark>
                    <v-card-text>
                        <div class="text-h4 font-weight-bold">
                            R$ {{ Number(resumo.ticketMedio).toFixed(2) }}
                        </div>
                        <div class="text-subtitle-1">Ticket Médio</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Tabela de Vendas Recentes -->
        <v-row class="mt-4">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Vendas Recentes</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="vendas"
                            :items-per-page="5"
                            :loading="isLoading"
                            class="elevation-1"
                        >
                            <template v-slot:item.valor_total="{ item }">
                                R$ {{ Number(item.valor_total).toFixed(2) }}
                            </template>
                            <template v-slot:item.data_venda="{ item }">
                                {{ formatDate(item.data_venda) }}
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import PagamentoRepository from '@/shared/http/repositories/pagamento/pagamento';

export default {
    name: 'Dashboard',
    data() {
        return {
            resumo: {
                totalVendas: 0,
                vendasMes: 0,
                quantidadeVendas: 0,
                mediaVendas: 0,
                ticketMedio: 0
            },
            headers: [
                { title: 'ID', key: 'id' },
                { title: 'Data', key: 'data_venda' },
                { title: 'Mercadinho', key: 'mercadinho.nome' },
                { title: 'Valor Total', key: 'valor_total' },
                { title: 'Quantidade', key: 'produto.quantidade' }
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
                    // Atualiza o resumo
                    this.resumo = {
                        totalVendas: Number(response.data.resumo.totalVendas) || 0,
                        vendasMes: Number(response.data.resumo.vendasMes) || 0,
                        quantidadeVendas: Number(response.data.resumo.quantidadeVendas) || 0,
                        mediaVendas: Number(response.data.resumo.mediaVendas) || 0,
                        ticketMedio: Number(response.data.resumo.ticketMedio) || 0
                    };
                    
                    // Atualiza a tabela de vendas
                    this.vendas = response.data.vendas || [];
                }
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
                // Define valores padrão em caso de erro
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
        }
    },
    mounted() {
        this.loadDashboardData();
        // Atualiza os dados a cada 5 minutos
        setInterval(this.loadDashboardData, 300000);
    }
};
</script>

<style scoped>
.v-card {
    height: 100%;
}
</style>
