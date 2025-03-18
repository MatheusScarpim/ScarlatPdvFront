<template>
    <div>
        <v-data-table :headers="headers" :items="categorias" :options.sync="options"
            :server-items-length="totalCategorias" :loading="loading"
            :footer-props="{ 'items-per-page-text': 'Itens por página' }" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Categorias</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchCategorias">Atualizar</v-btn>
                </v-toolbar>
            </template>
        </v-data-table>

        <!-- Modal de Adicionar Fornecedor -->
        <CategoriaAdd v-model:dialog="dialog" @close-modal="closeModal" />
    </div>
</template>

<script>
import axios from 'axios';
import CategoriaAdd from './CategoriaAdd.vue';

export default {
    components: {
        CategoriaAdd,
    },
    data() {
        return {
            dialog: false, // Estado da modal
            categorias: [{ id: 1, nome: 'Fornecedor 1', email: 'pedr', telefone: '001' },
            { id: 2, nome: 'Fornecedor 2', email: 'math', telefone: '002' }
            ]
            ,
            totalCategorias: 0,
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
                this.fetchCategorias();
            },
            deep: true,
        },
    },
    methods: {
        async fetchCategorias() {
            this.loading = true;
            try {
                const { page, itemsPerPage, sortBy, sortDesc } = this.options;
                const response = await axios.get('https://api.exemplo.com/categorias', {
                    params: {
                        page,
                        itemsPerPage,
                        sortBy: sortBy[0],
                        sortDesc: sortDesc[0],
                    },
                });
                this.categorias = response.data.items;
                this.totalCategorias = response.data.total;
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
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
        this.fetchCategorias();
    },
};
</script>
