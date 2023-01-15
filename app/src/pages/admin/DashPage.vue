<script setup lang="ts">
import { ref, watchEffect, Ref } from 'vue';
import { Keypair, PublicKey } from '@solana/web3.js';
// import { useWorkspace, initWorkspace } from 'src/composables';
// import { fundKP } from '../../solana/fundWallet'
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { useChainAPI } from '../../api/chain-api';
import axios from 'src/boot/axios';
import { CollectionInfo, CollectionRewardInfo, Accounts, CollectionRewardInfoJSON, CollectionRewardInfoFields, PhoenixRelation, UserStakeInfo } from '../../types';

import { CopyClick } from 'src/helpers';
import CollectionOnChainInfo from 'src/components/CollectionContainer.vue';
import { useAnchorWallet } from 'solana-wallets-vue';
import { ProgramAccount } from '@project-serum/anchor';
import { EmberBed } from 'src/solana/types/ember_bed';

const $q = useQuasar();

const { api, connection, program } = useChainAPI();
const wallet = useAnchorWallet();
// const readyForInfo = ref(false)
// const fundWallet = Keypair.fromSecretKey(Uint8Array.from(fundKP));

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


// const nftMint = "B2vPYLHVmVrbJHZnDtA6oUGUS429czJkAvitFaW11VLR"
watchEffect(async () => {
    const walletString = wallet.value?.publicKey.toBase58()
    console.log(onChainInfo.value)
    if (!collectionPDAs.value?.length) {
        const collectionsRaw = await program.value.account.collectionRewardInfo.all()
        if (wallet.value?.publicKey.toBase58() == 'DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q') {
            await collectionsRaw.map((acct: ProgramAccount) => {
                collectionPDAs.value = [...collectionPDAs.value, acct];
            })
        } else {
            await collectionsRaw.map((acct: ProgramAccount) => {
                console.log(acct.account)
                if (acct.account.manager.toBase58() == walletString) {
                    collectionPDAs.value = [...collectionPDAs.value, acct];
                }

            })
            return;
        }
    }
})

async function getCollectionInfo(collectionName: string, rewardMint: string) {
    onChainInfo.value = null as unknown as CollectionRewardInfoJSON
    if (!api.value) return false;
    accounts.value = await api.value.getAccounts({ user: wallet.value!.publicKey, collectionName, rewardMint });
    const { RewTok, stateBump, statePDA, rewardWallet, funderTokenAta, userAccountPDA, userRewardAta, nftCollectionAddress } = accounts.value;

    const res = await CollectionRewardInfo.fetch(connection, statePDA);
    if (!res) return

    onChainInfo.value = res.toJSON()

}

async function handleCopyClick(e: any, v?: string) {
    e.target.innerText ?
        v = e.target.innerText :
        v = undefined
    if (typeof (v) !== 'string') {
        return $q.notify({
            color: 'red-10',
            textColor: 'white',
            icon: 'warning',
            message: `So that didn't work. . . sorry`,
            caption: `Was Expecting Type To Be 'string' . . . contact the dev.`,
            position: 'top'

        })
    }
    const result: QNotifyCreateOptions = await CopyClick(v);
    return $q.notify({ ...result })

}
</script>
<template>
    <section class="btn-container">
        <q-btn dark label="Add New" icon="add" :class="!collectionPDAs.length ? 'add-btn' : void 0" to="/admin/new" />

        <q-btn dark label="Stats" icon="query_stats">
            <q-tooltip>Coming Soon.</q-tooltip>
        </q-btn>

        <q-btn dark label="Active Collections" @click="getCollectionInfo('TestEyes', demoRewardMint.toBase58())"
            icon="person" />
    </section>
    <section class="info-container">
        <h4>This is where info will go on how to use this page.</h4>
    </section>


    <CollectionOnChainInfo v-if="collectionPDAs" :collectionPDAs="collectionPDAs" />
    <section v-else>
        <q-card dark class="no-collections ">
            <q-card-section class="text-h5 text-center">
                No Collections Found for <div class="pubkey" @click="(e) => handleCopyClick(e)">

                    {{ wallet?.publicKey }}
                </div>

            </q-card-section>
        </q-card>
    </section>
</template>
<style lang="scss" scoped>
.no-collections {
    width: 50%;
    margin: auto;

}

.add-btn {
    box-shadow: (0px 0px 10px $secondary);
    animation: pulse 1s linear infinite;

}

@keyframes pulse {
    0% {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    50% {
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
    }

    100% {
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
}

.btn-container,
.info-container {
    display: flex;
    justify-content: center;
    padding: 2em;
}

.btn-container {
    gap: 2rem;
    flex-flow: row wrap;
    margin: 1rem;
}
</style>