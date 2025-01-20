import { promises as fs } from 'fs';
import readline from 'readline';
import { filechecker } from '../utils/fileHelper.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export async function finishTask(taskid, taskName) {
    try {
        await filechecker(); // ensure the existence of file
        let data = await fs.readFile(filePath, 'utf-8');

        // Update the list
        if (!data) {
            console.log('List is already empty!');
        }
        else {
            const list = JSON.parse(data);
            let flag = false;
            for(let i = 0; i < list.length; ++i) {
                if (list[i].taskName === taskName &&
                    list[i].taskid === taskid) {
                    list[i].completionStatus = true;
                    flag = true;
                    break;
                }
            }
            if (flag) {
                console.log("Updated said task");
                // write it back to the json
                await fs.writeFile(filePath, JSON.stringify(list, null, 2));
            }
            else console.log("No such task exist.")
            rl.close()
        }
    }
    catch (err) {
        console.log('Err :', err);
    }
}