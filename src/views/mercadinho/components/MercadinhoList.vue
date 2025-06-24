<template>
    <div>
        <DataGrid
            title="Lista de Mercadinhos"
            :items="mercadinhos"
            :columns="columns"
            :loading="loading"
            :current-page="options.page"
            :items-per-page="options.itemsPerPage"
            :total-items="totalMercadinhos"
            @add="openModal"
            @edit="editMercadinho"
            @delete="deleteMercadinho"
            @refresh="fetchMercadinhos"
            @page-change="onPageChange"
            @items-per-page-change="onItemsPerPageChange"
            @search="onSearch"
        />

        <!-- Modal para Adicionar Mercadinho -->
        <MercadinhoAdd :values="editValues" v-model:dialog="dialog" @update:dialog="onDialogUpdate" @close-modal="closeModal" />
    </div>
</template>

<script>
import MercadinhoRepository from '@/shared/http/repositories/mercadinho/mercadinho';
import MercadinhoAdd from './MercadinhoAdd.vue';
import { DataGrid } from '@/components/Grid';

export default {
    components: {
        MercadinhoAdd,
        DataGrid
    },
    data() {
        return {
            dialog: false,
            mercadinhos: [],
            totalMercadinhos: 0,
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
        async fetchMercadinhos() {
            this.loading = true;
            try {
                const params = {
                    page: this.options.page - 1,
                    size: this.options.itemsPerPage,
                };
                
                if (this.searchTerm) {
                    params.search = this.searchTerm;
                }
                
                const response = await MercadinhoRepository.GetAll({ params });
                this.mercadinhos = response.data.content;
                this.totalMercadinhos = response.data.page.totalElements;
            } catch (error) {
                console.error('Erro ao buscar mercadinhos:', error);
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
        editMercadinho(item) {
            this.editValues = { ...item };
            this.dialog = true;
        },
        async deleteMercadinho(item) {
            if (!confirm('Deseja realmente excluir este mercadinho?')) return;

            try {
                await MercadinhoRepository.Delete(item.id);
                this.fetchMercadinhos();
            } catch (error) {
                console.error('Erro ao excluir mercadinho:', error);
            }
        },
        onPageChange(page) {
            this.options.page = page;
            this.fetchMercadinhos();
        },
        onItemsPerPageChange(itemsPerPage) {
            this.options.itemsPerPage = itemsPerPage;
            this.options.page = 1;
            this.fetchMercadinhos();
        },
        onSearch(searchTerm) {
            this.searchTerm = searchTerm;
            this.options.page = 1;
            this.fetchMercadinhos();
        },
        onDialogUpdate(value) {
            this.dialog = value;
            if (!value) {
                this.fetchMercadinhos();
            }
        }
    },
    mounted() {
        this.fetchMercadinhos();
    },
};
</script>