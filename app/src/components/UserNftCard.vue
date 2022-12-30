<script setup lang="ts">
import { CollectionRewardInfo, EBNft, StakeAccounts, StakeState, StakeStateJSON, UnstakeAccounts, UserStakeInfo, UserStakeInfoJSON } from 'src/types';
import { camelCaseToTitleCase, CopyClick, getStakingFee, chargeFeeTx } from 'src/helpers';
import { ref, watchEffect } from 'vue';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { useChainAPI } from 'src/api/chain-api';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

const { wallet, connection, api, program } = useChainAPI();
const { notify } = useQuasar();
const props = defineProps<{ nft: EBNft, eligible: boolean }>();
const showNftDetails = ref(false);
const stakeState = ref<{ info: UserStakeInfoJSON, loaded: boolean }>({ loaded: false, info: null as unknown as UserStakeInfoJSON });
const ebCollection = ref({ loaded: false, info: <CollectionRewardInfo | null>{} })
function toggleShowNftDetails() {
    showNftDetails.value = !showNftDetails.value;
}
async function checkPDA() {
    const pdaState = await program.value.account.collectionRewardInfo.fetch(props.nft.ebCollection!);
    console.log(pdaState);
}

function refreshStakeState() {
    stakeState.value.loaded = false;
    stakeState.value.info.stakeState.kind == StakeState.Staked.kind ?
        stakeState.value.info.stakeState = StakeState.Unstaked :
        stakeState.value.info.stakeState = StakeState.Staked

    console.log(stakeState.value.info.stakeState);
    return stakeState.value.info.stakeState
}
async function handleStakeNft(nft: EBNft) {
    const accounts = await api.value?.getAccounts({ user: wallet.value.publicKey, collectionName: ebCollection.value.info!.collectionName, rewardMint: ebCollection.value.info!.rewardMint.toBase58(), nftMint: nft.mint });
    console.log(`StatePDA ${accounts?.statePDA} | ebCollection ${props.nft.ebCollection}`)
    if (!accounts) return;
    const stakeAccts: StakeAccounts = {
        user: wallet.value.publicKey,
        userRewardAta: accounts.userRewardAta,
        nftAta: accounts.nftTokenAddress,
        nftMintAddress: accounts.nft.mint.address,
        nftEdition: accounts.nft.edition.address,
        rewardMint: accounts.RewTok,
        collectionRewardInfo: accounts.statePDA,
        stakeStatus: accounts.stakeStatusPda,
        programAuthority: accounts.delegatedAuthPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadataProgram: METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
    }
    console.log(`Staking ${nft.mint}`)
    const stakeTx = await api.value?.stake(stakeAccts)
    if (!stakeTx) return;
    console.log(`https://explorer.solana.com/tx/${stakeTx.tx}?cluster=devnet`)
    refreshStakeState();
    return notify({
        group: 'staking',
        type: 'success',
        icon: 'grade',
        color: 'accent',
        message: `Successfully staked ${nft.name}`,
        caption: `https://explorer.solana.com/tx/${stakeTx.tx}?cluster=devnet`,

    })
}

// async function payFee() {
//     const feePaid = await api.value?.sendStakingFee();
//     if (!feePaid) return false;
//     console.log(feePaid)
//     return true;
// }

