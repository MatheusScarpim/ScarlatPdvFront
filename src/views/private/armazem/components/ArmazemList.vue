<template>
    <div>
        <v-data-table :headers="headers" :items="armazens" :options.sync="options"
            :server-items-length="totalArmazens" :loading="loading"
            :footer-props="{ 'items-per-page-text': 'Itens por página' }" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Armazens</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchArmazens">Atualizar</v-btn>
                </v-toolbar>
            </template>
        </v-data-table>

        <!-- Modal de Adicionar Fornecedor -->
        <ArmazemAdd v-model:dialog="dialog" @close-modal="closeModal" />
    </div>
</template>

<script>
import axios from 'axios';
import ArmazemAdd from './ArmazemAdd.vue';

export default {
    components: {
        ArmazemAdd,
    },
    data() {
        return {
            dialog: false, // Estado da modal
            armazens: [{ id: 1, nome: 'Fornecedor 1', email: 'pedr', telefone: '001' },
            { id: 2, nome: 'Fornecedor 2', email: 'math', telefone: '002' }
            ]
            ,
            totalArmazens: 0,
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
                this.fetchArmazens();
            },
            deep: true,
        },
    },
    methods: {
        async fetchArmazens() {
            this.loading = true;
            try {
                const { page, itemsPerPage, sortBy, sortDesc } = this.options;
                const response = await axios.get('https://api.exemplo.com/armazens', {
                    params: {
                        page,
                        itemsPerPage,
                        sortBy: sortBy[0],
                        sortDesc: sortDesc[0],
                    },
                });
                this.armazens = response.data.items;
                this.totalArmazens = response.data.total;
            } catch (error) {
                console.error('Erro ao buscar armazens:', error);
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
        this.fetchArmazens();
    },
};
</script>
