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




</script>
<template>
    <div class="flex justify-around collection-card--container">
        <CollectionCard v-for="acct in collectionPDAs" :key="acct.publicKey.toBase58()"
            :collectionRewardPDA="acct.publicKey" />
    </div>
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