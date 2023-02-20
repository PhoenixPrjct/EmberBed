import { PublicKey } from '@solana/web3.js';

function getFireMintPub() {
    if (process.env.NODE_ENV !== 'production') {
        return new PublicKey('F1RELQfqm789aGdLsdXRusCnrVEhqWGg3rrRDQsFXvR8');
    }
    return new PublicKey('F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw');

}
export const FIRE_MINT_PUB = getFireMintPub();
