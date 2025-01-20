import { promises as fs } from 'fs';
import readline from 'readline';
import { listsort } from '../utils/listSorter.js';
import { writeConfig } from '../utils/configHelper.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);
const configpath = path.resolve(process.env.CONFIG_PATH);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


export async function sortTasks(cmd) {
    try {
        // Read the existing config file and parse it into an object
        let configData = await fs.readFile(configpath, 'utf-8');
        let configjj = JSON.parse(configData);

        // Update values based on user input or defaults
        if (cmd.alphabet !== undefined) {
            configjj.alphasort = (cmd.alphabet === 'true');
        }
        if (cmd.time !== undefined) {
            configjj.timesort = (cmd.time === 'true');
        }

        // Write updated config back to the config file
        await writeConfig(configjj);

        // Sorting logic based on updated preferences
        let data = await fs.readFile(filePath, 'utf-8');
        let list = await JSON.parse(data);

        await listsort(list);
        console.log("Sorting Function Updated!");
        rl.close();

    } catch (err) {
        console.log('Error:', err);
    }
}