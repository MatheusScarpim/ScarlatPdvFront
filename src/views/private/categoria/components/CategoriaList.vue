<template>
    <div>
        <DataGrid
            title="Lista de Categorias"
            :items="categorias"
            :columns="columns"
            :loading="loading"
            :current-page="options.page"
            :items-per-page="options.itemsPerPage"
            :total-items="totalCategorias"
            @add="openModal"
            @edit="editCategoria"
            @delete="deleteCategoria"
            @refresh="fetchCategorias"
            @page-change="onPageChange"
            @items-per-page-change="onItemsPerPageChange"
            @search="onSearch"
        />

        <!-- Modal para Adicionar Categoria -->
        <CategoriaAdd :values="editValues" v-model:dialog="dialog" @update:dialog="onDialogUpdate" @close-modal="closeModal" />
    </div>
</template>

<script>
import CategoriaRepository from '@/shared/http/repositories/categoria/categoria';
import CategoriaAdd from './CategoriaAdd.vue';
import { DataGrid } from '@/components/Grid';

export default {
    components: {
        CategoriaAdd,
        DataGrid
    },
    data() {
        return {
            dialog: false,
            categorias: [],
            totalCategorias: 0,
            options: {
                page: 1,
                itemsPerPage: 10,
            },
            loading: false,
            columns: [
                { key: 'id', title: 'ID' },
                { key: 'nome', title: 'Nome' },
                { key: 'descricao', title: 'Descrição' }
            ],
            editValues: null,
            searchTerm: ''
        };
    },
    methods: {
        async fetchCategorias() {
            this.loading = true;
            try {
                const params = {
                    page: this.options.page - 1,
                    size: this.options.itemsPerPage,
                };
                
                if (this.searchTerm) {
                    params.search = this.searchTerm;
                }
                
                const response = await CategoriaRepository.GetAll({ params });
                this.categorias = response.data.content;
                this.totalCategorias = response.data.page.totalElements;
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
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
        editCategoria(item) {
            this.editValues = { ...item };
            this.dialog = true;
        },
        async deleteCategoria(item) {
            if (!confirm('Deseja realmente excluir esta categoria?')) return;

            try {
                await CategoriaRepository.Delete(item.id);
                this.fetchCategorias();
            } catch (error) {
                console.error('Erro ao excluir categoria:', error);
            }
        },
        onPageChange(page) {
            this.options.page = page;
            this.fetchCategorias();
        },
        onItemsPerPageChange(itemsPerPage) {
            this.options.itemsPerPage = itemsPerPage;
            this.options.page = 1;
            this.fetchCategorias();
        },
        onSearch(searchTerm) {
            this.searchTerm = searchTerm;
            this.options.page = 1;
            this.fetchCategorias();
        },
        onDialogUpdate(value) {
            this.dialog = value;
            if (!value) {
                this.fetchCategorias();
            }
        }
    },
    mounted() {
        this.fetchCategorias();
    },
};
</script>