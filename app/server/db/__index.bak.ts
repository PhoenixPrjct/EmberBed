import { hash } from "@project-serum/anchor/dist/cjs/utils/sha256"
import { PublicKey } from "@solana/web3.js"
import { response } from "express"
import { existsSync, mkdir, mkdirSync, readdirSync, readFileSync, unlink, writeFileSync } from "fs"
import path from "path"
type CollectionRecordInfo = {
    owner: string,
    name: string,
    collectionInfoPDA: PublicKey
    hashlist: string[],

}

type CollectionManagerRecord = {
    name: string,
    pda: PublicKey,
    hashList: string[],
}

interface CollectionRecord {
    id: string,
    info: {
        name: string,
        hashlist: string[],
        collectionInfoPDA: PublicKey,
    }

}

type CollectionRecordID = string;

type ManagerAcctInfo = {
    owner: string,
    collection?: CollectionRecord
}
interface ManagerAcct {
    id: string,
    owner: string,
    collections: CollectionRecord[]
}
class ManagerAcct {
    constructor(obj: { owner: string, collection?: CollectionRecord }) {
        // Assign a new UID to the object using the uuid module
        this.id = hash(obj.owner);

        this.owner = obj.owner;
        this.collections = obj.collection ? [obj.collection] : [] as CollectionRecord[];

    }
}

class CollectionRecord {
    constructor(obj: CollectionRecordInfo) {
        this.id = hash(obj.owner + obj.name)
        // this.owner = obj.owner;
        this.info = {
            name: obj.name,
            hashlist: obj.hashlist ? obj.hashlist : [],
            collectionInfoPDA: obj.collectionInfoPDA
        }

    }
}

const MANAGERPATH = path.join(__dirname, 'managers');
const COLLECTIONPATH = path.join(__dirname, 'collections');

const manager = {
    create: async (info: ManagerAcctInfo) => {
        try {
            console.log(`Creating ManagerAcct\n\n`)
            console.dir(info)
            const id = hash(info.owner)
            if (!existsSync(MANAGERPATH) || !existsSync(COLLECTIONPATH)) {
                mkdirSync(MANAGERPATH)
                mkdirSync(COLLECTIONPATH)
            }
            if (!existsSync(`${COLLECTIONPATH}/index.json`)) {
                writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify([]))
            }
            const data = readdirSync(MANAGERPATH)
            if (data.includes(id)) throw new Error(`ManagerAcct Exists\n\nID:\n${id}`)

            const account = new ManagerAcct({ owner: info.owner, collection: info.collection })
            mkdirSync(`${MANAGERPATH}/${account.id}`)
            console.log(`${MANAGERPATH}/${account.id}`)
            writeFileSync(`${MANAGERPATH}/${account.id}/info.json`, JSON.stringify(account))

            return { success: true, response: { owner: account.owner, id: account.id } };
        } catch (err) {
            console.error(err)
            return { success: false, response: err }
        }
    },
    get: {
        byOwner: async (owner: string) => {
            try {
                console.log(`Getting ManagerAcct\n\n`)
                const id = hash(owner);
                const accountString = readFileSync(`${MANAGERPATH}/${id}/info.json`, 'utf-8');
                console.log(accountString)
                const account = JSON.parse(accountString) as ManagerAcct;
                return { success: true, response: account }
            } catch (err) {
                console.error(err)
                return { success: false }
            }
        }
    },
    remove: {
        all: async (owner: string) => {
            try {

                const id = hash(owner)
                const data = readdirSync(path.join(__dirname, `./managers`))
                if (!data.includes(id)) throw new Error('ManagerAcct Not Found');
                unlink(path.join(__dirname, `managers/${id}/info.json`), (err) => {
                    if (err) throw new Error(err.message);
                })
                console.log(`Account for ${owner} has been deleted`)
                return { success: true, response: `Account for ${owner} has been deleted` }
            } catch (err) {
                console.error(err)
                return { success: false, response: err }
            }
        }

    }
}


