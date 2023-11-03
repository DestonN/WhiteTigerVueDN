<!-- ListView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Button from 'primevue/button';


const inventory = ref([])

async function getInventory() {


  let { data: Inventory, error } = await supabase
  .from('Inventory')
  .select(`Name, Size, Description, Categories(Category),Quantity`)

  Inventory.map((item) => {
    item.Categories = item.Categories.Category
    if (!item.Size) item.Size = 0
    if (!item.Description) item.Description = 'None'
  })

  inventory.value = Inventory;
}

onMounted(() => {
  getInventory()
})
</script>

<template>
  <div class="max-w-full h-full grid grid-cols-1 grid-rows-3">
    <Header />
    <div class="flex justify-center max-w-full">
      <DataTable :value="inventory" stripedRows paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        class="border-2 border-black rounded-sm">
        <template #paginatorstart>
          <div class="border-4">
            <h1>Hello</h1>
          </div>
        </template>
        <template #header>
          <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-3xl text-900 font-bold">Inventory</span>
          </div>
        </template>
        <Column field="Name" header="Item Name"></Column>
        <Column field="Size" header="Size"></Column>
        <Column field="Description" header="Description"></Column>
        <Column field="Categories" header="Categories"></Column>
        <Column field="Quantity" header="Quantity"></Column>
      </DataTable>
    </div>
    <Footer />
  </div>
</template>