<template>
  <q-page class="row items-center justify-evenly">
    <q-btn label="test" @click="testAPI()" />
    <h3 v-if="msg">{{ msg }}</h3>
    <q-btn label="Admin" to="/admin"/>
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import axios from 'axios';
import { ref } from 'vue';
const msg = ref('');

async function testAPI() {
  const { data } = await axios.get('/api')
  console.log(data)
  msg.value = data.message
}

</script>
