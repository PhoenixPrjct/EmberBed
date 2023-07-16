<script lang="ts" setup>
import axios from 'axios';
import { QBtn, QCard, QCardSection, QLinearProgress, QSpinner, useQuasar } from 'quasar';
import { useChainAPI } from 'src/api/chain-api';
import { getNftsInWallet } from 'src/helpers/nftUtils';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
import {
    CollectionRewardInfo, RedeemRewardAccounts,
    DBCollectionInfo, EBNft, RedeemFireAccounts,
    StakeAccounts, UnstakeAccounts,
    UserStakeInfoJSON
} from "src/types";
import { useRoute, useRouter } from 'vue-router';
import UserNftCard from "src/components/UserNftCard.vue"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { chargeFeeTx, getStakingFee, getExplorerURL } from 'src/helpers';
import { FIRE_INFO, FIRE_MINT_PUB } from "src/helpers/constants";

const { notify } = useQuasar();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const { api, connection } = useChainAPI();
const props = defineProps<{
    colPda: string | null
    theme: DBCollectionInfo["style"] | null
    // eligible: boolean | null
}>();


// const userStakeInfoRef = ref<{ info: UserStakeInfoJSON, loaded: boolean }>({ loaded: false, info: null as unknown as UserStakeInfoJSON });

const { wallet } = useChainAPI();
const nfts = ref({ loading: true, loaded: false, ebNfts: <EBNft[]>[], otherNfts: <EBNft[]>[] })
const stakingAction = ref<{ message: string, percent: number }>({ message: 'No Message', percent: 0 })


