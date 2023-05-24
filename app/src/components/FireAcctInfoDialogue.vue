<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useChainAPI } from 'src/api/chain-api';
import { camelCaseToTitleCase, isRelevant } from 'src/helpers';

const { program } = useChainAPI();
const fireAcct = ref();

watchEffect(async () => {
    if (!fireAcct.value && program.value) {
        const fireAcctRaw = await (await program.value.account.fireRewardInfo.all())[0];
        fireAcct.value = Object.entries(fireAcctRaw.account);
    }
})
</script>
<template>
    <q-card dark class="flex justify-around dialogue">
        <q-card-title center>Fire Reward Info</q-card-title>
        <section v-if="fireAcct">
            <div v-for="entry in fireAcct" :key="entry">
                <q-item-section v-if="isRelevant(entry[0])">
                    {{ camelCaseToTitleCase(entry[0]) }}: {{ entry[1] }}
                </q-item-section>
            </div>
        </section>
    </q-card>
</template>
<stlye lang="scss"></stlye>