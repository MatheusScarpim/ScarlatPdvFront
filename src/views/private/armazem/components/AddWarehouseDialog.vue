<!-- src/components/AddWarehouseDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Criar Novo Armazém</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="newWarehouse.name"
            label="Nome do Armazém"
            required
          ></v-text-field>
          <v-text-field
            v-model="newWarehouse.location"
            label="Localização"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="addWarehouse">Criar</v-btn>
        <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddWarehouseDialog',
  props: {
    value: Boolean,
  },
  data() {
    return {
      newWarehouse: {
        name: '',
        location: '',
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
    addWarehouse() {
      if (this.newWarehouse.name && this.newWarehouse.location) {
        this.$emit('warehouse-added', { ...this.newWarehouse });
        this.newWarehouse = { name: '', location: '' };
        this.dialog = false;
      } else {
        alert('Preencha os campos obrigatórios!');
      }
    },
  },
};
</script>