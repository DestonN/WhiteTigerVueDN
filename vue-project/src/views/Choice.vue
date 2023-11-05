<script setup>
import { ref } from 'vue';

import Dashboard from './Test_Dashboard.vue';
import FullDash from './FullDash.vue';

const bgColor = ref('bg-red-400');
const tab = ref('Inventory');
const Colors = {Inventory: 'bg-red-400', Shipments: 'bg-red-500', CheckOut: 'bg-red-600'}

const testColor = (e) => {
  tab.value = e;
  bgColor.value = Colors[e];
}
</script>

<template>
  <div class="max-w-full h-full grid grid-cols-1 grid-rows-3">
    <Header Sign="Sign Out"/>
    <div :class="bgColor" class="w-[60%] min-w-[1150px] aspect-video border-2 place-self-center relative rounded-t-lg rounded-r-lg">
      <!-- <Dashboard /> -->
      <div v-if="tab === 'Inventory'" class="p-[1%]">
        <h1 class="text-2xl f-text">Inventory</h1>
        <FullDash />
      </div>
      <div v-if="tab === 'Shipments'"><h1>Shipments</h1></div>
      <div v-if="tab === 'CheckOut'"><h1>Checked Out</h1></div>

      <div class="flex flex-nowrap absolute top-[100%] w-full">
        <div @click="testColor('Inventory')" class="w-fit h-[6%] bg-red-400 p-[1%] rounded-b-lg cursor-pointer">
          <h1 class="text-black">Inventory</h1>
        </div>
        <div @click="testColor('Shipments')" class="w-fit h-[6%] bg-red-500 p-[1%] rounded-b-lg cursor-pointer">
          <h1 class="text-black">Shipments</h1>
        </div>
        <div @click="testColor('CheckOut')" class="w-fit h-[6%] bg-red-600 p-[1%] rounded-b-lg cursor-pointer">
          <h1 class="text-black">Checked Out</h1>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>