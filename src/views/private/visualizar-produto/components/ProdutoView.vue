<template>
    <v-container class="produto-view-container">
        <v-row>
            <v-col cols="12">
                <h1>Produtos</h1>
            </v-col>
        </v-row>
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
        <v-row v-else>
            <v-col cols="12" v-if="produtos.length === 0" class="text-center">
                <v-alert type="info">Nada Encontrado</v-alert>
            </v-col>
            <v-col v-else v-for="produto in produtos" :key="produto.id" cols="12" md="4">
                <v-card class="produto-item">
                    <v-card-title>{{ produto.nome }}</v-card-title>
                    <v-card-text>
                        <p>Código de Barras: {{ produto.codBarra }}</p>
                        <p>Preço: {{ produto.preco }}</p>
                    </v-card-text>
                </v-card>
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
            errored: false
        };
    },
    props: {
        codBarra: {
            type: String,
            required: true
        }
    },
    watch: {
        codBarra: {
            handler() {
                this.getProdutoByCodBarra();
            }
        }
    },
    methods: {
        getProdutoByCodBarra() {
            this.loading = true;
            const filter = { params: { codBarra: this.codBarra } };
            ProdutoRepository.GetAll(filter)
                .then(response => {
                    this.produtos = response.data.content;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => this.loading = false);
        }
    }
};
</script>

<style>
.produto-view-container {
    padding: 20px;
    font-family: Arial, sans-serif;
}

.produto-item {
    margin-bottom: 20px;
}
</style>