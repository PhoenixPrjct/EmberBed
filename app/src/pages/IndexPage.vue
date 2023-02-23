    
<script setup lang="ts">
import SplashPage from 'src/components/SplashPage.vue'
import { useChainAPI } from 'src/api/chain-api';
// const { wallet, connection, program } = useChainAPI();
// console.log(wallet, connection, program);
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <SplashPage />
  </q-page>
</template>
