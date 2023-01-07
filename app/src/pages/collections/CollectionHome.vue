<script setup lang="ts">
import { useServerAPI } from 'src/api/server-api';
import { useChainAPI } from 'src/api/chain-api';
import { ref, watchEffect } from 'vue';
import { CollectionRewardInfo, CollectionRewardInfoJSON, DBCollectionInfo } from 'src/types'
import { useRoute } from 'vue-router';
import UserNftTray from 'src/components/UserNftTray.vue';
import { PublicKey } from '@solana/web3.js';
const { server_api } = useServerAPI();
const { connection } = useChainAPI();
const route = useRoute();
const pda = route.params.id

const pdaInfo = ref<CollectionRewardInfoJSON | null>(null)
const dbInfo = ref<DBCollectionInfo | null>(null);
const theme = ref<DBCollectionInfo["style"] | null>(null);
const styles = ref({
    chips: ''
})
const themeLoaded = ref(false);
const pdaLoaded = ref(false);
watchEffect(async () => {
    if (!theme.value) {
        dbInfo.value = await server_api.collection.get.one(pda as string);
        if (!dbInfo.value) return themeLoaded.value = true;
        theme.value = dbInfo.value.style
        !theme.value ?
            styles.value.chips = `width: 175px; text-align:center; color:#ffffff; box-shadow:  0 0 3px 1px #ffffff; font-variant: small-caps;` :
            styles.value.chips = `width: 175px; text-align:center; color:${theme.value.colors.primary}; box-shadow:  0 0 0 1px ${theme.value.colors.secondary}; font-variant: small-caps;`
        themeLoaded.value = true;
    }
    if (!pdaInfo.value) {
        const pdaPk = new PublicKey(pda as string)
        const rawPdaInfo = await (await CollectionRewardInfo.fetch(connection, pdaPk))?.toJSON()
        if (!rawPdaInfo) return pdaLoaded.value = true;
        pdaInfo.value = rawPdaInfo;
    }
})
</script>
<template>
    <div v-if="!themeLoaded">
        <q-spinner size="50%" />
    </div>
    <q-page v-else class="page"
        :style="`background-image: url(${theme?.icon}); background-position:center; background-size:contain; background-repeat: no-repeat;`">
        <div class="wrapper">

            <section class="section">
                <div class="flex justify-around">
                    <!-- <q-item> -->
                    <!-- <q-item-section style="background-color:#1d1d1d50">
                            <h5 style="color:white">
                                {{ pdaInfo?.collectionName }}
                            </h5>
                        </q-item-section> -->
                    <!-- </q-item> -->
                    <span class="chips special">

                        <q-chip dark square :style="styles.chips" class="special"
                            :label="dbInfo?.hashlist ? `Collection Size: ${dbInfo?.hashlist.length}` : 'Collection Size: Not Available'" />
                        <q-chip dark square :style="styles.chips" class="special"
                            :label="pdaInfo?.rewardSymbol ? `Token: ${pdaInfo?.rewardSymbol}` : 'Token: Not Available'" />
                        <q-chip dark square :style="styles.chips" class="special"
                            :label="pdaInfo?.fireEligible ? '$Fire Eligible' : 'Not $Fire Eligible '" />
                        <q-chip dark square :style="styles.chips" class="special"
                            :label="pdaInfo?.ratePerDay ? `Base Rate/Day: ${pdaInfo?.ratePerDay}` : 'Base Rate/Day Unavailable'" />
                    </span>
                </div>

                <UserNftTray :colPda="(pda as string)" :theme="theme" />
            </section>
        </div>
    </q-page>
</template>
<style scoped lang="scss">
main {
    margin-top: 1rem;
    color: #1d1d1d50
}

.wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, #000000, rgba(0, 0, 0, 0.5), #000000);
}

.page {
    background-color: rgba(0, 0, 0, 0.2);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: 1.25rem 1.25rem;
    padding: 1rem;
    // border-radius: 0.5rem;
}
</style>