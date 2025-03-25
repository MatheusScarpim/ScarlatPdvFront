<template>
    <v-container class="produto-view-container">
        <v-row v-if="loading">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>Carregando...</p>
            </v-col>
        </v-row>
        <v-row v-else-if="errored">
            <v-col cols="12" class="text-center">
                <v-alert type="error">Ocorreu um erro ao carregar os produtos.</v-alert>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div class="produto-list">
                    <div class="produto-item" v-for="item in cart" :key="item.produto.id">
                        <span>{{ item.produto.nome }}</span>
                        <span>Quantidade: {{ item.quantidade }}</span>
                        <span>Valor Unitário: R$ {{ item.produto.preco.toFixed(2) }}</span>
                        <span>Valor Total: R$ {{ (item.produto.preco * item.quantidade).toFixed(2) }}</span>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-right">
                <p>Total: R$ {{ total.toFixed(2) }}</p>
                <v-btn
                    color="primary"
                    class="mt-4"
                    :disabled="cart.length === 0"
                    @click="finalizarCompra"
                >
                    Finalizar Compra
                </v-btn>
            </v-col>
        </v-row>

        <!-- Modal de Pagamento PIX -->
        <v-dialog v-model="showPaymentModal" max-width="500">
            <v-card>
                <v-card-title class="headline">
                    Pagamento PIX
                </v-card-title>
                <v-card-text class="text-center">
                    <v-alert
                        color="info"
                        class="mb-4"
                        border="left"
                        elevation="2"
                    >
                        Valor Total: R$ {{ total.toFixed(2) }}
                    </v-alert>
                    <p class="mb-4">Escaneie o QR Code abaixo para pagar:</p>
                    <img :src="'data:image/png;base64,' + paymentData.qrCodeBase64" 
                         alt="QR Code PIX" 
                         class="qr-code-image mb-4"
                    />
                    <v-divider class="mb-4"></v-divider>
                    <p class="mb-2">Ou copie o código PIX:</p>
                    <v-text-field
                        v-model="paymentData.qrCode"
                        readonly
                        outlined
                        append-icon="mdi-content-copy"
                        @click:append="copyPixCode"
                    ></v-text-field>
                    
                    <v-alert
                        v-if="paymentStatus"
                        :color="getStatusColor"
                        border="left"
                        class="mt-4"
                    >
                        Status do Pagamento: {{ getStatusText }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="closePaymentModal"
                    >
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import PagamentoRepository from '@/shared/http/repositories/pagamento/pagamento';

export default {
    name: 'ProdutoView',
    data() {
        return {
            produtos: [],
            loading: false,
            errored: false,
            cart: [],
            showPaymentModal: false,
            paymentData: {
                qrCode: '',
                qrCodeBase64: '',
                paymentId: null
            },
            paymentStatus: null,
            statusCheckInterval: null
        };
    },
    props: {
        codBarra: {
            type: String,
            required: false
        }
    },
    watch: {
        codBarra: {
            handler() {
                if(this.codBarra) {
                    this.getProdutoByCodBarra();
                }
            }
        },
        showPaymentModal(newValue) {
            if (newValue) {
                this.startStatusCheck();
            } else {
                this.stopStatusCheck();
            }
        },
        'paymentStatus.status'(newStatus) {
            if (newStatus === 'approved') {
                this.handlePaymentApproved();
            }
        }
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
        },
        getStatusColor() {
            if (!this.paymentStatus) return 'info';
            
            switch (this.paymentStatus.status) {
                case 'approved':
                    return 'success';
                case 'pending':
                    return 'warning';
                case 'rejected':
                    return 'error';
                default:
                    return 'info';
            }
        },
        getStatusText() {
            if (!this.paymentStatus) return 'Aguardando pagamento';
            
            switch (this.paymentStatus.status) {
                case 'approved':
                    return 'Pagamento aprovado!';
                case 'pending':
                    return 'Aguardando pagamento';
                case 'rejected':
                    return 'Pagamento rejeitado';
                default:
                    return 'Status desconhecido';
            }
        }
    },
    methods: {
        async getProdutoByCodBarra() {
            this.loading = true;
            const filter = { params: { codBarra: this.codBarra } };
            try {
                const response = await ProdutoRepository.GetAll(filter);
                this.produtos = response.data.content;
                if (this.produtos.length > 0) {
                    console.log(this.produtos[0]);
                    this.addToCart(this.produtos[0]);
                }
            } catch (error) {
                console.log(error);
                this.errored = true;
            } finally {
                this.loading = false;
            }
        },
        addToCart(produto) {
            const item = this.cart.find(item => item.produto.id === produto.id);
            if (item) {
                item.quantidade++;
            } else {
                this.cart.push({ produto, quantidade: 1 });
            }
        },
        async finalizarCompra() {
            try {
                this.loading = true;
                const productIds = this.cart.map(item => item.produto.id);
                
                const response = await PagamentoRepository.CreatePixPayment({
                    productIds: productIds
                });

                // Atualizar dados do pagamento
                this.paymentData = {
                    qrCode: response.data.qrCode,
                    qrCodeBase64: response.data.qrCodeBase64,
                    paymentId: response.data.paymentId
                };

                // Mostrar modal
                this.showPaymentModal = true;

                // Não limpar o carrinho até confirmar o pagamento
                this.$emit('compra-iniciada', response.data);
            } catch (error) {
                console.error('Erro ao finalizar compra:', error);
                this.errored = true;
                this.$emit('erro-compra', error);
            } finally {
                this.loading = false;
            }
        },
        copyPixCode() {
            navigator.clipboard.writeText(this.paymentData.qrCode)
                .then(() => {
                    // Você pode adicionar um feedback visual aqui se desejar
                    alert('Código PIX copiado com sucesso!');
                })
                .catch(err => {
                    console.error('Erro ao copiar código:', err);
                });
        },
        async checkPaymentStatus() {
            try {
                const response = await PagamentoRepository.GetPaymentStatus(this.paymentData.paymentId);
                this.paymentStatus = response.data;
            } catch (error) {
                console.error('Erro ao verificar status do pagamento:', error);
            }
        },
        startStatusCheck() {
            this.checkPaymentStatus(); // Primeira verificação imediata
            this.statusCheckInterval = setInterval(this.checkPaymentStatus, 15000); // 15 segundos
        },
        stopStatusCheck() {
            if (this.statusCheckInterval) {
                clearInterval(this.statusCheckInterval);
                this.statusCheckInterval = null;
            }
        },
        handlePaymentApproved() {
            this.stopStatusCheck();
            this.cart = []; // Limpa o carrinho
            setTimeout(() => {
                this.showPaymentModal = false;
            }, 2000); // Fecha o modal após 2 segundos
        },
        closePaymentModal() {
            this.stopStatusCheck();
            this.showPaymentModal = false;
        }
    },
    beforeDestroy() {
        this.stopStatusCheck(); // Limpa o intervalo quando o componente é destruído
    }
};
</script>

<style>
.produto-view-container {
    padding: 20px;
    font-family: Arial, sans-serif;
}

.produto-list {
    display: flex;
    flex-direction: column;
}

.produto-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
}

.qr-code-image {
    max-width: 300px;
    width: 100%;
    height: auto;
    margin: 0 auto;
}
</style>