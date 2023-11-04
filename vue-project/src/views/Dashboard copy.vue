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

  console.log(Inventory)
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
      <DataTable v-model:filters="filters" :value="inventory" stripedRows paginator removableSort sortMode="multiple"
        :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" dataKey="id" filterDisplay="menu"
        :loading="loading"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :globalFilterFields="['Name', 'Size', 'Description', 'Categories']" class="border-2 border-black rounded-sm">
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <!-- <template #paginatorstart>
          <Button type="button" icon="pi pi-refresh" text />
        </template>
        <template #paginatorend>
          <Button type="button" icon="pi pi-download" text />
        </template> -->
        <template #header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.value" placeholder="Keyword Search" />
            </span>
          </div>
        </template>
        <Column field="Name" sortable header="Item Name"></Column>
        <Column field="Size" sortable header="Size"></Column>
        <Column field="Description" sortable header="Description"></Column>
        <Column field="Categories" sortable header="Categories"></Column>
        <Column field="Quantity" sortable header="Quantity"></Column>
      </DataTable>
    </div>
    <Footer />
  </div>
</template>