import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs"
import { join } from 'path';
import { CollectionRewardInfoJSON } from "src/types"
// import { Collection, User, Admin } from "../models"

// {
//     manager: 'DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q',
//         pda: 'CG4KDtfDDvYWP4ChqxKVLXjxjrg8VT28RoMpJgjYosFs',
//             hashlist: []
// }

interface CollectionFile {
    pda: string;
    manager: string;
    hashlist: string[];
}

class CollectionFile {
    pda: string;
    manager: string;
    hashlist: string[];
    constructor(pda: string, manager: string, hashlist: string[]) {
        this.pda = pda;
        this.manager = manager;
        this.hashlist = hashlist;
    }

    static toDB(pda: string, manager: string, hashlist: string[]) {
        const cleanedHashlist = hashlist.map(hash => hash.trim())
        const data = { manager: manager, hashlist: cleanedHashlist };
        writeFileSync(
            join(__dirname, '../collections', pda + '.json'),
            JSON.stringify(data)
        );
    }
}


export const CC = {

    deleteByPDA: async (pda: string) => {
        try {
            await unlinkSync(join(__dirname, `../collections/${pda}.json`))
            return { status: 200, response: `Deleted ${pda}` }
        } catch (err) {
            console.log(err)
            return { status: 500, err }
        }
    },
    addHashlist: async (wallet: string, hashlist: string[], pda: string) => {
        console.log({ wallet, hashlist, pda })
        try {
            const files = await readdirSync(join(__dirname, `../collections`));
            if (files.includes(pda + '.json')) {
                const fileContents = await readFileSync(
                    join(__dirname, `../collections/${pda}.json`),
                    'utf-8'
                );
                const collectionFile = JSON.parse(fileContents) as CollectionFile;
                if (collectionFile.manager !== wallet) {
                    return { status: 400, error: 'Manager does not match' };
                }
                collectionFile.hashlist = hashlist;
                CollectionFile.toDB(pda, wallet, hashlist);
                return { status: 200, response: 'Hashlist updated' };
            } else {
                const col = new CollectionFile(pda, wallet, hashlist);
                CollectionFile.toDB(pda, wallet, hashlist);
                return { status: 200, response: 'Hashlist added' };
            }
        } catch (err) {
            console.log(err);
            return { status: 500, err };
        }

    },
    getHashlist: async (pda: string) => {
        try {
            const files = await readdirSync(join(__dirname, `../collections`));
            if (files.includes(pda + '.json')) {
                const fileContents = await readFileSync(
                    join(__dirname, `../collections/${pda}.json`),
                    'utf-8'
                );
                const collectionFile = JSON.parse(fileContents) as CollectionFile;
                return { status: 200, response: collectionFile.hashlist };
            } else {
                return { status: 200, response: [] };
            }
        } catch (err) {
            console.log(err);
            return { status: 500, err };
        }
    }
}