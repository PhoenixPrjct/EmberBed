import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    Account,
} from "@solana/spl-token"
import web3 = anchor.web3;
import { EmberBed, Accounts, AnchorWallet, CollectionRewardInfo, UnstakeAccounts, StakeAccounts, StakeStateJSON, UserStakeInfo, RedeemRewardAccounts, RedeemFireAccounts, FireRewardInfo, FireRewardInfoFields, InitializeStatePdaArgs } from '../types'

import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
} from "@metaplex-foundation/js"
import { getExplorerURL } from 'src/helpers';
import { useAnchorWallet } from 'solana-wallets-vue';
import { Ref } from 'vue';
import { EBWallet } from 'src/dev/walletKPs';
import { InitializeFirePdaAccounts, InitializeFirePdaArgs } from 'src/types/instructions/initializeFirePda';
import { FIRE_INFO, FIRE_MINT_PUB } from 'src/helpers/constants';

const wallet: Ref<AnchorWallet | undefined> = useAnchorWallet();

export function getAPI(program: Program<EmberBed>) {
    const connection = program.provider.connection;
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(EBWallet))
        .use(bundlrStorage());


    async function getStatePda(RewTok: PublicKey, collectionName: string): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [RewTok.toBuffer(), Buffer.from(collectionName), Buffer.from("state")],
            program.programId
        );
        return { pda, bump };
    }

    async function getDelegatedAuthPda(): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [delegatedAuthPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("authority")],
            program.programId
        );
        return { pda: delegatedAuthPda, bump: bump };
    }

    async function getUserAccountPda(user: web3.PublicKey): Promise<{ pda: web3.PublicKey, bump: number }> {
        const [userAccountPDA, bumpAccount] = anchor.web3.PublicKey.findProgramAddressSync(
            [user.toBuffer()],
            program.programId
        );
        return { pda: userAccountPDA, bump: bumpAccount }
    }

    async function getStakeStatusPda(user: web3.PublicKey, nftMint: string): Promise<{ pda: web3.PublicKey, bump: number }> {
        const mintAddress: PublicKey = new PublicKey(nftMint);
        const nftTokenAddress = await getAssociatedTokenAddress(mintAddress, user)
        const [stakeStatusPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
            [user.toBuffer(), nftTokenAddress.toBuffer()],
            program.programId
        );
        return { pda: stakeStatusPda, bump: bump }
    }

    async function getUserRewardAta(user: web3.PublicKey, RewTok: web3.PublicKey) {
        const userRewardAta = await getAssociatedTokenAddress(RewTok, user);
        return userRewardAta;
    }

    async function getNftTokenAddress(user: web3.PublicKey, nftMint: string) {
        const mintAddress = new PublicKey(nftMint);
        const nftTokenAddress = await getAssociatedTokenAddress(mintAddress, user);
        return nftTokenAddress;
    }

    async function getRewardWallet(RewTok: web3.PublicKey, statePDA: web3.PublicKey): Promise<Account> {
        console.log("Getting Reward Wallet for:", statePDA.toBase58());

        const rewardWallet: Account = await getOrCreateAssociatedTokenAccount(connection, EBWallet, RewTok, statePDA, true);

        return rewardWallet;
    }

    async function getAccounts(data: { user: PublicKey, collectionName: string, rewardMint: string, nftMint?: string, uuid?: string, nftColAddress?: string }): Promise<Accounts> {
        let accounts: Accounts = {} as Accounts;

        const RewTok: PublicKey = new PublicKey(data.rewardMint);
        let nftAccounts = {};
        let mintAddress, nft, delegatedAuthPda,
            nftTokenAddress,
            stakeStatusPDA

        // Retrieve the user's account PDA and reward ATA
        const userAccountPDA = await getUserAccountPda(data.user);
        const userRewardAta = await getUserRewardAta(data.user, RewTok);
        const userFireAta = await getUserRewardAta(data.user, FIRE_MINT_PUB.pub);
        // Retrieve the state PDA for the specified collection
        const statePDA = await getStatePda(RewTok, data.collectionName);

        // Retrieve the funder's token ATA
        const funderTokenAta = await getAssociatedTokenAddress(RewTok, data.user);

        const userAccounts = {
            userRewardAta: userRewardAta,
            userAccountPDA: userAccountPDA.pda,
            userFireAta: userFireAta
        };

        // Retrieve the reward wallet associated with the state PDA
        const rewardWallet = await getRewardWallet(RewTok, statePDA.pda);

        const collectionAccounts = {
            funderTokenAta: funderTokenAta,
            rewardWallet: rewardWallet.address,
            RewTok: RewTok,
            stateBump: statePDA.bump,
            statePDA: statePDA.pda
        };

        // Merge user and collection accounts into the main accounts object
        accounts = { ...accounts, ...collectionAccounts, ...userAccounts };

        if (data.nftMint) {
            // If an NFT mint is provided, retrieve additional NFT-related accounts
            mintAddress = new PublicKey(data.nftMint);

            // Retrieve the NFT details by mint address
            nft = await metaplex.nfts().findByMint({ mintAddress: mintAddress });

            // Retrieve the delegated authorization PDA, NFT token address, and stake status PDA
            delegatedAuthPda = await getDelegatedAuthPda();
            nftTokenAddress = await getNftTokenAddress(data.user, data.nftMint);
            stakeStatusPDA = await getStakeStatusPda(data.user, data.nftMint);

            nftAccounts = {
                nftTokenAddress: nftTokenAddress, nft: nft, stakeStatusPda: stakeStatusPDA.pda, stakeStatusBump: stakeStatusPDA.bump, delegatedAuthPda: delegatedAuthPda.pda,
                authBump: delegatedAuthPda.bump,
            };

            // Merge NFT-related accounts into the main accounts object
            accounts = { ...accounts, ...nftAccounts };
        }

        if (data.nftColAddress) {
            // If an NFT collection address is provided, include it in the accounts object
            const nftCollectionAddress = new PublicKey(data.nftColAddress);
            accounts = { ...accounts, nftCollectionAddress: nftCollectionAddress };
        }
        return accounts;
    }

    async function initializeFirePda(args: InitializeFirePdaArgs, accounts: InitializeFirePdaAccounts) {
        try {
            Object.entries(accounts).map(([key, value]) => { console.log(`${key}: ${value.toBase58()}`); });
            const txPromise = await program.methods.initializeFirePda(args.bump).accounts(accounts).signers([EBWallet])
            const tx = await txPromise.rpc()
            console.log("Initialize Fire PDA tx:")
            console.log(getExplorerURL(tx))
            logFireAccountInfo(accounts.firePda)
            return tx;
        } catch (e) {
            console.log(e)
            return "Nope"
        }
    }

    async function logFireAccountInfo(pda: PublicKey) {
        console.log("Logging Accounts")
        const stateExists = await program.account.collectionRewardInfo.getAccountInfo(pda)
        if (stateExists) {
            console.log({ stateExists: stateExists.data.toJSON() })
            const stateStatus: FireRewardInfoFields = await program.account.fireRewardInfo.fetch(pda);
            Object.entries(stateStatus).forEach(([key, value]) => {
                if (typeof (value) !== "string" || typeof (value) !== "number") {
                    console.log(`${key}: ${JSON.stringify(value)}`)
                } else {
                    console.log(`${key}: ${value}`)
                }
            })
        } else {
            console.log("No Fire Reward Info Found")
        }

    }
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

            const tx = await program.methods.updateStatePda(stateBump, ratePerDay, rewardSymbol, collectionName, fireEligible, phoenixRelation.kind, manager.toBase58(), collectionAddress.toJSON(), uuid)
                .accounts({ statePda: statePDA, rewardMint: RewTok, tokenPoa: rewardWallet.address, /*nftCollectionAddress: collectionAddress,*/ funder: user, systemProgram: SystemProgram.programId })
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

        console.log(`\n\n*******************\n\n`)
        console.dir(collectionInfo)


        let rewMint = collectionInfo.rewardMint;
        const { uuid, collectionName, collectionAddress, ratePerDay, rewardSymbol, fireEligible, phoenixRelation, rewardMint } = collectionInfo;
        if (typeof rewardMint === "string") {
            rewMint = new PublicKey(collectionInfo.rewardMint)
        }
        const accounts = await getAccounts({ user, collectionName, rewardMint: rewMint.toBase58(), uuid: uuid ?? null });
        const { statePDA, RewTok, stateBump, funderTokenAta } = accounts;
        const rewardWallet = await getRewardWallet(RewTok, statePDA);
        const nftCollectionAddress = new PublicKey(collectionAddress);

        const stateExists = await program.account.collectionRewardInfo.getAccountInfo(statePDA.toBase58())
        const stateStatus = stateExists ? await program.account.collectionRewardInfo.fetch(statePDA) : <any>{};
        // if (stateStatus.isInitialized) {
        //     console.log("State Account", statePDA.toBase58(), "Already Initialized")
        //     return statePDA.toBase58();
        // }
        try {
            console.log({ statePDA: statePDA.toBase58(), stateBump, rewardWallet: rewardWallet.address.toBase58(), RewTok: RewTok.toBase58(), nftCollectionAddress: nftCollectionAddress.toBase58(), user: user.toBase58(), userATA: funderTokenAta.toBase58() })

            const tx = await program.methods
                .initializeStatePda(stateBump, ratePerDay, rewardSymbol, collectionName, fireEligible, collectionAddress.toString(), phoenixRelation.kind)
                .accounts({
                    statePda: statePDA,
                    tokenPoa: rewardWallet.address,
                    rewardMint: RewTok,
                    funder: user,
                    funderAta: funderTokenAta,
                    systemProgram: SystemProgram.programId,
                }).signers([])
            console.dir({ tx })
            await tx.rpc()
            const account = await getCollectionInfo(statePDA)

            return { tx: tx, pdas: { collectionInfoPDA: statePDA.toBase58(), rewardWallet: rewardWallet.address.toBase58() }, account: account }
        } catch (e: any) {
            console.log("Inside Try Block")
            console.log(e)
            return { error: e?.message }
        }
    };
    async function getCollectionInfo(statePDA: PublicKey) {
        const res = await CollectionRewardInfo.fetch(connection, statePDA)
        return res
    }
    async function stake(data: StakeAccounts): Promise<{ tx: string, stakeStatus: StakeStateJSON | null }> {
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
        bumpFire = (await FIRE_INFO).FIRE_BUMP
        console.log({ bumpFire, nftsHeld, collectionName })
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
        initializeFirePda,
        initStatePda,
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
