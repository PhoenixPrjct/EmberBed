<script setup lang="ts">
import { ref } from 'vue';
import { useServerAPI } from 'src/api/server-api';
import { useAnchorWallet } from 'solana-wallets-vue';
import { useChainAPI } from 'src/api/chain-api';

const { server_api } = useServerAPI()
useAnchorWallet()
const { wallet } = useChainAPI();
const msg = ref('');
const hashlist = ['token1', 'token5002', 'token3']
const pda = "AdGg8NzzE8xpHYvAtrgkHyq6bS33y8uEucFY734ybbm1"
const collectionList = ref([]);

async function testAPI() {
    if (!wallet.value.publicKey) return
    const info = await server_api.admin.getInfo(wallet.value.publicKey.toBase58());
    console.log('test')
    msg.value = info
}

async function getAllCollections() {
    if (!wallet.value.publicKey) return
    const info = await server_api.collection.get.all();
    collectionList.value = info
}

// async function addHashlist() {
//     if (!wallet.value.publicKey) return
//     const info = await server_api.collection.add.hashlist({ wallet: wallet.value.publicKey.toBase58(), hashlist: hashlist, pda: pda });
//     msg.value = info
// }
</script>

<template>
    <q-btn label="test" @click="testAPI()" />
    <!-- <q-btn label="Add Hashlist" @click="addHashlist()" /> -->
    <q-btn label="Get All Collections From DB" @click="getAllCollections()" />
    <pre v-if="collectionList">{{ collectionList }}</pre>

    <pre v-if="msg">{{ msg }}</pre>
    <q-btn label="User" to="/user" />
    <q-btn label="Admin" to="/admin" />
</template>