import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UnstakeAccounts {
  user: PublicKey
  nftAta: PublicKey
  nftMintAddress: PublicKey
  nftEdition: PublicKey
  stakeStatus: PublicKey
  userAccountPda: PublicKey
  programAuthority: PublicKey
  tokenProgram: PublicKey
  metadataProgram: PublicKey
  systemProgram: PublicKey
}

export function unstake(accounts: UnstakeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.nftAta, isSigner: false, isWritable: true },
    { pubkey: accounts.nftMintAddress, isSigner: false, isWritable: false },
    { pubkey: accounts.nftEdition, isSigner: false, isWritable: false },
    { pubkey: accounts.stakeStatus, isSigner: false, isWritable: true },
    { pubkey: accounts.userAccountPda, isSigner: false, isWritable: true },
    { pubkey: accounts.programAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([90, 95, 107, 42, 205, 124, 50, 225])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
