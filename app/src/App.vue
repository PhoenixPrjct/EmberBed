<template>
  <router-view />
</template>

<script setup lang="ts">
// import { LocalStorage } from 'quasar';
import { initWallet } from 'solana-wallets-vue';
import { walletOptions } from 'src/boot/sw';
initWallet(walletOptions)

</script>
