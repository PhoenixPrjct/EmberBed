<script lang="ts" setup>
import { ProgramAccount } from "@project-serum/anchor";
import { useChainAPI } from "../../api/chain-api";
import { CollectionContainer } from "../../components";
import UserNftTray from "../../components/UserNftTray.vue";
import { EmberBed } from "../../types/ember_bed";
// import { CollectionRewardInfoJSON, DBCollectionInfo } from "../../types";
import { watchEffect, ref } from "vue";
import { useServerAPI } from "../../api/server-api";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";


const { notify } = useQuasar();
const router = useRouter();
const { server_api } = useServerAPI();
const { program } = useChainAPI()
const collectionPDAs = ref<ProgramAccount<EmberBed>[]>([]);
const userCollections = ref<{ name: string, account: string }[]>([]);
const collectionOptions = ref<string[]>([]);
const selectColProxy = ref<string>()

function handleCollectionGoClick() {
    const item = userCollections.value.find(i => i.name == selectColProxy.value)
    if (!item) return notify({
        type: "error",
        message: "Collection not found",
        caption: "Collection Page Not Found",
        position: "top",
    })
    router.push(`/c/${item?.account}`)
}



watchEffect(async () => {

    if (!collectionPDAs.value?.length) {
        await (await program.value.account.collectionRewardInfo.all()).map((acct: ProgramAccount) => {
            // if (acct.account.manager.toBase58() == walletString) {
            collectionPDAs.value = [...collectionPDAs.value, acct];
            // }
            return;
        })
        const pdas: Promise<{ name: string, account: string }>[] = collectionPDAs.value.map(async (acct) => {
            console.log({ pda: acct.publicKey.toBase58() })
            const { name } = await server_api.collection.get.one(acct.publicKey.toBase58())
            const account = acct.publicKey.toBase58()
            const res = { name: name, account: account }
            console.log({ res })
            return res
        })
        userCollections.value = await Promise.all(pdas);
        collectionOptions.value = userCollections.value.map(item => item.name)
    }
    // console.log(userCollections.value)
})


</script>
<template>
    <section class="search-section">
        <div class="flex justify-center">

            <q-btn v-if="$q.screen.gt.sm" outline :label="!selectColProxy ? 'Go to Collection Page:' : 'Reset Selection'"
                @click="selectColProxy = undefined" />
            <q-btn v-if="!$q.screen.gt.sm && selectColProxy" outline icon="'clear_all'"
                @click="selectColProxy = undefined" />
            <q-select filled style="border-top:1px solid #fff;min-width:200px; flex: 1 0 65%;" dark v-model="selectColProxy"
                :label="!selectColProxy ? 'EmberBed Collections' : void 0" :options="collectionOptions"
                @click="selectColProxy = undefined" />
            <q-btn :outline="!!selectColProxy" style="padding-left:1rem;flex: 0 0 10%;" label="Go"
                :disable="!selectColProxy" @click="handleCollectionGoClick()"></q-btn>
        </div>

    </section>
    <UserNftTray :colPda="null" :theme="null" />
</template>
<style lang="scss" scoped>
.search-section {
    padding: 2rem;
}
</style>