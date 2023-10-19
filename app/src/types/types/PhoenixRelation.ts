import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface AffiliateJSON {
  kind: "Affiliate"
}

export class Affiliate {
  static readonly discriminator = 0
  static readonly kind = "Affiliate"
  readonly discriminator = 0
  readonly kind = "Affiliate"

  toJSON(): AffiliateJSON {
    return {
      kind: "Affiliate",
    }
  }

  toEncodable() {
    return {
      Affiliate: {},
    }
  }
}

export interface SavedJSON {
  kind: "Saved"
}

export class Saved {
  static readonly discriminator = 1
  static readonly kind = "Saved"
  readonly discriminator = 1
  readonly kind = "Saved"

  toJSON(): SavedJSON {
    return {
      kind: "Saved",
    }
  }

  toEncodable() {
    return {
      Saved: {},
    }
  }
}

export interface FounderJSON {
  kind: "Founder"
}

export class Founder {
  static readonly discriminator = 2
  static readonly kind = "Founder"
  readonly discriminator = 2
  readonly kind = "Founder"

  toJSON(): FounderJSON {
    return {
      kind: "Founder",
    }
  }

  toEncodable() {
    return {
      Founder: {},
    }
  }
}

export interface EvoJSON {
  kind: "Evo"
}

export class Evo {
  static readonly discriminator = 3
  static readonly kind = "Evo"
  readonly discriminator = 3
  readonly kind = "Evo"

  toJSON(): EvoJSON {
    return {
      kind: "Evo",
    }
  }

  toEncodable() {
    return {
      Evo: {},
    }
  }
}

export interface MemberJSON {
  kind: "Member"
}

export class Member {
  static readonly discriminator = 4
  static readonly kind = "Member"
  readonly discriminator = 4
  readonly kind = "Member"

  toJSON(): MemberJSON {
    return {
      kind: "Member",
    }
  }

  toEncodable() {
    return {
      Member: {},
    }
  }
}

export interface EmberBedJSON {
  kind: "EmberBed"
}

export class EmberBed {
  static readonly discriminator = 5
  static readonly kind = "EmberBed"
  readonly discriminator = 5
  readonly kind = "EmberBed"

  toJSON(): EmberBedJSON {
    return {
      kind: "EmberBed",
    }
  }

  toEncodable() {
    return {
      EmberBed: {},
    }
  }
}

export interface NoneJSON {
  kind: "None"
}

export class None {
  static readonly discriminator = 6
  static readonly kind = "None"
  readonly discriminator = 6
  readonly kind = "None"

  toJSON(): NoneJSON {
    return {
      kind: "None",
    }
  }

  toEncodable() {
    return {
      None: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.PhoenixRelationKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Affiliate" in obj) {
    return new Affiliate()
  }
  if ("Saved" in obj) {
    return new Saved()
  }
  if ("Founder" in obj) {
    return new Founder()
  }
  if ("Evo" in obj) {
    return new Evo()
  }
  if ("Member" in obj) {
    return new Member()
  }
  if ("EmberBed" in obj) {
    return new EmberBed()
  }
  if ("None" in obj) {
    return new None()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.PhoenixRelationJSON
): types.PhoenixRelationKind {
  switch (obj.kind) {
    case "Affiliate": {
      return new Affiliate()
    }
    case "Saved": {
      return new Saved()
    }
    case "Founder": {
      return new Founder()
    }
    case "Evo": {
      return new Evo()
    }
    case "Member": {
      return new Member()
    }
    case "EmberBed": {
      return new EmberBed()
    }
    case "None": {
      return new None()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Affiliate"),
    borsh.struct([], "Saved"),
    borsh.struct([], "Founder"),
    borsh.struct([], "Evo"),
    borsh.struct([], "Member"),
    borsh.struct([], "EmberBed"),
    borsh.struct([], "None"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
