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
    create: async (sig: string, pda: string, collection: CollectionRewardInfoJSON) => {
        try {
            const exists = await Collection.findOne({ pda: pda });
            if (exists) {
                // Update the existing document with the new values
                const update = await Collection.findOneAndUpdate({ pda: pda }, collection);
                return { status: 200, response: update }
            } else {
                const col = await Collection.create({ ...collection, phoenix_relation: collection.phoenixRelation.kind, paid_sig: sig });
                await Admin.findOneAndUpdate({ pubkey: collection.manager }, { $addToSet: { collections: col._id } });
                return { status: 200, response: col }
            }
        } catch (err: any) {
            console.log(err)
            return { status: 500, err }
        }
    },

    deleteByPDA: async (pda: string) => {
        try {
            const col = await Collection.findOne({ pda: pda }).sort({ _id: 1 });
            if (!col) throw new Error('Collection not found');
            // Delete all the other collection documents that match the pda value
            await Collection.deleteMany({ pda: pda, _id: { $ne: col._id } });
            return { status: 200, response: col }
        } catch (err) {
            console.log(err)
            return { status: 500, err }
        }
    },
    addHashlist: async (wallet: string, hashlist: string, pda: string) => {
        try {
            console.log({ wallet: wallet, hashlist: hashlist, pda: pda })
            const col = await Collection.findOne({ pda: pda });
            if (!col) throw new Error('Collection not found');
            if (col.manager !== wallet) throw new Error(`Unauthorized To Modify Collection`);
            const update = await Collection.updateOne({ pda: pda }, { $set: { hashlist: hashlist } }, { new: true });
            console.log(JSON.stringify(update));
            return { status: 200, response: update }

        } catch (err) {
            console.log(err)
            return { status: 500, err }
        }
    },
    getHashlist: async (pda: string) => {
        try {
            const col = await Collection.findOne({ pda: pda });
            if (!col) throw new Error('Collection not found');
            console.log(col);
            return { status: 200, response: col.hashlist }
        } catch (err) {
            console.log(err)
            return { status: 500, err }
        }
    }
}