async function stakeNft(nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) {
    try {
        stakingAction.value = { message: 'Getting Accounts', percent: .1 }
        const accounts = await api.value?.getAccounts({ user: wallet.value.publicKey, collectionName: ebCollection.info!.collectionName, rewardMint: ebCollection.info!.rewardMint.toBase58(), nftMint: nft.mint });
        console.log(`StatePDA ${accounts?.statePDA} | ebCollection ${nft.ebCollection}`)
        if (!accounts) throw new Error('Accounts Validation Failed, Please Refresh The Page')
        stakingAction.value = { message: 'Accounts All Good, calling EmberBed Program', percent: .5 }
        const stakeAccts: StakeAccounts = {
            user: wallet.value!.publicKey,
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
        stakingAction.value = { message: 'Staking NFT', percent: .8 }
        const stakeTx = await api.value?.stake(stakeAccts)
        if (!stakeTx) throw new Error('TX Failed, Please Refresh The Page');
        await setTimeout(() => { console.log('...') }, 2000)
        // console.log(`https://explorer.solana.com/tx/${stakeTx.tx}?cluster=devnet`)
        // refreshStakeState(nft)
        stakingAction.value = { message: 'Staking Complete', percent: 1 }
        notify({
            group: 'staking',
            type: 'success',
            icon: 'grade',
            color: 'accent',
            message: `Successfully Staked ${nft.name}`,
            caption: getExplorerURL(stakeTx.tx),
            position: 'top',
            timeout: 5000,
            html: true

        })
        stakingAction.value = { message: '', percent: 0 }
        // stakeStateRef.value.info.stakeState.kind = stakeTx.stakeStatus?.kind ? stakeTx.stakeStatus.kind : 'Staked'
        return
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
        stakingAction.value = { message: 'Unstaking NFT', percent: .1 }
        const feeAmount = await getStakingFee(ebCollection.info.phoenixRelation.kind)
        const paidTx = await chargeFeeTx(wallet.value!.publicKey, feeAmount);
        if (!paidTx.success) throw new Error('Unstaking Fee TX Failed')
        console.log(paidTx)
        console.log(`Unstaking ${nft.name}`)
        const accounts = await api.value?.getAccounts({ user: wallet.value!.publicKey, collectionName: ebCollection.info!.collectionName, rewardMint: ebCollection.info!.rewardMint.toBase58(), nftMint: nft.mint })
        if (!accounts) throw new Error('Accounts Not Validated')
        stakingAction.value.percent = 2.5;
        // userStakeInfoRef.value.loaded = false;
        const unstakeAccts: UnstakeAccounts = {
            user: wallet.value!.publicKey,
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
        // Object.entries(unstakeAccts).forEach(([key, value]) => { console.log(key, value.toBase58()) })
        stakingAction.value = { message: 'Accounts All Good', percent: .5 }
        const unstakeTx = await (await api.value?.unstake(unstakeAccts))
        if (!unstakeTx?.tx) throw new Error('Transaction Failed')
        stakingAction.value = { message: 'NFT Unstaked', percent: .9 }
        // console.log(`https://explorer.solana.com/tx/${unstakeTx.tx}?cluster=devnet`)
        stakingAction.value = { message: 'Refreshing UI', percent: 1 }
        notify({
            group: 'staking',
            type: 'success',
            icon: 'grade',
            color: 'accent',
            message: `Successfully unstaked ${nft.name}`,
            caption: getExplorerURL(unstakeTx.tx),
            position: 'top',
            timeout: 5000,
            html: true

        })

        stakingAction.value = { message: '', percent: 0 }
        // stakeStateRef.value.info.stakeState.kind = unstakeTx.stakeState?.kind ? unstakeTx.stakeState.kind : 'Unstaked'

        return
    } catch (err: any) {
        stakingAction.value = { message: '', percent: 0 }

        notify({
            group: 'staking',
            type: 'error',
            icon: 'error',
            color: 'error',
            message: `Failed to unstake ${nft.name}`,
            caption: `${err.message}`,
            position: 'top',
            timeout: 10000
        })
        return
    }
}

async function redeem(nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }, timeStaked: number) {
    try {
        if (!ebCollection.info) throw new Error('Collection Data is Incorrect, Please Refresh and try again')
        const amount = (timeStaked / 86400) * ebCollection.info.ratePerDay
        stakingAction.value = { message: 'Accounts Checkout', percent: 0.25 }
        const accounts = await api.value?.getAccounts({ user: wallet.value!.publicKey, collectionName: ebCollection.info.collectionName, rewardMint: ebCollection.info.rewardMint.toBase58(), nftMint: nft.mint });
        if (!accounts) throw new Error('Accounts Validation Failed, Please Refresh The Page')
        const redeemAccts: RedeemRewardAccounts = {
            ...accounts,
            user: wallet.value!.publicKey,
            collectionRewardInfo: accounts.statePDA,
            stakeStatus: accounts.stakeStatusPda,
            rewardMint: accounts.RewTok,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
        }
        const bumpState = accounts.stateBump
        const collectionName = ebCollection.info.collectionName
        stakingAction.value = { message: `Redeeming  ${amount.toFixed(4)} ${ebCollection.info.rewardSymbol}`, percent: 0.75 }
        const redeemTx = await api.value?.redeemReward(redeemAccts, collectionName, bumpState);
        if (!redeemTx) throw new Error('TX Failed, Please Refresh The Page');
        stakingAction.value = { message: `Complete`, percent: 1 }
        notify({
            message: `Redeemed ${ebCollection.info.rewardSymbol}`,
            caption: getExplorerURL(redeemTx),
            color: 'accent',
            type: 'success',
            position: 'top',
            timeout: 10000,
            html: true
        })
        stakingAction.value = { message: '', percent: 0 }
        return true
    } catch (err: any) {
        stakingAction.value = { message: '', percent: 0 }
        console.error(err)
        notify({
            group: 'staking',
            type: 'error',
            icon: 'error',
            color: 'error',
            message: `Failed to redeem ${ebCollection?.info?.rewardSymbol || 'Token'}`,
            caption: `${err.message}`,
            position: 'top'
        })
        return false;
    }

}

async function redeemFire(nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) {
    try {
        if (!ebCollection.info) throw new Error('Collection Data is Incorrect, Please Refresh and try again')
        console.log({ redeemFire_Collection_Address: ebCollection.info.collectionAddress.toJSON() });
        stakingAction.value = { message: 'Accounts Checkout', percent: 0.25 }
        const accounts = await api.value?.getAccounts({ user: wallet.value!.publicKey, collectionName: ebCollection.info.collectionName, rewardMint: ebCollection.info.rewardMint.toBase58(), nftMint: nft.mint });
        if (!accounts) throw new Error('Accounts Validation Failed, Please Refresh The Page')
        console.log({ POA: (await FIRE_INFO).FIRE_POA.toJSON(), REWARD_WALLET: (await FIRE_INFO).FIRE_MINT.toJSON() });
        const redeemAccts: RedeemFireAccounts = {
            firePoa: (await FIRE_INFO).FIRE_POA,
            user: wallet.value!.publicKey,
            collectionInfo: new PublicKey(ebCollection.info.uuid),
            fireInfo: (await FIRE_INFO).FIRE_PDA,
            stakeStatus: accounts.stakeStatusPda,
            fireMint: FIRE_MINT_PUB.pub,
            tokenProgram: TOKEN_PROGRAM_ID,
            userRewardAta: accounts.userFireAta!,
            systemProgram: SystemProgram.programId
        }
        console.dir({ collectionInfo: redeemAccts.collectionInfo.toJSON(), fireInfo: redeemAccts.fireInfo.toJSON(), firePOA: redeemAccts.firePoa.toJSON() })
        // const bumpFire = accounts.fireBump!
        // const collectionName = ebCollection.info.collectionName
        // stakingAction.value = { message: `Redeeming for $FIRE`, percent: 0.75 }
        // const redeemTx = await api.value?.redeemFire(redeemAccts, bumpFire, 0, collectionName);
        // if (!redeemTx) throw new Error('TX Failed, Please Refresh The Page');
        // stakingAction.value = { message: `Complete`, percent: 1 }
        // notify({
        //     group: 'staking',
        //     type: 'success',
        //     icon: 'grade',
        //     color: 'accent',
        //     message: `Redeemed ${ebCollection.info.rewardSymbol}`,
        //     caption: getExplorerURL(redeemTx),
        //     position: 'top',
        //     timeout: 10000
        // })
        // stakingAction.value = { message: '', percent: 0 }
        return true

    } catch (err: any) {
        stakingAction.value = { message: '', percent: 0 }
        console.error(err)
        notify({
            group: 'staking',
            type: 'error',
            icon: 'error',
            color: 'error',
            message: `Failed to redeem $FIRE'}`,
            caption: `${err.message}`,
            position: 'top'
        })
        return false;
    }

}
function handleGoBackClick() {
    if (route.path == '/user/') {
        router.push('/')
    }
    else {
        router.back();
    }
}

watchEffect(async () => {
    if (!nfts.value.loaded) {
        const { ebNfts, other } = await getNftsInWallet(wallet.value!.publicKey);
        if (props.colPda) {
            nfts.value.ebNfts = ebNfts.filter(nft => nft?.ebCollection == props.colPda);
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
    <div class="flex justify-center" v-if="nfts.loading && stakingAction.percent == 0">
        {{ nfts.loading ? 'Loading...' : 'Loaded' }}
        <q-spinner size="5rem" />
    </div>
    <q-card dark v-if="stakingAction.percent !== 0">
        <q-card-section class="staking-action">
            <q-card-section class="text-center text-h5">
                {{ stakingAction.message }}
            </q-card-section>
            <q-card-section>
                <q-linear-progress dark size="2rem" :value="stakingAction.percent" color="accent" class="q-mt-sm special">
                    <div class="absolute-full flex flex-center">
                        <q-badge color="white" text-color="accent" :label="`${stakingAction.percent * 100} %`" />
                    </div>
                </q-linear-progress>
            </q-card-section>
        </q-card-section>
    </q-card>
    <div>
        <div class="eligible">
            <section class="not-holding" v-if="nfts.loaded && !nfts.ebNfts.length">
                <div class="message">
                    <h5>
                        You are not holding any NFTs eligible for staking.
                    </h5>
                    <p> . . . at least not in the connected wallet.</p>
                </div>
                <div style="margin:1rem auto; flex:0 0 30%">
                    <q-btn push label="Go Back" @click="handleGoBackClick()" />
                </div>
            </section>
            <section class="nft-card-container" v-if="nfts.ebNfts.length && stakingAction.percent == 0">

                <div v-for="nft in nfts.ebNfts" :key="nft.mint" class="nft-card"
                    :style="theme ? `box-shadow: 0px 0px 12px 0px ${theme.colors.accent}` : `box-shadow: 0px 0px 12px 0px #ffff`">
                    <UserNftCard :nft="nft" :stakeNft="stakeNft" :unstakeNft="unstakeNft" :redeem="redeem"
                        :redeemFire="redeemFire" :theme="theme" />
                </div>
            </section>
        </div>
    </div>
</template>
<style lang="scss" scoped>
h5 {
    margin-bottom: 0px;
    padding-bottom: 0;
}

p {
    color: $accent;
}

.message {
    flex: 0 0 80%;
}

.not-holding {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
}

.nft-card-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
    gap: 3rem 1rem;
    height: 100%;
    width: 100%;
    padding: .5rem;
    margin: 1rem;
}

.nft-card {
    margin: 1rem;
    flex: 0 0 22%;
    max-width: 300px;
    // max-height: 300px;
    // min-width: 320px
}

@media screen and (min-width:1200px) {
    .nft-card-container {
        justify-content: center;
    }

    .nft-card {
        flex: 0 0 20%;
    }

}

@media screen and (max-width:900px) {
    .nft-card-container {
        gap: 0 5rem;
    }

    .nft-card {
        min-width: unset;
        max-width: unset;
        max-height: unset;
        flex: 0 0 35%;
    }

}


@media screen and (max-width:768px) {
    .nft-card-container {
        gap: 1rem;
    }

    .nft-card {
        flex: 0 0 100%;
    }

}

@media screen and (max-width:500px) {
    .eligible {
        padding: 1rem;
    }

    .nft-card-container {
        margin: 0;
        // padding: 1rem;
    }
}
</style>