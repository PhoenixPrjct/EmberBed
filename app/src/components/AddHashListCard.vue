<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useChainAPI } from 'src/api/chain-api';
import { useServerAPI } from 'src/api/server-api';
const { server_api } = useServerAPI();
const { wallet } = useChainAPI();

const props = defineProps<{ pda: string, collectionName: string }>();
const pda = ref(props.pda);
const collectionName = ref(props.collectionName);


const dbHashlist = ref<{ loaded: boolean, list: string[] }>({ loaded: false, list: [] })
const inputHashlist = ref(dbHashlist.value.list.toString());
async function addHashlist() {
    if (!wallet.value.publicKey) return
    const info = await server_api.collection.add.hashlist({ wallet: wallet.value.publicKey.toBase58(), hashlist: inputHashlist.value.split(','), pda: pda.value });
    return info;

}

watchEffect(async () => {
    console.log(dbHashlist.value.list)
    if (!dbHashlist.value.loaded) {
        const info: string[] = await server_api.collection.get.hashlist(pda.value);
        console.log(info.includes('token1'))
        dbHashlist.value.list = info;
        dbHashlist.value.loaded = true;

    }
    if (dbHashlist.value.loaded) {
        inputHashlist.value = dbHashlist.value.list.toString();
    }
})
</script>
<template>
    <q-card dark>
        <q-card-section class="text-h6 flex justify-center">
            Hashlist for {{ collectionName }}
        </q-card-section>
        <q-card-section>
            <q-input dark type="textarea" v-model="inputHashlist"
                placeholder="Please input using comma separated values." />
        </q-card-section>
        <q-card-actions v-if="dbHashlist.loaded">
            <q-btn dark label="Send" @click="addHashlist()" />
            <q-btn dark label="Reset" @click="dbHashlist.loaded = false" />
        </q-card-actions>
        <q-card-section v-else>
            <q-spinner />
        </q-card-section>
    </q-card>
</template>
