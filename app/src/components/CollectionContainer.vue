<script setup lang="ts">
import { PublicKey } from '@solana/web3.js';
import { copyToClipboard, useQuasar } from 'quasar'
import { useChainAPI } from 'src/api/chain-api';
import CollectionCard from './CollectionCard.vue';

import { ProgramAccount } from '@project-serum/anchor';
import { EmberBed } from 'src/solana/types/ember_bed';
import { CollectionRewardInfoJSON } from 'src/types';

type OnChainInfo = CollectionRewardInfoJSON & { statePDA: PublicKey }

const { wallet, api, program } = useChainAPI();
defineProps<{
    collectionPDAs: ProgramAccount<EmberBed>[],
}>()
const $q = useQuasar();
async function handleCopyClick(value: string) {
    try {
        await copyToClipboard(value)
        return $q.notify({
            color: 'green-10',
            textColor: 'white',
            icon: 'clipboard',
            group: 'saved group',
            message: `Successfully copied to clipboard`,
            position: 'top'

        })

    } catch (err) {
        // console.log(err)
        return $q.notify({
            color: 'red-10',
            textColor: 'white',
            icon: 'warning',
            message: `So that didn't work. . . sorry`,
            position: 'top'

        })
    }
}

// async function getCollectionInfo(collectionName: string, rewardMint: string) {
//     onChainInfo.value = null as unknown as CollectionRewardInfoJSON
//     if (!api.value) return false;
//     accounts.value = await api.value.getAccounts(wallet.value.publicKey, collectionName, rewardMint);
//     collectionPDA.value = accounts.value.statePDA
//     const { RewTok, stateBump, statePDA, rewardWallet, funderTokenAta, userAccountPDA, userRewardAta, nftCollectionAddress } = accounts.value;
//     console.dir(accounts.value);
//     const res = await CollectionRewardInfo.fetch(connection, collectionPDA.value);
//     if (!res) return
//     onChainInfo.value = res.toJSON()

// }



</script>
<template>
    <div class="flex justify-around collection-card--container">
        <CollectionCard v-for="acct in collectionPDAs" :key="acct.publicKey.toBase58()"
            :collectionRewardPDA="acct.publicKey" />
    </div>
    <!-- <q-card dark>
        <q-item>
            <q-item-section>
                $FIRE Eligible:
            </q-item-section>
            <q-item-section>
                {{ onChainInfo?.fireEligible }}
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                Phoenix Relation:
            </q-item-section>
            <q-item-section>
                {{ onChainInfo.phoenixRelation.kind }}
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                Collection Info Address:
            </q-item-section>
            <q-item-section class="pubkey" @click="handleCopyClick(address.toBase58())">
                {{ address.toBase58() }}
                <q-tooltip>Click to Copy to &#x1F4CB;</q-tooltip>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                Reward Wallet For {{ onChainInfo?.rewardSymbol }}:

            </q-item-section>
            <q-item-section class="pubkey" @click="handleCopyClick(onChainInfo.rewardWallet)">
                {{ onChainInfo.rewardWallet }}
                <q-tooltip>Click to Copy to &#x1F4CB;</q-tooltip>
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>

                Staking Rate Per Day :
                <q-tooltip>

                    For {{ onChainInfo.collectionName }} Holders
                </q-tooltip>
            </q-item-section>
            <q-item-section>
                {{ onChainInfo.ratePerDay }}
            </q-item-section>
        </q-item>
    </q-card> -->

</template>
<style scoped>
.collection-card--container {
    width: 90%;
    margin: 1rem auto;
    flex-flow: row wrap;
    gap: 1rem;
}


.pubkey {
    font-size: calc(10px + .25vw);
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}
</style>