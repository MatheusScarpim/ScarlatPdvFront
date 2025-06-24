<template>
    <div>
        <DataGrid
            title="Lista de Produtos"
            :items="produtos"
            :columns="columns"
            :loading="loading"
            :current-page="options.page"
            :items-per-page="options.itemsPerPage"
            :total-items="totalProdutos"
            @add="openModal"
            @edit="editProduto"
            @delete="deleteProduto"
            @refresh="fetchProdutos"
            @page-change="onPageChange"
            @items-per-page-change="onItemsPerPageChange"
            @search="onSearch"
        >
            <!-- Slot customizado para preço -->
            <template #item.preco="{ value }">
                <span class="price-value">{{ formatCurrency(value) }}</span>
            </template>
        </DataGrid>

        <!-- Modal para Adicionar Produto -->
        <ProdutoAdd :values="editValues" v-model:dialog="dialog" @update:dialog="onDialogUpdate" @close-modal="closeModal" />
    </div>
</template>

<script>
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import ProdutoAdd from './ProdutoAdd.vue';
import { DataGrid } from '@/components/Grid';

export default {
    components: {
        ProdutoAdd,
        DataGrid
    },
    data() {
        return {
            dialog: false,
            produtos: [],
            totalProdutos: 0,
            options: {
                page: 1,
                itemsPerPage: 10,
            },
            loading: false,
            columns: [
                { key: 'id', title: 'ID' },
                { key: 'nome', title: 'Nome' },
                { key: 'categoria.nome', title: 'Categoria' },
                { key: 'preco', title: 'Preço', type: 'currency' },
                { key: 'qtdMedida', title: 'Quantidade' },
                { key: 'codBarra', title: 'Código de Barras' }
            ],
            editValues: null,
            searchTerm: ''
        };
    },
    methods: {
        async fetchProdutos() {
            this.loading = true;
            try {
                const params = {
                    page: this.options.page - 1,
                    size: this.options.itemsPerPage,
                };
                
                if (this.searchTerm) {
                    params.search = this.searchTerm;
                }
                
                const response = await ProdutoRepository.GetAll({ params });
                this.produtos = response.data.content;
                this.totalProdutos = response.data.page.totalElements;
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
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
        editProduto(item) {
            this.editValues = { ...item };
            this.dialog = true;
        },
        async deleteProduto(item) {
            if (!confirm('Deseja realmente excluir este produto?')) return;

            try {
                await ProdutoRepository.Delete(item.id);
                this.fetchProdutos();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        },
        onPageChange(page) {
            this.options.page = page;
            this.fetchProdutos();
        },
        onItemsPerPageChange(itemsPerPage) {
            this.options.itemsPerPage = itemsPerPage;
            this.options.page = 1;
            this.fetchProdutos();
        },
        onSearch(searchTerm) {
            this.searchTerm = searchTerm;
            this.options.page = 1;
            this.fetchProdutos();
        },
        onDialogUpdate(value) {
            this.dialog = value;
            if (!value) {
                this.fetchProdutos();
            }
        },
        formatCurrency(value) {
            if (!value) return 'R$ 0,00';
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }
    },
    mounted() {
        this.fetchProdutos();
    },
};
</script>

<style scoped>
.price-value {
    font-weight: 600;
    color: #48bb78;
}
</style>