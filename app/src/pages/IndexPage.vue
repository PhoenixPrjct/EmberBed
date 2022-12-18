<template>
  <q-page class="row items-center justify-evenly">
    <q-btn label="test" @click="testAPI()" />
    <h3 v-if="msg">{{ msg }}</h3>
    <q-btn label="Admin" to="/admin" />
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useServerAPI } from 'src/api/server-api';
import { useAnchorWallet } from 'solana-wallets-vue';
import { AnchorWallet } from 'solana-wallets-vue';
import { useChainAPI } from 'src/api/chain-api';
const { admin } = useServerAPI()
useAnchorWallet()
const { publicKey } = useChainAPI().wallet.value;
const msg = ref('');
console.log(publicKey?.toBase58())
async function testAPI() {
  if (!publicKey) return
  const info = await admin.getInfo(publicKey.toBase58());
  console.log(info)
  msg.value = info
}

</script>
