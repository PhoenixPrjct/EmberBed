import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { EmberBed } from 'src/types';
import { PublicKey, Keypair, SystemProgram /*,Transaction, BlockheightBasedTransactionConfirmationStrategy*/ } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    // Account,
    TOKEN_PROGRAM_ID,
    // getAccount, 
    getOrCreateAssociatedTokenAccount,
    // getAssociatedTokenAddressSync, 
    // createAssociatedTokenAccount 
} from "@solana/spl-token"
import web3 = anchor.web3;
import { Accounts, AnchorWallet, CollectionRewardInfo, UnstakeAccounts, StakeAccounts, StakeStateJSON, UserStakeInfo, RedeemRewardAccounts, RedeemFireAccounts } from '../types'
// import * as devSecret from './wallets/devWallet'
import * as fundSecret from './wallets/fundWallet';
import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
    // useNftOperationHandler,
    // Nft,
    // walletAdapterIdentity,
} from "@metaplex-foundation/js"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { getExplorerURL } from 'src/helpers';
import { useAnchorWallet } from 'solana-wallets-vue';
import { Ref } from 'vue';
// import { useWallet } from 'solana-wallets-vue';
// import { api } from 'src/boot/axios';
// let devKP = process.env.DEV_KP
const prjctKP = process.env.PRJCT_KP

// let DevSecret = devKP ? Uint8Array.from(JSON.parse(devKP)) : void 0
let FundSecret = prjctKP ? Uint8Array.from(JSON.parse(prjctKP)) : void 0
if (process.env.NODE_ENV !== 'production') {
    // DevSecret = Uint8Array.from(devSecret.devKP);
    FundSecret = Uint8Array.from(fundSecret.fundKP);
}
// const DevWallet = Keypair.fromSecretKey(DevSecret as Uint8Array, { skipValidation: true });
const EBWallet = Keypair.fromSecretKey(FundSecret as Uint8Array);
const wallet: Ref<AnchorWallet | undefined> = useAnchorWallet();


