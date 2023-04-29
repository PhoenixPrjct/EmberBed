<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";
import { PublicKey } from '@solana/web3.js';
import { useChainAPI } from 'src/api/chain-api';
import { CollectionRewardInfo, CollectionRewardInfoJSON, WalletStore } from 'src/types';
import { onBeforeMount, ref, watchEffect, ComputedRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useServerAPI } from "src/api/server-api";
import { DBCollectionInfo } from 'src/types'
import { useUserStore } from "src/stores/user_store";
import { useWallet } from "solana-wallets-vue";

const wallet = <WalletStore>useWallet();
const { connection, program } = useChainAPI()
const { server_api } = useServerAPI();
const router = useRouter();
const route = useRoute();
const pdaInfo = ref<CollectionRewardInfoJSON>();
const dbInfo = ref<DBCollectionInfo>();


onBeforeMount(async () => {
    const pda = new PublicKey(route.params.id)
    dbInfo.value = await server_api.collection.get.one(route.params.id as string);

    const collectionPdaInfo = await CollectionRewardInfo.fetch(connection, pda)
    pdaInfo.value = collectionPdaInfo?.toJSON()
})


const store = useUserStore();
watchEffect(() => {
    if (!wallet.connected.value) router.push('/');
    if (store.getType !== 'Admin' && store.getType !== 'User') router.push('/');
})


</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title style=" font-variant: small-caps;">
                    <q-btn dark flat to="/">
                        <span
                            style="color:#86008f; text-shadow: #000000 1px 1px 0, #ffff54 1px 1px 1.5px; letter-spacing: .15rem; ">
                            {{ pdaInfo?.collectionName }}
                        </span>
                    </q-btn>
                    <q-space />
                </q-toolbar-title>
                <q-space />
                <wallet-multi-button dark />
            </q-toolbar>
        </q-header>
        <q-page-container style="background-color:#1D1D1D">
            <router-view :fire-eligible="pdaInfo?.fireEligible" />
        </q-page-container>

    </q-layout>
</template>
<style scoped lang="scss">
* {
    color: #8f7091a2
}
</style>