import { Keypair } from '@solana/web3.js'
import devPk from '../../../phoenixdev.json'
import PrjctSecret from '../../../PrjctTokenAuthority.json'
import ProgramSecret from '../../../Hydra.json'

const getKeyPair = (seed: number[]) => {
    const secret = Uint8Array.from(seed)
    const result = Keypair.fromSecretKey(secret);
    return result;
}


export const ProgramWallet = getKeyPair(ProgramSecret);
export const devKeyPair = getKeyPair(devPk)
export const EBWallet = getKeyPair(PrjctSecret)