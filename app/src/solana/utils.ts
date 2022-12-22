import * as anchor from '@project-serum/anchor';
import { Program, Idl } from '@project-serum/anchor';
import { EmberBed } from './types/ember_bed';
import { PublicKey, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, Account, TOKEN_PROGRAM_ID, getAccount, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import web3 = anchor.web3;
import { Accounts, AnchorWallet, CollectionInfo, CollectionRewardInfo } from '../types'
import { devKP } from './wallets/devWallet'
import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
    useNftOperationHandler,
    Nft,
    walletAdapterIdentity,
} from "@metaplex-foundation/js"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { useAnchorWallet } from 'solana-wallets-vue';


// const { connection, wallet } = useChainAPI();
const DevSecret = Uint8Array.from(devKP);
// const FundSecret = Uint8Array.from(fundKP);
const DevWallet = Keypair.fromSecretKey(DevSecret as Uint8Array, { skipValidation: true });
// const FundWallet = Keypair.fromSecretKey(FundSecret as Uint8Array);
const wallet: AnchorWallet = useAnchorWallet().wallet;
const demoCollectionInfo = [{
    name: 'ZeroEvo',
    tokenMint: 'REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko',
    tokenName: 'Evo',
    tokenSymbol: '$EVO',
    relation: 'Affiliate'
},
{
    name: 'TestEyes',
    tokenMint: 'REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko',
    tokenName: 'Eyes',
    tokenSymbol: '$EYES',
    relation: 'Affiliate'
},
{
    name: 'Phoenix: Founder',
    tokenMint: 'F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw',
    tokenName: 'Fire',
    tokenSymbol: '$FIRE'
}]


