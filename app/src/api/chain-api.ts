import { computed, watchEffect, ComputedRef, Ref } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Provider, Program } from '@project-serum/anchor'
import { createGlobalState } from '@vueuse/core'
import * as anchor from '@project-serum/anchor';
import web3 = anchor.web3;
import { IDL } from '../types/ember_bed'
import { getAPI } from '../solana/utils'
import { AnchorWallet, EmberBed } from 'src/types'
import { ProgramWallet } from 'src/dev/walletKPs'
// import { AnchorWallet } from 'solana-wallets-vue/src/useAnchorWallet'
console.log(typeof ProgramWallet)
// const devSecret = Uint8Array.from(devPk)
const EmberBedAddress = "2a1oeKBQddr2jgGB7MfvqHdEwi24KEcTS2Fbf5PvQTi5"
const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(EmberBedAddress);



export function getConnection(): string {
    let url = process.env.VUE_QUICK_NODE_HTTP //|| 'https://solana-api.projectserum.com'
    if (process.env.NODE_ENV !== 'production') {
        url = clusterApiUrl('devnet')
    }
    console.log({ url })
    if (!url) {
        url = "https://api.devnet.solana.com"
    }
    return url
}


export function _createChainAPI() {
    const programWallet = ProgramWallet;
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
        api,
        programWallet
    }

}

export const useChainAPI = createGlobalState(() => _createChainAPI());
