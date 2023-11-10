<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const checkouts = ref();
const dt_check = ref();
// const checkout1 = ref({});
const loading = ref(true);

const expandedRows = ref([]);
const toast = useToast();

async function getCheckOuts() {
  let { data: Checkout, error } = await supabase
    .from('CheckedOut')
    .select(`Check_id, Customers(First_Name, Last_Name, Email), Inventory(Name, Description, Size), Check_Out_At, Check_In_At`)

  Checkout.map((check) => {
    let {Email, First_Name, Last_Name } = check.Customers;
    check.Check_Out_At = format(new Date(check.Check_Out_At), 'eee, dd-MMM-yy h:mm a')
    if (check.Check_In_At) {
      check.Check_In_At = format(new Date(check.Check_In_At), 'eee, dd-MMM-yy h:mm a')
    }
    check.Email = Email;
    check.Name = First_Name + ' ' + Last_Name;
    check.Inventory = [check.Inventory]
  })

  loading.value = false;
  checkouts.value = Checkout;
  // console.log(checkouts)
}

const setCheckIn = async (id, time) => {

  console.log(id, time)

  let dateHolder = new Date(time).toUTCString()

  let { data, error } = await supabase
  .from('CheckedOut')
  .update({ 'Check_In_At': dateHolder })
  .eq('Check_id', id)

  console.log(data, error)

  getCheckOuts()
}

const exportCSV = () => {
  dt_check.value.exportCSV();
};

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Item Checked Out', detail: event.data.Name, life: 3000 });
};
const onRowCollapse = (event) => {
  toast.add({ severity: 'success', summary: 'Closing', detail: event.data.Name, life: 3000 });
};
const expandAll = () => {
  expandedRows.value = checkouts.value.filter((s) => s.Name);
};
const collapseAll = () => {
  expandedRows.value = null;
};

onMounted(() => {
  getCheckOuts()
})
</script>

<template>
  <div class="card">
    <h1 class="text-3xl f-text pb-2">Check Outs</h1>

    <DataTable ref="dt_check" v-model:expandedRows="expandedRows" :value="checkouts" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse"
      scrollable scrollHeight="500px"
      removableSort :paginator="true" :rows="5" :loading="loading"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">

      <Toolbar class="mb-4">
        <template #start>
          <ButtonArrow label="No Check In" icon="pi pi-filter" severity="help" @click="" />
        </template>
        <!-- <template #center>
          <ButtonArrow label="Additional Features" icon="pi pi-upload" severity="help" @click="" />
        </template> -->
        <template #end>
          <ButtonArrow label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <template #empty> No Check Outs Found.</template>

      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0 text-3xl f-text">Manage Check Outs</h4>
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
      <Column field="Name" sortable header="Name"></Column>
      <Column field="Email" sortable header="Email"></Column>
      <Column field="Check_Out_At" sortable class="tracking-wide" header="Checked Out At"></Column>
      <Column field="Check_In_At" sortable header="Checked In At">
        <template #body="slotProps">
          <div class="flex flex-nowrap gap-3" v-if="!slotProps.data.Check_In_At">
            <Calendar id="date" v-model="slotProps.data.datetime" showIcon showTime hourFormat="12" :maxDate="new Date()"/>
            <ButtonArrow icon="pi pi-check" @click="setCheckIn(slotProps.data.Check_id, slotProps.data.datetime)"/>
          </div>
          <h1 v-else>{{ slotProps.data.Check_In_At }}</h1>
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="h-[140px]">
          <DataTable :value="slotProps.data.Inventory" class="">
            <Column field="Name" header="Item Name"></Column>
            <Column field="Size" header="Size"></Column>
            <Column field="Description" header="Description"></Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>