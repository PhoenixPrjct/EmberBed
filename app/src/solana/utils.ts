import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    Account,
} from "@solana/spl-token"
import web3 = anchor.web3;
import { EmberBed, Accounts, AnchorWallet, CollectionRewardInfo, UnstakeAccounts, StakeAccounts, StakeStateJSON, UserStakeInfo, RedeemRewardAccounts, RedeemFireAccounts } from '../types'

import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
    associatedTokenProgram,

} from "@metaplex-foundation/js"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { getExplorerURL } from 'src/helpers';
import { useAnchorWallet } from 'solana-wallets-vue';
import { Ref } from 'vue';
import { EBWallet } from 'src/dev/walletKPs';
// import { useWallet } from 'solana-wallets-vue';
// import { api } from 'src/boot/axios';
// let devKP = process.env.DEV_KP
// const prjctKP = JSON.parse(fs.readFileSync('./PrjctTokenAuthority.json', 'utf-8'));

// This private key has already been compromised, so no one gives a fuck.
// const bsKey = Uint8Array.from([178, 13, 171, 164, 100, 123, 36, 5, 199, 169, 167, 4, 68, 180, 137, 159, 36, 120, 216, 97, 170, 223, 126, 237, 194, 101, 33, 101, 197, 166, 134, 33, 192, 54, 19, 177, 69, 246, 153, 65, 216, 117, 205, 41, 136, 204, 221, 172, 170, 4, 186, 169, 101, 69, 185, 223, 86, 36, 156, 126, 112, 249, 28, 162])

// const FundSecret = bsKey;
// if (process.env.NODE_ENV !== 'production' && prjctKP) {    // DevSecret = Uint8Array.from(devSecret.devKP);
//     FundSecret = Uint8Array.from(JSON.parse(prjctKP));
// }
// // const DevWallet = Keypair.fromSecretKey(DevSecret as Uint8Array, { skipValidation: true });
// const EBWallet = Keypair.fromSecretKey(FundSecret as Uint8Array);
console.log('EBWallet', EBWallet.publicKey.toBase58())
const wallet: Ref<AnchorWallet | undefined> = useAnchorWallet();


