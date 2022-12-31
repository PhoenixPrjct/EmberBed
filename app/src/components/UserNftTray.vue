<script lang="ts" setup>
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useChainAPI } from 'src/api/chain-api';
import { getNftsInWallet } from 'src/helpers/nftUtils';
import { ref, watchEffect, getCurrentInstance } from 'vue';
import { CollectionRewardInfo, CollectionRewardInfoJSON, DBCollectionInfo, EBNft, StakeAccounts, StakeStateJSON, UnstakeAccounts, UserStakeInfo, UserStakeInfoJSON } from "src/types";
import UserNftCard from "src/components/UserNftCard.vue"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { chargeFeeTx, getStakingFee } from 'src/helpers';

const { notify } = useQuasar();
const { api, connection } = useChainAPI();
const props = defineProps<{
    colPda: string | null
    theme: DBCollectionInfo["style"] | null
}>();

const stakeStateRef = ref<{ info: UserStakeInfoJSON, loaded: boolean }>({ loaded: false, info: null as unknown as UserStakeInfoJSON });

const { wallet } = useChainAPI();
const nfts = ref({ loading: true, loaded: false, ebNfts: <EBNft[]>[], otherNfts: <EBNft[]>[] })
const stakingAction = ref<{ message: string, percent: number }>({ message: '', percent: 0 })








async function stakeNft(nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) {
    try {
        stakingAction.value = { message: 'Getting Accounts', percent: 10 }
        const accounts = await api.value?.getAccounts({ user: wallet.value.publicKey, collectionName: ebCollection.info!.collectionName, rewardMint: ebCollection.info!.rewardMint.toBase58(), nftMint: nft.mint });
        console.log(`StatePDA ${accounts?.statePDA} | ebCollection ${nft.ebCollection}`)
        if (!accounts) throw new Error('Accounts Validation Failed, Please Refresh The Page')
        stakingAction.value = { message: 'Accounts All Good, calling EmberBed Program', percent: 50 }
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
        if (!stakeTx) throw new Error('TX Failed, Please Refresh The Page');
        stakingAction.value = { message: 'Staking Complete', percent: 90 }
        // console.log(`https://explorer.solana.com/tx/${stakeTx.tx}?cluster=devnet`)
        // refreshStakeState(nft)
        stakingAction.value = { message: 'Refreshing UI', percent: 100 }
        notify({
            group: 'staking',
            type: 'success',
            icon: 'grade',
            color: 'accent',
            message: `Successfully staked ${nft.name}`,
            caption: `https://explorer.solana.com/tx/${stakeTx.tx}?cluster=devnet`,
            position: 'top'

        })
        stakingAction.value = { message: '', percent: 0 }
    } catch (err: any) {
        stakingAction.value = { message: '', percent: 0 }
        notify({
            group: 'staking',
            type: 'error',
            icon: 'error',
            color: 'error',
            message: `Failed to unstake ${nft.name}`,
            caption: `${err.message}`,
            position: 'top'
        })

    }
    return
}

async function unstakeNft(nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) {
    try {
        if (!ebCollection.info) throw new Error('Colletion not loaded')
        stakingAction.value = { message: 'Unstaking NFT', percent: 10 }
        const feeAmount = await getStakingFee(ebCollection.info.phoenixRelation.kind)
        const paidTx = await chargeFeeTx(wallet.value.publicKey, feeAmount);
        if (!paidTx.success) throw new Error('Unstaking Fee TX Failed')
        console.log(paidTx)
        console.log(`Unstaking ${nft.name}`)
        const accounts = await api.value?.getAccounts({ user: wallet.value.publicKey, collectionName: ebCollection.info!.collectionName, rewardMint: ebCollection.info!.rewardMint.toBase58(), nftMint: nft.mint })
        if (!accounts) throw new Error('Accounts Not Validated')
        stakeStateRef.value.loaded = false;
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
        stakingAction.value = { message: 'Accounts All Good', percent: 50 }
        const tx = await (await api.value?.unstake(unstakeAccts))?.tx
        if (!tx) throw new Error('Transaction Failed')
        stakingAction.value = { message: 'NFT Unstaked', percent: 90 }
        console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        stakingAction.value = { message: 'Refreshing UI', percent: 100 }
        notify({
            group: 'staking',
            type: 'success',
            icon: 'grade',
            color: 'accent',
            message: `Successfully unstaked ${nft.name}`,
            caption: `https://explorer.solana.com/tx/${tx}?cluster=devnet`,
            position: 'top'

        })

        stakingAction.value = { message: '', percent: 0 }
    } catch (err: any) {
        stakingAction.value = { message: '', percent: 0 }
        notify({
            group: 'staking',
            type: 'error',
            icon: 'error',
            color: 'error',
            message: `Failed to unstake ${nft.name}`,
            caption: `${err.message}`,
            position: 'top'
        })

    }
    return
}



watchEffect(async () => {
    if (!nfts.value.loaded) {
        const { ebNfts, other } = await getNftsInWallet(wallet.value.publicKey);
        if (props.colPda) {
            nfts.value.ebNfts = ebNfts.filter(nft => nft.ebCollection == props.colPda)
        } else {
            nfts.value.ebNfts = ebNfts;
            nfts.value.otherNfts = other;

        }
        nfts.value.loaded = true;
    }

    nfts.value.loading = !nfts.value.loaded;



})

</script>
<template>
    <div v-if="nfts.loading && stakingAction.percent == 0">
        <q-spinner />
    </div>
    <q-card dark v-if="stakingAction.percent !== 0">
        <q-card-section class="staking-action">
            <q-card-section>
                <pre class="text-center">
                {{ stakingAction.message }}
                </pre>
            </q-card-section>
            {{ stakingAction.percent }}
            <q-card-section>
                <q-linear-progress size="25px" :value="stakingAction.percent" color="accent" class="q-mt-sm" />
            </q-card-section>
        </q-card-section>
    </q-card>
    <div v-else>
        <div class="eligible nft-card-container">
            <section v-if="!nfts.ebNfts.length">
                <h5>
                    You are not holding any NFTs for this Collection.
                </h5>
                <small> . . . at least not in the connected wallet.</small>
                <div style="margin:1rem auto">
                    <q-btn push label="Go Back" @click="$router.push('/user/')" />
                </div>
            </section>
            <section v-if="stakingAction.percent == 0">
                <div v-for="nft in nfts.ebNfts" :key="nft.mint" class="nft-card"
                    :style="theme ? `box-shadow: 0px 0px 12px 0px ${theme.colors.primary}` : `box-shadow: 0px 0px 12px 0px #ffff`">
                    <UserNftCard :nft="nft" :eligible="true" :stakeNft="stakeNft" :stakingAction="stakingAction"
                        :unstakeNft="unstakeNft" />
                </div>
            </section>

        </div>

        <!-- <div class="eligible nft-card-container">
            <div v-for="nft in nfts.otherNfts" :key="nft.mint" class="nft-card">
                <UserNftCard :nft="nft" :eligible="false" />
            </div>
        </div> -->
    </div>
</template>
<style lang="scss" scoped>
h5 {
    margin-bottom: 0px;
    padding-bottom: 0;
}

small {
    color: $accent;
}

.nft-card-container {

    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
    gap: 1.25rem 1.25rem;
    height: 100%;
    width: 100%;
    padding: 3rem;
    margin: 2rem;
}

.nft-card {
    max-width: 50%;
    max-height: 50%;
    min-width: 200px;
    min-height: 200px;
    flex: 0 0 200px;
}
</style>