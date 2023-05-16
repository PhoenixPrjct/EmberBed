    
<script setup lang="ts">
import SplashPage from 'src/components/SplashPage.vue'
import TestFunction from 'src/components/TestFunction.vue';
import { useChainAPI } from 'src/api/chain-api';
// const { wallet, connection, program } = useChainAPI();
// console.log(wallet, connection, program);
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <SplashPage />
    <TestFunction />
  </q-page>
</template>
