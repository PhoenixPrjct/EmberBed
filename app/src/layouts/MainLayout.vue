<script setup lang="ts">
import { watchEffect, computed, ref } from 'vue';
import CollectionCarousel from "src/components/CollectionsCarousel.vue";
import { WalletMultiButton } from 'solana-wallets-vue';
import { useRouter } from "vue-router";
import { useWallet } from "solana-wallets-vue"
import { WalletStore } from "src/types";
import { useUserStore } from 'src/stores/user_store';
import { LocalStorage } from 'quasar';
import { useServerAPI } from 'src/api/server-api';
import { FireAcctInfoDialogue } from "src/components"
async function getTest() {
  const res: any = await server_api.test();
  console.log(res.message);
  return res.message;
}

const store = useUserStore();
const wallet = <WalletStore>useWallet();
const router = useRouter();
const currentYear = new Date().getFullYear();
const { server_api } = useServerAPI();
const showFireAcctDialogue = ref(false);
const test = computed(() => getTest());
watchEffect(() => {
  if (wallet.connected.value && wallet.publicKey.value) {
    store.setPk(wallet.publicKey.value.toBase58())
  }
  if (!wallet.connected.value) {
    LocalStorage.clear();
    store.setPk('')
    store.setType(null)
  }
})



</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          <q-avatar square>
            <img src="@/assets/logo_only.png" alt="Logo">

          </q-avatar>
          EmberBed
        </q-toolbar-title>
        <span v-if="wallet.connected.value">

          <q-btn dark flat @click="showFireAcctDialogue = true">&#x1F525;</q-btn>
        </span>
        <WalletMultiButton dark />
      </q-toolbar>
      <q-toolbar dark inset>
        <CollectionCarousel />
      </q-toolbar>
      <!-- TEST: {{ test }} -->
    </q-header>
    <q-page-container>
      <q-dialog v-model="showFireAcctDialogue">
        <FireAcctInfoDialogue />
      </q-dialog>

      <router-view />
    </q-page-container>
    <q-footer reveal class="center bg-transparent">
      <q-toolbar class="flex justify-center phoenix-footer">
        <span type="a" target="_blank">
          <a class="footer" href="https://prjctphoenix.xyz">
            A PrjctPheonix

            <q-avatar>
              <img src="@/assets/phoenix_logo.png">
            </q-avatar>
            Product
          </a>
        </span>
      </q-toolbar>

      <small inset class="flex justify-center bg-primary copyright">&copy; Copyright {{ currentYear }}, Prjct Phoenix.
        All rights reserved.</small>
    </q-footer>
  </q-layout>
</template>

<style lang="scss" scoped>
.footer {
  font-variant: normal;
  text-decoration: none;
  transition: color 1s ease-in
}

.footer:hover {
  color: $secondary;
  font-weight: 800;

}
</style>