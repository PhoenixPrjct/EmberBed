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
    }
}