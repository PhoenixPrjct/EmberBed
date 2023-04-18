import { useChainAPI } from "src/api/chain-api";

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
        return `https://explorer.solana.com/tx/${sig}?cluster=devnet`
    }
    return `https://explorer.solana.com/tx/${sig}`

}