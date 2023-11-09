<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const shipments = ref();
const dt_ship = ref();
// const shipment = ref({});
const loading = ref(true);

const expandedRows = ref([]);
const toast = useToast();

async function getShipments() {
  let { data: Shipments, error } = await supabase
    .from('Shipments')
    .select(`Ship_id, Ship_Description, Arrived_At, Shipment_items(*))`)

  Shipments.map((shipment) => {
    if (shipment.Shipment_items) {
      for (let item of shipment.Shipment_items) {
        if (!item.size) item.size = 0;
        if (!item.description) item.description = 'none';
      }
    }
  })

  loading.value = false;
  shipments.value = Shipments;
  console.log(shipments)
}

const exportCSV = () => {
  dt_ship.value.exportCSV();
};

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.Ship_id, life: 3000 });
};
const onRowCollapse = (event) => {
  toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.Ship_id, life: 3000 });
};
const expandAll = () => {
  expandedRows.value = shipments.value.filter((s) => s.Ship_id);
};
const collapseAll = () => {
  expandedRows.value = null;
};

onMounted(() => {
  getShipments()
})
</script>

<template>
  <div class="card">
    <h1 class="text-3xl f-text pb-2">Shipments</h1>
    <DataTable ref="dt_ship" v-model:expandedRows="expandedRows" :value="shipments" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse"
      scrollable scrollHeight="500px"
      removableSort :paginator="true" :rows="5" :loading="loading"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">

      <Toolbar class="mb-4">
        <template #start>
          <ButtonArrow label="Quantity History" icon="pi pi-upload" severity="help" @click="" />
        </template>
        <template #center>
          <ButtonArrow label="Additional Features" icon="pi pi-upload" severity="help" @click="" />
        </template>
        <template #end>
          <ButtonArrow label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <template #empty> No shipments Found.</template>

      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0 text-3xl f-text">Manage Shipments</h4>
          <div class="flex flex-wrap justify-content-end gap-2">
            <ButtonArrow text icon="pi pi-plus" label="Expand All" @click="expandAll" />
            <ButtonArrow text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
        </div>
      </template>

      <Column expander style="width: 5rem"></Column>
      <Column field="Ship_id" sortable header="Shipment ID"></Column>
      <Column field="Ship_Description" sortable header="Shipment Serial#"></Column>
      <Column field="Arrived_At" sortable header="Arrival Date"></Column>

      <template #expansion="slotProps">
        <div class="h-min">
          <h5 class="p-2">Orders for Shipment {{ slotProps.data.Ship_id }}</h5>
          <DataTable :value="slotProps.data.Shipment_items" class="h-min">
            <Column field="Item" header="Item Name"></Column>
            <Column field="size" header="Size"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="quantity" header="Quanitity"></Column>
            <Column field="PPU" header="Price/Unit"></Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>