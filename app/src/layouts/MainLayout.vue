<script setup lang="ts">
// import { ref } from 'vue';
// import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
const currentYear = new Date().getFullYear();



</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          EmberBed
        </q-toolbar-title>

      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated reveal class="center">
      <q-toolbar class="flex justify-center">
        <q-btn type="a" flat href="https://prjctphoenix.xyz" target="_blank">
          A PrjctPheonix
          <q-avatar>
            <img src="@/assets/logo.png">
          </q-avatar>
          Product
        </q-btn>
      </q-toolbar>
      <q-toolbar inset class="flex justify-center">
        <div class="copyright">
          <small>&copy; Copyright {{ currentYear }}, Prjct Phoenix. All rights reserved.</small>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
