<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const pricePer = ref('Price per Unit');
const shipments = ref();
const categories = ref();
const dt_ship = ref();
const newShipment = ref({});
const newItemCount = ref(0);
const loading = ref(true);
const submitted = ref(false);
const shipmentDialog = ref(false);
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
      shipment.Arrived_At = format(new Date(shipment.Arrived_At), 'eee, dd-MMM-yy h:mm a')
    }
  })

  loading.value = false;
  shipments.value = Shipments;
  // console.log(shipments)
}

const exportCSV = () => {
  dt_ship.value.exportCSV();
};

const getCats = async () => {
  let { data: Categories, error } = await supabase
    .from('Categories')
    .select(`Category`)

  let ArrHolder = [];
  Categories.map((cats) => {
    ArrHolder.push(cats.Category);
  });

  categories.value = ArrHolder;
}

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

const hideShipmentDialog = () => {
  submitted.value = false;
  shipmentDialog.value = false;

  newItemCount.value = 0;
  newShipment.value = {};
};

const createShipment = () => {
  submitted.value = false;

  newShipment.value = {};
  newItemCount.value = 0;
  newShipment.value.items = [];
  getCats();
  addItem();

  shipmentDialog.value = true;
};

const addItem = () => {
  newItemCount.value += 1;
  newShipment.value.items.push({ Name: '', Category: '', Size: 0, Description: '', PPU: 0, Quantity: 0, pricePer: '' })


  // console.log(newShipment)
  // console.log(newItemCount)
}

const removeItem = () => {
  newItemCount.value -= 1;
  newShipment.value.items.pop()


  // console.log(newShipment)
  // console.log(newItemCount)
}

const getShipment = async (serial, arrival_date) => {
  const { data, error } = await supabase.rpc('newshipment', { p_serial_number: serial, p_arrival_date: arrival_date })
  return data;
}

const updateInventory = async (category, ship_id, item, quantity, size, description, ppu) => {
  const { data, error } = await supabase.rpc('updateinventory', {
    p_category: category,
    p_ship_id: ship_id,
    p_item: item,
    p_quantity: quantity,
    p_size: size,
    p_description: description,
    p_ppu: ppu  })

    // console.log('updateINV', category, ship_id, argument)

  console.log(data, error)
}

const submitShipment = async () => {
  submitted.value = true;

  let check = false;
  let shipHolder = newShipment.value
  // console.log(shipHolder)

  if (!shipHolder.serial || !shipHolder.datetime) check = true;
  shipHolder.items.map((item) => {
    if (!item.Name || !item.Quantity || !item.Category || !item.PPU || !item.pricePer) check = true;
  })

  // console.log('run', check)
  if (check) return;

  let dateHolder = new Date(shipHolder.datetime).toUTCString()

  // console.log(shipHolder)

  getShipment(shipHolder.serial, dateHolder)
  .then((ship_id) => {
    shipHolder.items.map((aItem) => {

      if (aItem.pricePer === 'Price for All') aItem.PPU = aItem.PPU / aItem.Quantity

      updateInventory(aItem.Category, ship_id, aItem.Name, aItem.Quantity, aItem.Size, aItem.Description, aItem.PPU )
    })
  }).then(setTimeout(() => getShipments(), 500))

  newItemCount.value = 0;
  shipmentDialog.value = false;
  newShipment.value = {};
};


onMounted(() => {
  getShipments()
})
</script>

