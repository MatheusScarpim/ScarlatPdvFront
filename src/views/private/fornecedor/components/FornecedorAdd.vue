<template>
    <v-dialog v-model="internalDialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ values ? 'Alterar Fornecedor' : 'Adicionar Fornecedor' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="form.nome" label="Nome" required></v-text-field>
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

import FornecedorRepository from '@/shared/http/repositories/fornecedor/fornecedor';

export default {
    name: 'FornecedorAdd',
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
        }
    },
    watch: {
        values: {
            handler() {
                if(this.values) {
                    this.form = this.values;
                } else {
                    this.form = {
                        nome: '',
                    };
                }
            },
            deep: true
        }
    },
    methods: {
        async handleSubmit() {
            if(this.values) {
                await FornecedorRepository.Update(this.values.id, this.form);
            } else {
                await FornecedorRepository.Create(this.form);
            }
            this.$emit('update:dialog', false);
        },
        close() {
            this.$emit('update:dialog', false);
        }
    }
};
</script>
