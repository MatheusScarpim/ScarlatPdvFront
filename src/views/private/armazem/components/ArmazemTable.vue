<!-- src/components/ArmazemTable.vue -->
<template>
    <v-data-table
      :headers="warehouseHeaders"
      :items="warehouses"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.productCount }}</td>
          <td>
            <v-btn
              icon
              small
              color="primary"
              @click="$emit('add-product', item)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="green"
              @click="$emit('view-products', item)"
              :disabled="item.productCount === 0"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </template>
  
  <script>
  export default {
    name: 'ArmazemTable',
    props: {
      warehouses: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        warehouseHeaders: [
          { text: 'Nome', value: 'name' },
          { text: 'Localização', value: 'location' },
          { text: 'Qtd. Produtos', value: 'productCount' },
          { text: 'Ações', value: 'actions', sortable: false },
        ],
      };
    },
  };
  </script>