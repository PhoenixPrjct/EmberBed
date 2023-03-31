<script setup lang="ts">
import { PublicKey } from "@solana/web3.js";
import { CollectionRewardInfoJSON } from "src/types";
import { useChainAPI } from "src/api/chain-api";
import { ref } from "vue"
import { useQuasar } from "quasar";

const $q = useQuasar();
const { api, wallet } = useChainAPI();
const amount = ref();
const props = defineProps<{
    collection: CollectionRewardInfoJSON;
    pda: string;
}>();

async function handleWithdrawal() {
    if (!wallet.value) return $q.notify({
        type: "error",
        message: "Please connect to a wallet",
        position: "top"
    });
    const res = await api.value?.managerWithdrawal(wallet.value.publicKey, props.collection.collectionName, new PublicKey(props.collection.rewardMint), amount.value)
    console.log(res)
    return $q.notify({
        type: "success",
        message: "Successful Withdrawal",
        caption: `https://explorer.solana.com/tx/${res?.tx}`
    })
}
</script>
<template>
    <q-card dark>
        <q-card-section>
            <div class="text-h6">
                {{ collection.collectionName }}
            </div>
            <div class="text-h6">
                Withdraw {{ collection.rewardSymbol }}
            </div>
        </q-card-section>
        <q-card-section>
            <q-input type="number" v-model="amount" placeholder="Amount" />
        </q-card-section>
        <q-card-actions>
            <q-btn dark label="Withdraw {{ amount }}" icon="send" @click="() => handleWithdrawal()" v-close-popup />
            <q-btn dark flat label="cancel" v-close-popup />
        </q-card-actions>
    </q-card>
</template>