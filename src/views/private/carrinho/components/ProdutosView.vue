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
                <p class="text-h6">Total: R$ {{ total.toFixed(2) }}</p>
                <v-btn
                    color="primary"
                    class="mt-4"
                    :disabled="cart.length === 0"
                    @click="showPaymentMethodModal = true"
                    elevation="2"
                >
                    <v-icon left>mdi-cart-check</v-icon>
                    Finalizar Compra
                </v-btn>
            </v-col>
        </v-row>

        <!-- Modal de Seleção de Método de Pagamento -->
        <v-dialog v-model="showPaymentMethodModal" max-width="800" persistent>
            <v-card class="payment-method-modal">
                <v-card-title class="headline primary white--text pa-4">
                    <v-icon color="white" class="mr-2">mdi-credit-card-multiple</v-icon>
                    Escolha a Forma de Pagamento
                    <v-spacer></v-spacer>
                    <v-btn icon @click="showPaymentMethodModal = false" dark>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="12">
                            <div class="text-h6 mb-4">Valor Total: <span class="primary--text">R$ {{ total ? total.toFixed(2) : '0.00' }}</span></div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="4">
                            <v-card 
                                class="payment-option" 
                                :class="{ 'selected': selectedPaymentMethod === 'credit' }"
                                @click="selectPaymentMethod('credit')"
                                elevation="2"
                                hover
                            >
                                <v-card-text class="text-center pa-6">
                                    <v-icon size="48" :color="selectedPaymentMethod === 'credit' ? 'primary' : ''">
                                        mdi-credit-card
                                    </v-icon>
                                    <div class="text-h6 mt-4">Cartão de Crédito</div>
                                    <div class="text-caption">Parcele em até 12x</div>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-card 
                                class="payment-option" 
                                :class="{ 'selected': selectedPaymentMethod === 'debit' }"
                                @click="selectPaymentMethod('debit')"
                                elevation="2"
                                hover
                            >
                                <v-card-text class="text-center pa-6">
                                    <v-icon size="48" :color="selectedPaymentMethod === 'debit' ? 'primary' : ''">
                                        mdi-credit-card-outline
                                    </v-icon>
                                    <div class="text-h6 mt-4">Cartão de Débito</div>
                                    <div class="text-caption">Débito à vista</div>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-card 
                                class="payment-option" 
                                :class="{ 'selected': selectedPaymentMethod === 'pix' }"
                                @click="selectPaymentMethod('pix')"
                                elevation="2"
                                hover
                            >
                                <v-card-text class="text-center pa-6">
                                    <v-icon size="48" :color="selectedPaymentMethod === 'pix' ? 'primary' : ''">
                                        mdi-qrcode
                                    </v-icon>
                                    <div class="text-h6 mt-4">PIX</div>
                                    <div class="text-caption">Pagamento instantâneo</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Opções de Parcelamento para Cartão de Crédito -->
                    <v-expand-transition>
                        <div v-if="selectedPaymentMethod === 'credit'" class="mt-6">
                            <v-divider class="mb-4"></v-divider>
                            <div class="text-h6 mb-4">Selecione o número de parcelas:</div>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="selectedInstallment"
                                        :items="installmentOptions"
                                        label="Selecione o número de parcelas"
                                        outlined
                                        dense
                                        return-object
                                    >
                                        <template v-slot:selection="{ item }">
                                            {{ item.label }}
                                            <v-chip
                                                v-if="item.recomendado"
                                                color="success"
                                                x-small
                                                class="ml-2"
                                            >
                                                Recomendado
                                            </v-chip>
                                        </template>
                                        <template v-slot:item="{ item }">
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        {{ item.label }}
                                                        <v-chip
                                                            v-if="item.recomendado"
                                                            color="success"
                                                            x-small
                                                            class="ml-2"
                                                        >
                                                            Recomendado
                                                        </v-chip>
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Total: R$ {{ (item.valorTotal || 0).toFixed(2) }} ({{ item.taxa }}% de juros)
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                    </v-select>
                                </v-col>
                            </v-row>
                        </div>
                    </v-expand-transition>

                    <!-- Mensagem para passar o cartão -->
                    <v-expand-transition>
                        <div v-if="selectedPaymentMethod === 'credit' || selectedPaymentMethod === 'debit'" class="mt-6">
                            <v-divider class="mb-4"></v-divider>
                            <v-alert
                                type="info"
                                border="{ left: true }"
                                colored-border
                                elevation="2"
                                class="mb-4"
                            >
                                <v-icon left>mdi-credit-card-scan</v-icon>
                                Após clicar em "Confirmar Pagamento", passe o cartão na maquininha
                            </v-alert>
                        </div>
                    </v-expand-transition>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="showPaymentMethodModal = false"
                        class="mr-4"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        color="primary"
                        :disabled="!isPaymentMethodValid"
                        @click="processPayment"
                        elevation="2"
                    >
                        <v-icon left>mdi-check</v-icon>
                        {{ paymentButtonText }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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

        <!-- Modal de Sucesso no Pagamento -->
        <v-dialog v-model="showSuccessModal" max-width="500">
            <v-card>
                <v-card-title class="headline success--text">
                    <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                    Pagamento Aprovado!
                </v-card-title>
                <v-card-text>
                    <v-alert
                        type="success"
                        border="left"
                        elevation="2"
                        class="mb-4"
                    >
                        Seu pagamento foi processado com sucesso!
                    </v-alert>
                    <div class="text-center">
                        <v-icon color="success" size="64" class="mb-4">mdi-check-circle</v-icon>
                        <p class="text-subtitle-1 mb-2">Detalhes do pagamento:</p>
                        <p class="text-body-2">ID: {{ paymentStatus?.id }}</p>
                        <p class="text-body-2">Data: {{ formatDate(paymentStatus?.date_approved) }}</p>
                        <p class="text-body-2">Valor: R$ {{ paymentStatus?.transaction_amount?.toFixed(2) }}</p>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        text
                        @click="closeSuccessModal"
                    >
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal de Erro de Pagamento -->
        <v-dialog v-model="showErrorModal" max-width="500">
            <v-card>
                <v-card-title class="headline error--text">
                    <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                    Erro no Pagamento
                </v-card-title>
                <v-card-text>
                    <v-alert
                        type="error"
                        border="left"
                        elevation="2"
                        class="mb-4"
                    >
                        {{ getErrorMessage }}
                    </v-alert>
                    <p class="text-subtitle-1 mb-2">Código do erro:</p>
                    <p class="text-body-2">{{ paymentStatus?.status_detail || 'Código não disponível' }}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="closeErrorModal"
                    >
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal de Comprovante -->
        <v-dialog v-model="showReceiptModal" max-width="600">
            <v-card>
                <v-card-title class="headline primary--text">
                    <v-icon color="primary" class="mr-2">mdi-receipt</v-icon>
                    Comprovante de Compra
                </v-card-title>
                <v-card-text>
                    <v-alert
                        type="success"
                        border="left"
                        elevation="2"
                        class="mb-4"
                    >
                        Compra realizada com sucesso!
                    </v-alert>
                    
                    <div class="receipt-content">
                        <div class="receipt-header mb-4">
                            <h3 class="text-h6">Mercado Scarlat</h3>
                            <p class="text-caption">CNPJ: XX.XXX.XXX/XXXX-XX</p>
                        </div>

                        <v-divider class="mb-4"></v-divider>

                        <div class="receipt-items mb-4">
                            <h4 class="text-subtitle-1 mb-2">Itens Comprados:</h4>
                            <div v-for="item in cart" :key="item.produto.id" class="receipt-item">
                                <div class="d-flex justify-space-between">
                                    <span>{{ item.produto.nome }}</span>
                                    <span>{{ item.quantidade }}x</span>
                                </div>
                                <div class="d-flex justify-space-between">
                                    <span>R$ {{ item.produto.preco.toFixed(2) }}</span>
                                    <span>R$ {{ (item.produto.preco * item.quantidade).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>

                        <v-divider class="mb-4"></v-divider>

                        <div class="receipt-total mb-4">
                            <div class="d-flex justify-space-between">
                                <span class="text-h6">Total:</span>
                                <span class="text-h6">R$ {{ total.toFixed(2) }}</span>
                            </div>
                        </div>

                        <div class="receipt-payment-info mb-4">
                            <p class="text-caption">Forma de Pagamento: PIX</p>
                            <p class="text-caption">Data: {{ formatDate(paymentStatus?.date_approved) }}</p>
                            <p class="text-caption">ID da Transação: {{ paymentStatus?.id }}</p>
                        </div>

                        <v-divider class="mb-4"></v-divider>

                        <div class="receipt-footer text-center">
                            <p class="text-caption">Obrigado pela preferência!</p>
                            <p class="text-caption">Volte sempre!</p>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        @click="downloadReceipt"
                        class="mr-2"
                    >
                        <v-icon left>mdi-download</v-icon>
                        Baixar Comprovante
                    </v-btn>
                    <v-btn
                        color="primary"
                        text
                        @click="closeReceiptModal"
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
import html2pdf from 'html2pdf.js';

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
            statusCheckInterval: null,
            showErrorModal: false,
            showSuccessModal: false,
            showReceiptModal: false,
            showPaymentMethodModal: false,
            selectedPaymentMethod: null,
            selectedInstallment: null,
            errorMessages: {
                // Erros de Fraude
                'cc_rejected_blacklist': 'Pagamento recusado por suspeita de fraude (cartão na lista negra)',
                'cc_rejected_high_risk': 'Pagamento recusado por alto risco de fraude',
                'cc_rejected_other_reason': 'Pagamento recusado por suspeita de fraude',

                // Erros do Banco Emissor
                'cc_rejected_call_for_authorize': 'Pagamento recusado - Necessária autorização do banco',
                'cc_rejected_card_disabled': 'Cartão desabilitado para compras online',
                'cc_rejected_duplicated_payment': 'Pagamento duplicado',
                'cc_rejected_insufficient_amount': 'Saldo ou limite insuficiente',
                'cc_rejected_invalid_installments': 'Número de parcelas inválido',
                'cc_rejected_max_attempts': 'Número máximo de tentativas excedido',

                // Erros de Preenchimento
                'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
                'cc_rejected_bad_filled_date': 'Data de validade do cartão inválida',
                'cc_rejected_bad_filled_security_code': 'Código de segurança do cartão inválido',
                'cc_rejected_bad_filled_other': 'Dados do cartão preenchidos incorretamente'
            }
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
            } else if (newStatus === 'rejected') {
                this.handlePaymentRejected();
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
        },
        getErrorMessage() {
            if (!this.paymentStatus?.status_detail) return 'Erro desconhecido no pagamento';
            return this.errorMessages[this.paymentStatus.status_detail] || 'Erro no processamento do pagamento';
        },
        installmentOptions() {
            if (!this.total || this.total <= 0) return [];
            
            const options = [];
            const maxInstallments = 12;
            const minInstallmentValue = 5;

            // Taxas do Mercado Pago Point (aproximadas)
            const taxas = {
                debito: 1.99, // 1.99% para débito
                credito: {
                    1: 3.79, // 3.79% à vista
                    2: 5.99, // 5.99% parcelado
                    3: 6.99,
                    4: 7.99,
                    5: 8.99,
                    6: 9.99,
                    7: 10.99,
                    8: 11.99,
                    9: 12.99,
                    10: 13.99,
                    11: 14.99,
                    12: 15.99
                }
            };

            // Opção à vista com desconto
            const valorAVista = this.total * (1 + taxas.credito[1] / 100);
            options.push({
                value: 1,
                label: `1x de R$ ${valorAVista.toFixed(2)} à vista`,
                taxa: taxas.credito[1],
                valorParcela: valorAVista,
                valorTotal: valorAVista,
                recomendado: true
            });

            // Calcula as parcelas
            for (let i = 2; i <= maxInstallments; i++) {
                const taxa = taxas.credito[i];
                const valorTotal = this.total * (1 + taxa / 100);
                const valorParcela = valorTotal / i;

                if (valorParcela >= minInstallmentValue) {
                    options.push({
                        value: i,
                        label: `${i}x de R$ ${valorParcela.toFixed(2)} (total: R$ ${valorTotal.toFixed(2)}, juros: ${taxa}%)`,
                        taxa: taxa,
                        valorParcela: valorParcela,
                        valorTotal: valorTotal,
                        recomendado: (i === 2 && this.total < 1000) || 
                                    (i === 3 && this.total >= 1000 && this.total < 2000) ||
                                    (i === 6 && this.total >= 2000)
                    });
                }
            }

            return options;
        },
        isPaymentMethodValid() {
            return this.selectedPaymentMethod !== null && 
                   (this.selectedPaymentMethod === 'pix' || 
                    this.selectedPaymentMethod === 'credit' || 
                    this.selectedPaymentMethod === 'debit');
        },
        paymentButtonText() {
            if (this.selectedPaymentMethod === 'pix') {
                return 'Gerar QR Code PIX';
            } else {
                return 'Passar Cartão na Maquininha';
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
                
                // Transforma o carrinho no formato esperado pela API
                const products = {};
                this.cart.forEach(item => {
                    products[item.produto.id] = {
                        quantity: item.quantidade
                    };
                });
                
                const response = await PagamentoRepository.CreatePixPayment({
                    products: products
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
            this.statusCheckInterval = setInterval(this.checkPaymentStatus, 5000); // 5 segundos
        },
        stopStatusCheck() {
            if (this.statusCheckInterval) {
                clearInterval(this.statusCheckInterval);
                this.statusCheckInterval = null;
            }
        },
        handlePaymentApproved() {
            this.stopStatusCheck();
            this.showPaymentModal = false;
            this.showSuccessModal = true;
            // Após 2 segundos, mostra o modal de comprovante
            setTimeout(() => {
                this.showSuccessModal = false;
                this.showReceiptModal = true;
            }, 2000);
        },
        handlePaymentRejected() {
            this.stopStatusCheck();
            this.showPaymentModal = false;
            this.showErrorModal = true;
        },
        closePaymentModal() {
            this.stopStatusCheck();
            this.showPaymentModal = false;
        },
        closeErrorModal() {
            this.showErrorModal = false;
            this.paymentStatus = null;
        },
        closeSuccessModal() {
            this.showSuccessModal = false;
            this.paymentStatus = null;
            this.cart = []; // Limpa o carrinho após fechar o modal de sucesso
        },
        closeReceiptModal() {
            this.showReceiptModal = false;
            this.cart = []; // Limpa o carrinho após fechar o comprovante
        },
        async downloadReceipt() {
            try {
                // Elemento que será convertido para PDF
                const element = document.createElement('div');
                element.innerHTML = `
                    <div style="font-family: 'Courier New', monospace; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="margin: 0;">Mercado Scarlat</h2>
                            <p style="margin: 5px 0;">CNPJ: XX.XXX.XXX/XXXX-XX</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin: 0 0 10px 0;">Itens Comprados:</h3>
                            ${this.cart.map(item => `
                                <div style="margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span>${item.produto.nome}</span>
                                        <span>${item.quantidade}x</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span>R$ ${item.produto.preco.toFixed(2)}</span>
                                        <span>R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div style="margin-bottom: 20px; border-top: 2px dashed #000; padding-top: 10px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="font-weight: bold;">Total:</span>
                                <span style="font-weight: bold;">R$ ${this.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <p style="margin: 5px 0;">Forma de Pagamento: PIX</p>
                            <p style="margin: 5px 0;">Data: ${this.formatDate(this.paymentStatus?.date_approved)}</p>
                            <p style="margin: 5px 0;">ID da Transação: ${this.paymentStatus?.id}</p>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <p style="margin: 5px 0;">Obrigado pela preferência!</p>
                            <p style="margin: 5px 0;">Volte sempre!</p>
                        </div>
                    </div>
                `;

                // Configurações do PDF
                const opt = {
                    margin: 1,
                    filename: `comprovante_${this.paymentStatus?.id || 'scarlat'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };

                // Gera e faz o download do PDF
                await html2pdf().set(opt).from(element).save();
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                alert('Erro ao gerar o comprovante. Por favor, tente novamente.');
            }
        },
        formatDate(dateString) {
            if (!dateString) return 'Não disponível';
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        selectPaymentMethod(method) {
            this.selectedPaymentMethod = method;
            if (method === 'debit') {
                this.selectedInstallment = 1;
            }
        },
        async processPayment() {
            try {
                this.loading = true;
                
                if (this.selectedPaymentMethod === 'pix') {
                    await this.finalizarCompra();
                } else {
                    // Preparar dados para envio
                    const paymentData = {
                        products: {},
                        paymentMethod: this.selectedPaymentMethod,
                        installments: this.selectedPaymentMethod === 'credit' ? this.selectedInstallment?.value || 1 : 1
                    };

                    // Adicionar produtos
                    this.cart.forEach(item => {
                        paymentData.products[item.produto.id] = {
                            quantity: item.quantidade
                        };
                    });

                    // Enviar para processamento na maquininha
                    const response = await PagamentoRepository.ProcessCardPayment(paymentData);
                    
                    if (response.data.status === 'approved') {
                        this.paymentStatus = response.data;
                        this.showSuccessModal = true;
                    } else {
                        this.paymentStatus = response.data;
                        this.showErrorModal = true;
                    }
                }
                
                this.showPaymentMethodModal = false;
            } catch (error) {
                console.error('Erro ao processar pagamento:', error);
                this.showErrorModal = true;
            } finally {
                this.loading = false;
            }
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

.error--text {
    color: #ff5252 !important;
}

.success--text {
    color: #4caf50 !important;
}

.receipt-content {
    font-family: 'Courier New', monospace;
}

.receipt-header {
    text-align: center;
}

.receipt-item {
    margin-bottom: 8px;
    padding: 4px 0;
}

.receipt-total {
    border-top: 1px dashed #ccc;
    padding-top: 8px;
}

.receipt-footer {
    font-style: italic;
}

.payment-method-modal {
    border-radius: 8px;
}

.payment-option {
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
    height: 100%;
}

.payment-option:hover {
    transform: translateY(-4px);
}

.payment-option.selected {
    border-color: var(--v-primary-base);
    background-color: var(--v-primary-lighten5);
}

.payment-option .v-icon {
    transition: all 0.3s ease;
}

.payment-option:hover .v-icon {
    transform: scale(1.1);
}

.v-card__text {
    position: relative;
}
</style>