function collectionsByOwner(owner: string) {
    try {
        console.log('Getting by Owner')
        const id = hash(owner)

        if (!existsSync(`${MANAGERPATH}/${id}`)) {
            console.log(`Manager Doesn't Exist`)
            throw new Error(`Manager Doesn't Exist`)
        }
        const dataString = readFileSync(`${MANAGERPATH}/${id}/info.json`, 'utf8')
        const { collections }: ManagerAcct = JSON.parse(dataString);
        collections.forEach(col => console.log(col.info.collectionInfoPDA))
        return collections
    } catch (err) {
        console.log(err)
        return null
    }
}

function getCollection(collection: string) {
    const { success, response } = collections.get.all();
    if (!success) return
    const list = response as CollectionRecord[]
    console.log("LIST:", list)
    const result = list.find(col => col.info.name == collection)
    return result
}
export const collections = {
    create: {
        new: async (info: CollectionRecordInfo) => {
            try {
                console.log('Creating New CollectionRecord')
                if (!existsSync(`${COLLECTIONPATH}`)) {
                    mkdirSync(`${COLLECTIONPATH}`)
                }
                if (!existsSync(`${MANAGERPATH}`)) {
                    mkdirSync(`${MANAGERPATH}`)
                }

                if (!existsSync(`${COLLECTIONPATH}/index.json`)) {
                    writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify({}))
                }
                const record = new CollectionRecord(info)
                const { id } = record
                const ownerID = hash(info.owner)
                console.log({ pubkey: info.owner, ID: ownerID })

                const managersList = readdirSync(`${MANAGERPATH}`)
                if (!managersList.includes(ownerID)) {
                    console.log(`Manager Doesn't Exist, Creating Now`)
                    const { success, response } = await manager.create({ owner: info.owner, collection: record })
                    return { success, response };
                }
                const managerString = readFileSync(`${MANAGERPATH}/${ownerID}/info.json`, "utf-8")

                const getManager = await manager.get.byOwner(info.owner);
                const managerObj = getManager.response

                const collectionRecord = managerObj?.collections.find((c: CollectionRecord) => c.id == record.id)
                console.log(`Manager Obj Record record:\n`, test)
                if (managerObj?.collections && !collectionRecord) {
                    console.log(`Collection not found in Manager List, Adding Now`)
                    const update = [...managerObj.collections, record];
                    console.log({ update })
                    managerObj.collections = [...update]
                    console.dir(managerObj)
                    writeFileSync(`${MANAGERPATH}/${ownerID}/info.json`, JSON.stringify(managerObj))
                }

                const colIndexString = readFileSync(`${COLLECTIONPATH}/index.json`, 'utf-8')

                const colIndexObj: CollectionRecord[] = colIndexString ? JSON.parse(colIndexString) : <CollectionRecord[]>[{}];
                console.log({ colIndexObj })
                if (!colIndexObj.find(collection => collection.id === id)) {
                    const colIndex = [...colIndexObj, record]
                    writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify(colIndex))
                    return { success: true, response: colIndex }
                }
                console.log(`Collection Already Exists, Try collection.update() instead`);
                return { success: true, response: colIndexObj }
            } catch (err) {
                console.error(err)
                return { success: false, response: err }
            }
        }
    },
    hashlist: {
        get: {
            byName: async (collection: string) => {
                const { success, response } = await collections.get.all();
                if (!success) return { success: false }
                const list = response as CollectionRecord[]
                const result = list.find(col => col.info.name == collection);
                const hashList = result?.info.hashlist
                return { success: true, response: hashList }

            },
            byId: async (collection: string) => {
                const { success, response } = await collections.get.all();
                if (!success) return { success: false }
                const list = response as CollectionRecord[]
                const result = list.find(col => col.id == collection);
                const hashList = result?.info.hashlist
                return { success: true, response: hashList }
            }
        }
    },
    update: {
        hashlist: {
            add: async (info: { owner: string, collection: string, tokens: string[] }) => {
                const managerID = hash(info.owner)
                let colID = info.collection
                let col = await (await collections.hashlist.get.byId(info.collection)).response
                if (!col) {
                    col = await (await collections.hashlist.get.byName(info.collection)).response
                    colID = hash(info.owner + info.collection)
                    if (!col) return { success: false }
                }

                const update = [...col, ...info.tokens]
                col = update
                const { response } = await collections.get.byOwner(info.owner)
                if (!response) return { success: false }
                const collectionEntry = response.collections?.find(c => c.name);
                if (!collectionEntry) return { success: false }
                collectionEntry.hashlist = update
                let collectionsList = response.collections?.filter(c => c.name !== info.collection)
                collectionsList?.push(collectionEntry)
                writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify(collectionsList));
                const managerAccount = await (await manager.get.byOwner(info.owner)).response
                if (!managerAccount) return
                const managerCollectionEntry = managerAccount.collections.find(c => c.id == colID)
                if (!managerCollectionEntry) return
                managerCollectionEntry.info.hashlist = update
                writeFileSync(`${MANAGERPATH}/${managerID}/info.json`, JSON.stringify(managerCollectionEntry));
                return { success: true, response: col }

            }
        }
    },
    get: {
        byOwner: async (owner: string) => {
            try {
                const collectionList = await collectionsByOwner(owner);
                const response = collectionList?.map(col => {
                    return col.info
                })
                return { success: true, response: { owner: owner, collections: response } }
            } catch (err) {
                console.log(err)
                return { success: false, err }
            }
        },
        pdas: {
            byOwner: async (owner: string) => {
                const collectionList = await collectionsByOwner(owner);
                const pdas: PublicKey[] = collectionList ?
                    collectionList.map(col => col.info.collectionInfoPDA) :
                    [] as PublicKey[]

                console.dir(pdas)
                return { success: true, response: pdas }
            }
        },
        pda: {
            byCollection: async (collection: string) => {
                const result = await getCollection(collection)
                console.log("RESULT:", result)
                const pda = result?.info.collectionInfoPDA
                return { success: true, response: pda }
            }

        },

        all: () => {
            try {
                console.log('Getting All Collections')
                const collectionsString = readFileSync(`${COLLECTIONPATH}/index.json`, 'utf-8');
                const collectionsObj: CollectionRecord[] = JSON.parse(collectionsString);
                return { success: true, response: collectionsObj }
            } catch (err) {
                console.log(err)
                return { success: false, err };
            }
        }
    }
}


const testhashList1 = ['TEST2-TOKEN1', 'TEST2-TOKEN2', 'TEST2-TOKEN3', 'TEST2-TOKEN4', 'TEST2-TOKEN5']
const testhashList2 = ["token1", "token2", "token3", "token4", "token5"]
// manager.create({ owner: "DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q" })
collections.create.new({ owner: "DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q", collectionInfoPDA: new PublicKey('8NjL5e57GxGyBTZ8z73Rpkz3WtysATShTdGMpuXibp5B'), hashlist: testhashList1, name: 'TEST2' })
collections.create.new({ owner: "DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q", collectionInfoPDA: new PublicKey('6dBSutTgSvug6S97U8mKFpMfqFZeUR2qGZwKQfc2AZcg'), hashlist: testhashList2, name: 'TestEyes' })
// async function test() {
//     const res = await collections.update.hashlist.add({ owner: 'DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q', collection: 'TestEyes', tokens: testhashList })
//     console.dir(res ? res : 'No Info')
//     //     // const { response } = await collections.get.pdas.byOwner('DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q');
//     //     const { response } = await collections.get.hashlist.byCollection('TestEyes');
//     //     console.log(response);
// }

// test();