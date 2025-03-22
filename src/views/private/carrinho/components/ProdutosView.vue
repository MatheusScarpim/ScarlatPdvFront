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
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ProdutoRepository from '@/shared/http/repositories/produto/produto';

export default {
    name: 'ProdutoView',
    data() {
        return {
            produtos: [],
            loading: false,
            errored: false,
            cart: []
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
        }
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
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
        }
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
</style>