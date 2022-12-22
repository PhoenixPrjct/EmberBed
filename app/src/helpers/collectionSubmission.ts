import { CollectionRewardInfoJSON, CollectionRewardInfo } from "src/types";

export async function validateCollectionInfo(
    collectionInfo: CollectionRewardInfoJSON
) {
    try {
        const info: CollectionRewardInfo = await CollectionRewardInfo.fromJSON(collectionInfo)
        return { success: true, info: info }
    } catch (err: any) {
        return { success: false, err: err.message };
    }
}

// export function validateCollectionInfo(collectionInfo: CollectionRewardInfoJSON): ValidInfoSuccess | <{ Error: any }> {
//     try {
//         return { success: true, info: CollectionRewardInfo.fromJSON(collectionInfo) };
//     } catch (err: any) {
//         return { Error: err.message }
//     }
// }