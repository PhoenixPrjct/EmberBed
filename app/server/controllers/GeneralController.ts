import { readFileSync } from "fs";
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
    }
}