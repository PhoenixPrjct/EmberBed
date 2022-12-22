<script setup lang="ts">
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { CollectionInfo, CollectionRewardInfo, NewCollectionResponse, RelationsServerResponse, CollectionRewardInfoJSON, PhoenixRelation, PhoenixRelationKind, MutableTokenInfo } from 'src/types';
import { getTokenInfo, SplKey, validateCollectionInfo } from 'src/helpers'
import { TokenInfo } from '@solana/spl-token-registry';
import { ref, Ref, watchEffect } from 'vue';
import { useChainAPI } from 'src/api/chain-api';
import { useQuasar } from 'quasar';
import { useServerAPI } from 'src/api/server-api';
import { NekoWalletAdapterConfig } from '@solana/wallet-adapter-neko';
const { wallet, api } = useChainAPI();
const { server_api } = useServerAPI();
const $q = useQuasar();


const relations = ref<RelationsServerResponse | null>(null)

function getInitCost(kind: string) {
    let amount
    const baseAmount = 10

    switch (kind) {
        case 'EmberBed':
            amount = baseAmount / 2;
            break;
        case 'Affiliate':
            amount = baseAmount / 5;
            break;
        case 'Saved':
            amount = baseAmount / 10;
            break;
        case 'None':
            amount = baseAmount;
            break;
        default:
            amount = 0.05
            break;
    }
    return amount;
}

async function onSubmit(rawInfo: CollectionRewardInfoJSON) {
    try {
        const { success, err, info } = await validateCollectionInfo(rawInfo);
        if (!success || !info) throw new Error('Collection Info is Invalid')
        const { kind } = info.phoenixRelation

        const amount = getInitCost(kind)
        const paid = await api.value?.chargeInitFee(amount);
        if (!paid?.success) throw new Error(`Something went wrong with \n tx: ${paid?.sig} `)

        const initState = await api.value?.initStatePda(wallet.publicKey, info)
        if (!initState || initState.error) throw new Error(`Something went wrong with \n tx: ${initState?.tx}`)
        const { account, pdas, tx } = await initState
        const data = { sig: tx, collection: { ...account, name: account?.collectionName, pda: pdas?.collectionInfoPDA, reward_wallet: pdas?.rewardWallet } }
        const res: { status: number, response?: NewCollectionResponse, Error?: any } = await server_api.collection.new(data)
        if (res.Error) throw new Error(`Collection Not Written to The Server`);
        console.log({ CollectionPDA: res.response?.pda })

        $q.notify({
            type: 'positive',
            position: 'top',
            timeout: 2000,
            message: 'Collection successfully initialized',
            caption: `Token Reward Wallet: ${pdas?.rewardWallet}`
        })
        onReset();
        return

    } catch (err: any) {
        console.error(err);
        $q.notify({
            type: 'negative',
            message: 'Collection Information Not Valid',
            caption: err.message ? err.message : 'Not sure why. . .',
            position: 'top',
            timeout: 3000
        })
        return;
    }
}


