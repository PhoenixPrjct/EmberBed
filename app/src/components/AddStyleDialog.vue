<script setup lang="ts">
import { useServerAPI } from 'src/api/server-api';
import { CollectionStyle, DBCollectionInfo } from 'src/types'
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import { useChainAPI } from 'src/api/chain-api';

const urlRegex = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i)
const { server_api } = useServerAPI();
const { wallet } = useChainAPI();
const { notify } = useQuasar();

const props = defineProps<{ pda: string, collectionName: string, style: DBCollectionInfo['style'] }>();

const styleRef = ref<CollectionStyle | null>(null);
const iconUri = ref<string>();


async function sendStyleToDb() {
    try {

        if (!styleRef.value) return
        const result = await server_api.collection.add.style(props.pda, wallet.value.publicKey.toBase58(), styleRef.value)
        if (!result) throw new Error(result.message);
        notify({
            type: 'success',
            icon: 'grade',
            message: 'Success!',
            caption: `Style added to ${props.collectionName}`,
            position: 'top'

        })
        return
    } catch (err: any) {
        console.error(err);
        notify({
            type: 'error',
            message: 'Something went Wrong',
            caption: err.message,
            position: 'top'
        })
    }

}


watchEffect(() => {
    if (props.style) {
        styleRef.value = props.style;
    }
    console.log(urlRegex)

})

</script>
<template>
    <q-card dark>
        <q-card-section>
            <div class="text-h6">
                {{ collectionName }}
            </div>
        </q-card-section>
        <q-card-section v-if="styleRef">
            <q-input dark dense v-model="styleRef.icon" label="URL to Icon/Logo For this Collection" type="url"
                :rules="[val => val && val.length > 0 || 'Please type something', val => urlRegex.test(val) || 'Please Enter a Valid URL']"></q-input>
        </q-card-section>
        <q-card-section v-if="styleRef" class="flex justify-around">
            <div class="primary-color flex justify-center">
                <div class="label text-h5 text-center">Primary</div>
                <q-color dark v-model="styleRef.colors.primary" no-header-tabs class="my-picker" />
            </div>
            <div class="secondary-color flex justify-center">
                <div class="label text-h5 text-center">Secondary</div>
                <q-color dark v-model="styleRef.colors.secondary" no-header-tabs class="my-picker" />
            </div>
            <div class="accent-color flex justify-center">
                <div class="label text-h5 text-center">Accent</div>
                <q-color dark v-model="styleRef.colors.accent" no-header-tabs class="my-picker" />
            </div>
        </q-card-section>
        <q-card-actions>
            <q-btn dark label="Send it" icon="send" @click="sendStyleToDb()" v-close-popup />
            <q-btn dark flat label="cancel" v-close-popup />
        </q-card-actions>
    </q-card>
</template>
<style lang="scss" scoped>
.label {
    flex: 0 0 100%;
}
</style>