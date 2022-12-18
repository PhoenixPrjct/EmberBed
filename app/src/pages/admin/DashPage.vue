<script setup lang="ts">
import { ref, watchEffect, Ref } from 'vue';
import { Keypair, PublicKey } from '@solana/web3.js';
// import { useWorkspace, initWorkspace } from 'src/composables';
// import { fundKP } from '../../solana/fundWallet'
import { useQuasar } from 'quasar';
import { useChainAPI } from '../../api/chain-api';
import axios from 'src/boot/axios';
import { CollectionInfo, CollectionRewardInfo, Accounts, CollectionRewardInfoJSON, CollectionRewardInfoFields, PhoenixRelation } from '../../types';


import CollectionOnChainInfo from 'src/components/CollectionOnChainInfo.vue';
import { useAnchorWallet } from 'solana-wallets-vue';
import { ProgramAccount } from '@project-serum/anchor';
import { EmberBed } from 'src/types/types/PhoenixRelation';
const $q = useQuasar();

const { api, connection, program } = useChainAPI();
const wallet = useAnchorWallet();
// const readyForInfo = ref(false)
// const fundWallet = Keypair.fromSecretKey(Uint8Array.from(fundKP));
const collectionPDA = ref(null as unknown as PublicKey)
const demoInfoSubmission: CollectionInfo = {
    // address: null as unknown as PublicKey,
    rewardMint: "REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko",
    collectionName: "TestEyes",
    collectionAddress: "CG4KDtfDDvYWP4ChqxKVLXjxjrg8VT28RoMpJgjYosFs",
    ratePerDay: 3,
    fireEligible: true,
    phoenixRelation: { kind: "Affiliate" },
    rewardSymbol: "$EYE",
} as CollectionRewardInfoJSON;

const collectionInfo: Ref<CollectionInfo> = ref(demoInfoSubmission);

const onChainInfo: Ref<CollectionRewardInfoJSON> = ref(null as unknown as CollectionRewardInfoJSON)

const accounts: Ref<Accounts> = ref(null as unknown as Accounts)

const collectionPDAs = ref<ProgramAccount<EmberBed>[]>([])
const demoRewardMint = new PublicKey("REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko");

async function getCollectionInfo(collectionName: string, rewardMint: string) {
    onChainInfo.value = null as unknown as CollectionRewardInfoJSON
    if (!api.value) return false;
    accounts.value = await api.value.getAccounts(wallet.value.publicKey, collectionName, rewardMint);
    collectionPDA.value = accounts.value.statePDA
    const { RewTok, stateBump, statePDA, rewardWallet, funderTokenAta, userAccountPDA, userRewardAta, nftCollectionAddress } = accounts.value;
    console.dir(accounts.value);
    const res = await CollectionRewardInfo.fetch(connection, collectionPDA.value);
    if (!res) return
    onChainInfo.value = res.toJSON()

}
interface PDAsArrayItem {
    PDA: PublicKey,
    info: CollectionRewardInfoFields;
}

// const nftMint = "B2vPYLHVmVrbJHZnDtA6oUGUS429czJkAvitFaW11VLR"
watchEffect(async () => {
    console.log(onChainInfo.value)
    if (!collectionPDAs.value?.length) {
        const walletString = wallet.value.publicKey
        await (await program.value.account.collectionRewardInfo.all()).map((acct: ProgramAccount) => {
            if (acct.account.manager.toBase58() == walletString) {
                collectionPDAs.value = [...collectionPDAs.value, acct];
            }
            return;
        })




        console.log(collectionPDAs.value[0].account)
    }
})


async function handleInitCollectionPDAClick() {
    console.log(!!accounts.value)
    if (wallet.publicKey && api.value) {
        try {

            const tx = (await api.value.initStatePda(wallet.publicKey, collectionInfo.value)).tx
            if (!tx) {
                throw new Error('Possible TX Failure')
            }

        } catch (err: any) {
            console.log(err)
            return $q.notify({
                type: 'negative',
                message: err.message,
                timeout: 3000
            })

        }

    }
}

    // console.log(tx)
    // const tx2 = await ws?.program.value.methods.initializeStatePda(stateBump, ratePerDay, collectionName, rewardSymbol, fireEligible, PhoenixRelation
    //    ).accounts({
    //             statePda: statePDA,
    //             tokenPoa: rewardWallet,
    //             rewardMint: RewTok,
    //             // authPda: authPDA,
    //             nftCollectionAddress: nftCollectionAddress,
    //             funder: wallet.publicKey.value!,
    //             funderAta: funderTokenAta,
    //             systemProgram: SystemProgram.programId,
    //         }).rpc();
    //     }

    // tx2.feePayer = wallet.publicKey.value!;
    // tx2.recentBlockhash = (await ws?.connection.getLatestBlockhash()).blockhash
    // const signedTx = await ws?.wallet.value?.signTransaction(tx2)
    // const txId = await wallet.sendTransaction(signedTx, ws?.connection)
    // console.log("TX ID:", txId)
    // ws?.wallet.value?.signTransaction(tx)

    // console.log('sig:', tx)



</script>
<template>
    <h1>Admin Dashboard!</h1>
    <q-input v-model="collectionInfo.collectionName" label="Collection Name" />
    <q-input v-model="collectionInfo.collectionAddress" label="Collection Address" />


    <q-btn label="Init State" @click="handleInitCollectionPDAClick()" />
    <q-btn label="Get Info" @click="getCollectionInfo('TestEyes', demoRewardMint.toBase58())" />

    <CollectionOnChainInfo v-if="onChainInfo" :address="accounts?.statePDA" :onChainInfo="onChainInfo" />
</template>