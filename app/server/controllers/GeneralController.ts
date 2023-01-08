import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { PhoenixRelationKind } from "src/types";

export const GC = {
    getRelations: async () => {
        try {
            const relations = await readFileSync(path.join(__dirname, '../data/Relations.json'), 'utf-8');
            return {
                status: 200, response: JSON.parse(relations)
            }
        } catch (e) {
            console.log(e)
            return { status: 500, e }
        }
    },
    searchForNftCollection: async (tokenMint: string): Promise<{ status: number, response: string | false }> => {
        try {  // Get a list of all the hashlist files
            const hashlistFiles = await readdirSync(path.join(__dirname, `../collections`))
            let file: string | boolean = false;
            // Combine the contents of all the hashlist files into a single array
            let combinedHashlist: { [file: string]: string[] }[] = []
            for (const hashListfile of hashlistFiles) {
                // Store the current file name
                const currentFile = hashListfile.split('.')[0]
                // console.log(currentFile)
                // Read the contents of the file
                const fileContents = await readFileSync(path.join(__dirname, `../collections/${hashListfile}`), 'utf-8')
                // Parse the file contents into a JavaScript object
                const hashlist = JSON.parse(fileContents).hashlist
                const hashListObj = { [currentFile]: [...hashlist] }
                // Add the hashlist from this file to the combined hashlist
                combinedHashlist = [...combinedHashlist, hashListObj]
                // Search for the string in the combined hashlist
                combinedHashlist.map((collection, i) => {
                    if (collection[currentFile]?.includes(tokenMint)) {
                        file = currentFile
                    }
                })
            }

            return { status: 200, response: file };
        } catch (err: any) {
            console.log(err)
            return err
        }
    },
    updateRelations: async (data: { auth: string, relationship: PhoenixRelationKind['kind'], address: string }) => {
        try {
            console.log(data.auth)
            const { relationship, auth, address } = data
            if (data.auth !== process.env.SERVER_AUTH) throw new Error('Authentication Failed')
            const relations = await readFileSync(path.join(__dirname, '../data/Relations.json'), 'utf-8');
            const relationObj = JSON.parse(relations)

            // Check if the address is already in any category
            let found = false;
            Object.keys(relationObj).forEach((key) => {
                if (relationObj[key].includes(address)) {
                    console.log(key)
                    // Remove the address from the category if it exists
                    relationObj[key] = relationObj[key].filter((a: string) => a !== address);
                }
            });


            // Add the address to the specified category
            relationObj[relationship] = [...relationObj[relationship], address];

            // Save the updated relations object to the file
            await writeFileSync(path.join(__dirname, '../data/Relations.json'), JSON.stringify(relationObj));

            return { status: 200, response: relationObj };

        } catch (e: any) {
            console.log(e)
            return { status: 500, response: e.message }
        }
    }
}