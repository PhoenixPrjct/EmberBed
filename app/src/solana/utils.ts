import * as anchor from '@project-serum/anchor';
import { Program, Idl } from '@project-serum/anchor';
import { EmberBed } from './types/ember_bed';
import { PublicKey, Keypair, SystemProgram, Transaction, BlockheightBasedTransactionConfirmationStrategy } from '@solana/web3.js';
import { getAssociatedTokenAddress, Account, TOKEN_PROGRAM_ID, getAccount, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync, createAssociatedTokenAccount } from "@solana/spl-token"
import web3 = anchor.web3;
import { Accounts, AnchorWallet, CollectionInfo, CollectionRewardInfo, UnstakeAccounts, StakeAccounts, StakeState, StakeStateJSON, UserStakeInfo, UserStakeInfoJSON, StakeStateKind, RedeemRewardAccounts } from '../types'
import { devKP } from './wallets/devWallet'
import { fundKP } from './wallets/fundWallet';
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
import { ComputedRef } from 'vue';
import { useWallet } from 'solana-wallets-vue';


// const { connection, wallet } = useChainAPI();
const DevSecret = Uint8Array.from(devKP);
const FundSecret = Uint8Array.from(fundKP);
const DevWallet = Keypair.fromSecretKey(DevSecret as Uint8Array, { skipValidation: true });
const FundWallet = Keypair.fromSecretKey(FundSecret as Uint8Array);
const wallet: ComputedRef<AnchorWallet> = useAnchorWallet();


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
        // console.log({ PDA: pda.toBase58() })
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
        const rewardWallet = await getOrCreateAssociatedTokenAccount(connection, FundWallet, RewTok, statePDA, true)
        return rewardWallet
    }
    async function getUserRewardAta(user: web3.PublicKey, RewTok: web3.PublicKey) {
        const userRewardAta = await getAssociatedTokenAddress(RewTok, user);
        return userRewardAta;
    }
    async function getFireTokenAta() {
        const fireTokenATA = await getAssociatedTokenAddress(FireTok, FundWallet.publicKey);
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


    async function getAccounts(data: { user: web3.PublicKey, collectionName: string, rewardMint: string, nftMint?: string, nftColAddress?: string, }): Promise<Accounts> {
        let accounts: Accounts = {} as Accounts;
        const RewTok: PublicKey = new PublicKey(data.rewardMint);
        let nftAccounts = {};
        let mintAddress, nft, delegatedAuthPda,
            nftTokenAddress,
            stakeStatusPDA



        const userAccountPDA = await getUserAccountPda(data.user);
        const userRewardAta = await getUserRewardAta(data.user, RewTok);
        const statePDA = await getStatePda(RewTok, data.collectionName);
        const funderTokenAta = await getAssociatedTokenAddress(RewTok, data.user);
        const userAccounts = {
            userRewardAta: userRewardAta,
            userAccountPDA: userAccountPDA.pda
        }
        const rewardWallet = await (await getRewardWallet(RewTok, statePDA.pda)).address;

        const collectionAccounts = {
            funderTokenAta: funderTokenAta,
            rewardWallet: rewardWallet,
            RewTok: RewTok,
            stateBump: statePDA.bump,
            statePDA: statePDA.pda
        }
        accounts = { ...accounts, ...collectionAccounts, ...userAccounts }
        if (data.nftMint) {
            mintAddress = new PublicKey(data.nftMint);
            nft = await metaplex
                .nfts().findByMint({ mintAddress: mintAddress })
            delegatedAuthPda = await getDelegatedAuthPda();
            nftTokenAddress = await getNftTokenAddress(data.user, data.nftMint);
            stakeStatusPDA = await getStakeStatusPda(data.user, data.nftMint);
            nftAccounts = {
                nftTokenAddress: nftTokenAddress, nft: nft, stakeStatusPda: stakeStatusPDA.pda, stakeStatusBump: stakeStatusPDA.bump, delegatedAuthPda: delegatedAuthPda.pda,
                authBump: delegatedAuthPda.bump,
            };

            accounts = { ...accounts, ...nftAccounts }
        }
        if (data.nftColAddress) {
            const nftCollectionAddress = new PublicKey(data.nftColAddress);
            accounts = { ...accounts, nftCollectionAddress: nftCollectionAddress }
        }

        // console.log('REWTOK:', accounts.RewTok.toBase58())

        return accounts;
    }

    async function initializeFirePda(signers: web3.Keypair[] = []) {
        const fire = await getFirePda()
        const firePDA = fire.pda
        const bumpFire = fire.bump
        const fireTokenAta = await getAssociatedTokenAddress(FireTok, FundWallet.publicKey);
        const fireRewardWallet = await getOrCreateAssociatedTokenAccount(
            connection, FundWallet, FireTok, firePDA, true);
        const stateExists = await program.account.fireRewardInfo.getAccountInfo(firePDA.toBase58())
        const stateStatus = stateExists ? await program.account.fireRewardInfo.fetch(firePDA) : <any>{};

        console.log({ bumpFire: bumpFire })
        if (stateStatus.isInitialized) {
            console.log("Fire Account", firePDA.toBase58(), "Already Initialized")
            return true;
        }
        const tx = await program.methods.initializeFirePda(bumpFire).accounts({
            firePda: firePDA,
            tokenPoa: fireRewardWallet.address,
            rewardMint: FireTok,
            funder: FundWallet.publicKey,
            funderAta: fireTokenAta,
            systemProgram: SystemProgram.programId,
        }).signers(signers).rpc();
        console.log("Initialize Fire PDA tx:")
        console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        return tx;
    }

    async function chargeInitFee(user: PublicKey, amount: number) {
        const PhoenixWallet = FundWallet.publicKey// new web3.PublicKey('E9NxULjZAxU4j1NYkDRN2YVpmixoyLX3fd1SsWRooPLB');
        console.log(PhoenixWallet.toBase58(), `\n`, wallet.value.publicKey)
        try {
            async function getTx() {

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

                const transaction = new web3.Transaction()
                    .add(
                        web3.SystemProgram.transfer({
                            fromPubkey: user,
                            toPubkey: PhoenixWallet,
                            lamports: amount * web3.LAMPORTS_PER_SOL,
                        })
                    );
                transaction.feePayer = user
                transaction.recentBlockhash = blockhash;
                transaction.lastValidBlockHeight = lastValidBlockHeight
                console.dir(transaction);
                return transaction;
            }
            const transaction = await getTx();
            return transaction
        } catch (err) {
            console.dir(err);
            return { success: false, error: err };
        }
    }


    async function initStatePda(user: web3.PublicKey, collectionInfo: CollectionRewardInfo) {
        try {

            console.log(collectionInfo.collectionName)
            const { collectionName, collectionAddress, ratePerDay, rewardSymbol, fireEligible, phoenixRelation, rewardMint } = collectionInfo;
            const accounts = await getAccounts({ user, collectionName, rewardMint: rewardMint.toBase58() });
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

    async function stake(data: StakeAccounts): Promise<{ tx: string, stakeStatus: StakeStateJSON | null }> {
        // const accounts = await getAccounts({ user, collectionName, rewardMint: nftMint })
        const { collectionRewardInfo } = data
        const tx = await program.methods.stake(collectionRewardInfo)
            .accounts({ ...data })
            .signers([])
            .rpc();

        console.log("Stake tx:")
        console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        const stakeStatusInfo: UserStakeInfo | null = await UserStakeInfo.fetch(connection, data.stakeStatus);
        if (!stakeStatusInfo) return { tx: tx, stakeStatus: null as unknown as StakeStateJSON }
        const stakeState = stakeStatusInfo?.toJSON().stakeState
        return { tx: tx, stakeStatus: stakeState }
    }
    async function redeemFire() {
        console.log('Hey')
    };
    async function redeemReward(accounts: RedeemRewardAccounts, collectionName: string, bumpState: number) {

        const rewardTxPromise = program.methods.redeemReward(bumpState, collectionName)
            .accounts({ ...accounts })
        const rewardTx = await rewardTxPromise
        const sig = await rewardTx.rpc();

        console.log("Redeem tx:")
        console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
        return sig;

    };
    async function unstake(accounts: UnstakeAccounts): Promise<{ tx: string, stakeState: StakeStateJSON | null }> {
        // console.log('Unstaking NFT:', accounts.nftMintAddress.toBase58());
        // console.log("Delegated Authority:", accounts.programAuthority.toBase58());
        // console.log("SystemProgram:", SystemProgram.programId.toBase58());
        // console.log("Token Program:", TOKEN_PROGRAM_ID.toBase58());
        // console.log("Delegated Authority", accounts.programAuthority.toBase58());
        // console.log("Stake Status", accounts.stakeStatus.toBase58());
        const unstakeTxPromise = program.methods.unstake().accounts({
            ...accounts,
            // user: accounts.user,
            // nftAta: accounts.nftAta,
            // nftMintAddress: accounts.nftMintAddress,
            // nftEdition: accounts.nftEdition,
            // stakeStatus: accounts.stakeStatus,
            // programAuthority: accounts.programAuthority,
            // *SYSTEM Variables
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
        });
        // console.log("Unstake tx:")
        // console.log(`https://explorer.solana.com/tx/${unstakeTx}?cluster=devnet`)
        const unstakeTx = await unstakeTxPromise;
        // if (!unstakeTx) throw new Error('Promise Error')
        const sig = await unstakeTx.rpc();
        console.log("Signature:", sig)
        const stakeStatus = await (await UserStakeInfo.fetch(connection, accounts.stakeStatus))?.toJSON()
        const stakeState = stakeStatus?.stakeState || null

        return { tx: sig, stakeState: stakeState }

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
        chargeInitFee,
        getStakeStatusPda,
        getStatePda

    }
}
