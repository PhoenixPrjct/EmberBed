import { useChainAPI } from "src/api/chain-api";
import { CollectionRewardInfoJSON, CollectionRewardInfo } from "src/types";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";

const { connection } = useChainAPI();
const wallet = useWallet();

export async function validateCollectionInfo(
    collectionInfo: CollectionRewardInfoJSON
) {
    try {

        Object.entries(collectionInfo).map((val, key) => { console.log(val[0], typeof val[1]) });
        const info: CollectionRewardInfo = await CollectionRewardInfo.fromJSON(collectionInfo)
        console.log('INFO:', info.toJSON())
        return { success: true, info: info }
    } catch (err: any) {
        return { success: false, err: err.message };
    }
}



export async function collectionInitFeeTx(user: PublicKey, amount: number) {
    if (!user) return { error: 'No public key provided, did you connect your wallet?' }
    alert(`Initialization Fee = ${amount * LAMPORTS_PER_SOL} SOL`);
    const PhoenixWallet = new PublicKey('E9NxULjZAxU4j1NYkDRN2YVpmixoyLX3fd1SsWRooPLB')
    try {
        const latestBlockHash = await connection.getLatestBlockhash();
        const { blockhash, lastValidBlockHeight } = latestBlockHash

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: user,
                toPubkey: PhoenixWallet,
                lamports: amount * LAMPORTS_PER_SOL,
            }))
        const sig = await wallet.sendTransaction(transaction, connection)
        if (!sig) throw new Error('Transaction failed: ' + JSON.stringify(sig))
        console.log({ sig })
        console.log({ latestBlockHash })
        const confirmation = await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');
        console.dir(confirmation)
        if (!confirmation.value.err) {
            console.log(`Successfully validated signature \n \n ${sig}`)
            return { success: true, sig: sig }
        }
        console.log(confirmation.value.err)
        return { success: false, error: confirmation.value.err };
    } catch (err: any) {
        console.dir(err)
        return { success: false, error: err.mesage };

    }
}
// export function validateCollectionInfo(collectionInfo: CollectionRewardInfoJSON): ValidInfoSuccess | <{ Error: any }> {
//     try {
//         return { success: true, info: CollectionRewardInfo.fromJSON(collectionInfo) };
//     } catch (err: any) {
//         return { Error: err.message }
//     }
// }