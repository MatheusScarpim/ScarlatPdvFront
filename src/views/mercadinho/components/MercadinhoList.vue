<template>
    <div>
        <v-data-table-server 
            :headers="headers"
            :items="medidas" 
            :items-per-page="options.itemsPerPage"
            :server-items-length="totalMercadinhos"
            :loading="loading"
            :items-length="totalMercadinhos"
            :total-items="totalMercadinhos"
            @update:options="fetchMercadinhos"
            :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-first-last-page': true,
                'color': 'pink' // Define a cor da paginação como rosa
            }"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Mercadinhos</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchMercadinhos">Atualizar</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="editMercadinho(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteMercadinho(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>

        <!-- Modal para Adicionar Mercadinho -->
        <MercadinhoAdd :values="editValues" v-model:dialog="dialog" @update:dialog="fetchMercadinhos" @close-modal="closeModal" />
    </div>
</template>

<script>
import MercadinhoRepository from '@/shared/http/repositories/mercadinho/mercadinho';
import MercadinhoAdd from './MercadinhoAdd.vue';

export default {
    components: {
        MercadinhoAdd,
    },
    data() {
        return {
            dialog: false,
            medidas: [],
            totalMercadinhos: 0,
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
                this.fetchMercadinhos();
            },
            deep: true,
        },
    },
    methods: {
        async fetchMercadinhos({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            try {
                const params = {
                    page: page - 1,
                    size: itemsPerPage,
                };
                const response = await MercadinhoRepository.GetAll({ params });
                this.medidas = response.data.content;
                this.totalMercadinhos = response.data.page.totalElements;
                this.totalPages = response.data.page.totalPages;
            } catch (error) {
                console.error('Erro ao buscar medidas:', error);
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
        editMercadinho(item) {
            this.editValues = item;
            this.dialog = true;
        },
        async deleteMercadinho(item) {
            if (!confirm('Deseja realmente excluir este medida?')) return;

           await MercadinhoRepository.Delete(item.id);
           this.fetchMercadinhos({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
        },
    },
    mounted() {
        this.fetchMercadinhos({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
    },
};
</script>