<script setup lang="ts">
import { ref, ComputedRef, computed, watchEffect } from 'vue';
import { useServerAPI } from 'src/api/server-api';
import { useWallet } from 'solana-wallets-vue';
import { useChainAPI } from 'src/api/chain-api';
import { verifyWallet } from 'src/helpers';
import { WalletStore } from 'src/types';
import { useRouter } from 'vue-router';
import { PublicKey } from '@solana/web3.js';

import { useUserStore } from 'src/stores/userStore'

const { server_api } = useServerAPI()
const router = useRouter();
const store = useUserStore();
const wallet = useWallet();
const connected = computed(() => wallet.connected.value);
const msg = ref('');
const collectionList = ref([]);


async function handleAdminClick(pk: PublicKey) {
    if (store.getType !== 'Admin') {
        const verified = await verifyWallet(pk);
        if (!verified) return
        router.push(`/${verified.toString().toLowerCase()}`);
        return
    }
    router.push('/admin')
    return

}
watchEffect(() => {
    if (wallet.publicKey.value && store.getType !== 'Admin') {
        store.setUser(wallet.publicKey.value.toBase58(), 'User');
    }

})


</script>

<template>
    <section class="connected" v-if="connected">
        <q-btn dark class="half left" label="User" to="/user" />
        <div class="midline"></div>
        <q-btn dark v-if="wallet.publicKey.value" class="half right" label="Admin"
            @click="handleAdminClick(wallet.publicKey.value!)" />
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
    grid-template-columns: auto 45% 2px 45% auto;
    grid-template-rows: 10% 85%;
    gap: 1rem;
}

.midline {
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    background: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, .25), rgba(255, 255, 255, .5), rgba(255, 255, 255, .25), rgba(255, 255, 255, 1));
}

section:not(.connected) {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
}

.directions {
    flex: 0 0 100%;
    align-items: center;
    vertical-align: middle;
    padding: auto;

}

.half {
    height: 100%;
    justify-content: center;
    font-weight: 900;
    font-size: calc(24px + .25vw)
}

.right {
    grid-column-start: 4;
    grid-column-end: 4;
    grid-row-start: 2;
    transition: all 1s ease-in-out
}

.left {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    transition: all 1s ease-in-out
}

.right:hover,
.left:hover {
    box-shadow: 0 0 5px 1px $accent;
}
</style>