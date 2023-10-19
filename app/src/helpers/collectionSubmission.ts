import { getConnection, useChainAPI } from "src/api/chain-api";
import { CollectionRewardInfoJSON, CollectionRewardInfo } from "src/types";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import { program } from "@project-serum/anchor/dist/cjs/native/system";

const connection = new Connection(getConnection());;
const wallet = useWallet();

export async function validateCollectionInfo(
    collectionInfo: CollectionRewardInfoJSON
) {
    try {
        Object.entries(collectionInfo).map((val) => { console.log(val[0], val[1], typeof val[1]) });
        const info: CollectionRewardInfo = CollectionRewardInfo.fromJSON(collectionInfo);
        console.log('INFO:', await info.toJSON())
        const res = await info.toJSON()
        console.log({ res })
        return { success: true, info: res }
    } catch (err: any) {
        return { success: false, err: err };
    }
}


export function getInitCost(kind: string) {
    let amount
    const baseAmount = 5

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
        case 'Evo':
        case 'Founder':
        case 'Member':
            amount = baseAmount / 100;
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
// * TODO: Implement once collections are added.
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
    const PhoenixWallet = useChainAPI().programWallet.publicKey
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

export async function refundTxFee(user: PublicKey, amount: number) {
    const PhoenixWallet = useChainAPI().programWallet
    try {
        const latestBlockHash = await connection.getLatestBlockhash();
        const { blockhash, lastValidBlockHeight } = latestBlockHash

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: PhoenixWallet.publicKey,
                toPubkey: user,
                lamports: amount * LAMPORTS_PER_SOL,

            }))
        transaction.recentBlockhash = blockhash
        transaction.sign(PhoenixWallet);
        const sig = await connection.sendRawTransaction(transaction.serialize());
        if (!sig) throw new Error('Transaction failed: ' + JSON.stringify(sig))
        console.log({ sig })

        const confirmation = await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');
        console.dir(confirmation)
        if (!confirmation.value.err) {
            console.log(`Successfully refunded tx \n \n ${sig}`)
            return { success: true, sig: sig }
        }
        console.log(confirmation.value.err)
        return { success: false, error: confirmation.value.err };
    } catch (err: any) {
        console.dir(err)
        return { success: false, error: err.message };

    }
}