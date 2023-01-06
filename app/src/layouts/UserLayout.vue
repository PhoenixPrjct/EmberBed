<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";
import { useUserStore } from "src/stores/userStore";

const store = useUserStore();
</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title style="font-variant: small-caps ">
                    <q-btn dark flat to="/">
                        EmberBed:&nbsp;
                        <span style="color:#fe4200">
                            User
                        </span>
                    </q-btn>
                </q-toolbar-title>
                {{ store.userType }}
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