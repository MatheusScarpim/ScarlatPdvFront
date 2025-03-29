<!-- AddProductDialog.vue -->
<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Adicionar Produto ao Armazém: {{ warehouse?.name }}</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="newProduct.name"
              label="Nome do Produto"
              required
            ></v-text-field>
            <v-text-field
              v-model="newProduct.quantity"
              label="Quantidade"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              v-model="newProduct.category"
              label="Categoria"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="addProduct">Adicionar</v-btn>
          <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'AddProductDialog',
    props: {
      value: Boolean, // Para v-model
      warehouse: Object,
    },
    data() {
      return {
        newProduct: {
          name: '',
          quantity: 0,
          category: '',
        },
      };
    },
    computed: {
      dialog: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        },
      },
    },
    methods: {
      addProduct() {
        if (this.newProduct.name && this.newProduct.quantity) {
          this.$emit('product-added', { ...this.newProduct });
          this.newProduct = { name: '', quantity: 0, category: '' };
          this.dialog = false;
        } else {
          alert('Preencha os campos obrigatórios!');
        }
      },
    },
  };
  </script>