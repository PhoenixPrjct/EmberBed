import { Keypair } from '@solana/web3.js'
import devPk from '../../../Wallet_Info/phoenixdev.json'
import PrjctSecret from '../../../Wallet_Info/PrjctTokenAuthority.json'
import ProgramSecret from '../../../Wallet_Info/Hydra.json'

const getKeyPair = (seed: number[]) => {
    const secret = Uint8Array.from(seed)
    const result = Keypair.fromSecretKey(secret);
    return result;
}


export const ProgramWallet = getKeyPair(ProgramSecret);
export const devKeyPair = getKeyPair(devPk)
export const EBWallet = getKeyPair(PrjctSecret)