<template>
  <div class="card">
    <h1 class="text-3xl f-text pb-2">Shipments</h1>
    <DataTable ref="dt_ship" v-model:expandedRows="expandedRows" :value="shipments" @rowExpand="onRowExpand"
      @rowCollapse="onRowCollapse" scrollable scrollHeight="500px" removableSort :paginator="true" :rows="5"
      :loading="loading" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">

      <Toolbar class="mb-4">
        <template #start>
          <ButtonArrow label="New" icon="pi pi-plus" @click="createShipment" />
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

  <Dialog v-model:visible="shipmentDialog" :style="{ width: '45vw' }" header="Stock Details" :modal="true"
    class="p-fluid max-h-[800px]">
    <div class="flex flex-col gap-4 p-3">
      <div class="flex justify-evenly items-baseline">
        <div class="field w-[40%]">
          <label for="shipNum" class="text-xl">Shipment Serial#:</label>
          <InputText id="fname" v-model.trim="newShipment.serial" required="true" autofocus
            :class="{ 'p-invalid': submitted && !newShipment.serial }" />
          <small class="p-error" v-if="submitted && !newShipment.serial">Serial# is required.</small>
        </div>
        <div class="field w-[40%]">
          <label for="fName">Arrival Date</label>
          <Calendar id="date" v-model="newShipment.datetime" showIcon showTime hourFormat="12" required="true" />
          <small class="p-error" v-if="submitted && !newShipment.datetime">Arrival Date is required.</small>
        </div>
      </div>

      <div class="flex flex-wrap gap-5 w-[100%] border-t-4 border-b-4 border-lime-500 p-4" v-for="item in newItemCount">
        <div class="flex w-[100%] gap-5">
          <div class="w-[50%]">
            <label for="itemName" class="text-xl">Item Name:</label>
            <InputText id="itemName" v-model.trim="newShipment.items[item - 1].Name" required="true"
              :class="{ 'p-invalid': submitted && !newShipment.items[item - 1].Name }" />
            <small class="p-error" v-if="submitted && !newShipment.items[item - 1].Name">Item Name is
              required.</small>
          </div>
          <div class="w-[50%]">
            <label for="itemCategory" class="text-xl">Item Category:</label>
            <Dropdown v-model="newShipment.items[item - 1].Category" editable :options="categories"
              optionlabel="category" placeholder="Add a Category" />
          </div>
        </div>
        <div class="field w-[100%]">
          <label for="itemDesc" class="text-xl">Description:</label>
          <InputText id="itemDesc" v-model.trim="newShipment.items[item - 1].Description" />
        </div>
        <div class="field w-[25%]">
          <label for="itemSize" class="text-xl">Size:</label>
          <InputNumber v-model="newShipment.items[item - 1].Size" inputID="integeronly" />
        </div>
        <div class="field w-[25%]">
          <label for="itemQuantity" class="text-xl">Quantity:</label>
          <InputNumber v-model="newShipment.items[item - 1].Quantity" inputID="integeronly" required="true"
            :class="{ 'p-invalid': submitted && !newShipment.items[item - 1].Quantity }" />
          <small class="p-error" v-if="submitted && !newShipment.items[item - 1].Quantity">Item Quantity is
            required.</small>
        </div>
        <div class="field w-[75%]">
          <label for="itemPrice" class="text-xl">Price:</label>
          <div class="w-[100%] flex gap-5">
            <InputNumber class="w-[50%]" inputID="currency-us" mode="currency" currency="USD" locale="en-US"
              required="true" v-model="newShipment.items[item - 1].PPU"
              :class="{ 'p-invalid': submitted && !newShipment.items[item - 1].PPU }" />
            <small class="p-error" v-if="submitted && !newShipment.items[item - 1].PPU">Item Price is
              required.</small>
            <SelectButton v-model="newShipment.items[item - 1].pricePer"
              :options="['Price per Unit', 'Price for All']" aria-labelledby="basic" class="w-[60%]" />
            <ButtonArrow v-if="item > 1" label="Remove Item" severity="danger" @click="removeItem" class="w-[30%]" />
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <ButtonArrow label="add Item" @click="addItem" class="w-[50%]" />
      </div>
    </div>


    <template #footer>
    <ButtonArrow label="Cancel" icon="pi pi-times" text @click="hideShipmentDialog" />
    <ButtonArrow label="Save" icon="pi pi-check" text @click="submitShipment" />
  </template>
</Dialog></template>