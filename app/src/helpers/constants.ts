import { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { getConnection } from 'src/api/chain-api';
import { useChainAPI } from 'src/api/chain-api';
import { EBWallet } from 'src/dev/walletKPs';
import { IDL, InitializeFirePdaAccounts, InitializeFirePdaArgs } from 'src/types';
const EmberBedAddress = "BJgybhDGQD6YoAQWfmz6K8VCVbbK2vsw16hHF7nzmDmp"
const programID = new PublicKey(EmberBedAddress);
const connection = new Connection(getConnection());

function getFireMintPub() {
    if (process.env.NODE_ENV !== 'production') {
        return new PublicKey('F1RELQfqm789aGdLsdXRusCnrVEhqWGg3rrRDQsFXvR8');
    }
    return new PublicKey('F1rEZqWk1caUdaCwyHMWhxv5ouuzPW8sgefwBhzdhGaw');
}
async function getFirePda(): Promise<{ pda: PublicKey, bump: number }> {
    const [pda, bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from("ebtreasury"), Buffer.from("fstate")],
        programID
    );
    console.log({ FIRE_PDA: pda, FIRE_BUMP: bump });
    return { pda, bump };
}
async function getFireRewardWallet(FIRE_MINT: PublicKey, FIRE_PDA: PublicKey) {
    const rewardWallet = await getOrCreateAssociatedTokenAccount(connection, EBWallet, FIRE_MINT, FIRE_PDA, true)
    console.log({ rewardWallet })
    return rewardWallet
}
async function getFireTokenAta(FireTok: PublicKey = getFireMintPub()) {
    const fireTokenATA = await getAssociatedTokenAddress(FireTok, EBWallet.publicKey);
    return fireTokenATA
}


async function initializeFirePdaAccounts() {
    const firePdaInfo = await getFirePda();
    const FIRE_FUNDER = EBWallet.publicKey;
    const FIRE_PDA = firePdaInfo.pda;
    const FIRE_BUMP = firePdaInfo.bump;
    const FIRE_MINT = await getFireMintPub();
    const FIRE_ATA = await getFireTokenAta();
    const FIRE_POA = (await getFireRewardWallet(FIRE_MINT, FIRE_PDA)).address;
    const FIRE_ACCTS: InitializeFirePdaAccounts = {
        firePda: FIRE_PDA,
        rewardMint: FIRE_MINT,
        tokenPoa: FIRE_POA,
        funder: FIRE_FUNDER,
        funderAta: FIRE_ATA,
        systemProgram: SystemProgram.programId,
    };
    const FIRE_ARGS: InitializeFirePdaArgs = { bump: FIRE_BUMP };


    return { FIRE_ACCTS, FIRE_ARGS, FIRE_BUMP, FIRE_PDA, FIRE_MINT, FIRE_ATA, FIRE_POA, FIRE_FUNDER };
}


export const FIRE_INFO = initializeFirePdaAccounts().then(res => res);
export const FIRE_MINT_PUB = getFireMintPub().toBase58(); 