<script lang="ts" setup>
import axios from 'axios';
import { useChainAPI } from 'src/api/chain-api';
import { getNftsInWallet } from 'src/helpers/nftUtils';
import { ref, watchEffect } from 'vue';
import { EBNft } from "src/types";
import UserNftCard from "src/components/UserNftCard.vue"

const { wallet } = useChainAPI();
const nfts = ref({ loading: true, loaded: false, ebNfts: <EBNft[]>[], otherNfts: <EBNft[]>[] })

watchEffect(async () => {
    if (!nfts.value.loaded) {
        const { ebNfts, other } = await getNftsInWallet(wallet.value.publicKey);

        nfts.value.ebNfts = ebNfts;
        nfts.value.otherNfts = other;
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
            <div v-for="nft in nfts.ebNfts" :key="nft.mint" class="nft-card">
                <UserNftCard :nft="nft" :eligible="true" />
            </div>

        </div>
        <div class="eligible nft-card-container">
            <div v-for="nft in nfts.ebNfts" :key="nft.mint" class="nft-card">
                <UserNftCard :nft="nft" :eligible="false" />
            </div>
        </div>
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
}

.nft-card {
    max-width: 300px;
    max-height: 300px;
    min-width: 100px;
    min-height: 100px;
    flex: 0 0 200px;
}
</style>