import { readFileSync } from "fs"
import { Collection, User, Admin } from "../models"
export const AC = {
    getDBAcct: async (wallet: string) => {
        try {
            console.log(wallet)
            let admin = await Admin.findOne({ pubkey: wallet }).populate({ path: 'collections', model: 'Collection' })
            if (!admin) {
                admin = await Admin.create({ pubkey: wallet })
            }
            return { status: 200, response: admin }
        } catch (e) {
            console.log(e)
            return { status: 500, e }
        }
    },
    getAll: async () => {
        try {
            const collections = await Collection.find({});
            return { status: 200, response: collections }
        } catch (e) {
            console.log(e)
            return { status: 500, e }
        }
    },
    getRelations: async () => {
        try {
            const relations = await readFileSync('../data/relations.json', 'utf-8');
            return {
                status: 200, response: JSON.parse(relations)
            }
        } catch (e) {
            console.log(e)
            return { status: 500, e }
        }
    }
}