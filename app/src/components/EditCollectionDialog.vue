<script setup lang="ts">
import { ref, watchEffect, Ref } from 'vue'
import { useChainAPI } from 'src/api/chain-api';
import { useServerAPI } from 'src/api/server-api';
import { CollectionInfo, CollectionRewardInfo, CollectionRewardInfoJSON, EditCollectionInfo } from 'src/types';
import { PublicKey } from '@solana/web3.js';
import { camelCaseToTitleCase } from 'src/helpers';
import { useQuasar } from 'quasar';

const props = defineProps<{
    collection: CollectionRewardInfoJSON;
    pda: PublicKey;
}>();
const { notify } = useQuasar();
const { connection, api, wallet } = useChainAPI();
const { server_api } = useServerAPI();
const collectionInfoProxy = ref<EditCollectionInfo>()
const initValues = ref();

function handleResetPda() {
    collectionInfoProxy.value = initValues.value;
    return
}

async function handleEditPda() {
    try {
        console.log('Edit pda')
        const update: CollectionRewardInfoJSON = { ...props.collection, ...collectionInfoProxy.value }
        const updatedCollection = CollectionRewardInfo.fromJSON(update)
        if (collectionInfoProxy.value?.manager !== initValues.value.manager || collectionInfoProxy.value?.collectionName !== initValues.value.collectionName) {
            const result = await server_api.collection.update({ wallet: wallet.value!.publicKey.toBase58(), pda: props.pda.toBase58(), data: update })
            console.log('DB Result:', result);
        }
        const result = await api.value?.updateCollectionRewardPDA(wallet.value!.publicKey, updatedCollection)
        if (result?.error) throw new Error(result.error);
        notify({ type: 'success', message: 'Collection Updated', caption: result?.tx, position: 'top' })
    } catch (err: any) {
        console.log(err);
        notify({
            type: 'error',
            message: 'Collection Update Failed',
            caption: err.message,
            position: 'top'
        })
    }
}

function isRelevant(key: string) {
    switch (key) {
        case 'bump':
            return false;
        case 'rewardWallet':
            return false;
        case 'phoenixRelation':
            return false;
        case 'isInitialized':
            return false;
        default:
            return true;
    }

}


watchEffect(() => {

    if (!collectionInfoProxy.value) {
        collectionInfoProxy.value = { ...props.collection }
        if (!collectionInfoProxy.value.uuid) {
            collectionInfoProxy.value.uuid = props.pda.toBase58()
        }
        initValues.value = { ...props.collection }
        initValues.value.uuid = props.pda.toBase58()
    }

    // console.log(collectionInfoProxy.value);
})

</script>
<template>
    <q-card dark>
        <q-card-section v-if="collectionInfoProxy">
            <div v-for="_, key in collectionInfoProxy" :key="key">
                <q-item v-if="isRelevant(key) && key !== 'fireEligible'">
                    <q-item-section>
                        {{ camelCaseToTitleCase(key) }}
                        <q-input dark v-model="collectionInfoProxy[key]" />
                    </q-item-section>
                </q-item>
                <q-item v-if="isRelevant(key) && key == 'fireEligible'">
                    <q-item-section>
                        {{ camelCaseToTitleCase(key) }}
                        <q-toggle dark v-model="collectionInfoProxy[key]" class="special" color="accent" />
                    </q-item-section>
                </q-item>
            </div>
        </q-card-section>
        <q-card-actions>
            <q-btn dense icon="send" label="Send It" @click="handleEditPda" />
            <q-btn dense icon="refresh" label="Reset" @click="handleResetPda" />
        </q-card-actions>
    </q-card>
</template>
<style lang="scss" scoped></style>