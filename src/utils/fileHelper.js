import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);
export async function filechecker () {
    try {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
    }
    catch (err) {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
    }
}

export async function getNextId() {
    try {
        await filechecker(); // ensure the existence of file
        let data = await fs.readFile(filePath, 'utf-8');
        let list = JSON.parse(data);
        
        // If list is empty, start with id 1
        if (list.length === 0) return 1;

        // Find the highest existing id and increment it by 1
        const maxId = Math.max(...list.map(i => i.id));
        return maxId + 1;
    } 
    catch (err) {
        console.log('Err: ', err);
    }
}
