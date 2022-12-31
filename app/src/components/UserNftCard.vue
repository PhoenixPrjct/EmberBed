<script setup lang="ts">
import { CollectionRewardInfo, EBNft, stake, StakeAccounts, StakeState, StakeStateJSON, UnstakeAccounts, UserStakeInfo, UserStakeInfoJSON } from 'src/types';
import { camelCaseToTitleCase, CopyClick, getStakingFee, chargeFeeTx } from 'src/helpers';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { useChainAPI } from 'src/api/chain-api';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
const instance = getCurrentInstance();

const { wallet, connection, api, program } = useChainAPI();
const { notify } = useQuasar();
const props = defineProps<{
    nft: EBNft,
    eligible: boolean,
    stakeNft: (nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) => Promise<void>,
    unstakeNft: (nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) => Promise<void>,
}>();
const showNftDetails = ref(false);
const stakeStatus = ref<{ info: UserStakeInfoJSON | null, loaded: boolean }>({ loaded: false, info: null });
const stakeStateComp = computed(() => stakeStatus?.value?.info?.stakeState)// || null);
const ebCollection = ref({ loaded: false, info: <CollectionRewardInfo | null>{} })
function toggleShowNftDetails() {
    showNftDetails.value = !showNftDetails.value;
}
async function handleStakeNft(nft: EBNft, eb: { loaded: boolean, info: CollectionRewardInfo | null }) {
    stakeStatus.value = { loaded: false, info: null as unknown as UserStakeInfoJSON };
    await props.stakeNft(nft, eb)
    await refreshStakeState(nft);
    return
}
async function handleUnstakeNft(nft: EBNft, eb: { loaded: boolean, info: CollectionRewardInfo | null }) {
    stakeStatus.value = { loaded: false, info: null as unknown as UserStakeInfoJSON };
    props.unstakeNft(nft, eb)
    await refreshStakeState(nft);
    return
}

async function refreshStakeState(nft: EBNft) {
    stakeStatus.value.loaded = false;

    const s = await api.value?.getStakeStatusPda(wallet.value.publicKey, nft.mint)
    if (!s) return stakeStatus.value.loaded = true;
    const { pda } = s
    const status = await UserStakeInfo.fetch(connection, pda)
    if (!status) return stakeStatus.value.loaded = true;

    stakeStatus.value.info = status.toJSON();
    // stakeStateComp.value = stakeStatus.value.info.stakeState
    // instance?.proxy?.$forceUpdate();
    stakeStatus.value.loaded = true;
    return stakeStatus.value.info;

    // if (!status) return
    // status.kind == StakeState.Staked.kind ?
    //     stakeState.value.info.stakeState = StakeState.Unstaked :
    //     stakeState.value.info.stakeState = StakeState.Staked
    // return stakeState.value.info.stakeState
}
async function checkPDA() {
    const pdaState = await program.value.account.collectionRewardInfo.fetch(props.nft.ebCollection!);
    console.log(pdaState);
}




// async function payFee() {
//     const feePaid = await api.value?.sendStakingFee();
//     if (!feePaid) return false;
//     console.log(feePaid)
//     return true;
// }


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
    console.log({ Comp: stakeStateComp.value })
    console.log({ Status: stakeStatus.value })
    if ((props.eligible && props.nft.ebCollection && !stakeStatus.value.loaded) || !stakeStateComp.value) {
        console.log("WatchEffect Refresh")
        refreshStakeState(props.nft);

    }
    if (!stakeStatus.value.loaded) {
        console.log(props.nft.name, ':', stakeStatus.value.loaded)
        refreshStakeState(props.nft);

    }


    if (props.eligible && props.nft.ebCollection && !ebCollection.value.loaded) {
        const pda = new PublicKey(props.nft.ebCollection)
        const collectionInfo = await CollectionRewardInfo.fetch(connection, pda);
        if (collectionInfo) {
            ebCollection.value.info = collectionInfo;
        }
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
            {{ ebCollection.info?.collectionName }} : {{ props.nft.name }}
            <div v-if="stakeStateComp && eligible && ebCollection.info">
                <q-card-actions v-if="stakeStateComp?.kind == 'Staked'">
                    <q-btn dark icon="&#x1F525;" @click="handleRedeemRewards(nft, true)" />
                    <q-btn dark icon="&#x1FA99;" @click="handleRedeemRewards(nft, false)" />
                    <q-btn dark icon="remove" @click="handleUnstakeNft(nft, ebCollection)" />
                </q-card-actions>
            </div>
            <div>
                <q-card-actions
                    v-if="(!stakeStatus.info || stakeStateComp?.kind == 'Unstaked') && eligible && ebCollection.info">
                    <q-btn dark label="Stake" @click="handleStakeNft(nft, ebCollection)" />
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