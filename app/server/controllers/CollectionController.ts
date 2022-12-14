import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs"
import path, { join } from 'path';
import { CollectionRewardInfoJSON } from "src/types"
// import { Collection, User, Admin } from "../models"

// {
//     manager: 'DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q',
//         pda: 'CG4KDtfDDvYWP4ChqxKVLXjxjrg8VT28RoMpJgjYosFs',
//             hashlist: []
// }

type CollectionStyle = {
    icon: string,
    colors: {
        primary: string,
        secondary: string,
        accent: string
    }
}


interface CollectionFile {
    pda: string;
    manager: string;
    hashlist: string[];
    style?: CollectionStyle;
}

class CollectionFile {
    pda: string;
    manager: string;
    hashlist: string[];
    style?: CollectionStyle;

    constructor(pda: string, manager: string, hashlist: string[], style?: CollectionStyle) {
        this.pda = pda;
        this.manager = manager;
        this.hashlist = hashlist;
        this.style = style;
    }

    static toDB(pda: string, manager: string, hashlist: string[], style?: CollectionStyle) {
        const cleanedHashlist = hashlist.map(hash => hash.trim())
        const data = { manager: manager, hashlist: cleanedHashlist, style: style };
        writeFileSync(
            join(__dirname, '../collections', pda + '.json'),
            JSON.stringify(data)
        );
    }
}


export const CC = {
    create: async (pda: string, manager: string, collection: string, rewardWallet: string) => {
        try {

            const collections = readdirSync(join(__dirname, '../collections'));
            if (collections?.includes(collection)) {
                throw new Error('Collection already exists');
            }
            const data = { manager: `${manager}`, name: `${collection}`, rewardWallet: `${rewardWallet}`, hashlist: [] };
            const newFile = await writeFileSync(join(__dirname, `../collections/${pda}.json`), JSON.stringify(data), 'utf-8');
            return { status: 200, response: newFile };
        } catch (err: any) {
            console.log(err);
            return { status: 400, response: err.message }
        }
    },
    getByPDA: async (pda: string) => {
        try {
            const collections = readdirSync(join(__dirname, '../collections'));
            console.log("GetPDA Collections")
            console.log(collections)
            if (!collections.includes(`${pda}.json`)) throw new Error('Collection Not Found')
            const data = readFileSync(join(__dirname, `../collections/${pda}.json`), 'utf-8');

            return { status: 200, response: JSON.parse(data) };

        } catch (err: any) {
            console.log(err);
            return { status: 400, response: err.message }
        }
    },
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
    },
    addStyle: async (pda: string, wallet: string, style: CollectionStyle) => {
        try {

            const files = await readdirSync(join(__dirname, `../collections`));
            if (files.includes(pda + '.json')) {
                const fileContents = await readFileSync(
                    join(__dirname, `../collections/${pda}.json`),
                    'utf-8'
                );

                const collectionFile = JSON.parse(fileContents) as CollectionFile;
                if (collectionFile.manager !== wallet) throw new Error('Not Your Collection to Be Styling Dog.')
                collectionFile.style = style
                CollectionFile.toDB(pda, collectionFile.manager, collectionFile.hashlist, collectionFile.style);
            }
            return { status: 200, response: 'Style added' };

        } catch (err: any) {
            console.log(err);
            return { status: 500, response: err.message };
        }
    }

}