async function handleUnstakeNft(nft: EBNft) {
    if (!ebCollection.value.info) return false;
    const feeAmount = await getStakingFee(ebCollection.value.info.phoenixRelation.kind)
    const paidTx = await chargeFeeTx(wallet.value.publicKey, feeAmount);
    if (!paidTx) return false;
    console.log(paidTx)
    console.log(`Unstaking ${nft.name}`)
    const accounts = await api.value?.getAccounts({ user: wallet.value.publicKey, collectionName: ebCollection.value.info!.collectionName, rewardMint: ebCollection.value.info!.rewardMint.toBase58(), nftMint: nft.mint })
    if (!accounts) return;
    const unstakeAccts: UnstakeAccounts = {
        user: wallet.value.publicKey,
        nftAta: accounts.nftTokenAddress,
        nftMintAddress: accounts.nft.mint.address,
        // userAccountPda: null,
        nftEdition: accounts.nft.edition.address,
        stakeStatus: accounts.stakeStatusPda,
        programAuthority: accounts.delegatedAuthPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadataProgram: METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
    }
    console.log(accounts);
    const unstakeTx: { tx: string, stakeState: StakeStateJSON } | any = await api.value?.unstake(unstakeAccts)
    if (!unstakeTx) return;
    console.log(`https://explorer.solana.com/tx/${unstakeTx.tx}?cluster=devnet`)
    refreshStakeState();
    return notify({
        group: 'staking',
        type: 'success',
        icon: 'grade',
        color: 'accent',
        message: `Successfully unstaked ${nft.name}`,
        caption: `https://explorer.solana.com/tx/${unstakeTx.tx}?cluster=devnet`,

    })
}
async function handleRedeemRewards(nft: EBNft, fire?: boolean) {
    console.log(`Redeeming ${nft.name} Reward`)
}
async function handleCopyClick(k: string, v: any) {
    if (k == 'misc') return
    if (typeof (v) !== 'string') {
        v = JSON.stringify(v);
        console.log(v);
    }
    const result: QNotifyCreateOptions = await CopyClick(v);
    return notify({ ...result, caption: v })

}

watchEffect(async () => {
    if (props.eligible && props.nft.ebCollection && !ebCollection.value.loaded) {
        const pda = new PublicKey(props.nft.ebCollection)
        const collectionInfo = await CollectionRewardInfo.fetch(connection, pda);
        if (collectionInfo) {
            ebCollection.value.info = collectionInfo;
        }
    }
    if (props.eligible && props.nft.ebCollection && !stakeState.value.loaded) {
        const s = await api.value?.getStakeStatusPda(wallet.value.publicKey, props.nft.mint)
        if (!s) return;
        const { pda } = s
        const status = await UserStakeInfo.fetch(connection, pda)
        console.log(status?.toJSON())
        stakeState.value.info = status?.toJSON() || null as unknown as UserStakeInfoJSON
        stakeState.value.loaded = true;
    }
})


</script>
<template>
    <q-card class="nft-card" dark>
        <q-card-section v-if="!showNftDetails" @click="toggleShowNftDetails()">
            <q-img :src="nft.image" :ratio="1 / 1" width="100%" height="100%" />

        </q-card-section>
        <q-card-section v-if="showNftDetails">
            <q-icon class="col-md-3 offset-md-3" name="close" @click="toggleShowNftDetails()" />
            <q-list class="list">
                <q-item v-for="(v, k, i) in nft" :key="i">
                    <q-item-section @click="() => handleCopyClick(k, v)">
                        {{ camelCaseToTitleCase(k) }}
                    </q-item-section>
                    <q-tooltip>
                        {{ v }}
                    </q-tooltip>

                </q-item>
            </q-list>
        </q-card-section>
        <q-card-section v-if="eligible && ebCollection">
            {{ ebCollection.info?.collectionName }}
            <div v-if="stakeState.info && eligible && ebCollection.info">
                <q-card-actions v-if="stakeState.info.stakeState?.kind == 'Staked'">
                    <q-btn dark icon="&#x1F525;" @click="handleRedeemRewards(nft, true)" />
                    <q-btn dark icon="&#x1FA99;" @click="handleRedeemRewards(nft, false)" />
                    <q-btn dark icon="remove" @click="handleUnstakeNft(nft)" />
                </q-card-actions>
            </div>
            <div>
                <q-card-actions
                    v-if="(!stakeState.info || stakeState.info.stakeState.kind == 'Unstaked') && eligible && ebCollection.info">
                    <q-btn dark label="Stake" @click="handleStakeNft(nft)" />
                    <!-- <q-btn dark label="Check PDA" @click="checkPDA()" /> -->
                </q-card-actions>
            </div>
        </q-card-section>
    </q-card>

</template>
<style lang="scss" scoped>
.list {
    height: 200px;
    overflow-y: auto;
}
</style>