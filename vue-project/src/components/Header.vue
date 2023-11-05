<template>
  <div class="flex flex-nowrap justify-evenly bg-white h-[20%] items-center">
    <img src="/WhiteTiger.png" class="rounded-full aspect-square h-[3vw]" />
    <h1 class="text-5xl f-text">White Tiger Tae Kwon Do</h1>
    <button @click="buttonRouting(Sign)" class="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
      {{ Sign }}
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps(['Sign'])

const buttonRouting = (s) => {
  if (s === 'Login' || s === 'Sign Out') {
    router.push('/')
  }
  if (s === 'Register') {
    router.push('/register')
  }
}

</script>