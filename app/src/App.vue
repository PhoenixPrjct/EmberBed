<template>
  <router-view />
</template>

<script setup lang="ts">
// import { LocalStorage } from 'quasar';
import { initWallet } from 'solana-wallets-vue';
import { walletOptions } from 'src/boot/sw';

// import {useUserStore} from 'src/stores/userStore';
// const store=useUserStore();
// store.$subscribe((mutation, state) => {
//   LocalStorage.set('user', state.wallet);
//   LocalStorage.set('type', state.type);
// });
initWallet(walletOptions)

</script>
