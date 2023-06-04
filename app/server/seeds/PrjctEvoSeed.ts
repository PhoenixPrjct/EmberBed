import { getOrCreateAssociatedTokenAccount, Account, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey, Connection, clusterApiUrl, SystemProgram, Transaction } from "@solana/web3.js";
import { EBWallet, devKeyPair, ProgramWallet } from "../../src/dev/walletKPs";
import * as types from "../../src/types";

import "dotenv"
import { VersionedTransaction } from "@solana/web3.js";
import { TransactionMessage } from "@solana/web3.js";



function getConnection() {
    if (process.env.NODE_ENV === "production" && process.env.QUICK_NODE_HTTP) {
        return new Connection(process.env.QUICK_NODE_HTTP)
    } else {
        return new Connection(clusterApiUrl("devnet"))

    }
}
const connection = getConnection();
console.log({ connection: connection.rpcEndpoint })
async function getFunderATA(name: "Evo" | "Founder" | "Member" | "Saved", rewardToken: PublicKey) {
    return await getAssociatedTokenAddress(rewardToken, EBWallet.publicKey);
}
async function getRewardWallet(rewardToken: PublicKey, statePDA: PublicKey) {
    const rewardWallet = await getOrCreateAssociatedTokenAccount(connection, EBWallet, rewardToken, statePDA, true);
    return rewardWallet;
}
async function getPDA(rewardToken: PublicKey, collectionName: string) {
    const [pda, bump] = await PublicKey.findProgramAddressSync(
        [rewardToken.toBuffer(), Buffer.from("state")],
        types.PROGRAM_ID
    );
    return { pda, bump }
}
async function generateSeedInfo(name: "Evo" | "Founder" | "Member" | "Saved") {
    let seed: types.CollectionRewardInfoJSON = {} as types.CollectionRewardInfoJSON;
    let pda: PublicKey;
    let bump: number;
    let rewardToken: PublicKey;
    switch (name) {
        case "Evo":
            rewardToken = new PublicKey("")
            const EvoPdaAndBump = await getPDA(rewardToken, "PrjctEvo");
            pda = EvoPdaAndBump.pda;
            bump = EvoPdaAndBump.bump;
            const EvoRewardWallet = await (await getRewardWallet(rewardToken, pda)).address.toJSON()
            seed = {
                uuid: "",
                collectionAddress: '',
                bump: bump,
                rewardMint: "",
                collectionName: "PrjctEvo",
                rewardSymbol: "$EVO",
                ratePerDay: 7,
                fireEligible: true,
                manager: EBWallet.publicKey.toJSON(),
                phoenixRelation: types.PhoenixRelation.Evo,
                isInitialized: false,
                rewardWallet: EvoRewardWallet

            }

            break;
        case "Founder":
            rewardToken = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
            const FounderInfo = await getPDA(rewardToken, "PrjctPhoenix: Founder");
            pda = FounderInfo.pda;
            bump = FounderInfo.bump;
            const FounderRewardWallet = await (await getRewardWallet(rewardToken, pda)).address.toJSON()
            seed = {
                uuid: "",
                collectionAddress: '',
                bump: bump,
                rewardMint: rewardToken.toBase58(),
                collectionName: "PrjctPhoenix: Founder",
                rewardSymbol: "$FIRE",
                ratePerDay: 10,
                fireEligible: true,
                manager: EBWallet.publicKey.toJSON(),
                phoenixRelation: types.PhoenixRelation.Founder,
                isInitialized: false,
                rewardWallet: FounderRewardWallet

            }
            break;
        case "Member":
            rewardToken = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
            const MemberInfo = await getPDA(rewardToken, "PrjctPhoenix: Member");
            pda = MemberInfo.pda;
            bump = MemberInfo.bump;

            console.log({ pda, bump, rewardToken });
            const MemberRewardWallet = await (await getRewardWallet(rewardToken, pda)).address.toJSON()
            seed = {
                uuid: "",
                collectionAddress: '9xVireFnLBZ3ZCjLS29EzF632YbpSFwsKvwsqCLxefxr',
                bump: bump,
                rewardMint: rewardToken.toBase58(),
                collectionName: "PrjctPhoenix: Member",
                rewardSymbol: "$FIRE",
                ratePerDay: 5,
                fireEligible: true,
                manager: EBWallet.publicKey.toJSON(),
                phoenixRelation: types.PhoenixRelation.Member,
                isInitialized: false,
                rewardWallet: MemberRewardWallet

            }
            break;

        case "Saved":
            rewardToken = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
            const SavedInfo = await getPDA(rewardToken, "PrjctPhoenix: Saved");
            pda = SavedInfo.pda;
            bump = SavedInfo.bump;
            const SavedRewardWallet = await (await getRewardWallet(rewardToken, pda)).address.toJSON()
            seed = {
                uuid: "",
                collectionAddress: '',
                bump: bump,
                rewardMint: rewardToken.toBase58(),
                collectionName: "PrjctPhoenix: Saved",
                rewardSymbol: "$FIRE",
                ratePerDay: 3,
                fireEligible: true,
                manager: EBWallet.publicKey.toJSON(),
                phoenixRelation: types.PhoenixRelation.Saved,
                isInitialized: false,
                rewardWallet: SavedRewardWallet
            }
            break;
    }
    return { ...seed, statePda: pda }

}

export async function createPDA(name: "Evo" | "Member" | "Founder" | "Saved"): Promise<String | unknown> {
    try {
        const { phoenixRelation, collectionName, rewardSymbol, ratePerDay, collectionAddress, rewardWallet, rewardMint, bump, statePda } = await generateSeedInfo(name)
        const funderAta = await getFunderATA(name, new PublicKey(rewardMint))
        // let nftCollectionAddress: PublicKey = null as unknown as PublicKey
        const accounts: types.InitializeStatePdaAccounts = {
            statePda,
            rewardMint: new PublicKey(rewardMint),
            tokenPoa: new PublicKey(rewardWallet),
            nftCollectionAddress: new PublicKey(collectionAddress),
            funder: EBWallet.publicKey,
            funderAta,
            systemProgram: SystemProgram.programId
        }
        const args: types.InitializeStatePdaArgs = {
            bump,
            rate: ratePerDay,
            rewardSymbol,
            collectionName,
            fireEligible: true,
            phoenixCollectionRelation: phoenixRelation.kind,

        }
        // Create the TransactionInstruction using the initializeStatePda function
        const ix = types.initializeStatePda(args, accounts);
        console.log({ ix })
        let blockhash = await connection
            .getLatestBlockhash()
            .then((res) => res.blockhash);
        const messageV0 = new TransactionMessage({
            payerKey: EBWallet.publicKey,
            recentBlockhash: blockhash,
            instructions: [ix],
        }).compileToV0Message();
        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([EBWallet])
        const signature = await connection.sendTransaction(transaction)

        console.log('Transaction successful:', signature);
        return signature;
    } catch (error) {
        console.error('Transaction failed:', error);
        return error
    }
}
