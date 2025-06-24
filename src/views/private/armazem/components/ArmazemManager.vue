<!-- WarehouseManager.vue -->
<template>
  <warehouse-list :warehouses="warehouses" @add-product="openAddDialog" @view-products="openViewDialog" />
</template>

<script>
import WarehouseList from './ArmazemList.vue';
import ArmazemRepository from '@/shared/http/repositories/armazem/armazem';

export default {
  name: 'WarehouseManager',
  components: {
    WarehouseList,
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
      selectedWarehouse: null,
    };
  },
  mounted() {
  },
  methods: {
    async GetArmazens() {
      try {
        const response = await ArmazemRepository.GetAll();
        const data = response.data.content;
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    },
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
  },
};
</script>

<style scoped>
.v-container {
  padding: 20px;
}
</style>