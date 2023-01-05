<script setup lang="ts">
import { CollectionRewardInfo, EBNft, PhoenixUserRelation, PhoenixUserRelationJSON, PhoenixUserRelationKind, stake, StakeAccounts, StakeState, StakeStateJSON, StakeStateKind, UnstakeAccounts, UserStakeInfo, UserStakeInfoJSON } from 'src/types';
import { camelCaseToTitleCase, CopyClick, getStakingFee, chargeFeeTx } from 'src/helpers';
import { ref, watchEffect, getCurrentInstance, computed, onBeforeUnmount, onMounted, Ref } from 'vue';
import { Dialog, QNotifyCreateOptions, useDialogPluginComponent, useQuasar } from 'quasar';
import { useChainAPI } from 'src/api/chain-api';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { computedAsync } from '@vueuse/core';
import BN from 'bn.js';
const instance = getCurrentInstance();

const { wallet, connection, api, program } = useChainAPI();
const { notify, dialog } = useQuasar();

const props = defineProps<{
    nft: EBNft,
    eligible: boolean,
    stakeNft: (nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) => Promise<void>,
    unstakeNft: (nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }) => Promise<void>,
    redeem: (nft: EBNft, ebCollection: { loaded: boolean, info: CollectionRewardInfo | null }, timeStaked: number) => Promise<boolean>
}>();
const statusRef = ref<UserStakeInfoJSON | null>(null)
const phoenixUserRelation = ref<PhoenixUserRelationJSON['kind'] | null>(null)
const stakeStartRef = ref()
const yieldRef = ref<{ native: number | null, fire: number | null }>({ native: null, fire: null })
const fireRate = ref(0)
const timeStaked = ref()
const counterDisplay = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
const showNftDetails = ref(false);
const stakeStatus = ref<{ info: UserStakeInfoJSON | null, loaded: boolean }>({ loaded: false, info: null });
// const stakeStateComp = computed(() => stakeStatus?.value?.info?.stakeState)// || null);
const stakeStateRef = ref<StakeStateJSON['kind'] | null>(null);
const showStakeButton = computed(() => stakeStateRef.value === 'Unstaked');
const showUnstakeButton = computed(() => stakeStateRef.value === 'Staked');
const forceUnstake = ref(false);
// const loadingState = computed(() => stakeStateRef.value === undefined);
const ebCollection = ref({ loaded: false, info: <CollectionRewardInfo | null>{} })

// update the countdown timer values every second
const counterInterval = setInterval(() => {
    // get the current time and the target time in UTC string format
    const now = new Date().toUTCString();

    if (!stakeStateRef.value) return
    const timestart = Number(stakeStartRef.value);
    const nowSeconds = Math.round(new Date(now).getTime() / 1000)
    // compute the difference in milliseconds
    let diff = (nowSeconds - timestart)
    timeStaked.value = diff
    const dayInSeconds = 86400;
    const hourInSeconds = 3600;
    const minuteInSeconds = 60

    // compute the number of days, hours, minutes, and seconds remaining
    counterDisplay.value.days = Math.floor(diff / dayInSeconds);
    counterDisplay.value.hours = Math.floor((diff % dayInSeconds) / hourInSeconds);
    counterDisplay.value.minutes = Math.floor((diff % hourInSeconds) / minuteInSeconds);
    counterDisplay.value.seconds = Math.floor((diff % minuteInSeconds));
    if (ebCollection.value.info) {
        yieldRef.value = { native: diff * (ebCollection.value.info.ratePerDay / 86400), fire: diff * (fireRate.value / 86400) }
    }
}, 1000);



onBeforeUnmount(() => {
    // clear the interval when the component is destroyed
    clearInterval(counterInterval);
})


