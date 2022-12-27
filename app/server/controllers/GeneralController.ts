import { readdirSync, readFileSync } from "fs";
import path from "path";

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
                // Read the contents of the file
                const fileContents = await readFileSync(path.join(__dirname, `../collections/${hashListfile}`), 'utf-8')
                // Parse the file contents into a JavaScript object
                const hashlist = JSON.parse(fileContents).hashlist
                const hashListObj = { [currentFile]: [...hashlist] }
                // Add the hashlist from this file to the combined hashlist
                combinedHashlist = [...combinedHashlist, hashListObj]
                // Search for the string in the combined hashlist
                combinedHashlist.map((collection, i) => {
                    if (collection[currentFile].includes(tokenMint)) {
                        file = currentFile;
                    }
                })
            }

            return { status: 200, response: file };
        } catch (err: any) {
            console.log(err)
            return err
        }
    }
}