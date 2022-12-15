import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface HobbyJSON {
  kind: "Hobby"
}

export class Hobby {
  static readonly discriminator = 0
  static readonly kind = "Hobby"
  readonly discriminator = 0
  readonly kind = "Hobby"

  toJSON(): HobbyJSON {
    return {
      kind: "Hobby",
    }
  }

  toEncodable() {
    return {
      Hobby: {},
    }
  }
}

export interface LoyalJSON {
  kind: "Loyal"
}

export class Loyal {
  static readonly discriminator = 1
  static readonly kind = "Loyal"
  readonly discriminator = 1
  readonly kind = "Loyal"

  toJSON(): LoyalJSON {
    return {
      kind: "Loyal",
    }
  }

  toEncodable() {
    return {
      Loyal: {},
    }
  }
}

export interface DieHardJSON {
  kind: "DieHard"
}

export class DieHard {
  static readonly discriminator = 2
  static readonly kind = "DieHard"
  readonly discriminator = 2
  readonly kind = "DieHard"

  toJSON(): DieHardJSON {
    return {
      kind: "DieHard",
    }
  }

  toEncodable() {
    return {
      DieHard: {},
    }
  }
}

export interface WhaleJSON {
  kind: "Whale"
}

export class Whale {
  static readonly discriminator = 3
  static readonly kind = "Whale"
  readonly discriminator = 3
  readonly kind = "Whale"

  toJSON(): WhaleJSON {
    return {
      kind: "Whale",
    }
  }

  toEncodable() {
    return {
      Whale: {},
    }
  }
}

export interface NoneJSON {
  kind: "None"
}

export class None {
  static readonly discriminator = 4
  static readonly kind = "None"
  readonly discriminator = 4
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
export function fromDecoded(obj: any): types.PhoenixUserRelationKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Hobby" in obj) {
    return new Hobby()
  }
  if ("Loyal" in obj) {
    return new Loyal()
  }
  if ("DieHard" in obj) {
    return new DieHard()
  }
  if ("Whale" in obj) {
    return new Whale()
  }
  if ("None" in obj) {
    return new None()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.PhoenixUserRelationJSON
): types.PhoenixUserRelationKind {
  switch (obj.kind) {
    case "Hobby": {
      return new Hobby()
    }
    case "Loyal": {
      return new Loyal()
    }
    case "DieHard": {
      return new DieHard()
    }
    case "Whale": {
      return new Whale()
    }
    case "None": {
      return new None()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Hobby"),
    borsh.struct([], "Loyal"),
    borsh.struct([], "DieHard"),
    borsh.struct([], "Whale"),
    borsh.struct([], "None"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
