<!-- ListView.vue -->
<script setup>
import { ref, onMounted, isMemoSame } from 'vue'
import { supabase } from '../supabase'
import { FilterMatchMode } from 'primevue/api';
import { format } from 'date-fns';

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const inventory = ref([]);
const dt = ref();
const item = ref({});
const itemDialog = ref(false);
const itemCheckDialog = ref(false);
const QuantityHistory = ref(false);
const loading = ref(true);
const submitted = ref(false);
const testQuan = ref(0)
const expandedRows = ref([]);


async function getInventory() {
  let { data: Inventory, error } = await supabase
    .from('Inventory')
    .select(`item_id, Name, Size, Description, Categories(Category),Quantity, InventoryHistory(Date_changed, quan)`)

  Inventory.map((item) => {
    item.Categories = item.Categories.Category
    if (item.InventoryHistory) {
      item.InventoryHistory.map((a) => {
        a.Date_changed = format(new Date(a.Date_changed), 'eee, dd-MMM-yy h:mm a')
      })
    }
    if (!item.Size) item.Size = 0
    if (!item.Description) item.Description = 'None'
  })

  console.log(Inventory)
  loading.value = false;
  inventory.value = Inventory;
}

const editQuantity = (prod) => {
  item.value = { ID: prod.item_id, Name: prod.Name, Quantity: prod.Quantity, quan: 0 };
  testQuan.value = prod.Quantity * -1;
  itemDialog.value = true;
};
const createCheckOut = (prod) => {
  submitted.value = false;
  item.value = { ID: prod.item_id, Name: prod.Name, quan: -1 };
  itemCheckDialog.value = true;
};

const hideItemDialog = () => {
  itemDialog.value = false;
};

const hideCheckDialog = () => {
  submitted.value = false;
  itemCheckDialog.value = false;
};

const saveQuantity = async () => {

  UpdateQuantity(item.value.ID, item.value.quan)
  .then(setTimeout(() => getInventory(), 500));

  itemDialog.value = false;
  item.value = {};
};

const UpdateQuantity = async (id, q) => {
  const { data, error } = await supabase.rpc('update_inventory_quantity', { p_item_id: id, p_quantity_change: q })
}

const emit = defineEmits(['Checkout'])

const saveCheckOut = async () => {
  submitted.value = true;

  if (!item.value.fName || !item.value.lName || !item.value.email || !item.value.datetime) return;

  let dateHolder = new Date(item.value.datetime).toUTCString()
  // console.log(dateHolder)

  UpdateQuantity(item.value.ID, item.value.quan)

  const { data, error } = await supabase.rpc('checkout', { p_first_name: item.value.fName, p_last_name: item.value.lName, p_email:item.value.email, p_item_id: item.value.ID, p_check_out_at: dateHolder })

  // console.log(data, error)

  itemCheckDialog.value = false;
  item.value = {};

  //TODO redirect to CheckOut Tab
  emit('Checkout')
};

const QuantityHist = () => {
  console.log(QuantityHistory);
  QuantityHistory.value = !QuantityHistory.value
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
    <DataTable ref="dt" v-model:expandedRows="expandedRows" :value="inventory" scrollable scrollHeight="500px" removableSort :paginator="true"
      :rows="5" :loading="loading" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">

      <Toolbar class="mb-4">
        <template #start>
          <!-- TODO Create Table for Quantity History -->
          <ButtonArrow label="Quantity History" icon="pi pi-chevron-right" severity="help" v-if="!QuantityHistory"
            @click="QuantityHist()" />
          <ButtonArrow label="Quantity History" icon="pi pi-chevron-down" severity="help" v-else
            @click="QuantityHist()" />
        </template>
        <!-- <template #center>
          TODO Create Banner for less then 5 Quantity items
          <ButtonArrow label="Low Stock" icon="pi pi-flag" severity="danger" @click="" />
        </template> -->
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
      <Column :exportable="false" header="Stock Edit" style="min-width:fit-content">
        <template #body="slotProps">
          <ButtonArrow icon="pi pi-arrows-v" outlined rounded class="mr-2" @click="editQuantity(slotProps.data)" />
        </template>
      </Column>
      <Column expander style="width: 5rem" v-if="QuantityHistory"></Column>
      <Column :exportable="false" header="Check Out" style="min-width:fit-content" v-else>
        <template #body="slotProps">
          <ButtonArrow icon="pi pi-arrow-circle-up" outlined rounded class="mr-2"
            @click="createCheckOut(slotProps.data)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="h-min">
          <h5 class="p-2">Changes in Quantity</h5>
          <DataTable :value="slotProps.data.InventoryHistory" class="h-min">
            <Column field="Date_changed" header="Date Updated"></Column>
            <Column field="quan" header="Quantity Changed"></Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>

  <Dialog v-model:visible="itemDialog" :style="{ width: '450px' }" header="Stock Details" :modal="true" class="p-fluid">
    <div class="flex justify-evenly p-3">
      <div class="flex flex-col justify-center gap-4">
        <label class="text-xl">Item Name: {{ item.Name }}</label>
        <label class="text-xl">Current Quantity: {{ item.Quantity }}</label>
        <label class="text-xl">Updated Quantity: {{ item.Quantity + item.quan }}</label>
      </div>
      <div class="flex flex-wrap gap-3">
        <InputNumber v-model="item.quan" showButtons buttonLayout="vertical" style="width: 4rem" :min="testQuan"
          decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary"
          incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
      </div>
    </div>
    <template #footer>
      <ButtonArrow label="Cancel" icon="pi pi-times" text @click="hideItemDialog" />
      <ButtonArrow label="Save" icon="pi pi-check" text @click="saveQuantity" />
    </template>
  </Dialog>

  <Dialog v-model:visible="itemCheckDialog" :style="{ width: '450px' }" header="Check Out" :modal="true" class="p-fluid">
    <div class="flex flex-col gap-4 p-3">
      <div class="field">
        <label for="iName" class="text-xl">Item Being Checked Out:</label>
        <h1 id="iName">{{ item.Name }}</h1>
      </div>
      <div class="field">
        <label for="fName">First Name</label>
        <InputText id="fname" v-model.trim="item.fName" required="true" autofocus
          :class="{ 'p-invalid': submitted && !item.fName }" />
          <small class="p-error" v-if="submitted && !item.fName">First Name is required.</small>
      </div>
      <div>
        <label for="lName">Last Name</label>
        <InputText id="lName" v-model.trim="item.lName" required="true"
          :class="{ 'p-invalid': submitted && !item.lName }" />
          <small class="p-error" v-if="submitted && !item.lName">Last Name is required.</small>
      </div>
      <div>
        <label for="email">Email</label>
        <InputText id="email" v-model.trim="item.email" required="true"
          :class="{ 'p-invalid': submitted && !item.email }" />
          <small class="p-error" v-if="submitted && !item.email">Email is required.</small>
      </div>
      <div>
        <label for="date">Check Out Date & Time</label>
        <Calendar id="date" v-model="item.datetime" showTime hourFormat="12"
        required="true" :class="{ 'p-invalid': submitted && !item.datetime }"/>
        <small class="p-error" v-if="submitted && !item.datetime">Date/Time is required.</small>
      </div>
    </div>
    <template #footer>
      <ButtonArrow label="Cancel" icon="pi pi-times" text @click="hideItemDialog" />
      <ButtonArrow label="Save" icon="pi pi-check" text @click="saveCheckOut" />
    </template>
  </Dialog>
</template>