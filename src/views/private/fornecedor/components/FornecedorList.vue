<template>
    <div>
        <DataGrid
            title="Lista de Fornecedores"
            :items="fornecedores"
            :columns="columns"
            :loading="loading"
            :current-page="options.page"
            :items-per-page="options.itemsPerPage"
            :total-items="totalFornecedores"
            @add="openModal"
            @edit="editFornecedor"
            @delete="deleteFornecedor"
            @refresh="fetchFornecedores"
            @page-change="onPageChange"
            @items-per-page-change="onItemsPerPageChange"
            @search="onSearch"
        />

        <!-- Modal para Adicionar Fornecedor -->
        <FornecedorAdd :values="editValues" v-model:dialog="dialog" @update:dialog="onDialogUpdate" @close-modal="closeModal" />
    </div>
</template>

<script>
import FornecedorRepository from '@/shared/http/repositories/fornecedor/fornecedor';
import FornecedorAdd from './FornecedorAdd.vue';
import { DataGrid } from '@/components/Grid';

export default {
    components: {
        FornecedorAdd,
        DataGrid
    },
    data() {
        return {
            dialog: false,
            fornecedores: [],
            totalFornecedores: 0,
            options: {
                page: 1,
                itemsPerPage: 10,
            },
            loading: false,
            columns: [
                { key: 'id', title: 'ID' },
                { key: 'nome', title: 'Nome' }
            ],
            editValues: null,
            searchTerm: ''
        };
    },
    methods: {
        async fetchFornecedores() {
            this.loading = true;
            try {
                const params = {
                    page: this.options.page - 1,
                    size: this.options.itemsPerPage,
                };
                
                if (this.searchTerm) {
                    params.search = this.searchTerm;
                }
                
                const response = await FornecedorRepository.GetAll({ params });
                this.fornecedores = response.data.content;
                this.totalFornecedores = response.data.page.totalElements;
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
            } finally {
                this.loading = false;
            }
        },
        openModal() {
            this.clearForm();
            this.dialog = true;
        },
        closeModal() {
            this.clearForm();
            this.dialog = false;
        },
        clearForm() {
            this.editValues = null;
        },
        editFornecedor(item) {
            this.editValues = { ...item };
            this.dialog = true;
        },
        async deleteFornecedor(item) {
            if (!confirm('Deseja realmente excluir este fornecedor?')) return;

            try {
                await FornecedorRepository.Delete(item.id);
                this.fetchFornecedores();
            } catch (error) {
                console.error('Erro ao excluir fornecedor:', error);
            }
        },
        onPageChange(page) {
            this.options.page = page;
            this.fetchFornecedores();
        },
        onItemsPerPageChange(itemsPerPage) {
            this.options.itemsPerPage = itemsPerPage;
            this.options.page = 1;
            this.fetchFornecedores();
        },
        onSearch(searchTerm) {
            this.searchTerm = searchTerm;
            this.options.page = 1;
            this.fetchFornecedores();
        },
        onDialogUpdate(value) {
            this.dialog = value;
            if (!value) {
                this.fetchFornecedores();
            }
        }
    },
    mounted() {
        this.fetchFornecedores();
    },
};
</script>