function onReset() {
    findSplToken.value._info = null;
    findSplToken.value.info = null;
    findSplToken.value.key = 'name';
    findSplToken.value.val = '';
    collectionInfo.value = {} as CollectionRewardInfoJSON
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




function findPhoenixRelation(collectionAddress: string) {
    if (!relations.value) {
        $q.notify({
            type: 'negative',
            message: `Relations Information Hasn't Loaded Yet`,
            position: 'top',
            timeout: 3000
        })
        return
    }
    const affiliate = relations.value.Affiliates.includes(collectionAddress);
    const saved = relations.value.Saved.includes(collectionAddress);
    const prjctPhoenix = { founders: relations.value.Founders.includes(collectionAddress), members: relations.value.Members.includes(collectionAddress) };
    if (affiliate) {
        console.log('Affiliate')
        return PhoenixRelation.fromJSON(PhoenixRelation.Affiliate)
    }
    if (saved) {
        console.log('Saved')
        return PhoenixRelation.fromJSON(PhoenixRelation.Saved);
    }
    if (prjctPhoenix.founders) {
        return PhoenixRelation.fromJSON(PhoenixRelation.Founder);
    }
    if (prjctPhoenix.members) {
        return PhoenixRelation.fromJSON(PhoenixRelation.Member);
    }
    console.log('None')
    return PhoenixRelation.fromJSON(PhoenixRelation.None)


}



const collectionInfo = ref<CollectionInfo>({
    // rewardWallet: '',
    manager: wallet.value.publicKey.toBase58() || '',
    rewardMint: "",
    collectionName: "",
    collectionAddress: "",
    ratePerDay: 0,
    fireEligible: false,
    phoenixRelation: null as unknown as PhoenixRelationKind,
    rewardSymbol: "",
}) as Ref<CollectionRewardInfoJSON>

async function handleFindSplTokenInfo() {
    findSplToken.value.loading = true
    try {
        findSplToken.value.key = findSplToken.value.key.toLowerCase().trim() as SplKey
        findSplToken.value.val.trim()
        console.log('findSplToken', findSplToken.value)
        const result = await getTokenInfo(findSplToken.value.key, findSplToken.value.val)
        console.log('findSplToken result', result)
        if (!result) throw new Error('No Token Found');
        findSplToken.value._info = [...result];
        findSplToken.value.info = Object.assign([], [...findSplToken.value._info])
        if (findSplToken.value.info.length == 1) {
            collectionInfo.value.rewardMint = findSplToken.value.info[0].address
            collectionInfo.value.rewardSymbol = findSplToken.value.info[0].symbol
        }
        findSplToken.value.loading = false;
    } catch (e) {
        findSplToken.value.loading = false;
        findSplToken.value.info = null as unknown as TokenInfo[];
        return null;
    }
}

async function handleSplTokenClick(tokenInfo?: TokenInfo) {
    console.log('handleSplTokenClick', tokenInfo)
    if (findSplToken.value.info?.length == 1) {
        collectionInfo.value.rewardMint = ''
        collectionInfo.value.rewardSymbol = ''
        findSplToken.value.info = null
        return
    }
    if (tokenInfo) {
        collectionInfo.value.rewardMint = tokenInfo.address
        collectionInfo.value.rewardSymbol = tokenInfo.symbol
        const selectedToken = findSplToken.value.info?.filter(token => {
            if (token == tokenInfo) { return token }
        })
        selectedToken ? findSplToken.value.info = selectedToken : void 0;
    }
    return


}

const findSplToken = ref({
    loading: false,
    options: ['Name', 'Symbol', 'Address'],
    key: <SplKey>'Name',
    val: '',
    info: <MutableTokenInfo[] | null>null,
    _info: <TokenInfo[] | null>null,
})
const showSubmit = ref(false);
const fireDialogShow = ref(false);
const makeRegToken = ref(null)
const makeRegTokenOptions = ['Create & Register', 'Register Existing Token']
const redeemForFireToggle = ref(false);

watchEffect(async () => {
    showSubmit.value = Object.values(collectionInfo.value).every(val => val);
    console.log(collectionInfo.value)
    if (collectionInfo.value.collectionAddress) {
        if (!collectionInfo.value.phoenixRelation) {
            collectionInfo.value.phoenixRelation = findPhoenixRelation(collectionInfo.value.collectionAddress)
            // console.log('pr:', collectionInfo.value?.phoenixRelation, `\n`, 'ca:', collectionInfo.value?.collectionAddress)
        }
        if (collectionInfo.value.phoenixRelation.kind == 'None' && collectionInfo.value.fireEligible) {
            collectionInfo.value.phoenixRelation = { kind: 'EmberBed' }
            // console.log('pr:', collectionInfo.value?.phoenixRelation, `\n`, 'ca:', collectionInfo.value?.collectionAddress)
        }
    }

})


</script>
<template>
    <q-page class="flex justify-center">
        <div class="q-pa-sm form--container" style=" width: 90%">
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <section class="general-info">
                    <h6>EmberBed Info</h6>
                    <small>This is how we categorize your NFT collection on the platform.</small>
                    <q-separator dark spaced />
                    <q-input dense dark filled v-model="collectionInfo.collectionName"
                        placeholder="Name of Nft Collection" hide-hint
                        hint="Collection Name: Bored Ape Yacht Club, DeGods, etc. " lazy-rules
                        :rules="[val => val && val.length > 0 || 'This Must Have a Value']" />
                    <div class="verify-collection--div">
                        <q-input class="verify-collection--input" dense dark filled hide-hint
                            hint="Check out Metaplex Collection Standards for More Info."
                            v-model="collectionInfo.collectionAddress" placeholder="Verified Collection Address"
                            lazy-rules :rules="[val => val && val.length > 0 || 'This Must Have a Value']" />
                        <span>
                            <q-btn v-if="!collectionInfo.collectionAddress" class="center" target="_blank" dark flat
                                icon="policy" href="https://collections.metaplex.com" />
                            <q-tooltip> Verify Your Collection on Metaplex</q-tooltip>

                        </span>
                    </div>
                </section>
                <section class="tokenInfo">

                    <h6>Reward Token Info</h6>
                    <span class="flex justify-between">
                        <small>What token is your community staking for?</small>

                    </span>
                    <q-separator dark spaced />
                    <small v-if="!collectionInfo.rewardSymbol">
                        <i>
                            *Reward Tokens Must be Registered with SPL TokenList
                        </i>
                    </small>
                    <div class="flex justify-around">
                        <span class="splToken-query" v-if="!findSplToken.info?.length">
                            <q-select dense dark v-model="findSplToken.key" :options="findSplToken.options" />
                            <q-input dense dark v-model="findSplToken.val" />
                            <q-btn :disable="!findSplToken.key || !findSplToken.val || findSplToken.loading" dark dense
                                icon="search" @click="handleFindSplTokenInfo()" />
                            <q-icon name="info" color="accent">
                                <q-tooltip>Search Metaplex Registry For Your Token</q-tooltip>
                            </q-icon>
                        </span>
                    </div>
                    <div class="token--container" :class="$q.screen.lt.md ? 'flex justify-around' : void 0"
                        v-if="!findSplToken.loading && findSplToken.info && findSplToken.info.length !== 1">

                        <q-card class="token-card" dark v-for="token in findSplToken.info" :key="token.address">
                            <!-- <q-card-section horizontal> -->
                            <q-img fit="contain" class="token-image" v-if="token.logoURI" :src="token.logoURI" />
                            <div class="token-inputs">
                                <q-input dark dense readonly v-model="token.name" label="Name" />
                                <q-input dark dense readonly v-model="token.symbol" label="Symbol" />
                                <q-input dark dense readonly v-model="token.address" label="Mint Address" />
                                <q-input dark dense readonly v-model="token.decimals" label="Decimals" />
                            </div>
                            <!-- </q-card-section> -->
                            <q-card-action dark class="flex justify-center select-btn">
                                <q-btn flat dark round dense label="Select" @click="handleSplTokenClick(token)" />
                            </q-card-action>
                        </q-card>
                    </div>
                    <div v-if="findSplToken.info?.length == 1" class="selected-token-info">
                        <q-item class="text-bold flex justify-center">
                            <q-item-section avatar v-if="findSplToken.info[0].logoURI">
                                <q-avatar size="75px" :icon="`img:${findSplToken.info[0].logoURI}`" />
                            </q-item-section>
                            <!-- <q-img fit="contain" :src="findSplToken.info[0].logoURI" ratio="1:1" /> -->

                            <q-item-section>

                                {{ findSplToken.info[0].name }}
                            </q-item-section>
                            <q-item-section side>
                                <q-btn v-if="findSplToken.info?.length == 1" color="secondary" class="special" flat dark
                                    label="Reset Token Info" @click="handleSplTokenClick()" />
                            </q-item-section>
                        </q-item>

                        <q-input dark dense readonly v-model="collectionInfo.rewardMint" label="Mint Address" />
                        <q-input dark dense readonly v-model="collectionInfo.rewardSymbol" label="Token Symbol" />
                        <q-input v-if="collectionInfo.rewardSymbol && collectionInfo.rewardMint" class="rate"
                            type="number" v-model="collectionInfo.ratePerDay" dark label="Rate Per day" />
                        <q-toggle dark v-model="collectionInfo.fireEligible" class="special" color="accent"
                            label="$FIRE Redemption?" />
                        <q-btn flat icon-color="accent" icon="info" @click="fireDialogShow = true">
                            <q-tooltip>
                                Allow your community to stake for $FIRE tokens.
                            </q-tooltip>
                        </q-btn>
                    </div>
                    <div>
                        <q-btn v-if="showSubmit" dark label="Submit" type="submit" color="primary" />
                        <q-btn dark label="Reset" type="reset" color="secondary" flat class="q-ml-sm" />
                    </div>
                </section>
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

.token--container {
    gap: 1rem;
}

.rate {
    max-width: fit-content;
    margin: 0 auto;
}


.token-card {
    display: flex;
    justify-content: space-around;
    gap: 3px;
    align-items: center;
    flex-flow: row wrap;
    margin: 1rem;


    & .token-image {
        flex: 1 0 30%;
    }

    & .token-inputs {
        flex: 1 0 60%;
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

.splToken-query {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
}

.form--container {
    max-width: 500px;
    background-color: rgba(19, 19, 19, 0.627);
    padding-top: 2rem;
    padding-bottom: 2rem;

    & * {
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 3px;
    }

    & h6 {
        margin-bottom: 0;
        padding-bottom: 0;
    }
}

.special {
    font-size: smaller;
}
</style>