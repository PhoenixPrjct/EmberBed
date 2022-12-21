<script setup lang="ts">
import { PublicKey } from '@solana/web3.js';
import { CollectionInfo, CollectionRewardInfo, CollectionRewardInfoJSON, PhoenixRelationKind } from 'src/types';
import { getTokenInfo, SplKey, MutableTokenInfo } from 'src/helpers'
import { TokenInfo } from '@solana/spl-token-registry';
import { ref, Ref } from 'vue';

function onSubmit() {

    // charge 10 SOL / (5 SOL if redeemFireToken == true)
    // if successful,call initState(), 
    // if successful,add Collection to MongoDB
    console.log('submit!');
}
function onReset() {
    console.log('reset!');
}

function isPK(v: PublicKey | string): boolean {
    try {
        v = new PublicKey(v);
    } catch (e) {
        return false;
    }
    return true;
}



const collectionInfo = ref<CollectionInfo>({
    rewardWallet: '',
    manager: '',
    rewardMint: "",
    collectionName: "",
    collectionAddress: "",
    ratePerDay: 0,
    fireEligible: false,
    phoenixRelation: {} as PhoenixRelationKind,
    rewardSymbol: "",
}) as Ref<CollectionRewardInfoJSON>

async function handleFindSplTokenInfo() {
    findSplToken.value.loading = true
    findSplToken.value.info = {} as TokenInfo[]
    try {
        findSplToken.value.key = findSplToken.value.key.toLowerCase().trim() as SplKey
        findSplToken.value.val.trim()
        console.log('findSplToken', findSplToken.value)
        const result = await getTokenInfo(findSplToken.value.key, findSplToken.value.val)
        console.log('findSplToken result', result)
        if (!result) throw new Error('No Token Found');
        findSplToken.value._info = { ...result }
        findSplToken.value.info = Object.assign([], [...findSplToken.value._info])
        findSplToken.value.loading = false;
    } catch (e) {
        findSplToken.value.loading = false;
        findSplToken.value.info = null;
        return null;
    }
}

async function handleSplTokenClick(tokenInfo: TokenInfo) {
    collectionInfo.value.rewardMint = tokenInfo.address
    collectionInfo.value.rewardSymbol = tokenInfo.symbol
    findSplToken.value.info = findSplToken.value._info?.filter(token => {
        if (token == tokenInfo) {
            return [token]
        }
        return null;

    })
}

const findSplToken = ref({
    loading: false,
    options: ['Name', 'Symbol', 'Address'],
    key: <SplKey>'Name',
    val: '',
    info: <MutableTokenInfo[] | null>null,
    _info: <TokenInfo[] | null>null
})

const splTokenInfo = ref(null)
const fireDialogShow = ref(false);
const makeRegToken = ref(null)
const makeRegTokenOptions = ['Create & Register', 'Register Existing Token']
const redeemForFireToggle = ref(false);
</script>
<template>
    <q-page class="flex justify-center">
        <div class="q-pa-md form--container" style=" width: 90%">
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

                <h5>EmberBed Info</h5>
                <small>This is how we categorize your NFT collection on the platform.</small>
                <q-separator dark spaced />
                <q-input dense dark filled v-model="collectionInfo.collectionName" placeholder="Name of Nft Collection"
                    hint="Collection Name: Bored Ape Yacht Club, DeGods, etc. " lazy-rules
                    :rules="[val => val && val.length > 0 || 'This Must Have a Value']" />
                <div class="verify-collection--div">
                    <q-input class="verify-collection--input" dense dark filled
                        v-model="collectionInfo.collectionAddress" placeholder="Verified Collection Address" lazy-rules
                        :rules="[val => val && val.length > 0 || 'This Must Have a Value']" />
                    <q-btn v-if="!collectionInfo.collectionAddress" class="center" target="_blank" type="a" dark flat
                        icon="policy" href="https://collections.metaplex.com">
                        <q-tooltip> Verify Your Collection on Metaplex</q-tooltip>
                    </q-btn>
                </div>

                <q-toggle dark v-model="redeemForFireToggle" label="$FIRE Redemption?" />
                <q-btn flat icon-color="accent" icon="info" @click="fireDialogShow = true">
                    <q-tooltip>
                        Allow your community to stake for $FIRE tokens.
                    </q-tooltip>
                </q-btn>
                <h5>Reward Token Info</h5>
                <small>What token is your community staking for?</small>
                <q-separator dark spaced />
                <small> *Reward Tokens Must be Registered with SPL TokenList </small>
                <div class="flex justify-center full-width">
                    <q-select dark v-model="findSplToken.key" :options="findSplToken.options" />
                    <q-input dark v-model="findSplToken.val" />
                    <q-btn :disable="!findSplToken.key || !findSplToken.val || findSplToken.loading" dark dense
                        icon="search" @click="handleFindSplTokenInfo()" />
                    <q-icon name="info" color="accent">
                        <q-tooltip>Search Metaplex Registry For Your Token</q-tooltip>
                    </q-icon>
                </div>
                <div class=" flex justify-around" v-if="!findSplToken.loading && findSplToken.info">
                    <q-card class="token-card" dark v-for="token in findSplToken.info" :key="token.address">
                        <q-card-section horizontal>

                            <q-img fit="contain" class="token-image" v-if="token.logoURI" :src="token.logoURI" />


                            <q-card-section class="token-inputs">
                                <q-input dark dense readonly v-model="token.name" label="Name" />
                                <q-input dark dense readonly v-model="token.symbol" label="Symbol" />
                                <q-input dark dense readonly v-model="token.address" label="Mint Address" />
                                <q-input dark dense readonly v-model="token.decimals" label="Decimals" />
                            </q-card-section>
                        </q-card-section>
                        <q-card-action dark class="flex justify-center select-btn">
                            <q-btn flat dark round dense label="Select" @click="handleSplTokenClick()" />
                        </q-card-action>
                    </q-card>


                </div>
                <div>
                    <q-btn dark label="Submit" type="submit" color="primary" />
                    <q-btn dark label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
            </q-form>
        </div>
        <q-dialog v-model="fireDialogShow">
            <q-card class="dialog">

                This is info about staking for $fire.
            </q-card>
        </q-dialog>
    </q-page>
</template>


<style lang="scss" scoped>
.verify-collection--div {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-flow: row wrap;

    & .verify-collection--input {
        flex: 1 0 70%;
    }

    & a {
        flex: 0 0 auto;
        padding: 8px;
        // box-shadow: -1px 0px 1.5px $accent;
        // align-self: flex-start;
        // align-items: flex-start;
    }

}

.token-card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-flow: row wrap;

    & .token-card__icon {
        min-width: 300px;
        max-width: 400px;
    }

    & .token-image {
        flex: 0 0 30%;
    }

    & .token-inputs {
        flex: 1 0 30%;
    }

    & .select-btn {
        flex: 0 0 90%;
    }
}

.dialog {
    width: 80%;
    min-height: 300px;
    background: linear-gradient(to right, $secondary, $accent);
    color: #1d1d1d;
}

.form--container {
    background-color: rgba(19, 19, 19, 0.627);
    padding-top: 2rem;
    padding-bottom: 2rem;


    & h5 {
        margin-bottom: 0;
        padding-bottom: 0;
    }
}
</style>