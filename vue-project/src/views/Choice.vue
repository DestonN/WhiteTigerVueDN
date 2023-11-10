<script setup>
import { ref } from 'vue';

import Inventory from './Inventory.vue';
import Shipments from './Shipments.vue';
import CheckOut from './CheckOut.vue';


const bgColor = ref('bg-red-400');
const tab = ref('Inventory');
const Colors = {Inventory: 'bg-red-400', Shipments: 'bg-red-500', CheckOut: 'bg-red-600'};

const testColor = (e) => {
  tab.value = e;
  bgColor.value = Colors[e];
}
</script>

<template>
  <div class="max-w-full h-full grid grid-cols-1 grid-rows-3">
    <Header Sign="Sign Out" />
    <div :class="bgColor" class="w-[60%] min-w-[1150px] aspect-video border-2 place-self-center relative rounded-t-lg rounded-r-lg">
      <div v-if="tab === 'Inventory'" class="p-[1%]">
        <Inventory />
      </div>
      <div v-if="tab === 'Shipments'" class="p-[1%]">
        <Shipments />
      </div>
      <div v-if="tab === 'CheckOut'" class="p-[1%]">
        <CheckOut />
      </div>

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