import { useChainAPI } from "src/api/chain-api";
import { CollectionRewardInfoJSON, CollectionRewardInfo } from "src/types";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";

const { connection } = useChainAPI();
const wallet = useWallet();

export async function validateCollectionInfo(
    collectionInfo: CollectionRewardInfoJSON
) {
    // try {
    Object.entries(collectionInfo).map((val, key) => { console.log(val[0], typeof val[1]) });
    const info: CollectionRewardInfo = CollectionRewardInfo.fromJSON(collectionInfo);
    console.log('INFO:', info.toJSON())
    await info.toJSON()
    return { success: true, info: info }
    // } catch (err: any) {
    // return { success: false, err: err.message };
    // }
}


export function getInitCost(kind: string) {
    let amount
    const baseAmount = 10

    switch (kind) {
        case 'EmberBed':
            amount = baseAmount / 2;
            break;
        case 'Affiliate':
            amount = baseAmount / 5;
            break;
        case 'Saved':
            amount = baseAmount / 10;
            break;
        case 'None':
            amount = baseAmount;
            break;
        default:
            amount = 0.05
            break;
    }
    return amount;
}

export function getStakingFee(kind: string) {
    let amount
    const baseAmount = 0.0095

    switch (kind) {
        case 'EmberBed':
            amount = baseAmount / 2;
            break;
        case 'Affiliate':
            amount = baseAmount / 5;
            break;
        case 'Saved':
            amount = baseAmount / 10;
            break;
        case 'None':
            amount = baseAmount;
            break;
        default:
            amount = 0.0095
            break;
    }
    return amount;
}

// export function getUserRate(nftsHeld: number) {
//     let amount
//     const baseRPD = 1

//     switch (kind) {
//         case 'EmberBed':
//             amount = baseRPD * 2;
//             break;
//         case 'Affiliate':
//             amount = baseRPD * 5;
//             break;
//         case 'Saved':
//             amount = baseRPD * 10;
//             break;
//         case 'None':
//             amount = baseRPD;
//             break;
//         default:
//             amount = 0.0095
//             break;
//     }
//     return amount;
// }


export async function chargeFeeTx(user: PublicKey, amount: number) {
    if (!user) throw new Error('No public key provided, did you connect your wallet?')
    console.log(`Initialization Fee = ${amount} SOL`);
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