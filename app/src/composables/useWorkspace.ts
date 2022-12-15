import { computed, ComputedRef, Ref } from "vue";
import { AnchorWallet, useAnchorWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { getAPI } from "src/solana/utils";
import { EmberBed, IDL } from '../solana/types/ember_bed'
import { useChainAPI } from "src/api/chain-api";


const preflightCommitment = "processed";
const commitment = "confirmed";
const programID = new PublicKey(IDL.metadata.address);

let workspace: { wallet: Ref<AnchorWallet | undefined>; connection: Connection; provider: ComputedRef<AnchorProvider>; program: ComputedRef<Program<EmberBed>>; api?: ComputedRef<any>; } | null = null;
export const useWorkspace = () => workspace;

export const initWorkspace = () => {
    const wallet = useAnchorWallet();
    const connection = new Connection(clusterApiUrl("devnet"), commitment);
    const provider = computed(
        () =>
            new AnchorProvider(connection, wallet.value!, {
                preflightCommitment,
                commitment,
            })
    );
    const program = computed(() => new Program(IDL, programID, provider.value));
    const { api } = useChainAPI();

    console.log(wallet.value?.publicKey.toBase58())
    workspace = {
        api,
        wallet,
        connection,
        provider,
        program,
    };
};
