<template>
    <div>
        <v-data-table-server 
            :headers="headers"
            :items="fornecedores" 
            :items-per-page="options.itemsPerPage"
            :server-items-length="totalFornecedores"
            :loading="loading"
            :items-length="totalFornecedores"
            :total-items="totalFornecedores"
            @update:options="fetchFornecedores"
            :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-first-last-page': true,
                'color': 'pink' // Define a cor da paginação como rosa
            }"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Fornecedores</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchFornecedores">Atualizar</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="editFornecedor(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteFornecedor(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>

        <!-- Modal para Adicionar Fornecedor -->
        <FornecedorAdd :values="editValues" v-model:dialog="dialog" @update:dialog="fetchFornecedores" @close-modal="closeModal" />
    </div>
</template>

<script>
import FornecedorRepository from '@/shared/http/repositories/fornecedor/fornecedor';
import FornecedorAdd from './FornecedorAdd.vue';

export default {
    components: {
        FornecedorAdd,
    },
    data() {
        return {
            dialog: false,
            fornecedores: [],
            totalFornecedores: 0,
            options: {
                page: 1, // Página atual
                itemsPerPage: 10, // Quantidade de itens por página
            },
            totalPages: 0,
            loading: false,
            headers: [
                { title: 'id', key: 'id' },
                { title: 'Nome', key: 'nome' },
                { title: 'Ações', key: 'actions', sortable: false },
            ],
            editValues: null,
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
        async fetchFornecedores({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            try {
                const params = {
                    page: page - 1,
                    size: itemsPerPage,
                };
                const response = await FornecedorRepository.GetAll({ params });
                this.fornecedores = response.data.content;
                this.totalFornecedores = response.data.page.totalElements;
                this.totalPages = response.data.page.totalPages;
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
            } finally {
                this.loading = false;
            }
        },
        openModal() {
            this.clearForm()
            this.dialog = true;
        },
        closeModal() {
            this.clearForm()
            this.dialog = false;
        },
        clearForm() {
            this.editValues = null;
        },
        editFornecedor(item) {
            this.editValues = item;
            this.dialog = true;
        },
        async deleteFornecedor(item) {
            if (!confirm('Deseja realmente excluir este fornecedor?')) return;

           await FornecedorRepository.Delete(item.id);
           this.fetchFornecedores({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
        },
    },
    mounted() {
        this.fetchFornecedores({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
    },
};
</script>