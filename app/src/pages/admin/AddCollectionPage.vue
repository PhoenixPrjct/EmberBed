<script setup lang="ts">
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getTokenInfo, SplKey, validateCollectionInfo, chargeFeeTx, getInitCost } from 'src/helpers'
import { TokenInfo } from '@solana/spl-token-registry';
import { ref, Ref, watchEffect, ComputedRef } from 'vue';
import { useChainAPI } from 'src/api/chain-api';
import { useQuasar } from 'quasar';
import { useServerAPI } from 'src/api/server-api';
import {
    CollectionInfo, CollectionRewardInfo,
    NewCollectionResponse, RelationsServerResponse,
    CollectionRewardInfoJSON, PhoenixRelation,
    PhoenixRelationKind, MutableTokenInfo, WalletStore
} from 'src/types';
import { useRouter } from 'vue-router';
import { useWallet } from 'solana-wallets-vue';

const router = useRouter();
const { wallet, api, connection, program } = useChainAPI();
const $wallet = useWallet().wallet
const { server_api } = useServerAPI();
const $q = useQuasar();


const relations = ref<RelationsServerResponse | null>(null)
const showSubmit = ref(false);
const fireDialogShow = ref(false);
const manualSplEntryToggle = ref(false);
const showWhyVerify = ref(false)
function handleShowWhyVerify() {
    showWhyVerify.value = true;
}
// const makeRegTokenOptions = ['Create & Register', 'Register Existing Token']
const findSplToken = ref({
    loading: false,
    options: ['Name', 'Symbol', 'Address'],
    key: <SplKey>'Name',
    val: '',
    info: <MutableTokenInfo[] | null>null,
    _info: <TokenInfo[] | null>null,
})

const submissionStatus = ref({
    loading: false,
    percent: 0,
    message: ''
});
const collectionInfo = ref<CollectionInfo>({
    // rewardWallet: '',
    manager: '',
    rewardMint: "REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko",
    collectionName: "TEST_EYES",
    collectionAddress: "CG4KDtfDDvYWP4ChqxKVLXjxjrg8VT28RoMpJgjYosFs",
    ratePerDay: 2,
    fireEligible: true,
    phoenixRelation: null as unknown as PhoenixRelationKind,
    rewardSymbol: "$REW",
}) as Ref<CollectionRewardInfoJSON>

async function getRewardWallet() {
    const rw = new PublicKey(collectionInfo.value.rewardMint);
    const colInfo = await api.value?.getStatePda(rw, collectionInfo.value.collectionName);
    if (!colInfo) return null;
    console.log(colInfo.pda.toBase58());
    const rewardWallet = await api.value?.getRewardWallet(rw, colInfo.pda);
    if (rewardWallet) {
        console.log(rewardWallet.address.toBase58())
        return rewardWallet
    }
    return null
}

