<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";
</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <q-btn dark flat to="/" style="font-variant: small-caps ">
                        EmberBed:
                    </q-btn>
                    Admin
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

</style>