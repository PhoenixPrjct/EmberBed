import { computed, watchEffect, ComputedRef, Ref } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { Provider, Program } from '@project-serum/anchor'
import { createGlobalState } from '@vueuse/core'
import * as anchor from '@project-serum/anchor';
import web3 = anchor.web3;
import { IDL } from '../solana/types/ember_bed'
import { getAPI } from '../solana/utils'
import { AnchorWallet, EmberBed } from 'src/types'

// import { AnchorWallet } from 'solana-wallets-vue/src/useAnchorWallet'

const EmberBedAddress = "6Gn1WEdLCAiC7JfMekmWHsEeEwoByn1JP5VV3n2sWLKz"
const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(EmberBedAddress);



export function getConnection() {
    let url = process.env.QUICK_NODE_HTTP || 'https://solana-api.projectserum.com'
    console.log({ url1: url })
    console.log({ nodeENV: process.env.NODE_ENV })
    if (process.env.NODE_ENV !== 'production') {
        url = clusterApiUrl('devnet')
    }
    console.log({ url })
    return url
}


export function _createChainAPI() {

    const wallet: Ref<AnchorWallet | undefined> = useAnchorWallet();
    // console.log(wallet.value)
    const connection = new Connection(getConnection());
    const provider = computed(() => wallet.value ? new anchor.AnchorProvider(connection, wallet.value, { preflightCommitment, commitment }) : null)
    // console.log(provider.value)
    const program = computed(() => provider.value ? new Program(IDL, programID, provider.value) : null);
    const newProgram = program as unknown as ComputedRef<Program<EmberBed>>;
    const api = computed(() => program.value ? getAPI(newProgram.value) : null)

    // console.log(newProgram?.value)
    return {
        program: newProgram,
        wallet,
        connection,
        api
    }

}

export const useChainAPI = createGlobalState(() => _createChainAPI());
