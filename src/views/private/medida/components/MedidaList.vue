<template>
    <div>
        <v-data-table-server 
            :headers="headers"
            :items="medidas" 
            :items-per-page="options.itemsPerPage"
            :server-items-length="totalMedidas"
            :loading="loading"
            :items-length="totalMedidas"
            :total-items="totalMedidas"
            @update:options="fetchMedidas"
            :footer-props="{
                'items-per-page-options': [5, 10, 15],
                'show-first-last-page': true,
                'color': 'pink' // Define a cor da paginação como rosa
            }"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Medidas</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openModal">Adicionar</v-btn>
                    <v-btn color="primary" @click="fetchMedidas">Atualizar</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="editMedida(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteMedida(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>

        <!-- Modal para Adicionar Medida -->
        <MedidaAdd :values="editValues" v-model:dialog="dialog" @update:dialog="fetchMedidas" @close-modal="closeModal" />
    </div>
</template>

<script>
import MedidaRepository from '@/shared/http/repositories/Medida/medida';
import MedidaAdd from './MedidaAdd.vue';

export default {
    components: {
        MedidaAdd,
    },
    data() {
        return {
            dialog: false,
            medidas: [],
            totalMedidas: 0,
            options: {
                page: 1, // Página atual
                itemsPerPage: 10, // Quantidade de itens por página
            },
            totalPages: 0,
            loading: false,
            headers: [
                { title: 'id', key: 'id' },
                { title: 'Tipo', key: 'tipo' },
                { title: 'Abreviação', key: 'abreviacao' },
                { title: 'Ações', key: 'actions', sortable: false },
            ],
            editValues: null,
        };
    },
    watch: {
        options: {
            handler() {
                this.fetchMedidas();
            },
            deep: true,
        },
    },
    methods: {
        async fetchMedidas({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            try {
                const params = {
                    page: page - 1,
                    size: itemsPerPage,
                };
                const response = await MedidaRepository.GetAll({ params });
                this.medidas = response.data.content;
                this.totalMedidas = response.data.page.totalElements;
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
        editMedida(item) {
            this.editValues = item;
            this.dialog = true;
        },
        async deleteMedida(item) {
            if (!confirm('Deseja realmente excluir este medida?')) return;

           await MedidaRepository.Delete(item.id);
           this.fetchMedidas({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
        },
    },
    mounted() {
        this.fetchMedidas({ page: this.options.page, itemsPerPage: this.options.itemsPerPage });
    },
};
</script>