async function onSubmit(rawInfo: CollectionRewardInfoJSON) {
    try {
        submissionStatus.value = {
            loading: true,
            message: 'Validating Info. . .',
            percent: 5
        }
        // Find or Create the PDAs
        const accounts = await (await api.value?.getAccounts({ user: wallet.value.publicKey, collectionName: rawInfo.collectionName, rewardMint: rawInfo.rewardMint }))

        if (!accounts) throw new Error('Generating PDAS Failed')
        const { stateBump, statePDA, rewardWallet } = accounts
        rawInfo.bump = stateBump
        rawInfo.rewardWallet = rewardWallet.toBase58();
        const collections = await (await program.value.account.collectionRewardInfo.all()).map(collection => collection.publicKey.toBase58())
        if (!collections.includes(statePDA.toBase58())) {
            console.log(rawInfo)
            // Validate The Information
            const valid = await validateCollectionInfo(rawInfo);
            if (!valid) throw new Error('Failed to validate collection')

            submissionStatus.value.message = `Info Checks Out, Moving On. . .`


            const { success, info } = valid
            console.log(valid.success, info?.toJSON())
            if (!success || !info) throw new Error(`Failed To Validate Collection Information`)
            const { kind } = info.phoenixRelation

            const amount = getInitCost(kind)
            submissionStatus.value = { ...submissionStatus.value, percent: 20, message: `Sending Initialization Fee for Collection\n\n${amount} ☉\n\n ${kind} Price` }
            const paidTx = await chargeFeeTx(wallet.value.publicKey, amount);

            if (!paidTx.success) throw new Error(paidTx.error)
            const paymentSig = await paidTx.sig
            submissionStatus.value = { ...submissionStatus.value, percent: 50, message: `${paymentSig} \n\n Halfway there! Let's Go!!` }
            const initState = await api.value?.initStatePda(wallet.value.publicKey, info)
            if (!initState || initState.error) throw new Error(`${initState?.error.message}`)
            const { account, tx } = await initState
            console.log({ tx, account })
            submissionStatus.value = { ...submissionStatus.value, percent: 60, message: 'Sent Collection Info On Chain' }
        }
        const data = {
            pda: statePDA,
            manager: wallet.value.publicKey.toBase58(),
            collection: rawInfo.collectionName,
            /*{ ...account, name: account?.collectionName, */
            reward_wallet: rewardWallet
        }
        submissionStatus.value = { ...submissionStatus.value, percent: 80, message: 'Indexing Collection on DB. . .' }
        const res: { status: number, response?: NewCollectionResponse, Error?: any } = await server_api.collection.new(data)
        if (res.Error) throw new Error(`Collection Not Written to The Server`);
        submissionStatus.value = { ...submissionStatus.value, percent: 100, message: 'Welcome Aboard!' }


        $q.notify({
            type: 'positive',
            position: 'top',
            timeout: 2000,
            message: 'Collection successfully initialized',
            caption: `Token Reward Wallet: ${rewardWallet}`
        })
        onReset();
        submissionStatus.value = {
            loading: false,
            percent: 0,
            message: ''
        }
        return

    } catch (err: any) {
        console.error(err);
        submissionStatus.value = { ...submissionStatus.value, percent: 0, message: err.message ? err.message : 'Something went wrong, please try again' }
        $q.notify({
            type: 'negative',
            message: 'Collection Information Not Valid',
            caption: err.message ? err.message : 'Not sure why. . .',
            position: 'top',
            timeout: 3000
        })
        submissionStatus.value = {
            message: err.message ? err.message : 'Something went wrong',
            loading: false,
            percent: 0
        }
        return;
    }
}


