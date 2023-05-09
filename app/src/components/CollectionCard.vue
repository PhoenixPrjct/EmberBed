<script setup lang="ts">
import { PublicKey } from '@solana/web3.js';
import { computedAsync } from '@vueuse/core';
import { useChainAPI } from 'src/api/chain-api';
import { useServerAPI } from 'src/api/server-api';
import * as types from 'src/types';
import { PhoenixRelationKind } from 'src/types';
import { ref, watchEffect } from 'vue'
import { CopyClick, camelCaseToTitleCase } from 'src/helpers';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { AddHashList, AddStyleDialog } from 'src/components'
import { useRouter } from 'vue-router';
import EditCollectionDialog from './EditCollectionDialog.vue';
import WithdrawDialog from './WithdrawDialog.vue';
type PR =
    | PhoenixRelationKind
    | types.PhoenixRelation.Affiliate
    | types.PhoenixRelation.Evo
    | types.PhoenixRelation.Saved
    | types.PhoenixRelation.Founder
    | types.PhoenixRelation.Member
    | types.PhoenixRelation.EmberBed
    | types.PhoenixRelation.None

const router = useRouter();
const { server_api } = useServerAPI();
const { notify } = useQuasar();
const dialogShow = ref(false);
const hashListCardView = ref(false);
const styleCardView = ref(false);
const editCollectionView = ref(false);
const withdrawDialog = ref(false);
const styleReady = ref(false);
const { connection, wallet } = useChainAPI();
const { CollectionRewardInfo } = types
const collectionStyle = ref<types.DBCollectionInfo['style']>();
const props = defineProps<{ collectionRewardPDA: PublicKey }>();
const collectionRewardPDA = ref(props.collectionRewardPDA)
const _collectionInfo = computedAsync(() => CollectionRewardInfo.fetch(connection, collectionRewardPDA.value), null);
const collectionInfo = ref(_collectionInfo.value?.toJSON());


watchEffect(async () => {
    if (!collectionInfo.value && _collectionInfo.value) {
        console.log({ CollectionRewardInfo: _collectionInfo.value })
        collectionInfo.value = _collectionInfo.value.toJSON();
    }
    if (props.collectionRewardPDA) {
        const dbCollectionInfo: Promise<types.DBCollectionInfo> = await server_api.collection.get.one(props.collectionRewardPDA.toBase58())
        const styleInfo = await (await dbCollectionInfo).style
        if (!styleInfo) {
            collectionStyle.value = { icon: '', colors: { primary: '#14f195', secondary: '#9945FF', accent: '#88888' } }
        } else {
            collectionStyle.value = (await dbCollectionInfo).style
        }
    }
    if (collectionStyle.value) {
        styleReady.value = true;
    }
})
function isPK(v: any): boolean {
    if (typeof (v) == 'string') {
        try {
            v = new PublicKey(v);
        } catch (e) {
            return false;
        }
    }

    if (v.constructor && v.constructor.name === "PublicKey") {
        return true;
    }
    return false;

}

function handleAddHashlistClick() {
    // dialogShow.value = false;
    hashListCardView.value = true;

}
async function handleCopyClick(e: any, v?: string) {
    console.log(e.target)
    e.target.innerText ?
        v = e.target.innerText :
        v = undefined
    if (typeof (v) !== 'string') {
        console.log({ v })
        return notify({
            color: 'red-10',
            textColor: 'white',
            icon: 'warning',
            message: `So that didn't work. . . sorry`,
            position: 'top'

        })
    }
    const result: QNotifyCreateOptions = await CopyClick(v);
    return notify({ ...result })

}
function handleDialogShow() {
    dialogShow.value = true;
}

function isRelevant(k: string): boolean {
    // console.log(k)
    let result
    switch (k) {
        case 'bump':
            result = false;
            console.log('bump', result)
            break;
        case 'isInitialized':
            result = false;
            break;
        default:
            result = true;
            break;
    }
    return result;
}


function handleCollectionRouteClick(pda: string) {
    // console.log(pda)
    router.push(`/c/${pda}`)
}


