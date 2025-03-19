<template>
    <div>
        <v-data-table-server 
            :headers="headers"
            :items="categorias" 
            :items-per-page="options.itemsPerPage"
            :server-items-length="totalCategorias"
            :loading="loading"
            :items-length="totalCategorias"
            :total-items="totalCategorias"
            @update:options="fetchCategorias"
            :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-first-last-page': true,
                'color': 'pink' // Define a cor da paginação como rosa
            }"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Categorias</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchCategorias">Atualizar</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="editCategoria(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteCategoria(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>

        <!-- Modal para Adicionar Categoria -->
        <CategoriaAdd :values="editValues" v-model:dialog="dialog" @update:dialog="fetchCategorias" @close-modal="closeModal" />
    </div>
</template>

<script>
import CategoriaRepository from '@/shared/http/repositories/categoria/categoria';
import CategoriaAdd from './CategoriaAdd.vue';

export default {
    components: {
        CategoriaAdd,
    },
    data() {
        return {
            dialog: false,
            categorias: [],
            totalCategorias: 0,
            options: {
                page: 1, // Página atual
                itemsPerPage: 10, // Quantidade de itens por página
            },
            totalPages: 0,
            loading: false,
            headers: [
                { title: 'id', key: 'id' },
                { title: 'Nome', key: 'nome' },
                { title: 'Descrição', key: 'descricao'},
                { title: 'Ações', key: 'actions', sortable: false },
            ],
            editValues: null,
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
        async fetchCategorias({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            try {
                const params = {
                    page: page - 1,
                    size: itemsPerPage,
                };
                const response = await CategoriaRepository.GetAll({ params });
                this.categorias = response.data.content;
                this.totalCategorias = response.data.page.totalElements;
                this.totalPages = response.data.page.totalPages;
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
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
        editCategoria(item) {
            this.editValues = item;
            this.dialog = true;
        },
        async deleteCategoria(item) {
            if (!confirm('Deseja realmente excluir esta categoria?')) return;

           await CategoriaRepository.Delete(item.id);
           this.fetchCategorias({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
        },
    },
    mounted() {
        this.fetchCategorias({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
    },
};
</script>