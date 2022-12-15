import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface FireRewardInfoFields {
  bump: number
  rewardWallet: PublicKey
  rewardSymbol: string
  collectionName: string
  rewardMint: PublicKey
  manager: PublicKey
  isInitialized: boolean
}

export interface FireRewardInfoJSON {
  bump: number
  rewardWallet: string
  rewardSymbol: string
  collectionName: string
  rewardMint: string
  manager: string
  isInitialized: boolean
}

export class FireRewardInfo {
  readonly bump: number
  readonly rewardWallet: PublicKey
  readonly rewardSymbol: string
  readonly collectionName: string
  readonly rewardMint: PublicKey
  readonly manager: PublicKey
  readonly isInitialized: boolean

  static readonly discriminator = Buffer.from([
    243, 137, 36, 42, 147, 238, 13, 213,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.publicKey("rewardWallet"),
    borsh.str("rewardSymbol"),
    borsh.str("collectionName"),
    borsh.publicKey("rewardMint"),
    borsh.publicKey("manager"),
    borsh.bool("isInitialized"),
  ])

  constructor(fields: FireRewardInfoFields) {
    this.bump = fields.bump
    this.rewardWallet = fields.rewardWallet
    this.rewardSymbol = fields.rewardSymbol
    this.collectionName = fields.collectionName
    this.rewardMint = fields.rewardMint
    this.manager = fields.manager
    this.isInitialized = fields.isInitialized
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<FireRewardInfo | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<FireRewardInfo | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): FireRewardInfo {
    if (!data.slice(0, 8).equals(FireRewardInfo.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = FireRewardInfo.layout.decode(data.slice(8))

    return new FireRewardInfo({
      bump: dec.bump,
      rewardWallet: dec.rewardWallet,
      rewardSymbol: dec.rewardSymbol,
      collectionName: dec.collectionName,
      rewardMint: dec.rewardMint,
      manager: dec.manager,
      isInitialized: dec.isInitialized,
    })
  }

  toJSON(): FireRewardInfoJSON {
    return {
      bump: this.bump,
      rewardWallet: this.rewardWallet.toString(),
      rewardSymbol: this.rewardSymbol,
      collectionName: this.collectionName,
      rewardMint: this.rewardMint.toString(),
      manager: this.manager.toString(),
      isInitialized: this.isInitialized,
    }
  }

  static fromJSON(obj: FireRewardInfoJSON): FireRewardInfo {
    return new FireRewardInfo({
      bump: obj.bump,
      rewardWallet: new PublicKey(obj.rewardWallet),
      rewardSymbol: obj.rewardSymbol,
      collectionName: obj.collectionName,
      rewardMint: new PublicKey(obj.rewardMint),
      manager: new PublicKey(obj.manager),
      isInitialized: obj.isInitialized,
    })
  }
}
