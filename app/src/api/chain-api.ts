import { computed, watchEffect, ComputedRef } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { Provider, Program } from '@project-serum/anchor'
import { createGlobalState } from '@vueuse/core'
import * as anchor from '@project-serum/anchor';
import web3 = anchor.web3;
import { EmberBed, IDL } from '../solana/types/ember_bed'
import { getAPI } from '../solana/utils'

const EmberBedAddress = "BW2w1qyVvgZyv6iNuYycWDnmNCMHoY8iA49BkHPzPi7Z"

const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(EmberBedAddress);

export function _createChainAPI() {
    const wallet = useAnchorWallet();
    const connection = new Connection(clusterApiUrl('devnet'));
    const provider = computed(() => wallet.value ? new anchor.AnchorProvider(connection, wallet.value, { preflightCommitment, commitment }) : null)
    const program = computed(() => provider.value ? new Program(IDL, programID, provider.value) : null);
    const newProgram = program as unknown as ComputedRef<Program<EmberBed>>;
    const api = computed(() => program.value ? getAPI(newProgram.value) : null)
    return {
        program: newProgram,
        wallet,
        connection,
        api
    }
}

export const useChainAPI = createGlobalState(() => _createChainAPI());