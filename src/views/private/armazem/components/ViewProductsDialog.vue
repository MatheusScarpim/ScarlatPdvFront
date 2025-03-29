<!-- ViewProductsDialog.vue -->
<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Produtos do Armazém: {{ warehouse?.name }}</v-card-title>
        <v-card-text>
          <v-list v-if="warehouse?.products.length">
            <v-list-item v-for="(product, index) in warehouse.products" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ product.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Quantidade: {{ product.quantity }} | Categoria: {{ product.category || 'N/A' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info" text>Nenhum produto cadastrado neste armazém.</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" text @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'ViewProductsDialog',
    props: {
      value: Boolean, // Para v-model
      warehouse: Object,
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
  };
  </script>