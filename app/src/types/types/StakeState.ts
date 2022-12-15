import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface StakedJSON {
  kind: "Staked"
}

export class Staked {
  static readonly discriminator = 0
  static readonly kind = "Staked"
  readonly discriminator = 0
  readonly kind = "Staked"

  toJSON(): StakedJSON {
    return {
      kind: "Staked",
    }
  }

  toEncodable() {
    return {
      Staked: {},
    }
  }
}

export interface UnstakedJSON {
  kind: "Unstaked"
}

export class Unstaked {
  static readonly discriminator = 1
  static readonly kind = "Unstaked"
  readonly discriminator = 1
  readonly kind = "Unstaked"

  toJSON(): UnstakedJSON {
    return {
      kind: "Unstaked",
    }
  }

  toEncodable() {
    return {
      Unstaked: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StakeStateKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Staked" in obj) {
    return new Staked()
  }
  if ("Unstaked" in obj) {
    return new Unstaked()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.StakeStateJSON): types.StakeStateKind {
  switch (obj.kind) {
    case "Staked": {
      return new Staked()
    }
    case "Unstaked": {
      return new Unstaked()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Staked"),
    borsh.struct([], "Unstaked"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
