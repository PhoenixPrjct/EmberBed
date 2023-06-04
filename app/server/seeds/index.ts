import { createPDA } from "./PrjctEvoSeed";
type seedName = "Evo" | "Founder" | "Member" | "Saved"
const collectionsToAdd: seedName[] = ["Member"]

collectionsToAdd.forEach(async (name) => {
    const sig = await createPDA(name)
    console.log({ name, sig })
})
