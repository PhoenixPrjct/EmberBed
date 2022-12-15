import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UserStakeInfoFields {
  userNftAta: PublicKey
  stakeStartTime: BN
  lastStakeRedeem: BN
  userPubkey: PublicKey
  stakeState: types.StakeStateKind
  phoenixStatus: types.PhoenixUserRelationKind
  collectionRewardState: PublicKey
  isInitialized: boolean
  bump: number
}

export interface UserStakeInfoJSON {
  userNftAta: string
  stakeStartTime: string
  lastStakeRedeem: string
  userPubkey: string
  stakeState: types.StakeStateJSON
  phoenixStatus: types.PhoenixUserRelationJSON
  collectionRewardState: string
  isInitialized: boolean
  bump: number
}

export class UserStakeInfo {
  readonly userNftAta: PublicKey
  readonly stakeStartTime: BN
  readonly lastStakeRedeem: BN
  readonly userPubkey: PublicKey
  readonly stakeState: types.StakeStateKind
  readonly phoenixStatus: types.PhoenixUserRelationKind
  readonly collectionRewardState: PublicKey
  readonly isInitialized: boolean
  readonly bump: number

  static readonly discriminator = Buffer.from([
    219, 233, 236, 123, 28, 113, 89, 56,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("userNftAta"),
    borsh.i64("stakeStartTime"),
    borsh.i64("lastStakeRedeem"),
    borsh.publicKey("userPubkey"),
    types.StakeState.layout("stakeState"),
    types.PhoenixUserRelation.layout("phoenixStatus"),
    borsh.publicKey("collectionRewardState"),
    borsh.bool("isInitialized"),
    borsh.u8("bump"),
  ])

  constructor(fields: UserStakeInfoFields) {
    this.userNftAta = fields.userNftAta
    this.stakeStartTime = fields.stakeStartTime
    this.lastStakeRedeem = fields.lastStakeRedeem
    this.userPubkey = fields.userPubkey
    this.stakeState = fields.stakeState
    this.phoenixStatus = fields.phoenixStatus
    this.collectionRewardState = fields.collectionRewardState
    this.isInitialized = fields.isInitialized
    this.bump = fields.bump
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<UserStakeInfo | null> {
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
  ): Promise<Array<UserStakeInfo | null>> {
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

  static decode(data: Buffer): UserStakeInfo {
    if (!data.slice(0, 8).equals(UserStakeInfo.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = UserStakeInfo.layout.decode(data.slice(8))

    return new UserStakeInfo({
      userNftAta: dec.userNftAta,
      stakeStartTime: dec.stakeStartTime,
      lastStakeRedeem: dec.lastStakeRedeem,
      userPubkey: dec.userPubkey,
      stakeState: types.StakeState.fromDecoded(dec.stakeState),
      phoenixStatus: types.PhoenixUserRelation.fromDecoded(dec.phoenixStatus),
      collectionRewardState: dec.collectionRewardState,
      isInitialized: dec.isInitialized,
      bump: dec.bump,
    })
  }

  toJSON(): UserStakeInfoJSON {
    return {
      userNftAta: this.userNftAta.toString(),
      stakeStartTime: this.stakeStartTime.toString(),
      lastStakeRedeem: this.lastStakeRedeem.toString(),
      userPubkey: this.userPubkey.toString(),
      stakeState: this.stakeState.toJSON(),
      phoenixStatus: this.phoenixStatus.toJSON(),
      collectionRewardState: this.collectionRewardState.toString(),
      isInitialized: this.isInitialized,
      bump: this.bump,
    }
  }

  static fromJSON(obj: UserStakeInfoJSON): UserStakeInfo {
    return new UserStakeInfo({
      userNftAta: new PublicKey(obj.userNftAta),
      stakeStartTime: new BN(obj.stakeStartTime),
      lastStakeRedeem: new BN(obj.lastStakeRedeem),
      userPubkey: new PublicKey(obj.userPubkey),
      stakeState: types.StakeState.fromJSON(obj.stakeState),
      phoenixStatus: types.PhoenixUserRelation.fromJSON(obj.phoenixStatus),
      collectionRewardState: new PublicKey(obj.collectionRewardState),
      isInitialized: obj.isInitialized,
      bump: obj.bump,
    })
  }
}
