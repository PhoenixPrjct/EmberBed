<script lang="ts" setup>
import { ProgramAccount } from '@project-serum/anchor';
import { useChainAPI } from 'src/api/chain-api';
import { CollectionContainer } from 'src/components';
import UserNftTray from 'src/components/UserNftTray.vue';
import { EmberBed } from 'src/solana/types/ember_bed';
import { CollectionRewardInfoJSON } from 'src/types';
import { watchEffect, ref } from 'vue';

const { program } = useChainAPI()
const collectionPDAs = ref<ProgramAccount<EmberBed>[]>([]);
watchEffect(async () => {

    if (!collectionPDAs.value?.length) {
        await (await program.value.account.collectionRewardInfo.all()).map((acct: ProgramAccount) => {
            // if (acct.account.manager.toBase58() == walletString) {
            collectionPDAs.value = [...collectionPDAs.value, acct];
            // }
            return;
        })
    }
})


</script>
<template>

    <CollectionContainer :collectionPDAs="collectionPDAs" />
    <UserNftTray />
</template>
<style lang="scss" scoped>

</style>