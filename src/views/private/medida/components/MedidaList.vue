<template>
    <div>
        <DataGrid
            title="Lista de Medidas"
            :items="medidas"
            :columns="columns"
            :loading="loading"
            :current-page="options.page"
            :items-per-page="options.itemsPerPage"
            :total-items="totalMedidas"
            @add="openModal"
            @edit="editMedida"
            @delete="deleteMedida"
            @refresh="fetchMedidas"
            @page-change="onPageChange"
            @items-per-page-change="onItemsPerPageChange"
            @search="onSearch"
        />

        <!-- Modal para Adicionar Medida -->
        <MedidaAdd :values="editValues" v-model:dialog="dialog" @update:dialog="onDialogUpdate" @close-modal="closeModal" />
    </div>
</template>

<script>
import MedidaRepository from '@/shared/http/repositories/medida/medida';
import MedidaAdd from './MedidaAdd.vue';
import { DataGrid } from '@/components/Grid';

export default {
    components: {
        MedidaAdd,
        DataGrid
    },
    data() {
        return {
            dialog: false,
            medidas: [],
            totalMedidas: 0,
            options: {
                page: 1,
                itemsPerPage: 10,
            },
            loading: false,
            columns: [
                { key: 'id', title: 'ID' },
                { key: 'tipo', title: 'Tipo' },
                { key: 'abreviacao', title: 'Abreviação' }
            ],
            editValues: null,
            searchTerm: ''
        };
    },
    methods: {
        async fetchMedidas() {
            this.loading = true;
            try {
                const params = {
                    page: this.options.page - 1,
                    size: this.options.itemsPerPage,
                };
                
                if (this.searchTerm) {
                    params.search = this.searchTerm;
                }
                
                const response = await MedidaRepository.GetAll({ params });
                this.medidas = response.data.content;
                this.totalMedidas = response.data.page.totalElements;
            } catch (error) {
                console.error('Erro ao buscar medidas:', error);
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
        editMedida(item) {
            this.editValues = { ...item };
            this.dialog = true;
        },
        async deleteMedida(item) {
            if (!confirm('Deseja realmente excluir esta medida?')) return;

            try {
                await MedidaRepository.Delete(item.id);
                this.fetchMedidas();
            } catch (error) {
                console.error('Erro ao excluir medida:', error);
            }
        },
        onPageChange(page) {
            this.options.page = page;
            this.fetchMedidas();
        },
        onItemsPerPageChange(itemsPerPage) {
            this.options.itemsPerPage = itemsPerPage;
            this.options.page = 1;
            this.fetchMedidas();
        },
        onSearch(searchTerm) {
            this.searchTerm = searchTerm;
            this.options.page = 1;
            this.fetchMedidas();
        },
        onDialogUpdate(value) {
            this.dialog = value;
            if (!value) {
                this.fetchMedidas();
            }
        }
    },
    mounted() {
        this.fetchMedidas();
    },
};
</script>