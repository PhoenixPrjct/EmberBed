import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { EmberBed } from "../target/types/ember_bed";
import { PublicKey, Keypair, SystemProgram, AccountInfo } from "@solana/web3.js"
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
  useNftOperationHandler,
} from "@metaplex-foundation/js"
import * as beet from '@metaplex-foundation/beet'
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { getAssociatedTokenAddress, Account, createMint, TOKEN_PROGRAM_ID, getAccount, TOKEN_2022_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
// import {createInitializeStatePdaInstruction} from "../programs/staking_attempt_1/src/generated"

// MY WALLET SETTING
const user_json_path = require("os").homedir() + "/Crypto/Scripts/TestStaking/TestStaking.json"
// const user_json_path = 
const UserSecret = Uint8Array.from(
  JSON.parse(require("fs").readFileSync(user_json_path))
)

const admin_json_path = require("os").homedir() + "/Crypto/Scripts/Scam/Scam.json"
//require('path').join(__dirname, "../phoenixdev.json")
const AdminSecret = Uint8Array.from(
  JSON.parse(require("fs").readFileSync(admin_json_path))
)

const dev_json_path = require("os").homedir() + "/.config/solana/id.json"
const DevSecret = Uint8Array.from(
  JSON.parse(require("fs").readFileSync(dev_json_path))
)

const DevWallet = Keypair.fromSecretKey(DevSecret as Uint8Array)
const UserWallet = Keypair.fromSecretKey(UserSecret as Uint8Array)
const AdminWallet = Keypair.fromSecretKey(AdminSecret as Uint8Array)
// const stakingProgramID = new PublicKey("EnpLfXX7cBedvRG8TRW7zMRBtVFc1D5EWC13Ffd7efw9")
// const program = anchor.workspace.StakingProgram as Program<StakingAttempt1>
// anchor.setProvider(anchor.AnchorProvider.env());
// const connection = anchor.getProvider().connection
const initState = true;
const withdrawing = false;
const makeDeposit = false;
const makeFireDeposit = true;
describe("EmberBed", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection

  const program = await anchor.workspace.EmberBed as Program<EmberBed>;
  const FireTOK = new PublicKey("F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw")

  // Admin Variables
  const RewTok = new PublicKey("REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko");
  //new PublicKey("REWLYBz1rZFS2ErKB5LEdXTYChUXBAvF2zjbizsAsjM");
  const nftCollectionAddress = new PublicKey("9xVireFnLBZ3ZCjLS29EzF632YbpSFwsKvwsqCLxefxr")
  let statePDA: PublicKey,
    firePDA: PublicKey,
    ratePerDay: number,
    authPDA: PublicKey,
    userAccountPDA: PublicKey,
    bumpState: number,
    bumpToken: number,
    bumpAuth: number,
    bumpAccount: number,
    bumpFire: number,
    tokenPDA: PublicKey,
    amount: beet.bignum,
    rewardWallet: Account,
    fireRewardWallet: Account
  const rewardSymbol: string = "$REW2";
  const collectionName: string = "PPM";
  const fireCollName: string = "EmberBed"
  let funderTokenAta = await getAssociatedTokenAddress(RewTok, AdminWallet.publicKey);
  let fireTokenAta = await getAssociatedTokenAddress(FireTOK, DevWallet.publicKey);
  // console.log(funderTokenAta.toBase58())

  // Staking Variables
  let delegatedAuthPda: PublicKey
  let stakeStatusPda: PublicKey
  let userRewardInfoPda: PublicKey
  let nft: any
  let nftTokenAddress: PublicKey
  let mintAuth: PublicKey
  let mint: PublicKey
  let userAta: Account //
  let userRewardAta: PublicKey;
  let userFireAta: PublicKey;
  let PhoenixRelation: string;

  const fireEligible = true;
  before(async () => {
    //* Admin 
    [firePDA, bumpFire] = await anchor.web3.PublicKey.findProgramAddress(
      [FireTOK.toBuffer(), Buffer.from(fireCollName), Buffer.from("fstate")],
      program.programId
    );

    [statePDA, bumpState] = await anchor.web3.PublicKey.findProgramAddress(
      [RewTok.toBuffer(), Buffer.from(collectionName), Buffer.from("state")],
      program.programId
    );

    [authPDA, bumpAuth] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("redeem_authority")],
      program.programId
    );

    rewardWallet = await getOrCreateAssociatedTokenAccount(
      connection, AdminWallet, RewTok, statePDA, true);

    fireRewardWallet = await getOrCreateAssociatedTokenAccount(
      connection, DevWallet, FireTOK, firePDA, true);

    PhoenixRelation = 'Affiliate'

    ratePerDay = 10
    //* Staking
    // const mintAddress: PublicKey = new PublicKey("GjFaTy4irZQ1LHev9NE6mHNnbFZYUtYEuYws88ZWZEua");
    const mintAddress: PublicKey = new PublicKey("32ke7s6Q3imrg2mv9gE67HwiyQnr6bLTux6zoiTrbxXm");
    nftTokenAddress = await getAssociatedTokenAddress(mintAddress, UserWallet.publicKey)
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(UserWallet))
      .use(bundlrStorage())

    nft = await metaplex
      .nfts().findByMint({ mintAddress: mintAddress })

    console.log("Staking Program Address", program.programId.toBase58());
    // console.log("user:", UserWallet.publicKey.toBase58());
    // console.log("nft_ata:", nftTokenAddress.toBase58());
    console.log("mint address:", nft.mint.address.toBase58());
    console.log("nft edition address: ", nft.edition.address.toBase58());
    // console.log("generated mint address:", mintAddress.toBase58());
    // console.log("nft token address: ", nft.address.toBase58());
    console.log("nft token address: ", nftTokenAddress.toBase58());

    userFireAta = await getAssociatedTokenAddress(FireTOK, UserWallet.publicKey);
    userRewardAta = await getAssociatedTokenAddress(RewTok, UserWallet.publicKey);
    // console.log("user ata:", userAta.address.toBase58());
    console.log("user reward ata:", userRewardAta.toBase58());

    [delegatedAuthPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("authority")],
      program.programId
    );

    [userAccountPDA, bumpAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [UserWallet.publicKey.toBuffer()],
      program.programId
    );

    [userRewardInfoPda] = await anchor.web3.PublicKey.findProgramAddress(
      [UserWallet.publicKey.toBuffer(), RewTok.toBuffer()],
      program.programId
    );
    [stakeStatusPda] = await anchor.web3.PublicKey.findProgramAddress(
      [UserWallet.publicKey.toBuffer(), nftTokenAddress.toBuffer()],
      program.programId
    );
    console.log("Stake Status PDA", stakeStatusPda.toBase58());
    console.log("User Account PDA", userAccountPDA.toBase58());
  })

  it("Initializes FIRE COLLECTION PDA If Needed", async () => {
    const rewardWalletBalance = Number(fireRewardWallet.amount)
    console.log("Admin Wallet:", DevWallet.publicKey.toBase58());
    console.log("FirePDA :", firePDA.toBase58())

    let stateExists = await program.account.fireRewardInfo.getAccountInfo(firePDA.toBase58())
    const stateStatus = stateExists ? await program.account.fireRewardInfo.fetch(firePDA) : <any>{};
    console.log("Fire PDA Initialized:", !!stateStatus)
    console.log("Balance:", rewardWalletBalance / anchor.web3.LAMPORTS_PER_SOL)
    console.log("Funder ATA:", fireTokenAta.toBase58())
    console.log("Reward Wallet:", fireRewardWallet.address.toBase58())
    console.log("nftCollectionAddress:", nftCollectionAddress.toBase58())
    console.log({ bumpFire: bumpFire, bumpState: bumpState, bumpAuth: bumpAuth })
    if (stateStatus.isInitialized) {
      console.log("Fire Account", firePDA.toBase58(), "Already Initialized")
      return true;
    }
    const tx = await program.methods.initializeFirePda(bumpFire, fireCollName).accounts({
      firePda: firePDA,
      tokenPoa: fireRewardWallet.address,
      rewardMint: FireTOK,
      funder: DevWallet.publicKey,
      funderAta: fireTokenAta,
      systemProgram: SystemProgram.programId,
    }).signers([DevWallet]).rpc();
    console.log("Initialize Fire PDA tx:")
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
  });
  it("Deposits to Fire POA", async () => {
    if (!makeFireDeposit) {
      console.log("Skipping the Manager Deposit Test")
      return true
    }
    amount = new anchor.BN(100000 * anchor.web3.LAMPORTS_PER_SOL)
    const tx2 = await program.methods.depositToFireAta(amount).accounts({
      tokenPoa: fireRewardWallet.address,
      firePda: firePDA,
      mint: FireTOK,
      funder: DevWallet.publicKey,
      funderAta: fireTokenAta,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID
    }).signers([DevWallet]).rpc();
    console.log("Deposit tx:")
    console.log(`https://explorer.solana.com/tx/${tx2}?cluster=devnet`)

  });

  it("Initializes State PDA If Needed", async () => {
    if (!initState) {
      console.log("Skipping Initialize Collection")
      return true
    }
    const rewardWalletBalance = Number(rewardWallet.amount)
    console.log("Admin Wallet:", AdminWallet.publicKey.toBase58());
    console.log("StatePDA :", statePDA.toBase58())

    let stateExists = await program.account.collectionRewardInfo.getAccountInfo(statePDA.toBase58())
    const stateStatus = stateExists ? await program.account.collectionRewardInfo.fetch(statePDA) : <any>{};
    console.log("Stake State Initialized:", !!stateStatus)
    console.log("Manager:", stateStatus.manager?.toBase58())
    console.log("RewardSymbol:", stateStatus?.isInitialized)
    console.log("Balance:", rewardWalletBalance / anchor.web3.LAMPORTS_PER_SOL)
    console.log("Funder ATA:", funderTokenAta.toBase58())
    console.log("Reward Wallet:", rewardWallet.address.toBase58())
    console.log("nftCollectionAddress:", nftCollectionAddress.toBase58())
    console.log({ bumpToken: bumpToken, bumpState: bumpState, bumpAuth: bumpAuth })
    if (stateStatus.isInitialized) {
      console.log("State Account", statePDA.toBase58(), "Already Initialized")
      return true;
    }
    const tx = await program.methods.initializeStatePda(bumpState, ratePerDay, rewardSymbol, collectionName, fireEligible, PhoenixRelation).accounts({
      statePda: statePDA,
      tokenPoa: rewardWallet.address,
      rewardMint: RewTok,
      // authPda: authPDA,
      nftCollectionAddress: nftCollectionAddress,
      funder: AdminWallet.publicKey,
      funderAta: funderTokenAta,
      systemProgram: SystemProgram.programId,
    }).signers([AdminWallet]).rpc();
    console.log("Stake tx:")
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
  });
  // it("Allows Manager to Deposit to Program Owned Account", async () => {
  //   if (!makeDeposit) {
  //     console.log("Skipping the Manager Deposit Test")
  //     return true
  //   }
  //   amount = new anchor.BN(100000 * anchor.web3.LAMPORTS_PER_SOL)
  //   const tx2 = await program.methods.depositToRewardAta(amount).accounts({
  //     tokenPoa: rewardWallet.address,
  //     statePda: statePDA,
  //     mint: RewTok,
  //     funder: AdminWallet.publicKey,
  //     funderAta: funderTokenAta,
  //     systemProgram: SystemProgram.programId,
  //     rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //     tokenProgram: TOKEN_PROGRAM_ID
  //   }).signers([AdminWallet]).rpc();
  //   console.log("Deposit tx:")
  //   console.log(`https://explorer.solana.com/tx/${tx2}?cluster=devnet`)

  // });

  // it(" Allows Manager to withdraw tokens", async () => {
  //   if (!withdrawing) {
  //     console.log("Skipping the Manager Withdrawal Test")
  //     return true
  //   };
  //   amount = new anchor.BN(3 * anchor.web3.LAMPORTS_PER_SOL)
  //   const closeAta = false;
  //   const tx = await program.methods.managerWithdrawal(bumpState, closeAta, collectionName, amount).accounts({
  //     manager: AdminWallet.publicKey,
  //     statePda: statePDA,
  //     tokenPoa: rewardWallet.address,
  //     rewardMint: RewTok,
  //     managerAta: funderTokenAta,
  //     tokenProgram: TOKEN_PROGRAM_ID,
  //     systemProgram: SystemProgram.programId,
  //   }).signers([AdminWallet]).rpc();
  //   console.log("Deposit tx:")
  //   console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)

  // })
  it("Stakes NFT", async () => {
    console.log('Staking NFT:', nft.address.toBase58());
    let stakeStatus
    let userAccount, userAccountExists
    userAccountExists = await program.account.userAccount.getAccountInfo(userAccountPDA.toBase58());
    if (userAccountExists) {
      userAccount = await program.account.userAccount.fetch(userAccountPDA.toBase58());
      console.log("User Account PDA Contents", userAccount)
    }
    let stakeStateExists = await program.account.userStakeInfo.getAccountInfo(stakeStatusPda.toBase58());
    if (!stakeStateExists) {
      console.log('User Stake info not found');
    } else {
      stakeStatus = stakeStateExists ? await program.account.userStakeInfo.fetch(stakeStatusPda) : { stakeState: { unstaked: {} } };
      console.log(stakeStatus)
      if (Object.keys(stakeStatus.stakeState)?.includes(' staked')) {
        console.log('NFT already staked')
        return true;
      }
    }
    const tx = await program.methods.stake()
      .accounts({
        user: UserWallet.publicKey,
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
      .signers([UserWallet])
      .rpc();
    console.log("Stake tx:")
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)

    // stakeStatus = await program.account.userStakeInfo.fetch(stakeStatusPda)
    // console.log("Stake State:", stakeStatus.stakeState)

    console.log("Sleeping for 5 sec...")
    await new Promise((resolve) => setTimeout(resolve, 5000))
  })
  it("Redeems Fire Reward", async () => {
    console.log('Redeems Fire Reward:', firePDA.toBase58());
    console.log('Fire POA :', fireRewardWallet.address.toBase58());
    const nftsHeld = 2;
    const tx = await program.methods.redeemFire(bumpFire, nftsHeld).accounts({
      firePoa: fireRewardWallet.address,
      user: UserWallet.publicKey,
      userRewardAta: userFireAta,
      stakeStatus: stakeStatusPda,
      fireMint: FireTOK,
      fireInfo: firePDA,
      collectionInfo: statePDA,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID
    }).signers([UserWallet]).rpc();


    console.log("Redeem tx:")
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
    console.log("Waiting For 5 Seconds to Unstake");


    await new Promise((resolve) => setTimeout(resolve, 5000))

  })
  it("Redeems Staking Reward", async () => {
    console.log("Redeeming Rewards")
    console.log("Redeem Authority:", authPDA.toBase58())
    const tx = await program.methods.redeemReward(bumpState, collectionName).accounts({
      user: UserWallet.publicKey,
      userRewardAta: userRewardAta,
      stakeStatus: stakeStatusPda,
      rewardMint: RewTok,
      rewardWallet: rewardWallet.address,
      collectionRewardInfo: statePDA,
      // programAuthority: authPDA,
      // *SYSTEM Variables
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    }).signers([UserWallet]).rpc();
    console.log("Redeem tx:")
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
    console.log("Waiting For 5 Seconds to Unstake");
    await new Promise((resolve) => setTimeout(resolve, 5000))
  })

  it("Unstakes NFT", async () => {
    console.log('Unstaking NFT:', nft.address.toBase58());
    console.log("Delegated Authority:", delegatedAuthPda.toBase58());
    const unstakeTx = await program.methods.unstake().accounts({
      user: UserWallet.publicKey,
      nftAta: nftTokenAddress,
      nftMintAddress: nft.mint.address,
      nftEdition: nft.edition.address,
      stakeStatus: stakeStatusPda,
      userAccountPda: userAccountPDA,
      programAuthority: delegatedAuthPda,
      // *SYSTEM Variables
      tokenProgram: TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    }).signers([UserWallet]).rpc();
    console.log("Unstake tx:")
    console.log(`https://explorer.solana.com/tx/${unstakeTx}?cluster=devnet`)


    const stakeStatus = await program.account.userStakeInfo.fetch(stakeStatusPda)
    console.log("Stake State:", stakeStatus.stakeState)
  })
});