export function getAPI(program: Program<EmberBed>) {
    const connection = program.provider.connection
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(DevWallet))
        .use(bundlrStorage())
    const FireTok = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")

    async function getStatePda(RewTok: web3.PublicKey, collectionName: string): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [pda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
            [RewTok.toBuffer(), Buffer.from(collectionName), Buffer.from("state")],
            program.programId
        );
        console.log({ PDA: pda.toBase58() })
        return { pda, bump };
    }

    async function getFirePda(): Promise<{ pda: web3.PublicKey, bump: number }> {
        const fireCollName = "EmberBed"
        const [pda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
            [FireTok.toBuffer(), Buffer.from(fireCollName), Buffer.from("fstate")],
            program.programId
        );

        return { pda, bump };
    }

    async function getDelegatedAuthPda(): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [delegatedAuthPda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("authority")],
            program.programId
        );
        return { pda: delegatedAuthPda, bump: bump };
    }


    async function getUserAccountPda(user: web3.PublicKey): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [userAccountPDA, bumpAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
            [user.toBuffer()],
            program.programId
        );
        return { pda: userAccountPDA, bump: bumpAccount }
    }

    async function getUserRewardInfoPda(user: web3.PublicKey, RewTok: web3.PublicKey): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [userRewardInfoPda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
            [user.toBuffer(), RewTok.toBuffer()],
            program.programId
        );
        return { pda: userRewardInfoPda, bump: bump };
    }
    async function getStakeStatusPda(user: web3.PublicKey, nftMint: string): Promise<{ pda: web3.PublicKey, bump: number }> {
        const mintAddress: PublicKey = new PublicKey(nftMint);
        const nftTokenAddress = await getAssociatedTokenAddress(mintAddress, user)
        const [stakeStatusPda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
            [user.toBuffer(), nftTokenAddress.toBuffer()],
            program.programId
        );
        return { pda: stakeStatusPda, bump: bump }
    }

    async function getUserFireAta(user: web3.PublicKey) {
        const userFireAta = await getAssociatedTokenAddress(FireTok, user);
        return userFireAta;

    }

    async function getRewardWallet(RewTok: web3.PublicKey, statePDA: web3.PublicKey) {

        const rewardWallet = await getOrCreateAssociatedTokenAccount(
            connection, DevWallet, RewTok, statePDA, true)
        console.log(rewardWallet.address.toBase58())
        return rewardWallet;
    }
    async function getUserRewardAta(user: web3.PublicKey, RewTok: web3.PublicKey) {
        const userRewardAta = await getAssociatedTokenAddress(RewTok, user);
        return userRewardAta;
    }
    async function getFireTokenAta() {
        const fireTokenATA = await getAssociatedTokenAddress(FireTok, DevWallet.publicKey);
        return fireTokenATA
    }


    // async function findRewardMintForCollection(collection: string) {
    //     const info = await getCollectionInfo(collection)
    //     return new PublicKey(info.)

    // }

    async function getNftTokenAddress(user: web3.PublicKey, nftMint: string) {
        const mintAddress = new PublicKey(nftMint);
        const nftTokenAddress = await getAssociatedTokenAddress(mintAddress, user);
        return nftTokenAddress;
    }


    async function getAccounts(user: web3.PublicKey, collectionName: string, rewardMint: string, nftColAddress?: string, nftMint?: string): Promise<Accounts> {
        let accounts: Accounts = {} as Accounts;
        const RewTok: PublicKey = new PublicKey(rewardMint);
        let nftAccounts = {};
        let mintAddress, nft, delegatedAuthPda,
            nftTokenAddress,
            stakeStatusPDA



        const userAccountPDA = await getUserAccountPda(user);
        const userRewardAta = await getUserRewardAta(user, RewTok);
        const statePDA = await getStatePda(RewTok, collectionName);
        const funderTokenAta = await getAssociatedTokenAddress(RewTok, user);
        const userAccounts = {
            userRewardAta: userRewardAta,
            userAccountPDA: userAccountPDA.pda
        }
        const rewardWallet = await getRewardWallet(RewTok, statePDA.pda);

        const collectionAccounts = {
            funderTokenAta: funderTokenAta,
            rewardWallet: rewardWallet.address,
            RewTok: RewTok,
            stateBump: statePDA.bump,
            statePDA: statePDA.pda
        }
        accounts = { ...accounts, ...collectionAccounts, ...userAccounts }
        if (nftMint) {
            mintAddress = new PublicKey(nftMint);
            nft = await metaplex
                .nfts().findByMint({ mintAddress: mintAddress })
            delegatedAuthPda = await getDelegatedAuthPda();
            nftTokenAddress = await getNftTokenAddress(user, nftMint);
            stakeStatusPDA = await getStakeStatusPda(user, nftMint);
            nftAccounts = {
                nftTokenAddress: nftTokenAddress, nft: nft, stakeStatusPda: stakeStatusPDA.pda, stakeStatusBump: stakeStatusPDA.bump, delegatedAuthPda: delegatedAuthPda.pda,
                authBump: delegatedAuthPda.bump,
            };

            accounts = { ...accounts, ...nftAccounts }
        }
        if (nftColAddress) {
            const nftCollectionAddress = new PublicKey(nftColAddress);
            accounts = { ...accounts, nftCollectionAddress: nftCollectionAddress }
        }

        console.log('REWTOK:', accounts.RewTok.toBase58())

        return accounts;
    }

    async function initializeFirePda(signers: web3.Keypair[] = []) {
        const fire = await getFirePda()
        const firePDA = fire.pda
        const bumpFire = fire.bump
        const fireTokenAta = await getAssociatedTokenAddress(FireTok, DevWallet.publicKey);
        const fireRewardWallet = await getOrCreateAssociatedTokenAccount(
            connection, DevWallet, FireTok, firePDA, true);
        const stateExists = await program.account.fireRewardInfo.getAccountInfo(firePDA.toBase58())
        const stateStatus = stateExists ? await program.account.fireRewardInfo.fetch(firePDA) : <any>{};

        console.log({ bumpFire: bumpFire })
        if (stateStatus.isInitialized) {
            console.log("Fire Account", firePDA.toBase58(), "Already Initialized")
            return true;
        }
        const tx = await program.methods.initializeFirePda(bumpFire, "EmberBed").accounts({
            firePda: firePDA,
            tokenPoa: fireRewardWallet.address,
            rewardMint: FireTok,
            funder: DevWallet.publicKey,
            funderAta: fireTokenAta,
            systemProgram: SystemProgram.programId,
        }).signers(signers).rpc();
        console.log("Initialize Fire PDA tx:")
        console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        return tx;
    }

    async function chargeInitFee(amount: number) {
        const PhoenixWallet = new web3.PublicKey('E9NxULjZAxU4j1NYkDRN2YVpmixoyLX3fd1SsWRooPLB')
        try {
            const latestBlockHash = await connection.getLatestBlockhash();
            const { blockhash, lastValidBlockHeight } = latestBlockHash

            const transaction: Transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: PhoenixWallet,
                    lamports: amount * web3.LAMPORTS_PER_SOL,
                }))
            const signature = await wallet.signTransaction(transaction);
            console.log({ signature })
            console.log({ latestBlockHash })


            const confirmation = await connection.confirmTransaction({ signature: signature.toString(), blockhash, lastValidBlockHeight }, 'confirmed')
            console.dir(confirmation)
            if (!confirmation.value.err) {
                console.log(`Successfully validated signature \n \n ${signature}`)
                return { success: true, sig: signature, message: `Successfully paid initialization fee ${amount} SOL` }
            }
            console.log(confirmation.value.err)
            return { success: false, sig: signature, error: confirmation.value.err };
        } catch (err) {
            console.dir(err)
            return { success: false, error: err };

        }
    }

    async function initStatePda(user: web3.PublicKey, collectionInfo: CollectionRewardInfo) {
        try {

            console.log(collectionInfo.collectionName)
            const { collectionName, collectionAddress, ratePerDay, rewardSymbol, fireEligible, phoenixRelation, rewardMint } = collectionInfo;
            const accounts = await getAccounts(user, collectionName, rewardMint.toBase58());
            const { statePDA, RewTok, stateBump, funderTokenAta } = accounts;
            const rewardWallet = await getRewardWallet(RewTok, statePDA);
            const nftCollectionAddress = new PublicKey(collectionAddress);

            const stateExists = await program.account.collectionRewardInfo.getAccountInfo(statePDA.toBase58())
            const stateStatus = stateExists ? await program.account.collectionRewardInfo.fetch(statePDA) : <any>{};
            // if (stateStatus.isInitialized) {
            //     console.log("State Account", statePDA.toBase58(), "Already Initialized")
            //     return statePDA.toBase58();
            // }
            // console.log({ statePDA: statePDA.toBase58(), stateBump, rewardWallet: rewardWallet.address.toBase58(), RewTok: RewTok.toBase58(), nftCollectionAddress: nftCollectionAddress.toBase58(), user: user.toBase58(), userATA: funderTokenAta.toBase58() })
            const tx = await program.methods.initializeStatePda(stateBump, ratePerDay, rewardSymbol, collectionName, fireEligible, phoenixRelation.kind).accounts({
                statePda: statePDA,
                tokenPoa: rewardWallet.address,
                rewardMint: RewTok,
                // authPda: authPDA,
                nftCollectionAddress: nftCollectionAddress,
                funder: user,
                funderAta: funderTokenAta,
                systemProgram: SystemProgram.programId,
            }).signers([]).rpc();

            const account = await CollectionRewardInfo.fetch(connection, statePDA);//await program.account.collectionRewardInfo.getAccountInfo(statePDA)

            console.dir({ tx })
            return { tx: tx, pdas: { collectionInfoPDA: statePDA.toBase58(), rewardWallet: rewardWallet.address.toBase58() }, account: account }
        } catch (e: any) {
            console.log(e)
            return { error: e?.message }
        }
    };

    async function stake(user: web3.PublicKey, collectionName: string, nftMint: string, signers: web3.Keypair) {
        const accounts = await getAccounts(user, collectionName, nftMint)
        const { RewTok, nft, nftTokenAddress, userRewardAta, stakeStatusPda, userAccountPDA, statePDA, delegatedAuthPda } = accounts
        const tx = await program.methods.stake()
            .accounts({
                user: user,
                userRewardAta: userRewardAta,
                nftAta: nftTokenAddress,
                nftMintAddress: nft.mint.address,
                nftEdition: nft.edition.address,
                stakeStatus: stakeStatusPda,
                userAccountPda: userAccountPDA,
                collectionRewardInfo: statePDA,
                rewardMint: RewTok,
                programAuthority: delegatedAuthPda,
                // *SYSTEM Variables
                tokenProgram: TOKEN_PROGRAM_ID,
                metadataProgram: METADATA_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .signers([signers])
            .rpc();

        console.log("Stake tx:")
        console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        return tx
    }
    async function redeemFire() {
        console.log('Hey')
    };
    async function redeemReward() {
        console.log('Hey')
    };
    async function unstake() {
        console.log('Hey')
    };
    async function depositToFireAta() {
        console.log('Hey')
    };
    async function depositToRewardAta() {
        console.log('Hey')
    };
    async function managerWithdrawal() {
        console.log('Hey')
    };
    async function getUsersStakedNfts() {
        console.log('Hey')
    };
    return {
        initializeFirePda,
        initStatePda,
        depositToFireAta,
        depositToRewardAta,
        managerWithdrawal,
        stake,
        redeemFire,
        redeemReward,
        unstake,
        getAccounts,
        getRewardWallet,
        chargeInitFee

    }
}
