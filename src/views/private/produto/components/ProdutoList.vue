<template>
    <div>
        <v-data-table-server 
            :headers="headers"
            :items="produtos" 
            :items-per-page="options.itemsPerPage"
            :server-items-length="totalProdutos"
            :loading="loading"
            :items-length="totalProdutos"
            :total-items="totalProdutos"
            @update:options="fetchProdutos"
            :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-first-last-page': true,
                'color': 'pink' // Define a cor da paginação como rosa
            }"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Produtos</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchProdutos">Atualizar</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="editProduto(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteProduto(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>

        <!-- Modal para Adicionar Produto -->
        <ProdutoAdd :values="editValues" v-model:dialog="dialog" @update:dialog="fetchProdutos" @close-modal="closeModal" />
    </div>
</template>

<script>
import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import ProdutoAdd from './ProdutoAdd.vue';

export default {
    components: {
        ProdutoAdd,
    },
    data() {
        return {
            dialog: false,
            produtos: [],
            totalProdutos: 0,
            options: {
                page: 1, // Página atual
                itemsPerPage: 10, // Quantidade de itens por página
            },
            totalPages: 0,
            loading: false,
            headers: [
                { title: 'id', key: 'id' },
                { title: 'Nome', key: 'nome' },
                {title: 'Categoria', key: 'categoria.nome'},
                { title: 'Ações', key: 'actions', sortable: false },
            ],
            editValues: null,
        };
    },
    watch: {
        options: {
            handler() {
                this.fetchProdutos();
            },
            deep: true,
        },
    },
    methods: {
        async fetchProdutos({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            try {
                const params = {
                    page: page - 1,
                    size: itemsPerPage,
                };
                const response = await ProdutoRepository.GetAll({ params });
                this.produtos = response.data.content;
                this.totalProdutos = response.data.page.totalElements;
                this.totalPages = response.data.page.totalPages;
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
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
        editProduto(item) {
            this.editValues = item;
            this.dialog = true;
        },
        async deleteProduto(item) {
            if (!confirm('Deseja realmente excluir este produto?')) return;

           await ProdutoRepository.Delete(item.id);
           this.fetchProdutos({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
        },
    },
    mounted() {
        this.fetchProdutos({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
    },
};
</script>