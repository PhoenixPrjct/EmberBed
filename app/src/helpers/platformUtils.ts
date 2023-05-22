import { useChainAPI } from "src/api/chain-api";
// import { InitializeFirePdaAccounts } from "src/types/instructions/initializeFirePda";

export async function getAllEBCollections() {
    const { program } = useChainAPI();
    if (!program.value) return
    const collections = await program.value.account.collectionRewardInfo.all()
    collections.forEach(col => console.log({ pda: col.publicKey.toBase58() }))
    const collectionNames = collections.map(col => col.account.collectionName);
    return collectionNames
}

export function getExplorerURL(sig: string) {
    if (process.env.NODE_ENV !== "production") {
        return `<a href='https://explorer.solana.com/tx/${sig}?cluster=devnet' target='_blank'> See transaction </a>`
    }
    return `<a href='https://explorer.solana.com/tx/${sig}' target='_blank'> See transaction </a>`

}

// export async function initializeFirePda() {
//     const { program,api } = useChainAPI();
//     const accounts:InitializeFirePdaAccounts = await api.value?.getAccounts()
// }