</script>
<template>
    <q-card class="collection-card" dark v-if="!collectionInfo">
        <q-spinner size="5rem" />
    </q-card>
    <q-card dark v-else class="collection--card">
        <!-- <q-card-section> -->
        <q-list>
            <q-item>
                <q-item-section>
                    <q-item-label header class="text-h5 card-section-title">
                        Collection:
                        <span class="text-white">
                            {{ collectionInfo.collectionName }}
                        </span>
                    </q-item-label>
                </q-item-section>
                <q-tooltip>Name of NFT Collection (or subgroup)</q-tooltip>

            </q-item>
            <!-- </q-card-section>
                                    <q-card-section> -->

            <q-item>
                <q-item-label header class="card-section-title">
                    Reward Token Mint:
                    <br>
                    <div class="pubkey" @click="(e: MouseEvent) => handleCopyClick(e)">
                        {{ collectionInfo.rewardMint }}
                    </div>
                </q-item-label>
                <q-tooltip>Copy Full Address to Clipboard</q-tooltip>
            </q-item>
            <q-item>
                <q-item-label header class="card-section-title">
                    <span class="title">
                        EmberBed Token Account:
                        <q-tooltip>
                            * Where to send {{ collectionInfo.rewardSymbol }}
                        </q-tooltip>
                    </span>


                    <div class="pubkey" @click="(e: MouseEvent) => handleCopyClick(e)">
                        {{ collectionInfo.rewardWallet }}
                    </div>
                </q-item-label>
                <q-tooltip>Copy Full Address to Clipboard</q-tooltip>
            </q-item>
            <q-item>
                <q-item-label header class="card-section-title">
                    Collection Reward PDA:
                    <br>
                    <div class="pubkey" @click="(e: MouseEvent) => handleCopyClick(e)">
                        {{ collectionRewardPDA.toBase58() }}
                    </div>
                </q-item-label>
                <q-tooltip>Copy Full Address to Clipboard</q-tooltip>
            </q-item>
        </q-list>
        <q-card-actions class="flex justify-between">
            <q-btn dark @click="handleDialogShow">Details</q-btn>
            <q-btn dark label="Edit Info" @click="() => editCollectionView = true" />
            <q-btn dark @click="handleCollectionRouteClick(collectionRewardPDA.toBase58())" label="Go to
                                        Page" />
        </q-card-actions>
    </q-card>
    <q-dialog v-model="dialogShow">
        <q-card dark>
            <q-card-section header>
                <div class="text-h6 collection-name flex justify-center">
                    {{ collectionInfo?.collectionName }}

                </div>
            </q-card-section>
            <q-card-section>
                <q-list v-for="(v, k) in collectionInfo" :key="k">
                    <div v-if="isRelevant(k)">

                        <q-item-section class="collectionInfo-key">
                            {{ camelCaseToTitleCase(k) }}
                        </q-item-section>

                        <q-item-section v-if="isPK(v)" class="pubkey collectionInfo-value"
                            @click="(e: MouseEvent) => handleCopyClick(e)">
                            {{ v }}
                        </q-item-section>
                        <q-item-section v-else class="collectionInfo-value">
                            {{ v }}
                        </q-item-section>
                    </div>

                </q-list>
            </q-card-section>
            <q-separator dark spaced />
            <q-card-actions class="collection-add-ons"
                v-if="collectionInfo?.manager == wallet?.publicKey.toBase58() && collectionInfo?.collectionName && collectionRewardPDA">
                <q-btn dark label="Add Hashlist" @click="handleAddHashlistClick()" />
                <q-btn dark label="Customization" :disable="!styleReady" @click="styleCardView = true" />
                <q-btn dark :label="`Withdraw ${collectionInfo.rewardSymbol}`" @click="withdrawDialog = true" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="editCollectionView" full-width>
        <EditCollectionDialog :pda="props.collectionRewardPDA" :collection="collectionInfo!" />
    </q-dialog>
    <q-dialog v-model="hashListCardView" fullWidth>
        <AddHashList :pda="collectionRewardPDA.toBase58()" :collectionName="collectionInfo!.collectionName" />
    </q-dialog>
    <q-dialog v-model="styleCardView" full-width>
        <AddStyleDialog :pda="collectionRewardPDA.toBase58()" :collectionName="collectionInfo!.collectionName"
            :style="collectionStyle!" />
    </q-dialog>
    <q-dialog v-model="withdrawDialog" full-width>
        <WithdrawDialog v-if="collectionInfo" :collection="collectionInfo" :pda="collectionRewardPDA.toBase58()"
            :collectionName="collectionInfo.collectionName" />
    </q-dialog>
</template>
<style lang="scss" scoped>
// @import 'src/css/quasar.variables.sass';

.no-select {
    user-select: none;
}

.collection-add-ons {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
}

.collectionInfo-key {
    font-weight: 800;
    font-size: calc(10px + .5vw);
    color: $dirtyFont;
}

.collectionInfo-value {
    font-weight: 400;
    margin-top: 0;
    padding-top: 0;
}

.collection--card {
    flex: 1 0 320px;
    max-width: 550px;
    min-width: 220px;
    overflow-x: hidden;
    background-color: #1d1d1dd8;
}

.card-item {
    margin: 0 auto;
    // width: 90%;
    padding-top: 0;
    padding: 0;
}


.collection-name {
    color: $dirtyFont;
}

.q-item {

    margin: 0;
    padding: 0;

    .card-section-title {
        margin: 0;
        padding: 0 16px;
        font-weight: bold;
        font-size: 1rem;

        color: $dirtyFont;

        & span:not(.title),
        div {
            font-weight: 300;
        }
    }
}




.card-section-content {

    margin: 0 auto;
    // align-items: flex-start;
    font-weight: 400;
    font-size: 1rem;
}
</style>