<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useChainAPI } from 'src/api/chain-api';
import { FIRE_INFO } from 'src/helpers/constants';
import { AccountInfo, PublicKey, SystemProgram } from '@solana/web3.js';
import { Accounts, FireRewardInfo, FireRewardInfoJSON } from 'src/types';
import { InitializeFirePdaAccounts, InitializeFirePdaArgs, initializeFirePda } from 'src/types/instructions/initializeFirePda';
import { EBWallet } from 'src/dev/walletKPs';
const { api, wallet, program } = useChainAPI();

const result = ref();
async function testFireAccounts() {
    console.clear()
    console.log("Testing Fire Accounts")
    const fireInfo = await FIRE_INFO
    const { FIRE_MINT, FIRE_ACCTS, FIRE_ARGS, FIRE_ATA, FIRE_POA, FIRE_PDA, FIRE_BUMP, FIRE_FUNDER } = fireInfo
    console.log({ FIRE_MINT: FIRE_MINT.toBase58(), FIRE_ACCTS: FIRE_ACCTS.firePda.toBase58(), FIRE_ATA: FIRE_ATA.toBase58(), FIRE_POA: FIRE_POA.toBase58(), FIRE_PDA: FIRE_PDA.toBase58(), FIRE_BUMP, FIRE_FUNDER: FIRE_FUNDER.toBase58() })
    const tx = await api.value!.initializeFirePda(FIRE_ARGS, FIRE_ACCTS)
    if (tx) {
        // Object.entries(tx.keys).map(key => console.log(key))

        const info = await program.value.account.collectionRewardInfo.fetch(FIRE_PDA)
        // account.fireRewardInfo.fetch(FIRE_PDA)
        result.value = info
    }

    return result.value;
}
</script>
<template>
    <section>
        <h1>TEST</h1>
        <q-btn dark @click="testFireAccounts">Run Function</q-btn>
        <div v-if="result">
            <pre>{{ result }}</pre>
        </div>
    </section>
</template>