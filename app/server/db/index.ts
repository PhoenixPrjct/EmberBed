import { createAuctionHouseOperationHandler } from "@metaplex-foundation/js"
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
        owner: string,
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
        this.info = {
            name: obj.name,
            hashlist: obj.hashlist ? obj.hashlist : [],
            collectionInfoPDA: obj.collectionInfoPDA,
            owner: obj.owner,
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
            if (existsSync(`${MANAGERPATH}/${id}/info.json`)) throw new Error(`ManagerAcct Exists\n\nID:\n${id}`)

            const account = new ManagerAcct({ owner: info.owner, collection: info.collection })
            mkdirSync(`${MANAGERPATH}/${account.id}`)
            console.log(`${MANAGERPATH}/${account.id}`)
            writeFileSync(`${MANAGERPATH}/${account.id}/info.json`, JSON.stringify(account))

            return { success: true, response: { account: account, owner: account.owner, id: account.id } };
        } catch (err) {
            console.error(err)
            return { success: false, err }
        }
    },
    get: {
        byOwner: async (owner: string) => {
            try {
                console.log(`Getting ManagerAcct\n\n`)
                const id = hash(owner);
                const accountString = readFileSync(`${MANAGERPATH}/${id}/info.json`, 'utf-8');
                console.log(accountString)
                let account = JSON.parse(accountString) as ManagerAcct || null
                !account ? await (await manager.create({ owner: owner })).response : <ManagerAcct>{}
                console.log('Manager acct', account)
                return { success: true, response: account }
            } catch (err) {
                console.error(err)
                return { success: false, err }
            }
        }
    },
    remove: {
        all: async (owner: string) => {
            try {

                const id = hash(owner)
                const data = readdirSync(`${MANAGERPATH}`);
                if (!data.includes(id)) throw new Error('ManagerAcct Not Found');
                unlink(`${MANAGERPATH}/${id}/info.json`, (err) => {
                    if (err) throw new Error(err.message);
                })
                console.log(`Account for ${owner} has been deleted`)
                return { success: true, response: `Account for ${owner} has been deleted` }
            } catch (err) {
                console.error(err)
                return { success: false, response: err }
            }
        }

    },
    sync: {
        collections: async (owner: string, record?: CollectionRecord) => {
            try {
                console.log('Syncing Collections')
                const id = hash(owner)
                console.log(`Syncing Collections\n\n`)
                if (!existsSync(`${MANAGERPATH}/${id}/info.json`)) {
                    console.log(`Creating ManagerAcct\n\n`)
                    const newAcct = await manager.create({ owner: owner, collection: record })
                    return { success: true, response: newAcct }
                }
                const ownerCollections = await collections.get.byOwner(owner)// await (await collections.get.byOwner(owner)).response || <CollectionRecord[]>[]
                console.log({ ownerCollections })
                const { response } = await manager.get.byOwner(owner);
                if (!response) throw new Error(`ManagerAcct Doesn't Exist`)
                response.collections = ownerCollections || <CollectionRecord[]>[]

                writeFileSync(`${MANAGERPATH}/${id}/info.json`, JSON.stringify(response), 'utf8')

                return { success: true, response: response }
            } catch (err) {
                console.error(err)
                return { success: false, err }
            }
        }
    }
}


