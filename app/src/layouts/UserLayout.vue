<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useChainAPI } from "src/api/chain-api";
const router = useRouter();
const { wallet } = useChainAPI();
watchEffect(() => {
    if (!wallet.value?.publicKey) router.push('/');

})
</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar v-if="$q.screen.lt.sm">
                <q-toolbar-title style="text-align:center; font-variant: small-caps; ">

                    <q-btn class="logo" dark flat to="/">
                        EmberBed:&nbsp;
                        <span style="color:#fe4200">
                            User
                        </span>
                    </q-btn>
                </q-toolbar-title>

                <q-toolbar inset>
                    <wallet-multi-button dark />
                </q-toolbar>

            </q-toolbar>
            <q-toolbar v-else>
                <q-toolbar-title style="font-variant: small-caps; ">
                    <q-avatar square>
                        <img src="@/assets/logo_only.png" alt="Logo" />
                    </q-avatar>
                    <q-btn class="logo" dark flat to="/">
                        EmberBed:&nbsp;
                        <span style="color:#fe4200">
                            User
                        </span>
                    </q-btn>
                </q-toolbar-title>
                <q-space />
                <wallet-multi-button dark />
            </q-toolbar>

        </q-header>
        <q-page-container>
            <router-view />
        </q-page-container>

    </q-layout>
</template>
<style scoped>
.logo {
    min-width: 100px;
}
</style>