function toggleShowNftDetails() {
    showNftDetails.value = !showNftDetails.value;
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

async function handleStakeNft(nft: EBNft, eb: { loaded: boolean, info: CollectionRewardInfo | null }) {
    stakeStatus.value.loaded = false;
    await props.stakeNft(nft, eb)
    delayedRefresh(nft)
    return
}



async function handleUnstakeNft(nft: EBNft, eb: { loaded: boolean, info: CollectionRewardInfo | null }, force?: boolean) {
    stakeStatus.value.loaded = false;
    if (!force) {
        const redemption = await props.redeem(nft, eb, timeStaked.value)
        if (!redemption) return
    }
    await props.unstakeNft(nft, eb)
    delayedRefresh(nft)
    return
}

function delayedRefresh(nft: EBNft) {
    console.log("delayedRefresh");
    stakeStateRef.value = null;
    setTimeout(() => getStakeState(nft), 15000);
    return
}
async function getStakeState(nft: EBNft) {
    console.log('getStakeState');
    try {

        const s = await api.value?.getStakeStatusPda(wallet.value.publicKey, nft.mint)

        if (!s) throw new Error('Failed to get stake status PDA')
        const { pda } = s
        const status = await UserStakeInfo.fetch(connection, pda)
        if (!status) throw new Error('Failed to fetch Stake State from PDA')
        statusRef.value = status.toJSON()
        console.log("Stake status:", status.toJSON().stakeState.kind)
        stakeStatus.value.loaded = true;
        return
    } catch (err: any) {
        notify({
            type: 'error',
            message: 'Error',
            caption: err.message,
            icon: 'alert',
            position: 'top',
        })


        return 'Unstaked'
    }

}

async function handleRedeemRewards(nft: EBNft, eb: { loaded: boolean, info: CollectionRewardInfo | null }, fire?: boolean) {
    if (!fire) {
        await props.redeem(nft, eb, timeStaked.value)
        delayedRefresh(nft)
        return
    }
    console.log(`Redeeming ${nft.name} Reward`)
    return
}

async function getFireRate(pr: string) {
    switch (pr) {
        case 'Founder':
            return 10
        case 'Member':
            return 7
        case 'Affiliate':
            return 3
        case 'Saved':
            return 2
        case 'EmberBed':
            return 1
        default:
            return 0


    }
}

function startTimer() {
    counterInterval
}

if (counterDisplay.value.seconds == 0 && stakeStartRef.value) {
    startTimer()
}
watchEffect(async () => {
    // console.log(stakeStartRef.value)
    if (!stakeStatus.value.loaded) {
        console.log({ [props.nft.name]: stakeStatus.value.loaded })
        setTimeout(async () => await getStakeState(props.nft), 12000)

    }

    if (props.eligible && props.nft.ebCollection && !ebCollection.value.loaded) {
        const pda = new PublicKey(props.nft.ebCollection)
        const collectionInfo = await CollectionRewardInfo.fetch(connection, pda);
        if (collectionInfo) {
            if (collectionInfo.fireEligible) {
                fireRate.value = await getFireRate(collectionInfo.phoenixRelation.kind)
            }
            ebCollection.value.info = collectionInfo;
        }
    }

    if (statusRef.value) {
        stakeStartRef.value = statusRef.value.lastStakeRedeem;
        phoenixUserRelation.value = statusRef.value.phoenixStatus.kind
        stakeStateRef.value = statusRef.value.stakeState.kind;
    }
})


</script>
<template>

    <q-card class="nft-card-local" dark>
        <q-card-section v-if="!showNftDetails" @click="toggleShowNftDetails()">
            <q-img :src="nft.image" :ratio="1 / 1" width="100%" height="100%">
                <div v-if="!showStakeButton && stakeStateRef" class="absolute-top">

                    <span>{{ counterDisplay.days }}</span>:
                    <span>{{ counterDisplay.hours }}</span>:
                    <span>{{ counterDisplay.minutes }}</span>:
                    <span>{{ counterDisplay.seconds }}</span>
                    <!-- {{ fireRate }} -->
                </div>
                <div v-if="!showStakeButton && stakeStateRef" class="absolute-bottom">
                    <span>
                        ~ {{ yieldRef.native?.toFixed(4) }} {{ ebCollection.info?.rewardSymbol }}
                    </span>
                    <span v-if="props.eligible && ebCollection.info?.rewardSymbol !== '$FIRE'">
                        || ~{{ yieldRef.fire?.toFixed(4) }} $FIRE
                    </span>
                </div>
            </q-img>

        </q-card-section>
        <q-card-section v-if="showNftDetails">
            <q-icon class="col-md-3 offset-md-3" name="close" @click="toggleShowNftDetails()" />
            <q-list class="list">
                <div v-for="(v, k, i) in nft" :key="i" class="text-center">
                    <q-item clickable>
                        <q-item-section @click="() => handleCopyClick(k, v)">
                            {{ camelCaseToTitleCase(k) }}
                        </q-item-section>
                        <q-tooltip>
                            {{ v }}
                        </q-tooltip>
                    </q-item>
                    <q-separator spaced dark />
                </div>
            </q-list>
        </q-card-section>
        <q-card-section class="flex justify-around" v-if="ebCollection">
            <div class="collection-name--container">
                <span>
                    {{ ebCollection.info?.collectionName }} :
                </span>
                <br />
                <span> {{ props.nft.name }}
                </span>

            </div>
            <q-spinner v-if="!stakeStateRef" size="2rem" style="flex:0 0 100%;" />
            <div v-else class="flex justify-center">
                <q-card-actions class="flex justify-around">
                    <q-btn :class="$q.screen.gt.md ? 'action-btn' : 'mini-action-btn'" dense dark
                        v-if="showUnstakeButton" icon="&#x1F525;" :label="$q.screen.gt.md ? 'Redeem $FIRE' : void 0"
                        @click="handleRedeemRewards(nft, ebCollection, true)" />
                    <q-btn :class="$q.screen.gt.md ? 'action-btn' : 'mini-action-btn'" dense dark
                        v-if="showUnstakeButton && ebCollection.info?.rewardSymbol !== '$FIRE'" icon="&#x1FA99;"
                        :label="$q.screen.gt.md ? `Redeem ${ebCollection.info.rewardSymbol}` : 'Redeem Tokens'"
                        @click="handleRedeemRewards(nft, ebCollection, false)" />

                    <q-btn :class="$q.screen.gt.md ? 'action-btn' : 'mini-action-btn'" dense dark
                        v-if="showUnstakeButton" icon="remove" :label="$q.screen.gt.md ? 'Unstake' : void 0"
                        @click="handleUnstakeNft(nft, ebCollection, forceUnstake)" />
                    <span class="action-btn" v-if="showUnstakeButton">
                        <q-checkbox id="force" dark keep-color v-model="forceUnstake" />
                        <label for="force">Force Unstake</label>

                    </span>
                    <q-btn :class="$q.screen.gt.md ? 'action-btn' : 'mini-action-btn'" dense dark v-if="showStakeButton"
                        style="flex:0 0 90%" label="Stake" @click="handleStakeNft(nft, ebCollection)" />
                    <!-- <q-btn dark label="Check PDA" @click="checkPDA()" /> -->




                </q-card-actions>
            </div>
            <q-btn flat class='refresh-btn' dark icon="refresh" @click="getStakeState(nft)" />
        </q-card-section>
    </q-card>


</template>
<style lang="scss" scoped>
.nft-card-local {
    width: 100%;
    height: 100%;

}

.collection-name--container {
    width: 100%;
    // display: flex;
    // flex-flow: row wrap;
    // justify-content: flex-start;
    // align-items: center;

    // & span {
    //     flex: 100% 0 40%;
    // }

}

.action-btn {
    flex: 0 0 100%;
    // max-width: 200px
}

.refresh-btn {
    flex: 0 0 100%;
    color: $dirtyFont;
}

.list {
    height: 400px;
    overflow-y: auto;
}
</style>