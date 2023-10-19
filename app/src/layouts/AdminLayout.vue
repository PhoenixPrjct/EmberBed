<script setup lang="ts">

import { WalletMultiButton } from "solana-wallets-vue";
import { useUserStore } from "src/stores/user_store";
import { watchEffect, ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { useWallet } from "solana-wallets-vue"
import { WalletStore } from "src/types";

const wallet = <WalletStore>useWallet();
const router = useRouter();
const store = useUserStore();
watchEffect(() => {
    if (!wallet.connected.value) router.push('/');

})
</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title style="font-variant: small-caps;">
                    <q-btn dark to="/" flat>
                        <q-avatar square>
                            <img src="@/assets/logo_only.png" alt="Logo">
                        </q-avatar>
                    </q-btn>
                    <q-btn type="a" dark flat to="/admin">
                        EmberBed: &nbsp;
                        <span class="admin">
                            Admin
                        </span>
                    </q-btn>
                </q-toolbar-title>
                <q-space />
                <q-space />
                <wallet-multi-button dark />
            </q-toolbar>

        </q-header>
        <q-page-container>
            <router-view />
        </q-page-container>

    </q-layout>
</template>
<style lang="scss" scoped>
.admin {
    font-variant: small-caps;
    color: $dirtyFont;
}
</style>