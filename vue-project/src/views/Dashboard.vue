<!-- ListView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import Button from 'primevue/button';


const inventory = ref([])

async function getInventory() {


  let { data: Inventory, error } = await supabase
  .from('Inventory')
  .select(`Name, Size, Description, Categories(Category),Quantity`)

  Inventory.map((item) => {
    item.Categories = item.Categories.Category
  })

  console.log(Inventory)
  inventory.value = Inventory;
}

onMounted(() => {
  getInventory()
})
</script>

<template>
  <div class="">
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
    <DataTable :value="inventory" stripedRows paginator :rows="5" :rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}">
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text></Button>
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-download" text />
      </template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-3xl text-900 font-bold">Inventory</span>
          <Button icon="pi pi-check" rounded raised />
        </div>
      </template>
      <Column field="Name" header="Item Name"></Column>
      <Column field="Size" header="Size"></Column>
      <Column field="Description" header="Description"></Column>
      <Column field="Categories" header="Categories"></Column>
      <Column field="Quantity" header="Quantity"></Column>
    </DataTable>
  </div>
</template>