export function getAPI(program: Program<EmberBed>) {
    console.log('getAPI', program.programId.toBase58())
    const connection = program.provider.connection
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(EBWallet))
        .use(bundlrStorage())
    const FireTok = new PublicKey("F1RELQfqm789aGdLsdXRusCnrVEhqWGg3rrRDQsFXvR8")




    async function getStatePda(RewTok: PublicKey, collectionName: string): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [RewTok.toBuffer(), Buffer.from(collectionName), Buffer.from("state")],
            program.programId
        );
        return { pda, bump };
    }
    // async function getStatePda(RewTok: web3.PublicKey, collectionName: string): Promise<{ pda: web3.PublicKey, bump: number }> {
    //     const [pda, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
    //         [RewTok.toBuffer(), Buffer.from(collectionName), Buffer.from("state")],
    //         program.programId
    //     );
    //     // console.log({ PDA: pda.toBase58() })
    //     return { pda, bump };
    // }

    async function getFirePda(): Promise<{ pda: web3.PublicKey, bump: number }> {
        const fireCollName = "EmberBed"
        const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [FireTok.toBuffer(), Buffer.from(fireCollName), Buffer.from("fstate")],
            program.programId
        );

        return { pda, bump };
    }

    async function getFireMint(): Promise<PublicKey> {
        return FireTok
    }

    async function getDelegatedAuthPda(): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [delegatedAuthPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("authority")],
            program.programId
        );
        console.log({ delegatedAuthPda: delegatedAuthPda.toBase58(), authBump: bump })
        return { pda: delegatedAuthPda, bump: bump };
    }


    async function getUserAccountPda(user: web3.PublicKey): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [userAccountPDA, bumpAccount] = anchor.web3.PublicKey.findProgramAddressSync(
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
        const [stakeStatusPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [user.toBuffer(), nftTokenAddress.toBuffer()],
            program.programId
        );

        console.log(stakeStatusPda.toBase58());
        return { pda: stakeStatusPda, bump: bump }

    }

    async function getUserFireAta(user: web3.PublicKey) {
        const userFireAta = await getAssociatedTokenAddress(FireTok, user);
        return userFireAta;

    }

    async function getRewardWallet(RewTok: web3.PublicKey, statePDA: web3.PublicKey): Promise<Account> {
        console.log("Getting Reward Wallet for:", statePDA.toBase58())
        // statePDA = new PublicKey('H3d6LoF7ByDnQ8vGtWHzcRahnJvEm1XW6TDGDodbMjfg')
        console.log({ RewTok: RewTok.toBase58() });
        console.log({ EBWallet: EBWallet.publicKey.toBase58() })

        const rewardWallet: Account = await getOrCreateAssociatedTokenAccount(connection, EBWallet, RewTok, statePDA, true)
        console.log({ rewardWallet })
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

    async function getAccounts(data: { user: PublicKey, collectionName: string, rewardMint: string, nftMint?: string, uuid?: string, nftColAddress?: string, isFire?: boolean }): Promise<Accounts> {
        console.log("Getting Accounts")
        let accounts: Accounts = {} as Accounts;
        const RewTok: PublicKey = new PublicKey(data.rewardMint);
        let nftAccounts = {};
        let mintAddress, nft, delegatedAuthPda,
            nftTokenAddress,
            stakeStatusPDA

        // const collectionID = data.uuid ? data.uuid : generateUUID();
        // console.log({ uuid: data.uuid, collectionID })
        const userAccountPDA = await getUserAccountPda(data.user);
        console.log({ userAccountPDA: userAccountPDA.pda.toBase58() })
        const userRewardAta = await getUserRewardAta(data.user, RewTok);
        console.log({ userRewardAta: userRewardAta.toBase58() })
        const statePDA = await getStatePda(RewTok, data.collectionName);
        console.log({ statePDA: statePDA.pda.toBase58() });
        const funderTokenAta = await getAssociatedTokenAddress(RewTok, data.user);
        console.log({ funderTokenAta: funderTokenAta.toBase58() })
        const userAccounts = {
            userRewardAta: userRewardAta,
            userAccountPDA: userAccountPDA.pda
        }
        console.log({ userAccounts: { pda: userAccounts.userAccountPDA.toBase58(), userRewardAta: userAccounts.userRewardAta.toBase58() } })
        const rewardWallet = await getRewardWallet(RewTok, statePDA.pda);

        console.log({ rewardWallet: rewardWallet?.address.toBase58() })
        const collectionAccounts = {
            funderTokenAta: funderTokenAta,
            rewardWallet: rewardWallet.address,
            RewTok: RewTok,
            stateBump: statePDA.bump,
            statePDA: statePDA.pda
        }
        accounts = { ...accounts, ...collectionAccounts, ...userAccounts }
        console.log({ "199": accounts })
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
        if (data.isFire) {
            const fireInfo = await getFirePda();
            const firePoa = await getFireTokenAta();
            const fireMint = await getFireMint();
            const userFireAta = await getUserFireAta(data.user);
            accounts = { ...accounts, firePoa: firePoa, fireInfo: fireInfo.pda, fireBump: fireInfo.bump, fireMint: fireMint, userFireAta: userFireAta };
        }
        // console.log('REWTOK:', accounts.RewTok.toBase58())
        console.log({ success: accounts })
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
            const { uuid, collectionName, collectionAddress, ratePerDay, rewardSymbol, fireEligible, phoenixRelation, rewardMint, manager } = collectionInfo;
            const accounts = await getAccounts({ user, collectionName, rewardMint: rewardMint.toBase58() })
            const { statePDA, RewTok, stateBump, } = accounts;
            const rewardWallet = await getRewardWallet(RewTok, statePDA);

            const tx = await program.methods.updateStatePda(stateBump, ratePerDay, rewardSymbol, collectionName, fireEligible, phoenixRelation.kind, manager.toBase58(), uuid)
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
            const { uuid, collectionName, collectionAddress, ratePerDay, rewardSymbol, fireEligible, phoenixRelation, rewardMint } = collectionInfo;
            const accounts = await getAccounts({ user, collectionName, rewardMint: rewardMint.toBase58(), uuid: uuid ?? null });
            const { statePDA, RewTok, stateBump, funderTokenAta } = accounts;
            const rewardWallet = await getRewardWallet(RewTok, statePDA);
            const nftCollectionAddress = new PublicKey(collectionAddress);

            const stateExists = await program.account.collectionRewardInfo.getAccountInfo(statePDA.toBase58())
            const stateStatus = stateExists ? await program.account.collectionRewardInfo.fetch(statePDA) : <any>{};
            // if (stateStatus.isInitialized) {
            //     console.log("State Account", statePDA.toBase58(), "Already Initialized")
            //     return statePDA.toBase58();
            // }
            console.log({ statePDA: statePDA.toBase58(), stateBump, rewardWallet: rewardWallet.address.toBase58(), RewTok: RewTok.toBase58(), nftCollectionAddress: nftCollectionAddress.toBase58(), user: user.toBase58(), userATA: funderTokenAta.toBase58() })
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
        console.dir({ collectionRewardInfo })
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
        const fireTx = fireTxPromise;
        const sig = await fireTx.rpc();
        console.log("Redeem tx:")
        console.log(getExplorerURL(sig));
        return sig;

    };
    async function redeemReward(accounts: RedeemRewardAccounts, collectionName: string, bumpState: number) {

        const rewardTxPromise = program.methods.redeemReward(bumpState, collectionName)
            .accounts({ ...accounts })
        const rewardTx = rewardTxPromise
        const sig = await rewardTx.rpc();

        console.log("Redeem tx:")
        console.log(getExplorerURL(sig))
        return sig;

    };
    async function unstake(accounts: UnstakeAccounts): Promise<{ tx: string, stakeState: StakeStateJSON | null }> {
        try {

            console.log({
                program_authority: accounts.programAuthority.toBase58(),
                nft_mint_address: accounts.nftMintAddress.toBase58(),
                metadata_program: accounts.metadataProgram.toBase58(),
                stake_status: accounts.stakeStatus.toBase58(),
                SystemProgram: SystemProgram.programId.toBase58(),

            })

            const unstakeTxPromise = program.methods.unstake().accounts({ ...accounts })

            // const unstakeTxPromise = program.methods.unstake().accounts({
            //     ...accounts,
            //     // *SYSTEM Variables
            //     tokenProgram: TOKEN_PROGRAM_ID,
            //     metadataProgram: METADATA_PROGRAM_ID,
            //     systemProgram: SystemProgram.programId,
            // });
            const unstakeTx = unstakeTxPromise;
            if (!unstakeTx) throw new Error('Promise Error')
            const sig = await unstakeTx.rpc();
            console.log("Signature:", sig)
            console.log("Unstake tx:")
            console.log(`DevNet: https://explorer.solana.com/tx/${sig}?cluster=devnet \n\n Main: https://explorer.solana.com/tx/${sig}`)
            const stakeStatus = (await UserStakeInfo.fetch(connection, accounts.stakeStatus))?.toJSON()
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
    async function managerWithdrawal(user: PublicKey, collectionName: string, rewardMint: PublicKey, rawAmount: number, closeAta = false) {
        try {
            console.log({
                user: user.toBase58(),
                collectionName: collectionName,
                rewardMint: rewardMint.toBase58(),
                rawAmount: rawAmount,
                closeAta: closeAta,
            })
            const accounts = await getAccounts({ user, collectionName, rewardMint: rewardMint.toBase58() });
            const { statePDA, stateBump, rewardWallet, RewTok, funderTokenAta } = accounts;
            const amount = new anchor.BN(rawAmount);
            const bumpState = stateBump
            const txPromise = program.methods.managerWithdrawal(bumpState, closeAta, collectionName, amount).accounts({
                manager: user,
                statePda: statePDA,
                tokenPoa: rewardWallet,
                rewardMint: RewTok,
                managerAta: funderTokenAta,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            const sig = await txPromise.rpc();
            if (!sig) throw new Error('Promise Error')
            console.log("Deposit tx:")
            console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
            return { tx: sig };
        } catch (err) {
            console.log(err)
            return { tx: 'ERROR' }
        };
    }

    return {
        updateCollectionRewardPDA,
        // generateUUID,
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
