<template>
    <v-dialog v-model="internalDialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ values ? 'Alterar Produto' : 'Adicionar Produto' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="form.nome" label="Nome" required :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="form.dataValidade" label="Data de Validade" type="date"></v-text-field>
                    <v-number-input :precision="2" hide-details="auto"></v-number-input>
                    <v-text-field v-model="form.qtdMedida" type="number" step="0.01" label="Quantidade" hide-details="auto"
                        @blur="formatQtdMedida"></v-text-field>

                    <v-text-field v-model="form.preco" type="number" step="0.01" label="Preço" hide-details="auto"
                        @blur="formatPreco"></v-text-field>

                    <v-text-field v-model="form.codBarra" label="Código de barra" ></v-text-field>
                    <v-text-field v-model="form.ncm" label="Ncm" ></v-text-field>
                    <v-text-field v-model="form.codCest" label="Cod. Cest" ></v-text-field>



                    <v-select v-model="form.categoriaId" :items="categorias" item-text="title" item-value="value"
                        label="Categoria" required :rules="[rules.required]"></v-select>
                    <v-select v-model="form.medidaId" :items="medidas" item-text="title" item-value="value"
                        label="Medida" required :rules="[rules.required]"></v-select>
                    <v-select v-model="form.fornecedorId" :items="fornecedores" item-text="title" item-value="value"
                        label="Fornecedor" required :rules="[rules.required]"></v-select>
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
                dataValidade: null,
                qtdMedida: 0.0,  
                preco: 0.0,
                codBarra: '',
                ncm: '',
                codCest: ''
            },
            medidas: [],
            categorias: [],
            fornecedores: [],
            valid: false,
            rules: {
                required: value => !!value || 'Campo obrigatório'
            }
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
        },
    },
    watch: {
        values: {
            handler() {
                if (this.values) {
                    this.form = {
                        ...this.values,
                        qtdMedida: parseFloat(this.values.qtdMedida) || 0.0,
                        preco: parseFloat(this.values.preco) || 0.0
                    };
                } else {
                    this.form = {
                        id: '',
                        nome: '',
                        categoriaId: '',
                        medidaId: '',
                        fornecedorId: '',
                        dataValidade: null,
                        qtdMedida: 0.0,
                        preco: 0.0,
                        codBarra: '',
                        ncm: '',
                        codCest: ''
                    };
                }
            },
            deep: true
        }
    },
    mounted() {
        this.onGetAll();
    },
    methods: {
        formatQtdMedida() {
            this.form.qtdMedida = parseFloat(this.form.qtdMedida).toFixed(2);
        },
        formatPreco() {
            this.form.preco = parseFloat(this.form.preco).toFixed(2);
        },
        async onGetAll() {
            await this.onGetCategorias();
            await this.onGetFornecedores();
            await this.onGetMedidas();
        },
        async onGetMedidas() {
            const req = await MedidaRepository.GetAll();
            this.medidas = req.data.content.map(item => ({
                value: item.id.toString(),
                title: item.tipo
            }));
        },
        async onGetCategorias() {
            const req = await CategoriaRepository.GetAll();
            this.categorias = req.data.content.map(item => ({
                value: item.id.toString(),
                title: item.nome
            }));
        },
        async onGetFornecedores() {
            const req = await FornecedorRepository.GetAll();
            this.fornecedores = req.data.content.map(item => ({
                value: item.id,
                title: item.nome
            }));
        },
        async handleSubmit() {
            const { valid } = await this.$refs.form.validate();
            if (valid) {
                if (this.values) {
                    await ProdutoRepository.Update(this.values.id, this.form);
                } else {
                    await ProdutoRepository.Create(this.form);
                }
                this.$emit('update:dialog', false);
            } else {
                console.log('Formulário inválido');
            }
        },
        close() {
            this.$emit('update:dialog', false);
        }
    }
};
</script>