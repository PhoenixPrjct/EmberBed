<script setup lang="ts">
import { PublicKey } from '@solana/web3.js';
import { CollectionRewardInfoJSON } from 'src/types';
import { copyToClipboard, useQuasar } from 'quasar'
type OnChainInfo = CollectionRewardInfoJSON & { statePDA: PublicKey }


defineProps<{
    onChainInfo: CollectionRewardInfoJSON,
    address: PublicKey,
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



</script>
<template>
    <q-card dark>
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
    </q-card>
    <q-spinner v-if="!onChainInfo" />
</template>
<style scoped>
.pubkey {
    font-size: calc(10px + .25vw);
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>