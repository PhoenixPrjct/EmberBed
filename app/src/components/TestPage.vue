<script setup lang="ts">
import { ref } from 'vue';
import { useServerAPI } from 'src/api/server-api';
import { useAnchorWallet } from 'solana-wallets-vue';
import { useChainAPI } from 'src/api/chain-api';
const { admin } = useServerAPI()
useAnchorWallet()
const { wallet } = useChainAPI();
const msg = ref('');
if (wallet) {
    console.log(wallet.value)
}
async function testAPI() {
    if (!wallet.value.publicKey) return
    const info = await admin.getInfo(wallet.value.publicKey.toBase58());
    console.log('test')
    msg.value = info
}
</script>

<template>
    <q-btn label="test" @click="testAPI()" />
    <h3 v-if="msg">{{ msg }}</h3>
    <q-btn label="Admin" to="/admin" />
</template>