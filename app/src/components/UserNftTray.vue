<script lang="ts" setup>
import axios from 'axios';
import { useChainAPI } from 'src/api/chain-api';
import { getNftsInWallet } from 'src/helpers/nftUtils';
import { ref, watchEffect } from 'vue';
import { DBCollectionInfo, EBNft } from "src/types";
import UserNftCard from "src/components/UserNftCard.vue"

const props = defineProps<{
    colPda: string | null
    theme: DBCollectionInfo["style"] | null
}>();
const { wallet } = useChainAPI();
const nfts = ref({ loading: true, loaded: false, ebNfts: <EBNft[]>[], otherNfts: <EBNft[]>[] })

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
    <div v-if="nfts.loading">
        <q-spinner />
    </div>
    <div v-else>
        <div class="eligible nft-card-container">
            <div v-for="nft in nfts.ebNfts" :key="nft.mint" class="nft-card"
                :style="theme ? `box-shadow: 0px 0px 12px 0px ${theme.colors.primary}` : `box-shadow: 0px 0px 12px 0px #ffff`">
                <UserNftCard :nft="nft" :eligible="true" />
            </div>

        </div>

        <!-- <div class="eligible nft-card-container">
            <div v-for="nft in nfts.otherNfts" :key="nft.mint" class="nft-card">
                <UserNftCard :nft="nft" :eligible="false" />
            </div>
        </div> -->
    </div>
</template>
<style lang="scss" scoped>
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