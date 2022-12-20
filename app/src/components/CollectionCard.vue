<script setup lang="ts">
import { PublicKey } from '@solana/web3.js';
import { computedAsync } from '@vueuse/core';
import { useChainAPI } from 'src/api/chain-api';
import * as types from 'src/types';
import { PhoenixRelationKind } from 'src/types';
import { computed, Events, ref, watchEffect } from 'vue'
import { CopyClick, camelCaseToTitleCase } from 'src/helpers';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { ConstraintClose } from 'src/types/errors/anchor';

type PR =
    | PhoenixRelationKind
    | types.PhoenixRelation.Affiliate
    | types.PhoenixRelation.Saved
    | types.PhoenixRelation.Founder
    | types.PhoenixRelation.Member
    | types.PhoenixRelation.EmberBed
    | types.PhoenixRelation.None
const { notify } = useQuasar();
const dialogShow = ref(false);
const { CollectionRewardInfo } = types
const props = defineProps<{ collectionRewardPDA: PublicKey }>()
const _collectionInfo = computedAsync(() => CollectionRewardInfo.fetch(useChainAPI().connection, props.collectionRewardPDA), null);
const collectionInfo = ref(_collectionInfo.value?.toJSON())
watchEffect(() => {
    if (!collectionInfo.value && _collectionInfo.value) {
        collectionInfo.value = { ..._collectionInfo.value.toJSON() };
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

function isRelevant(k: string): boolean {
    console.log(k)
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
                        <span>
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
                <q-tooltip>Copy Full Address to Clipbaord</q-tooltip>
            </q-item>


            <!-- </q-item> -->


        </q-list>
        <!-- </q-card-section> -->
        <q-card-actions>
            <q-btn flat dark @click="dialogShow = true">Details</q-btn>
        </q-card-actions>
    </q-card>
    <q-dialog v-model="dialogShow">
        <q-card dark>
            <q-card-section>
                <q-list v-for="(v, k) in collectionInfo" :key="k">
                    <q-item v-if="isRelevant(k)">
                        <q-item-section>
                            {{ camelCaseToTitleCase(k) }}
                        </q-item-section>
                        <q-item-section :class="isPK(v) ? 'pubkey' : void 0"
                            :@click="isPK(v) ? (e: MouseEvent) => handleCopyClick(e) : void 0">
                            {{ v }}
                        </q-item-section>
                        <q-space />
                    </q-item>
                </q-list>
            </q-card-section>
            <!-- <q-card-section>

            <q-card-section></q-card-section> -->
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
// @import 'src/css/quasar.variables.sass';

.no-select {
    user-select: none;
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



.q-item {

    margin: 0;
    padding: 0;

    .card-section-title {
        margin: 0;
        padding: 0 16px;
        font-weight: bold;
        font-size: 1rem;

        color: $accent;

        & span,
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