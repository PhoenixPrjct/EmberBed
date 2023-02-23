<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useChainAPI } from "src/api/chain-api";
import { useServerAPI } from "src/api/server-api";
import { saveAs } from "file-saver";
const { server_api } = useServerAPI();
const { wallet } = useChainAPI();

const props = defineProps<{ pda: string, collectionName: string }>();
const pda = ref(props.pda);
const collectionName = ref(props.collectionName);


const dbHashlist = ref<{ loaded: boolean, list: string[] }>({ loaded: false, list: [] })
const inputHashlist = ref(dbHashlist.value.list.join(','))

async function addHashlist() {
    if (!wallet.value.publicKey) return

    const info = await server_api.collection.add.hashlist({
        wallet: wallet.value.publicKey.toBase58(),
        name: props.collectionName,
        hashlist: inputHashlist.value.split(',').map(item => item.replace(/[\[\]',\n"]/g, '')
        ), pda: pda.value
    });
    dbHashlist.value.loaded = false;
    inputHashlist.value = ''
    return info;

}

async function clearHashlist() {
    if (!wallet.value.publicKey) return
    await server_api.collection.add.hashlist({
        wallet: wallet.value.publicKey.toBase58(),
        hashlist: [], pda: pda.value
    });
    dbHashlist.value.loaded = false;
    inputHashlist.value = ''
    return

}

async function exportHashlist() {
    if (!wallet.value.publicKey) return
    const file: string[] = await server_api.collection.get.hashlist(pda.value);
    if (file.length === 0) return
    const fileJson = JSON.stringify(file);
    const blob = new Blob([fileJson], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'hashlist.json');
}


watchEffect(async () => {
    console.log(dbHashlist.value.list)
    console.log('inputHashlist:', inputHashlist.value)
    if (!dbHashlist.value.loaded) {
        const info: string[] = await server_api.collection.get.hashlist(pda.value);
        console.log(info.includes('token1'))
        dbHashlist.value.list = info;
        dbHashlist.value.loaded = true;

    }
    if (dbHashlist.value.loaded && !inputHashlist.value) {
        inputHashlist.value = dbHashlist.value.list.join(',');
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
            <span class="flex justify-around actions ">
                <q-btn dark label="Send" @click="addHashlist()" />
                <q-btn dark flat class="text-accent" label="Reset" @click="dbHashlist.loaded = false" />
            </span>
            <q-space />
            <span class="flex justify-around actions">
                <q-btn dark label="Export" @click="exportHashlist()" />
                <q-btn dark color="red" label="Clear" @click="clearHashlist()" />
            </span>
        </q-card-actions>
        <q-card-section v-else>
            <q-spinner />
        </q-card-section>
    </q-card>
</template>
<style lang="scss" scoped>
.actions {
    width: 20%;
}
</style>