import { CollectionRewardInfoJSON } from "src/types"
import { Collection, User, Admin } from "../models"
export const CC = {
    getByOwner: async (owner: string) => {
        try {
            const collections = await Collection.find({ owner: owner })
            return { status: 200, response: collections }
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
    create: async (sig: string, collection: CollectionRewardInfoJSON) => {
        try {
            const col = await Collection.create({ ...collection, paid_sig: sig });
            return { status: 200, response: col }
        } catch (err: any) {
            console.log(err)
            return { status: 500, err }
        }
    }
}