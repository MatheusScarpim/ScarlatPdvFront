<template>
    <v-dialog v-model="internalDialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ values ? 'Alterar Produto' : 'Adicionar Produto' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="form.nome" label="Nome" required></v-text-field>
                    <v-text-field v-model="form.dataValidade" label="Data de Validade" type="date"></v-text-field>
                    <v-text-field label="Valor" type="number" v-model="valor" step="0.01"></v-text-field>
                    <v-select v-model="form.categoriaId" :items="categorias" item-text="text" item-value="value"
                        label="Categoria" required></v-select>
                    <v-select v-model="form.medidaId" :items="medidas" item-text="title" item-value="value"
                        label="Medida" required></v-select>
                    <v-select v-model="form.fornecedorId" :items="fornecedores" item-text="title" item-value="value"
                        label="Fornecedor" required></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="handleSubmit">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import ProdutoRepository from '@/shared/http/repositories/produto/produto';
import MedidaRepository from '@/shared/http/repositories/medida/medida';
import CategoriaRepository from '@/shared/http/repositories/categoria/categoria';
import FornecedorRepository from '@/shared/http/repositories/fornecedor/fornecedor';

export default {
    name: 'ProdutoAdd',
    props: {
        dialog: {
            type: Boolean,
            required: true
        },
        values: {
            type: Object,
            required: false,
            default: null
        }
    },
    data() {
        return {
            form: {
                nome: '',
                categoriaId: '',
                medidaId: '',
                fornecedorId: '',
                dataValidade: null
            },
            medidas: [],
            categorias: [],
            fornecedores: []
        };
    },
    computed: {
        internalDialog: {
            get() {
                return this.dialog;
            },
            set(value) {
                this.$emit('update:dialog', value);
            }
        }
    },
    watch: {
        values: {
            handler() {
                if (this.values) {
                    this.form = this.values;
                } else {
                    this.form = {
                        nome: '',
                        categoriaId: '',
                        medidaId: '',
                        fornecedorId: '',
                        dataValidade: null
                    };
                }
            },
            deep: true
        },
    },
    mounted() {
        this.onGetAll();
    },
    methods: {
        async onGetAll() {
            await this.onGetCategorias();
            await this.onGetFornecedores();
            await this.onGetMedidas();
        },
        async onGetMedidas() {
            const req = await MedidaRepository.GetAll();
            const data = req.data.content.map(item => ({
                value: item.id.toString(),
                title: item.tipo
            }));
            this.medidas = data;
        },
        async onGetCategorias() {
            const req = await CategoriaRepository.GetAll();
            const data = req.data.content.map(item => ({
                value: item.id.toString(),
                title: item.nome
            }));
            this.categorias = data;
        },
        async onGetFornecedores() {
            const req = await FornecedorRepository.GetAll();
            const data = req.data.content.map(item => ({
                value: item.id,
                title: item.nome
            }));
            this.fornecedores = data;
        },
        async handleSubmit() {
            if (this.values) {
                // await ProdutoRepository.Update(this.values.id, this.form);
            } else {
                // await ProdutoRepository.Create(this.form);
            }
            console.log(this.form)
            // this.$emit('update:dialog', false);
        },
        close() {
            this.$emit('update:dialog', false);
        }
    }
};
</script>