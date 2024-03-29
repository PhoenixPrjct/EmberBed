import { PublicKey } from "@solana/web3.js";
import { useWallet, initWallet } from "solana-wallets-vue";
import { walletOptions } from "src/boot/sw";
import { AnchorWallet, WalletStore } from "src/types";
import { useUserStore } from "src/stores/user_store";
import { ComputedRef } from "vue";
import { sign } from 'tweetnacl'
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
initWallet(walletOptions);

const wallet = <WalletStore>useWallet();
const { signMessage } = wallet
export async function verifyWallet(pKey: PublicKey) {
    const store = useUserStore();
    if (!pKey || typeof pKey === "string") return false;
    try {
        console.log({ wallet: wallet.publicKey.value?.toBase58(), pk: pKey.toBase58() });
        console.log({ check: wallet.publicKey.value?.toBase58() === pKey.toBase58() });
        if (wallet.publicKey.value?.toBase58() !== pKey.toBase58()) throw new Error('Not the Same Wallet... Maybe');
        // `publicKey` will be null if the wallet isn't connected
        if (!pKey) throw new Error('Wallet not connected!');
        // `signMessage` will be undefined if the wallet doesn't support it
        if (!signMessage) throw new Error('Wallet does not support message signing!');
        // Encode anything as bytes
        const message = new TextEncoder().encode(`Sign this so EmberBed knows that this\nwallet is actually yours \n\n\n . . . please.`);
        // Sign the bytes using the wallet
        if (!wallet.signMessage.value) throw new Error('Message Was Undefined');
        const signature = await wallet.signMessage.value(message);

        // Verify that the bytes were signed using the private key that matches the known public key
        if (!sign.detached.verify(message, signature, pKey.toBytes())) throw new Error('Invalid signature!');
        console.log("success")

        async function setStore() {
            store.setUser(pKey.toBase58(), 'Admin');
            return store.getType
        }
        const storeUserType = await setStore()
        return storeUserType
    } catch (err) {
        console.dir(err)
        return false

    }
}