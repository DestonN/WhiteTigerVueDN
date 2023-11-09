<!-- ListView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { FilterMatchMode } from 'primevue/api';

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const inventory = ref([]);
const dt = ref();
const item = ref({});
const itemDialog = ref(false);
const loading = ref(true);

async function getInventory() {
  let { data: Inventory, error } = await supabase
    .from('Inventory')
    .select(`Name, Size, Description, Categories(Category),Quantity`)

  Inventory.map((item) => {
    item.Categories = item.Categories.Category
    if (!item.Size) item.Size = 0
    if (!item.Description) item.Description = 'None'
  })

  // console.log(Inventory)
  loading.value = false;
  inventory.value = Inventory;
}

const editQuantity = (prod) => {
  // console.log(prod)
  item.value = { ...prod };
  itemDialog.value = true;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

onMounted(() => {
  getInventory()
})
</script>

<template>
  <div class="card">
    <h1 class="text-3xl f-text pb-2">Inventory</h1>
    <DataTable ref="dt" dataKey="id" :value="inventory" scrollable scrollHeight="500px" removableSort :paginator="true" :rows="5" :loading="loading"
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

      <template #empty> No Items Found.</template>

      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0 text-3xl f-text">Manage Inventory</h4>
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
        </div>
      </template>

      <Column field="Name" sortable header="Item Name"></Column>
      <Column field="Size" sortable header="Size"></Column>
      <Column field="Description" sortable header="Description"></Column>
      <Column field="Categories" sortable header="Categories"></Column>
      <Column field="Quantity" sortable header="Quantity"></Column>
      <!-- <Column field="inventoryStatus" header="Status" sortable style="min-width:12rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
        </template>
      </Column> -->
      <Column :exportable="false" style="min-width:2rem">
        <template #body="slotProps">
          <ButtonArrow icon="pi pi-pencil" outlined rounded class="mr-2" @click="editQuantity(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>