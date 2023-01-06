<script setup lang="ts">
import { ref, ComputedRef, computed, watchEffect } from 'vue';
import { useServerAPI } from 'src/api/server-api';
import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
import { useChainAPI } from 'src/api/chain-api';
import { verifyWallet } from 'src/helpers';
import { WalletStore } from 'src/types';
import { useRouter } from 'vue-router';
// import { Wallet } from 'src/types';

const { server_api } = useServerAPI()
const router = useRouter();
const wallet = useAnchorWallet();
const _connected = ref()
const connected = computed(() => wallet?.value?.publicKey? true: false);
const msg = ref('');
const collectionList = ref([]);


async function handleAdminClick(){
  const verified = await verifyWallet(wallet.value.publicKey);
  if(verified){
    router.push('/admin')
}
    return
}
// watchEffect(async () => {

   
// })


</script>

<template>
    <section class="connected" v-if="connected">
        <q-btn class="half left" outline ripple square label="User" to="/user" />
        <q-btn class="half right" outline ripple square label="Admin" @click="handleAdminClick()" />
    </section>
    <section v-else>
        <div class="text-center text-h4 directions">
            Please Connect Your Wallet to Continue.
        </div>
    </section>
</template>
<style lang="scss" scoped>
.connected {
    height: 85vh;
    width: 100%;
    display: grid;
    grid-template-columns: auto 45% 45% auto;
    grid-template-rows: 10% 85%;
    gap: 1rem;
}
section:not(.connected){
    display:flex;
    flex-flow:row wrap;
    justify-content:center;
    align-items:center;
}
.directions{
    flex:0 0 100%;
    align-items: center;
    vertical-align: middle;
    padding:auto;
    
}
.half {
    height: 100%;
    justify-content: center;
    font-weight: 900;
    font-size: calc(24px + .25vw)
}

.right {
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row-start: 2;
}

.left {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
}
</style>