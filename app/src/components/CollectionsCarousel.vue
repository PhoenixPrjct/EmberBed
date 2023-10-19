<script setup lang="ts">
import { getAllEBCollections } from "src/helpers";
import { ref, watchEffect, computed } from 'vue';
const collections = ref<string[]>()

watchEffect(async () => {
    if (!collections.value) {
        collections.value = await getAllEBCollections()
    }

})
</script>
<template>
    <div class="wrapper" v-if="collections?.length">
        <div id="marquee">
            <q-icon name="grade" />
            <span v-for="collection in collections" :key="collection">

                <q-chip outline square dark>{{ collection }}</q-chip>
                <q-icon name="grade" />
            </span>
        </div>
    </div>
    <div v-else style="text-align:center; width:100%;">
        Welcome to EmberBed!
    </div>
</template>
<style lang="scss" scoped>
.wrapper {
    width: 80%;
    margin: 0 auto;
    overflow-x: hidden;
}

#marquee {
    position: relative;
    animation: marquee 20s linear infinite // animation-duration: calc(10s * (1 + attr(--collections-length)/ 5))
}


#marquee:hover {
    animation-play-state: paused;
}

@keyframes marquee {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(-100%);
    }
}
</style>