import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const filePath = path.resolve(process.env.FILE_PATH);
const configPath = path.resolve(process.env.CONFIG_PATH);

export async function listsort(list) {
    // Read the config
    const configData = await fs.readFile(configPath, 'utf-8');
    let config = await JSON.parse(configData);
    
    // sorting protocol
    const timeOrder = {
        'morning': 0,
        'evening': 1,
        'night': 2,
    };
    
    list.sort((a, b) => {
        const t1 = timeOrder[a.timeOfDay.toLowerCase()] - timeOrder[b.timeOfDay.toLowerCase()];
        if (t1 !== 0) return t1;

        if (config.timesort === false) {
            if (a.totalMinutes !== b.totalMinutes) {
                return b.totalMinutes - a.totalMinutes;
            }
        }
        else {
            if (a.totalMinutes !== b.totalMinutes) {
                return a.totalMinutes - b.totalMinutes;
            }
        }
        
        // If both timeOfDay and timeRequired are the same, compare based on taskName alphabetically
        if (config.alphasort === true) {
            return a.taskName.localeCompare(b.taskName);
        }
        else {
            return b.taskName.localeCompare(a.taskName); 
        }
    })

    // write it back to the json
    await fs.writeFile(filePath, JSON.stringify(list, null, 2));
}