function onReset() {
    console.log('Resetting Form.');
    findSplToken.value._info = null;
    findSplToken.value.info = null;
    findSplToken.value.key = 'name';
    findSplToken.value.val = '';
    manualSplEntryToggle.value = false;
    collectionInfo.value = {} as CollectionRewardInfoJSON
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
    console.log({ Relations: relations.value })
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


watchEffect(async () => {
    showSubmit.value = Object.values(collectionInfo.value).every(val => val !== null && val !== undefined && val !== 0);
    if (!relations.value) {
        const relationsResult = await server_api.general.getRelations()
        if (!relationsResult) return
        relations.value = relationsResult
        console.log(relations.value)
    }
    // console.log(collectionInfo.value)
    if (collectionInfo.value.collectionAddress) {
        if (!collectionInfo.value.phoenixRelation) {
            const relationRes = findPhoenixRelation(collectionInfo.value.collectionAddress)
            collectionInfo.value.phoenixRelation = relationRes ? relationRes : null as unknown as PhoenixRelationKind
            // console.log('pr:', collectionInfo.value?.phoenixRelation, `\n`, 'ca:', collectionInfo.value?.collectionAddress)
        }
        if (collectionInfo.value.phoenixRelation.kind == 'None' && collectionInfo.value.fireEligible) {
            collectionInfo.value.phoenixRelation = { kind: 'EmberBed' }
            // console.log('pr:', collectionInfo.value?.phoenixRelation, `\n`, 'ca:', collectionInfo.value?.collectionAddress)
        }
    }
    if (wallet.value) {
        collectionInfo.value.manager = wallet.value.publicKey.toBase58()
    }
    if (!collectionInfo.value.rewardWallet && collectionInfo.value.rewardMint && collectionInfo.value.collectionName) {
        const rw = await getRewardWallet()
        if (!rw) return
        console.log(rw.address.toBase58())
        collectionInfo.value.rewardWallet = rw.address.toBase58();
    }
    console.log($wallet.value)

    if (!$wallet.value) {
        router.push({ path: '/admin' })
    }
})


</script>
<template>
    <q-page class="flex justify-center">
        <div class="submission-loading" v-if="submissionStatus.loading">
            <div class="text-h6">
                <pre class="text-center">
                {{ submissionStatus.message }}
                </pre>
            </div>
            <q-linear-progress size="25px" :value="submissionStatus.percent" color="accent" class="q-mt-sm" />
            <q-linear-progress size="25px" :value="100 - submissionStatus.percent" color="secondary" class="q-mt-sm" />
        </div>
        <div v-else class="q-pa-sm form--container" style="width: 90%">
            <q-form @submit="onSubmit(collectionInfo)" @reset="onReset" class="q-gutter-md">
                <section class="general-info">
                    <h6>EmberBed Info</h6>
                    <small>This is how we categorize your NFT collection on the platform.</small>
                    <q-separator dark spaced />
                    <q-input dense dark filled v-model="collectionInfo.collectionName" placeholder="Name of Nft Collection"
                        hide-hint hint="Collection Name: Bored Ape Yacht Club, DeGods, etc. " lazy-rules
                        :rules="[val => val && val.length > 0 || 'This Must Have a Value']" />
                    <div class="verify-collection--div">
                        <q-input class="verify-collection--input" dense dark filled hide-hint
                            v-model="collectionInfo.collectionAddress" placeholder="Verified Collection Address">
                            <q-btn icon="info" @click="handleShowWhyVerify()" />
                        </q-input>
                        <span>
                            <div>

                                <q-btn v-if="!collectionInfo.collectionAddress" class="center" target="_blank" dark flat
                                    icon="policy" href="https://collections.metaplex.com/create-collection"
                                    label="Create Collection On Metaplex" />
                                <q-tooltip> Verify Your Collection on Metaplex</q-tooltip>
                            </div>

                        </span>
                    </div>
                </section>
                <q-space />
                <q-separator dark spaced />
                <q-space />
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
                        <q-toggle dark v-model="manualSplEntryToggle" class="special"
                            onchange="()=> findSplToken.key = '' && findSplToken.val = ''" label="Manual Token Entry?" />
                    </div>
                    <div class="flex justify-around" v-if="!manualSplEntryToggle">
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
                        v-if="!findSplToken.loading && findSplToken.info && findSplToken.info.length !== 1 && !manualSplEntryToggle">

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
                            <q-card-actions dark class="flex justify-center select-btn">
                                <q-btn flat dark round dense label="Select" @click="handleSplTokenClick(token)" />
                            </q-card-actions>
                        </q-card>
                    </div>
                    <div v-if="manualSplEntryToggle">
                        <q-input dark dense v-model="collectionInfo.rewardMint" label="Mint Address" />
                        <q-input dark dense v-model="collectionInfo.rewardSymbol" label="Token Symbol" />
                    </div>
                    <div v-if="findSplToken.info?.length == 1 && !manualSplEntryToggle" class="selected-token-info">
                        <q-item class="text-bold flex justify-center">
                            <q-item-section avatar v-if="findSplToken.info[0].logoURI">
                                <q-avatar size="75px" :icon="`img:${findSplToken.info[0].logoURI}`" />
                            </q-item-section>
                            <!-- <q-img fit="contain" :src="findSplToken.info[0].logoURI" ratio="1:1" /> -->
                            <q-item-section>
                                {{ findSplToken.info[0].name }}
                            </q-item-section>
                        </q-item>
                        <q-input dark dense readonly v-model="collectionInfo.rewardMint" label="Mint Address" />
                        <q-input dark dense readonly v-model="collectionInfo.rewardSymbol" label="Token Symbol" />
                        <q-item-section side>
                            <q-btn v-if="findSplToken.info?.length == 1" color="secondary" class="special" flat dark
                                label="Reset Token Info" @click="handleSplTokenClick()" />
                        </q-item-section>
                    </div>
                    <q-item>
                        <q-btn flat icon-color="accent" icon="info" @click="fireDialogShow = true">
                            <q-tooltip>
                                Allow your community to stake for $FIRE tokens.
                            </q-tooltip>
                        </q-btn>
                    </q-item>
                    <q-toggle dark v-if="findSplToken.info?.length == 1 || manualSplEntryToggle"
                        v-model="collectionInfo.fireEligible" class="special" color="accent" label="$FIRE Redemption?" />
                    <q-input v-if="collectionInfo.rewardSymbol && collectionInfo.rewardMint" class="rate" type="number"
                        v-model="collectionInfo.ratePerDay" dark label="Rate Per day" />
                    <div>
                        <q-btn v-if="showSubmit" dark label="Submit" type="submit" color="primary" />
                        <q-btn dark label="Reset" type="reset" color="secondary" flat class="q-ml-sm" />
                    </div>
                </section>
            </q-form>
        </div>
        <q-dialog v-model="fireDialogShow">
            <q-card class="dialog">
                <q-card-section title class="text-h6">
                    Allowing $FIRE Staking
                </q-card-section>
                <q-separator dark />
                <q-card-section class="fire-content">
                    <q-item class="fire-item">
                        <q-item-section class="fire-title text-subtitle1">
                            What does this mean?
                        </q-item-section>
                        <q-item-section class="fire-list text-body-2">
                            <q-list>
                                <q-item>
                                    Your holders will have the option to redeem for $FIRE tokens if they desire.
                                </q-item>
                                <q-item>
                                    would be instead of redeeming your native token.
                                </q-item>
                                <q-item>
                                    It is a choice for them each time they go to redeem their yield from staking.
                                </q-item>
                            </q-list>
                        </q-item-section>
                    </q-item>
                    <!-- </q-card-section>
                                        <q-card-section> -->
                    <q-item class="fire-item">
                        <q-item-section class="fire-title text-subtitle1">
                            Why Might This Be a Good Idea?
                        </q-item-section>
                        <q-item-section class="fire-list text-body-2">
                            <q-list>
                                <q-item>
                                    Added Utility to Holding Your NFTs
                                </q-item>
                                <q-item>
                                    Reduced Upfront Cost to use EmberBed (50% off!)
                                </q-item>
                                <q-item>
                                    $FIRE tokens will be available to cover all platform fees **

                                </q-item>
                            </q-list>
                        </q-item-section>
                    </q-item>
                    **After the PrjctPhoenix:Founder collection mint
                </q-card-section>
                <q-card-section>
                    <q-item class="fire-item">
                        <q-item-section class="fire-title text-subtitle1">
                            Have More Questions?
                        </q-item-section>
                        <q-item-section class="fire-list text-body-2">
                            Hop in our discord and ask, or @ us on Twitter.
                        </q-item-section>
                    </q-item>
                    <q-card-actions class="justify-around">
                        <q-btn dark flat href="https://discord.gg/s9SUKBWKuQ" target="_blank">
                            <q-icon name="fab fa-discord" />
                        </q-btn>
                        <q-btn dark flat href="https://twitter.com/PrjctPhoenix" target="_blank">
                            <q-icon name="fab fa-twitter" />
                        </q-btn>
                    </q-card-actions>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="showWhyVerify">
            <q-card dark>
                <q-card-section title class="text-h6">
                    Why Verify?
                </q-card-section>
                <q-separator spaced dark />
                <q-card-section>
                    <q-item>
                        <q-item-section side>
                            <q-icon name="grade" />
                        </q-item-section>
                        <q-item-section>
                            Verified Collections Don't Need to Add a Hashlist.
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section side>
                            <q-icon name="grade" />
                        </q-item-section>
                        <q-item-section>
                            If you are a PrjctPhoenix Affiliate, this is how EmberBed verifies this and adds the
                            proper
                            relationship on-chain.
                        </q-item-section>
                    </q-item>



                </q-card-section>
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
        padding: 1rem;
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
    flex: 0 0 90%;
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

.fire-content {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
}

.fire-title {
    font-weight: 900;
    flex: 1 0 20%;
    min-width: 100px
}

.fire-list {
    flex: 1;
    min-width: 270px;
}

.fire-item {
    flex-wrap: wrap;
}

.special {
    font-size: smaller;
}

@media screen and (max-width:400px) {
    .dialog {
        width: 95%;
        min-height: 300px;
        background: linear-gradient(to right, $secondary, $accent);
        color: #1d1d1d;
    }

}
</style>