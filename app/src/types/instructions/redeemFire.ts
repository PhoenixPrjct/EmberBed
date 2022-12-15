import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RedeemFireArgs {
  bumpFire: number
  nftsHeld: number
}

export interface RedeemFireAccounts {
  firePoa: PublicKey
  user: PublicKey
  userRewardAta: PublicKey
  stakeStatus: PublicKey
  fireMint: PublicKey
  fireInfo: PublicKey
  collectionInfo: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u8("bumpFire"), borsh.u8("nftsHeld")])

export function redeemFire(args: RedeemFireArgs, accounts: RedeemFireAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.firePoa, isSigner: false, isWritable: true },
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.userRewardAta, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeStatus, isSigner: false, isWritable: true },
    { pubkey: accounts.fireMint, isSigner: false, isWritable: false },
    { pubkey: accounts.fireInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.collectionInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([121, 243, 240, 206, 228, 239, 217, 205])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bumpFire: args.bumpFire,
      nftsHeld: args.nftsHeld,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