export const collections = {
    create: async (info: CollectionRecordInfo) => {
        try {
            console.log('Creating New CollectionRecord')
            //    Makes sure root directories exist 
            if (!existsSync(`${COLLECTIONPATH}`)) {
                mkdirSync(`${COLLECTIONPATH}`)
            }
            if (!existsSync(`${MANAGERPATH}`)) {
                mkdirSync(`${MANAGERPATH}`, { recursive: true })
            }
            // Creates Collections/index.json if it doesn't exist
            if (!existsSync(`${COLLECTIONPATH}/index.json`)) {
                writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify(<CollectionRecord[]>[]))
            }
            const record = new CollectionRecord(info)
            console.log(record.info.owner)
            const { id } = record


            let colIndexObj: CollectionRecord[] = []
            colIndexObj = await collections.get.all()?.response || <CollectionRecord[]>[{}]
            // colIndexString ? JSON.parse(colIndexString) : <CollectionRecord[]>[{}];
            console.log({ colIndexObj })
            if (!colIndexObj.find(collection => collection.id === id)) {
                const colIndex = [...colIndexObj, record]
                writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify(colIndex))
                await manager.sync.collections(info.owner)
                return { success: true, response: colIndex }
            }
            await manager.sync.collections(info.owner)
            console.log(`Collection Already Exists, Try collection.update() instead`);
            return { success: true, response: colIndexObj }
        } catch (err) {
            console.error(err)
            return { success: false, response: err }
        }

    },
    update: {
        hashlist: {
            add: async (info: { owner: string, tokens: string[], collectionID?: string, collectionName?: string }) => {
                const managerID = hash(info.owner)
                let colID = info?.collectionID
                if (!colID) {
                    colID = hash(info.owner + info.collectionName)
                }
                const { response } = await collections.get.byId(colID)
                if (!response) {
                    throw new Error(`No Collection Found`)
                }
                //  updating the entry in collections/index.json
                const oldCollections = await collections.get.all().response || <CollectionRecord[]>[]
                const dbEntry = oldCollections?.find(c => c.id == response.id)
                console.log({ dbEntry })
                if (!dbEntry) {
                    throw new Error(`No Collection Found`)
                }
                dbEntry.info.hashlist = [...dbEntry.info.hashlist, ...info.tokens]
                const newCollections = [...oldCollections.filter(c => c.id !== response.id), dbEntry]
                writeFileSync(`${COLLECTIONPATH}/index.json`, JSON.stringify(newCollections));
                await manager.sync.collections(info.owner)
                return { success: true, response: newCollections }
            }
        }
    },
    get: {
        hashlist: {
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
        },
        byOwner: async (owner: string) => {
            try {
                console.log('Getting by Owner')
                const id = hash(owner)

                if (!existsSync(`${MANAGERPATH}/${id}`)) {
                    console.log(`Manager Doesn't Exist`)
                    throw new Error(`Manager Doesn't Exist`)
                }
                const dataString = readFileSync(`${COLLECTIONPATH}/index.json`, 'utf8')
                const dataObj: CollectionRecord[] = JSON.parse(dataString);
                const ownerCollections = dataObj.filter(col => col.info.owner == owner)
                console.log("Collections", ownerCollections)
                ownerCollections.forEach(col => console.log(col.info.collectionInfoPDA))
                return ownerCollections
            } catch (err) {
                console.log(err)
                return null
            }
        },
        byId: async (id: string) => {
            try {
                const collectionList = await collections.get.all().response;
                const response = collectionList?.find(col => col.id == id) || <CollectionRecord>{}
                return { success: true, response: response }
            } catch (err) {
                console.log(err)
                return { success: false, err }
            }
        },
        byName: async (name: string) => {
            const { success, response } = collections.get.all();
            if (!success) return
            const list = response as CollectionRecord[]
            console.log("LIST:", list)
            const result = list.find(col => col.info.name == name)
            return result
        },
        pdas: {
            byOwner: async (owner: string) => {
                const collectionList = await collections.get.byOwner(owner);
                const pdas: PublicKey[] = collectionList ?
                    collectionList.map(col => col.info.collectionInfoPDA) :
                    [] as PublicKey[]

                console.dir(pdas)
                return { success: true, response: pdas }
            }
        },
        pda: {
            byCollection: async (collection: string) => {
                const result = await collections.get.byName(collection)
                console.log("RESULT:", result)
                const pda = result?.info.collectionInfoPDA
                return { success: true, response: pda }
            }

        },

        all: () => {
            try {
                console.log('Getting All Collections')
                const collectionsString = readFileSync(`${COLLECTIONPATH}/index.json`, 'utf-8');
                const collectionsObj: CollectionRecord[] = JSON.parse(collectionsString) || [{}] as CollectionRecord[]
                return { success: true, response: collectionsObj }
            } catch (err) {
                console.log(err)
                return { success: false, err };
            }
        }
    }
}


const testHashList1 = ['TEST2-TOKEN1', 'TEST2-TOKEN2', 'TEST2-TOKEN3', 'TEST2-TOKEN4', 'TEST2-TOKEN5']
const testHashList2 = ["token1", "token2", "token3", "token4", "token5"]
const testHashListAddition = ["AddedToken1", "AddedToken2"]
async function test() {
    // await manager.create({ owner: "DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q" })
    // await collections.create({ owner: "DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q", collectionInfoPDA: new PublicKey('8NjL5e57GxGyBTZ8z73Rpkz3WtysATShTdGMpuXibp5B'), hashlist: testHashList1, name: 'TEST2' })
    await collections.create({ owner: "DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q", collectionInfoPDA: new PublicKey('6dBSutTgSvug6S97U8mKFpMfqFZeUR2qGZwKQfc2AZcg'), hashlist: testHashList2, name: 'TestEyes' })
    // const res = await manager.sync.collections("DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q")
    const res = await collections.update.hashlist.add({ owner: 'DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q', collectionName: 'TestEyes', tokens: testHashListAddition })
    console.dir(res ? res : 'No Info')
    //     //     // const { response } = await collections.get.pdas.byOwner('DwK72SPFqZfPvnoUThk2BAjPxBMeDa2aPT7k8FAyCz8q');
    //     //     const { response } = await collections.get.hashlist.byCollection('TestEyes');
    //     //     console.log(response);
}

test();