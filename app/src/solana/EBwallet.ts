import { Keypair } from '@solana/web3.js';
import PrjctSecret from '../../../PrjctTokenAuthority.json'
console.log(PrjctSecret)

export const EBSecret = new Uint8Array(PrjctSecret);

export const EBWallet = Keypair.fromSecretKey(EBSecret)
console.log(EBWallet.publicKey.toBase58())