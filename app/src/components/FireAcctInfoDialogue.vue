<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useChainAPI } from 'src/api/chain-api';
import { camelCaseToTitleCase, isRelevant } from 'src/helpers';

const { program } = useChainAPI();
const fireAcct = ref();

watchEffect(async () => {
    if (!fireAcct.value && program.value) {
        const fireAcctRaw = await (await program.value.account.fireRewardInfo.all())[0];
        fireAcct.value = Object.entries({ ...fireAcctRaw.account, pda: fireAcctRaw.publicKey.toJSON() });
    }
})
</script>
<template>
    <q-card dark class="flex justify-around dialogue">
        <q-card-title class="title text-bold" center>Fire Reward Info</q-card-title>
        <section v-if="fireAcct">
            <div v-for="entry in fireAcct" :key="entry">
                <!-- <q-item v-if="isRelevant(entry[0])"> -->
                <q-item>
                    <q-item-section>
                        <div class="text-bold">
                            {{ camelCaseToTitleCase(entry[0]) }}:
                        </div>
                        <!-- </q-item-section>
                    <q-item-section> -->
                        {{ entry[1] }}
                    </q-item-section>
                </q-item>
            </div>
        </section>
    </q-card>
</template>
<style lang="scss">
.dialogue {
    padding: 1rem;
    width: 90%;
    margin: auto auto;
}

.title {
    width: 100%;
    text-align: center;
    font-size: 1.25rem;
}
</style>