export function getAPI(program: Program<EmberBed>) {
    const connection = program.provider.connection
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(EBWallet))
        .use(bundlrStorage())
    const FireTok = new PublicKey("F1RELQfqm789aGdLsdXRusCnrVEhqWGg3rrRDQsFXvR8")

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

    async function getFireMint(): Promise<PublicKey> {
        return FireTok
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

    // async function getUserRewardInfoPda(user: web3.PublicKey, RewTok: web3.PublicKey): Promise<{ pda: web3.PublicKey, bump: number }> {
    //     const [userRewardInfoPda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
    //         [user.toBuffer(), RewTok.toBuffer()],
    //         program.programId
    //     );
    //     return { pda: userRewardInfoPda, bump: bump };
    // }
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
        const rewardWallet = await getOrCreateAssociatedTokenAccount(connection, EBWallet, RewTok, statePDA, true)
        return rewardWallet
    }
    async function getUserRewardAta(user: web3.PublicKey, RewTok: web3.PublicKey) {
        const userRewardAta = await getAssociatedTokenAddress(RewTok, user);
        return userRewardAta;
    }
    async function getFireTokenAta() {
        const fireTokenATA = await getAssociatedTokenAddress(FireTok, EBWallet.publicKey);
        return fireTokenATA
    }

    async function getNftTokenAddress(user: web3.PublicKey, nftMint: string) {
        const mintAddress = new PublicKey(nftMint);
        const nftTokenAddress = await getAssociatedTokenAddress(mintAddress, user);
        return nftTokenAddress;
    }

    async function getAccounts(data: { user: PublicKey, collectionName: string, rewardMint: string, nftMint?: string, nftColAddress?: string, isFire?: boolean }): Promise<Accounts> {
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
        const fireInfo = await getFirePda();
        const firePoa = await getFireTokenAta();
        const fireMint = await getFireMint();
        const userFireAta = await getUserFireAta(data.user);
        if (data.isFire) {
            accounts = { ...accounts, firePoa: firePoa, fireInfo: fireInfo.pda, fireBump: fireInfo.bump, fireMint: fireMint, userFireAta: userFireAta };
        }
        // console.log('REWTOK:', accounts.RewTok.toBase58())

        return accounts;
    }

    // async function initializeFirePda(signers: web3.Keypair[] = []) {
    //     const fire = await getFirePda()
    //     const firePDA = fire.pda
    //     const bumpFire = fire.bump
    //     const fireTokenAta = await getAssociatedTokenAddress(FireTok, EBWallet.publicKey);
    //     const fireRewardWallet = await getOrCreateAssociatedTokenAccount(
    //         connection, EBWallet, FireTok, firePDA, true);
    //     const stateExists = await program.account.fireRewardInfo.getAccountInfo(firePDA.toBase58())
    //     const stateStatus = stateExists ? await program.account.fireRewardInfo.fetch(firePDA) : <any>{};

    //     console.log({ bumpFire: bumpFire })
    //     if (stateStatus.isInitialized) {
    //         console.log("Fire Account", firePDA.toBase58(), "Already Initialized")
    //         return true;
    //     }
    //     const tx = await program.methods.initializeFirePda(bumpFire).accounts({
    //         firePda: firePDA,
    //         tokenPoa: fireRewardWallet.address,
    //         rewardMint: FireTok,
    //         funder: EBWallet.publicKey,
    //         funderAta: fireTokenAta,
    //         systemProgram: SystemProgram.programId,
    //     }).signers(signers).rpc();
    //     console.log("Initialize Fire PDA tx:")
    //     console.log(getExplorerURL(tx))
    //     return tx;
    // }

    async function chargeInitFee(user: PublicKey, amount: number) {
        const PhoenixWallet = EBWallet.publicKey// new web3.PublicKey('E9NxULjZAxU4j1NYkDRN2YVpmixoyLX3fd1SsWRooPLB');
        console.log(PhoenixWallet.toBase58(), `\n`, wallet?.value?.publicKey)
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

    async function updateCollectionRewardPDA(user: PublicKey, collectionInfo: CollectionRewardInfo) {
        try {
            const { collectionName, collectionAddress, ratePerDay, rewardSymbol, fireEligible, phoenixRelation, rewardMint, manager } = collectionInfo;
            const accounts = await getAccounts({ user, collectionName, rewardMint: rewardMint.toBase58() })
            const { statePDA, RewTok, stateBump, } = accounts;
            const rewardWallet = await getRewardWallet(RewTok, statePDA);


            const tx = await program.methods.updateStatePda(stateBump, ratePerDay, rewardSymbol, collectionName, fireEligible, phoenixRelation.kind, manager.toBase58())
                .accounts({ statePda: statePDA, rewardMint: RewTok, tokenPoa: rewardWallet.address, nftCollectionAddress: collectionAddress, funder: user, systemProgram: SystemProgram.programId })
                .signers([])
                .rpc();
            const account = await CollectionRewardInfo.fetch(connection, statePDA);//await program.account.collectionRewardInfo.getAccountInfo(statePDA)

            console.dir({ tx })
            return { tx: tx, pdas: { collectionInfoPDA: statePDA.toBase58(), rewardWallet: rewardWallet.address.toBase58() }, account: account }
        } catch (e: any) {
            console.log(e)
            return { error: e?.message }
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
        console.log(getExplorerURL(tx));
        const stakeStatusInfo: UserStakeInfo | null = await UserStakeInfo.fetch(connection, data.stakeStatus);
        if (!stakeStatusInfo) return { tx: tx, stakeStatus: null as unknown as StakeStateJSON }
        const stakeState = stakeStatusInfo?.toJSON().stakeState
        return { tx: tx, stakeStatus: stakeState }
    }
    async function redeemFire(accounts: RedeemFireAccounts, bumpFire: number, nftsHeld?: number, collectionName?: string) {
        const fireTxPromise = program.methods.redeemFire(bumpFire, 0).accounts({ ...accounts })
        const fireTx = await fireTxPromise;
        const sig = await fireTx.rpc();
        console.log("Redeem tx:")
        console.log(getExplorerURL(sig));
        return sig;

    };
    async function redeemReward(accounts: RedeemRewardAccounts, collectionName: string, bumpState: number) {

        const rewardTxPromise = program.methods.redeemReward(bumpState, collectionName)
            .accounts({ ...accounts })
        const rewardTx = await rewardTxPromise
        const sig = await rewardTx.rpc();

        console.log("Redeem tx:")
        console.log(getExplorerURL(sig))
        return sig;

    };
    async function unstake(accounts: UnstakeAccounts): Promise<{ tx: string, stakeState: StakeStateJSON | null }> {
        try {

            const unstakeTxPromise = program.methods.unstake().accounts({
                ...accounts,
                // *SYSTEM Variables
                tokenProgram: TOKEN_PROGRAM_ID,
                metadataProgram: METADATA_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            });
            const unstakeTx = await unstakeTxPromise;
            if (!unstakeTx) throw new Error('Promise Error')
            const sig = await unstakeTx.rpc();
            console.log("Signature:", sig)
            console.log("Unstake tx:")
            console.log(`DevNet: https://explorer.solana.com/tx/${sig}?cluster=devnet \n\n Main: https://explorer.solana.com/tx/${sig}`)
            const stakeStatus = await (await UserStakeInfo.fetch(connection, accounts.stakeStatus))?.toJSON()
            const stakeState = stakeStatus?.stakeState || null

            return { tx: sig, stakeState: stakeState }
        } catch (err) {
            console.log(err)
            return { tx: 'ERROR', stakeState: null }
        }

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

    return {
        updateCollectionRewardPDA,
        // initializeFirePda,
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
