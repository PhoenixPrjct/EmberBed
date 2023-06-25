import { getOrCreateAssociatedTokenAccount, Account, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey, Connection, clusterApiUrl, SystemProgram, Transaction } from "@solana/web3.js";
import { EBWallet, devKeyPair, ProgramWallet } from "../../src/dev/walletKPs";
import * as types from "../../src/types";
import { CC } from "../controllers"
import "dotenv"
import { VersionedTransaction } from "@solana/web3.js";
import { TransactionMessage } from "@solana/web3.js";
import { type } from "os";
import { _ } from "app/dist/spa/assets/logo_only.976939b9";

function getConnection() {
    // if (process.env.NODE_ENV === "production" && process.env.QUICK_NODE_HTTP) {
    //     return new Connection(process.env.QUICK_NODE_HTTP)
    // } else {
    return new Connection(clusterApiUrl("devnet"))

    // }
}
const connection = getConnection();
// console.log({ connection: connection.rpcEndpoint })
async function getFunderATA(rewardToken: PublicKey) {
    const ata = await getAssociatedTokenAddress(rewardToken, EBWallet.publicKey);
    // console.log({ ata: ata.toJSON() });
    return ata;
}
async function getRewardWallet(rewardToken: PublicKey, statePDA: PublicKey) {
    const rewardWallet = await getOrCreateAssociatedTokenAccount(connection, EBWallet, rewardToken, statePDA, true);
    return rewardWallet;
}
console.log({ EBWallet: EBWallet.publicKey.toJSON() })
async function getPDA(RewTok: PublicKey, collectionName: string): Promise<{ pda: PublicKey, bump: number }> {
    const res = PublicKey.findProgramAddressSync(
        [RewTok.toBuffer(), Buffer.from(collectionName), Buffer.from("state")],
        types.PROGRAM_ID
    );
    console.log({ PROGRAM_ID: types.PROGRAM_ID.toBase58() })
    console.log({ pda: res[0].toBase58() })
    return { pda: res[0], bump: res[1] };
}
async function generateSeedInfo(name: "Evo" | "Founder" | "Member" | "Saved") {
    let seed: types.CollectionRewardInfoFields = {} as types.CollectionRewardInfoFields;
    let pda: PublicKey;
    let bump: number;
    let rewardToken: PublicKey;
    switch (name) {
        case "Evo":
            rewardToken = new PublicKey("")
            const EvoPdaAndBump = await getPDA(rewardToken, "PrjctEvo");
            pda = EvoPdaAndBump.pda;
            bump = EvoPdaAndBump.bump;
            const EvoRewardWallet = await (await getRewardWallet(rewardToken, pda)).address
            seed = {
                uuid: pda.toBase58(),
                collectionAddress: new PublicKey(""),
                bump: bump,
                rewardMint: rewardToken,
                collectionName: "PrjctEvo",
                rewardSymbol: "$EVO",
                ratePerDay: 7,
                fireEligible: true,
                manager: EBWallet.publicKey,
                phoenixRelation: types.PhoenixRelation.fromJSON(types.PhoenixRelation.Evo),
                isInitialized: true,
                rewardWallet: EvoRewardWallet
            }
            break;
        case "Founder":
            rewardToken = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
            const FounderInfo = await getPDA(rewardToken, "PrjctFounder");
            pda = FounderInfo.pda;
            bump = FounderInfo.bump;
            const FounderRewardWallet = await (await getRewardWallet(rewardToken, pda)).address
            seed = {
                uuid: pda.toBase58(),
                collectionAddress: new PublicKey(""),
                bump: bump,
                rewardMint: rewardToken,
                collectionName: "PrjctFounder",
                rewardSymbol: "$FIRE",
                ratePerDay: 10,
                fireEligible: true,
                manager: EBWallet.publicKey,
                phoenixRelation: types.PhoenixRelation.fromJSON(types.PhoenixRelation.Founder),
                isInitialized: false,
                rewardWallet: FounderRewardWallet

            }
            break;
        case "Member":
            rewardToken = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
            const MemberInfo = await getPDA(rewardToken, "PrjctMember");
            pda = MemberInfo.pda;
            bump = MemberInfo.bump;

            console.log({ pda, bump, rewardToken });
            const MemberRewardWallet = await (await getRewardWallet(rewardToken, pda)).address.toJSON()
            seed = {
                uuid: pda.toBase58(),
                bump: bump,
                rewardMint: rewardToken,
                collectionName: "PrjctMember",
                rewardSymbol: "$FIRE",
                ratePerDay: 5,
                fireEligible: true,
                manager: EBWallet.publicKey,
                phoenixRelation: types.PhoenixRelation.fromJSON(types.PhoenixRelation.Member),
                isInitialized: false,
                rewardWallet: new PublicKey(MemberRewardWallet)

            } as types.CollectionRewardInfoFields;
            break;

        case "Saved":
            rewardToken = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
            const SavedInfo = await getPDA(rewardToken, "PrjctSaved");
            pda = SavedInfo.pda;
            bump = SavedInfo.bump;
            const SavedRewardWallet = await (await getRewardWallet(rewardToken, pda)).address
            seed = {
                uuid: pda.toBase58(),
                collectionAddress: new PublicKey(""),
                bump: bump,
                rewardMint: rewardToken,
                collectionName: "PrjctSaved",
                rewardSymbol: "$FIRE",
                ratePerDay: 3,
                fireEligible: true,
                manager: EBWallet.publicKey,
                phoenixRelation: types.PhoenixRelation.fromJSON(types.PhoenixRelation.Saved),
                isInitialized: false,
                rewardWallet: SavedRewardWallet
            }
            break;
    }
    return { ...seed, statePda: pda }
}
async function getFireInfo() {
    const rewardMint = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")
    const FireInfo = await PublicKey.findProgramAddressSync(
        [Buffer.from("ebtreasury"), Buffer.from("fstate")],
        types.PROGRAM_ID
    );
    const firePda = FireInfo[0]
    const fireBump = FireInfo[1]
    const tokenPoa = await getOrCreateAssociatedTokenAccount(connection, EBWallet, rewardMint, firePda, true);
    const funderAta = await getFunderATA(rewardMint)
    return { firePda, fireBump, tokenPoa, rewardMint, funderAta }
}


