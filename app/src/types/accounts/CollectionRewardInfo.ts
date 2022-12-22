import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectionRewardInfoFields {
  bump: number
  ratePerDay: number
  rewardWallet: PublicKey
  rewardSymbol: string
  collectionName: string
  collectionAddress: PublicKey
  fireEligible: boolean
  phoenixRelation: types.PhoenixRelationJSON | types.PhoenixRelationKind
  rewardMint: PublicKey
  manager: PublicKey
  isInitialized: boolean
}

export interface CollectionRewardInfoJSON {
  bump: number
  ratePerDay: number
  rewardWallet: string
  rewardMint: string
  rewardSymbol: string
  collectionName: string
  collectionAddress: string
  fireEligible: boolean
  phoenixRelation: types.PhoenixRelationJSON | types.PhoenixRelationKind
  manager: string | PublicKey
  isInitialized: boolean
}

export class CollectionRewardInfo {
  readonly bump: number
  readonly ratePerDay: number
  readonly rewardWallet: PublicKey
  readonly rewardSymbol: string
  readonly collectionName: string
  readonly collectionAddress: PublicKey
  readonly fireEligible: boolean
  readonly phoenixRelation: types.PhoenixRelationKind
  readonly rewardMint: PublicKey
  readonly manager: PublicKey
  readonly isInitialized: boolean

  static readonly discriminator = Buffer.from([
    17, 201, 53, 23, 128, 85, 206, 71,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.u32("ratePerDay"),
    borsh.publicKey("rewardWallet"),
    borsh.str("rewardSymbol"),
    borsh.str("collectionName"),
    borsh.publicKey("collectionAddress"),
    borsh.bool("fireEligible"),
    types.PhoenixRelation.layout("phoenixRelation"),
    borsh.publicKey("rewardMint"),
    borsh.publicKey("manager"),
    borsh.bool("isInitialized"),
  ])

  constructor(fields: CollectionRewardInfoFields) {
    this.bump = fields.bump
    this.ratePerDay = fields.ratePerDay
    this.rewardWallet = fields.rewardWallet
    this.rewardSymbol = fields.rewardSymbol
    this.collectionName = fields.collectionName
    this.collectionAddress = fields.collectionAddress
    this.fireEligible = fields.fireEligible
    this.phoenixRelation = fields.phoenixRelation as types.PhoenixRelationKind
    this.rewardMint = fields.rewardMint
    this.manager = fields.manager
    this.isInitialized = fields.isInitialized
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CollectionRewardInfo | null> {
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
  ): Promise<Array<CollectionRewardInfo | null>> {
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

  static decode(data: Buffer): CollectionRewardInfo {
    if (!data.slice(0, 8).equals(CollectionRewardInfo.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CollectionRewardInfo.layout.decode(data.slice(8))

    return new CollectionRewardInfo({
      bump: dec.bump,
      ratePerDay: dec.ratePerDay,
      rewardWallet: dec.rewardWallet,
      rewardSymbol: dec.rewardSymbol,
      collectionName: dec.collectionName,
      collectionAddress: dec.collectionAddress,
      fireEligible: dec.fireEligible,
      phoenixRelation: types.PhoenixRelation.fromDecoded(dec.phoenixRelation),
      rewardMint: dec.rewardMint,
      manager: dec.manager,
      isInitialized: dec.isInitialized,
    })
  }

  toJSON(): CollectionRewardInfoJSON {
    return {
      bump: this.bump,
      ratePerDay: this.ratePerDay,
      rewardWallet: this.rewardWallet.toString(),
      rewardSymbol: this.rewardSymbol,
      collectionName: this.collectionName,
      collectionAddress: this.collectionAddress.toString(),
      fireEligible: this.fireEligible,
      phoenixRelation: this.phoenixRelation,
      rewardMint: this.rewardMint.toString(),
      manager: this.manager.toString(),
      isInitialized: this.isInitialized,
    }
  }

  static fromJSON(obj: CollectionRewardInfoJSON): CollectionRewardInfo {
    return new CollectionRewardInfo({
      bump: obj.bump,
      ratePerDay: obj.ratePerDay,
      rewardWallet: new PublicKey(obj.rewardWallet),
      rewardSymbol: obj.rewardSymbol,
      collectionName: obj.collectionName,
      collectionAddress: new PublicKey(obj.collectionAddress),
      fireEligible: obj.fireEligible,
      phoenixRelation: types.PhoenixRelation.fromJSON(obj.phoenixRelation),
      rewardMint: new PublicKey(obj.rewardMint),
      manager: new PublicKey(obj.manager),
      isInitialized: obj.isInitialized,
    })
  }
}
