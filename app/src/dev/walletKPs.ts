import { Keypair } from '@solana/web3.js'
import devPk from '../../../Wallet_Info/phoenixdev.json'
import PrjctSecret from '../../../Wallet_Info/PrjctTokenAuthority.json'
import ProgramSecret from '../../../Wallet_Info/Hydra.json'

const getKeyPair = (seed: number[]) => {
    const secret = Uint8Array.from(seed)
    const result = Keypair.fromSecretKey(secret);
    return result;
}

const PW = ProgramSecret || process.env.VUE_APP_PROGRAM_WALLET;
const DW = devPk || process.env.VUE_APP_DEV_WALLET;
const EW = PrjctSecret || process.env.VUE_APP_EBWALLET;

export const ProgramWallet = getKeyPair(PW);
export const devKeyPair = getKeyPair(DW);
export const EBWallet = getKeyPair(EW);