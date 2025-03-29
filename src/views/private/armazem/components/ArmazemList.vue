<!-- src/components/ArmazemList.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addWarehouseDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Novo Armazém
        </v-btn>
      </v-card-title>
      <armazem-table
        :warehouses="warehouses"
        @add-product="openAddDialog"
        @view-products="openViewDialog"
      />
      <add-product-dialog
        v-model="addDialog"
        :warehouse="selectedWarehouse"
        @product-added="updateWarehouse"
      />
      <view-products-dialog
        v-model="viewDialog"
        :warehouse="selectedWarehouse"
      />
      <add-warehouse-dialog
        v-model="addWarehouseDialog"
        @warehouse-added="addNewWarehouse"
      />
    </v-card>
  </v-container>
</template>

<script>
import ArmazemTable from './ArmazemTable.vue';
import AddProductDialog from './AddProductDialog.vue';
import ViewProductsDialog from './ViewProductsDialog.vue';
import AddWarehouseDialog from './AddWarehouseDialog.vue';

export default {
  name: 'ArmazemList',
  components: {
    ArmazemTable,
    AddProductDialog,
    ViewProductsDialog,
    AddWarehouseDialog,
  },
  data() {
    return {
      warehouses: [
        { id: 1, name: 'Armazém Central', location: 'São Paulo', products: [], productCount: 0 },
        { id: 2, name: 'Armazém Norte', location: 'Manaus', products: [], productCount: 0 },
        { id: 3, name: 'Armazém Sul', location: 'Porto Alegre', products: [], productCount: 0 },
      ],
      addDialog: false,
      viewDialog: false,
      addWarehouseDialog: false,
      selectedWarehouse: null,
    };
  },
  methods: {
    openAddDialog(warehouse) {
      this.selectedWarehouse = warehouse;
      this.addDialog = true;
    },
    openViewDialog(warehouse) {
      this.selectedWarehouse = warehouse;
      this.viewDialog = true;
    },
    updateWarehouse(newProduct) {
      if (this.selectedWarehouse && newProduct.name && newProduct.quantity) {
        this.selectedWarehouse.products.push(newProduct);
        this.selectedWarehouse.productCount = this.selectedWarehouse.products.length;
      }
    },
    addNewWarehouse(newWarehouse) {
      if (newWarehouse.name && newWarehouse.location) {
        const newId = this.warehouses.length + 1;
        this.warehouses.push({
          id: newId,
          name: newWarehouse.name,
          location: newWarehouse.location,
          products: [],
          productCount: 0,
        });
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  padding: 20px;
}
</style>