async function generateFireAccount(name = "Fire") {
    const { tokenPoa, rewardMint, firePda, fireBump, funderAta } = await getFireInfo()
    const accounts: types.InitializeFirePdaAccounts = {
        firePda,
        rewardMint,
        tokenPoa: tokenPoa.address,
        funder: EBWallet.publicKey,
        funderAta,
        systemProgram: SystemProgram.programId,
    }
    const args: types.InitializeFirePdaArgs = {
        bump: fireBump,
    }
    const exists = await connection.getAccountInfo(firePda)
    console.log({ exists: (exists) })
    if (exists) {
        console.log("PDA already exists")
        console.log({ pda: firePda.toBase58(), manager: EBWallet.publicKey.toBase58(), collection: "EmberBed", reward_wallet: tokenPoa.address.toBase58(), vca: "" })
        return { name: "fire", sig: firePda.toBase58() };
    }
    const ix = types.initializeFirePda(args, accounts);
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
    return ({ name, signature })
}

export async function createPDA(name: "Evo" | "Member" | "Founder" | "Saved" | "Fire"): Promise<String | unknown> {
    try {
        if (name === "Fire") {
            console.log("Creating fire account")
            return await generateFireAccount();
        }
        // console.log({ EBWallet: EBWallet.publicKey.toBase58() })
        const { phoenixRelation, collectionName, rewardSymbol, ratePerDay, collectionAddress, rewardWallet, rewardMint, bump, statePda } = await generateSeedInfo(name)
        const funderAta = await getFunderATA(new PublicKey(rewardMint))
        // console.log({ funderAta: funderAta.toJSON() })
        const colAddress = collectionAddress ? collectionAddress.toJSON() : ""
        // let nftCollectionAddress: PublicKey = null as unknown as PublicKey
        const accounts: types.InitializeStatePdaAccounts = {
            statePda,
            rewardMint: new PublicKey(rewardMint),
            tokenPoa: new PublicKey(rewardWallet),
            funder: EBWallet.publicKey,
            funderAta,
            systemProgram: SystemProgram.programId
        }
        const args: types.InitializeStatePdaArgs = {
            bump,
            rate: ratePerDay,
            rewardSymbol,
            collectionName,
            nftCollectionPubkey: colAddress,
            fireEligible: true,
            phoenixCollectionRelation: phoenixRelation.kind,

        }

        const exists = await connection.getAccountInfo(statePda)
        if (exists) {
            console.log("PDA already exists")
            console.log({ exists_state: exists.data.toJSON() })
            // CC.create({ pda: statePda.toBase58(), manager: EBWallet.publicKey.toBase58(), collection: collectionName, reward_wallet: rewardWallet.toBase58(), vca: collectionAddress?.toString() })
            return statePda.toBase58();
        }


        // console.log({ accts: accounts, args: args })
        // Create the TransactionInstruction using the initializeStatePda function
        const ix = types.initializeStatePda(args, accounts);
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
