<template>
    <v-dialog v-model="internalDialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Adicionar Armazem</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="form.nome" label="Nome" required></v-text-field>
                    <v-text-field v-model="form.email" label="Email" required></v-text-field>
                    <v-text-field v-model="form.telefone" label="Telefone" required></v-text-field>
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
export default {
    name: 'ArmazemAdd',
    props: {
        dialog: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            form: {
                nome: '',
                email: '',
                telefone: ''
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
    methods: {
        handleSubmit() {
            // Simulação de envio do formulário
            console.log("Armazem salvo:", this.form);
            this.$emit('update:dialog', false);
        },
        close() {
            this.$emit('update:dialog', false);
        }
    }
};
</script>
