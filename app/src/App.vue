<template>
  <router-view />
</template>

<script setup lang="ts">
import { initWallet } from 'solana-wallets-vue';
import { walletOptions } from '@/boot/sw'
// import { initWorkspace } from './composables';
initWallet(walletOptions)
// initWorkspace();
</script>
