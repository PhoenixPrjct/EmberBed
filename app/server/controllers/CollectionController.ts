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
    collectionAddress?: string;
    name: string;
    hashlist: string[];
    style?: CollectionStyle;
}

class CollectionFile {
    pda: string;
    manager: string;
    collectionAddress?: string;
    name: string;
    hashlist: string[];
    style?: CollectionStyle;

    constructor(pda: string, manager: string, name: string, hashlist: string[], collectionAddress?: string, style?: CollectionStyle) {
        this.pda = pda;
        this.manager = manager;
        this.collectionAddress = collectionAddress;
        this.name = name;
        this.hashlist = hashlist;
        this.style = style;
    }

    static toDB(colFile: { pda: string, manager: string, name: string, hashlist?: string[], collectionAddress?: string, style?: CollectionStyle }) {
        let data: CollectionFile = { ...colFile, hashlist: [] }
        if (colFile.hashlist) {
            const cleanedHashlist = colFile.hashlist.map(hash => hash.trim())
            data = { ...data, hashlist: cleanedHashlist };
        }
        writeFileSync(
            join(__dirname, '../collections', colFile.pda + '.json'),
            JSON.stringify(data)
        );

    }
}


export const CC = {
    create: async (info: {
        pda: string;
        manager: string;
        collection: string;
        rewardWallet: string;
        vca?: string;
    }) => {
        try {

            const collections = readdirSync(join(__dirname, '../collections'));
            if (collections?.includes(info.collection)) {
                throw new Error('Collection already exists');
            }
            const data = { manager: `${info.manager}`, name: `${info.collection}`, rewardWallet: `${info.rewardWallet}`, vca: `${info.vca}`, hashlist: [] };
            const newFile = await writeFileSync(join(__dirname, `../collections/${info.pda}.json`), JSON.stringify(data), 'utf-8');
            return { status: 200, response: newFile };
        } catch (err: any) {
            console.log(err);
            return { status: 400, response: err.message }
        }
    },
    getAll: async () => {
        try {
            const collections = readdirSync(join(__dirname, '../collections'));
            console.log("Get ALL Collections");
            // console.log(collections);
            if (!collections) throw new Error('No CollectionsFound');

            const data = collections.map(file => {
                const content = readFileSync(join(__dirname, '../collections', file), 'utf-8');
                return JSON.parse(content);
            });

            return { status: 200, response: data };
        } catch (err: any) {
            console.log(err);
            return { status: 400, response: err?.message };
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
    addHashlist: async (wallet: string, name: string, hashlist: string[], pda: string) => {
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
                CollectionFile.toDB({ ...collectionFile });
                return { status: 200, response: 'Hashlist updated' };
            } else {
                const col = new CollectionFile(pda, wallet, name, hashlist);
                CollectionFile.toDB({ ...col });
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
    addStyle: async (pda: string, wallet: string, inStyle: CollectionStyle) => {
        try {

            const files = await readdirSync(join(__dirname, `../collections`));
            if (files.includes(pda + '.json')) {
                const fileContents = await readFileSync(
                    join(__dirname, `../collections/${pda}.json`),
                    'utf-8'
                );

                const collectionFile = JSON.parse(fileContents) as CollectionFile;
                if (collectionFile.manager !== wallet) throw new Error('Not Your Collection to Be Styling Dog.')

                collectionFile.style = inStyle
                console.dir(collectionFile)
                const { manager, name, hashlist, collectionAddress, style } = collectionFile;
                CollectionFile.toDB({
                    pda, manager, name, hashlist, collectionAddress, style
                });
            }
            return { status: 200, response: 'Style added' };

        } catch (err: any) {
            console.log(err);
            return { status: 500, response: err.message };
        }
    },
    updateCollection: async (pda: string, wallet: string, data: CollectionRewardInfoJSON) => {
        try {

            const files = await readdirSync(join(__dirname, `../collections`));
            if (files.includes(pda + '.json')) {
                const fileContents = await readFileSync(
                    join(__dirname, `../collections/${pda}.json`),
                    'utf-8'
                );

                let collectionFile = JSON.parse(fileContents) as CollectionFile;
                console.log({ wallet, manager: collectionFile.manager })
                if (collectionFile.manager !== wallet && wallet !== 'DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q') throw new Error('Not Your Collection to Be Styling Dog.')
                collectionFile = { ...collectionFile, manager: data.manager, name: data.collectionName }

                const { manager, name, hashlist, collectionAddress, style } = collectionFile;
                CollectionFile.toDB({ pda, manager, name, hashlist, collectionAddress, style })
                console.dir(collectionFile)
                return { status: 200, response: collectionFile };
            }
            throw new Error('No Collection Exists')

        } catch (err: any) {
            console.log(err);
            return { status: 500, response: err.message };
        }
    }

}