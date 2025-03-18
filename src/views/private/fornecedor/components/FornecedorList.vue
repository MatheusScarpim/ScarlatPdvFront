<template>
    <div>
        <v-data-table :headers="headers" :items="fornecedores" :options.sync="options"
            :server-items-length="totalFornecedores" :loading="loading"
            :footer-props="{ 'items-per-page-text': 'Itens por página' }" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Fornecedores</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchFornecedores">Atualizar</v-btn>
                </v-toolbar>
            </template>
        </v-data-table>

        <!-- Modal de Adicionar Fornecedor -->
        <FornecedorAdd v-model:dialog="dialog" @close-modal="closeModal" />
    </div>
</template>

<script>
import axios from 'axios';
import FornecedorAdd from './FornecedorAdd.vue';

export default {
    components: {
        FornecedorAdd,
    },
    data() {
        return {
            dialog: false, // Estado da modal
            fornecedores: [],
            totalFornecedores: 0,
            options: {
                page: 1,
                itemsPerPage: 5,
                sortBy: [],
                sortDesc: [],
            },
            loading: false,
        };
    },
    watch: {
        options: {
            handler() {
                this.fetchFornecedores();
            },
            deep: true,
        },
    },
    methods: {
        async fetchFornecedores() {
            this.loading = true;
            try {
                const { page, itemsPerPage, sortBy, sortDesc } = this.options;
                const response = await axios.get('https://api.exemplo.com/fornecedores', {
                    params: {
                        page,
                        itemsPerPage,
                        sortBy: sortBy[0],
                        sortDesc: sortDesc[0],
                    },
                });
                this.fornecedores = response.data.items;
                this.totalFornecedores = response.data.total;
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
            } finally {
                this.loading = false;
            }
        },
        openModal() {
            this.dialog = true;
        },
        closeModal() {
            this.dialog = false;
        },
    },
    mounted() {
        this.fetchFornecedores();
    },
};
</script>
