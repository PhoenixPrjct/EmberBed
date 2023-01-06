<script setup lang="ts">
import { watch } from "fs";
import { WalletMultiButton } from "solana-wallets-vue";
import { useUserStore } from "src/stores/userStore";
import { watchEffect, ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { useWallet } from "solana-wallets-vue"
import { WalletStore } from "src/types";
import { WalletReadyState } from "@solana/wallet-adapter-base";
const wallet = <WalletStore>useWallet();
const router = useRouter();
const { type, getType } = useUserStore();
watchEffect(() => {
    if (!wallet.connected.value) router.push('/');
    if (type !== 'Admin') router.push('/');
})
</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title style="font-variant: small-caps;">
                    <q-avatar square>
                        <img src="@/assets/logo_only.png" alt="Logo">
                    </q-avatar>
                    <q-btn type="a" dark flat to="/">
                        EmberBed:
                        Admin
                    </q-btn>
                </q-toolbar-title>
                <q-space />
                <wallet-multi-button dark />
            </q-toolbar>

        </q-header>
        <q-page-container>
            {{ type }} | {{ getType }}
            <router-view />
        </q-page-container>

    </q-layout>
</template>
<style scoped>

</style>