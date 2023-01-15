
import { Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import type {
    Adapter, WalletReadyState, WalletName,
    WalletNotReadyError,
    WalletNotConnectedError, MessageSignerWalletAdapterProps, SignerWalletAdapterProps, WalletAdapterProps
} from "@solana/wallet-adapter-base";
import { Ref } from "vue";
import { writeFileSync } from "fs";
import { join } from "path";

export * from './accounts'
export * from './errors'
export * from './types'
export * from './instructions'
export * from './programId'
export type CollectionInfo = {
    address?: PublicKey
    bump?: number,
    manager?: string,
    rewardWallet?: string,
    collectionName: string,
    collectionAddress: string,
    ratePerDay?: number,
    fireEligible: boolean,
    phoenixRelation?: { kind: string },
    rewardSymbol: string,
    rewardMint: string
}

export interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction: SignerWalletAdapterProps["signTransaction"];
    signAllTransactions: SignerWalletAdapterProps["signAllTransactions"];
}

export type Wallet = {
    adapter: Adapter;
    readyState: WalletReadyState;
};
export interface WalletStore {
    // Props.
    wallets: Ref<Wallet[]>;
    autoConnect: Ref<boolean>;

    // Data.
    wallet: Ref<Wallet | null>;
    publicKey: Ref<PublicKey | null>;
    readyState: Ref<WalletReadyState>;
    ready: Ref<boolean>;
    connected: Ref<boolean>;
    connecting: Ref<boolean>;
    disconnecting: Ref<boolean>;

    // Methods.
    select(walletName: WalletName): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction: WalletAdapterProps["sendTransaction"];

    // Optional methods.
    signTransaction: Ref<SignerWalletAdapterProps["signTransaction"] | undefined>;
    signAllTransactions: Ref<
        SignerWalletAdapterProps["signAllTransactions"] | undefined
    >;
    signMessage: Ref<MessageSignerWalletAdapterProps["signMessage"] | undefined>;
}

export interface RawEBNft {
    key: number;
    mint: string;
    ebCollection?: string;
    updateAuthority: string;
    data: {
        name: string;
        symbol: string;
        description: string;

        image: string;
        external_url: string;
        edition: number;
        attributes: {
            trait_type: string;
            value: string;
        }[];
        properties: {
            files: {
                uri: string;
                type: string;
            }[];
            category: string;
            creators: {
                address: string;
                share: number;
            }[];
        }
    }
}


export type DBCollectionInfo = {
    manager: string;
    name: string;
    hashlist: string[];
    style: {
        icon: string,
        colors: {
            primary: string;
            secondary: string;
            accent: string;
        }
    }

}

export interface EBNft {
    key: number;
    mint: string;
    ebCollection?: string;
    updateAuthority: string;
    name: string;
    symbol: string;
    description: string;

    image: string;
    external_url: string;
    edition: number;
    misc: {
        attributes: {
            trait_type: string;
            value: string;
        }[];
        properties: {
            files: {
                uri: string;
                type: string;
            }[];
            category: string;
            creators: {
                address: string;
                share: number;
            }[];
        }
    }
}
export class EBNft {
    key: number;
    mint: string;
    ebCollection?: string;
    updateAuthority: string;
    name: string;
    symbol: string;

    description: string;
    image: string;
    external_url: string;
    edition: number;
    misc: {
        attributes: {
            trait_type: string;
            value: string;
        }[];
        properties: {
            files: {
                uri: string;
                type: string;
            }[];
            category: string;
            creators: {
                address: string;
                share: number;
            }[];
        }
    };

    constructor(props: RawEBNft) {
        this.key = props.key;
        this.mint = props.mint;
        this.ebCollection = props.ebCollection;
        this.updateAuthority = props.updateAuthority;
        this.name = props.data.name;
        this.symbol = props.data.symbol;
        this.description = props.data.description;
        this.image = props.data.image;
        this.external_url = props.data.external_url;
        this.edition = props.data.edition;
        this.misc = {
            attributes: [...props.data.attributes],
            properties: { ...props.data.properties }
        };
    }
}
export type CollectionAccounts = {
    RewTok: PublicKey,
    collectionAddress: PublicKey,
    collectionName: string,
    ratePerDay: number,
    fireEligible: boolean,
    phoenixRelation: { kind: string },
    rewardSymbol: string,
    rewardMint: string
}

export type Accounts = {
    RewTok: PublicKey,
    nft: Nft | any,
    nftTokenAddress: PublicKey,
    userRewardAta: PublicKey,
    stakeStatusPda: PublicKey,
    stakeStatusBump: number,
    delegatedAuthPda: PublicKey,
    authBump: number,
    statePDA: PublicKey,
    stateBump: number
    userAccountPDA: PublicKey,
    nftCollectionAddress: PublicKey,
    funderTokenAta: PublicKey
    rewardWallet: PublicKey
}


export interface MutableTokenInfo {
    chainId: number;
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    logoURI?: string;
    tags?: string[];
}

export interface EditCollectionInfo {
    ratePerDay: number
    rewardWallet: string
    rewardSymbol: string
    collectionName: string
    collectionAddress: string
    fireEligible: boolean
    rewardMint: string
    manager: string

}
export class EditCollectionInfo {
    ratePerDay: number;
    rewardWallet: string;
    rewardSymbol: string;
    collectionName: string;
    collectionAddress: string;
    fireEligible: boolean;
    rewardMint: string;
    manager: string;

    constructor(ratePerDay: number, rewardWallet: string, rewardSymbol: string, collectionName: string, collectionAddress: string, fireEligible: boolean, rewardMint: string, manager: string) {
        this.ratePerDay = ratePerDay;
        this.rewardWallet = rewardWallet;
        this.rewardSymbol = rewardSymbol;
        this.collectionName = collectionName;
        this.collectionAddress = collectionAddress;
        this.fireEligible = fireEligible;
        this.rewardMint = rewardMint;
        this.manager = manager;
    }
}



// Server Response Types

export interface RelationsServerResponse {
    Affiliates: string[];
    Saved: string[];
    Founders: string[];
    Members: string[];
}


export interface NewCollectionResponse {
    _id: string;
    phoenix_relation: "Affiliate" | "Founder" | "Member" | "Saved" | "None";
    hashlist: string[];
    idx?: string | undefined;
    name?: string | undefined;
    pda?: string | undefined;
    reward_mint?: string | undefined;
    reward_wallet?: string | undefined;
    paid_sig?: string | undefined;
}

export type CollectionStyle = {
    icon: string,
    colors: {
        primary: string,
        secondary: string,
        accent: string
    }
}


export interface CollectionFile {
    pda: string;
    manager: string;
    hashlist: string[];
    style?: CollectionStyle;
}

export class CollectionFile {
    pda: string;
    manager: string;
    hashlist: string[];
    style?: CollectionStyle;
    constructor(pda: string, manager: string, hashlist: string[], style?: CollectionStyle) {
        this.pda = pda;
        this.manager = manager;
        this.hashlist = hashlist;
        this.style = style;
    }
}