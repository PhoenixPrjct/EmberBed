import { createPDA } from "./seeds";
type seedName = "Evo" | "Founder" | "Member" | "Saved" | "Fire"
const collectionsToAdd: seedName[] = ["Fire"]

collectionsToAdd.forEach(async (name) => {
    console.log({ name })
    const sig = await createPDA(name)
    console.log({ name, sig })
})
