type Collection = {
    name: string;
    nfts: string[];
}


let collections = <Collection[]>[{ name: 'test', nfts: ['test1', 'test2', 'test3'] }];


function storeCollectionAddresses(collectionName: string, addressList: string[]) {
    if (addressList.length == 0) {
        return;
    }
    let colxns = collections.map((i: Collection) => { return i.name });

    if (colxns.includes(collectionName))


}