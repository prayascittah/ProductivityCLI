import { promises as fs } from 'fs';
import readline from 'readline';
import { listsort } from '../utils/listSorter.js';
import { filechecker, getNextId } from '../utils/fileHelper.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

export async function addTask(taskName, timeRequired, timeOfDay) {
    try {
        // ensure the existence of file
        await filechecker();
        let data = await fs.readFile(filePath, 'utf-8');

        // Update the list
        if (!data || data.trim() === '') data = '[]';
        const list = JSON.parse(data);

        const [hours, minutes] = timeRequired.split(':').map(Number);
        const totalMinutes = (hours * 60) + minutes;


        let completionStatus = false;
        const id = await getNextId();
        const taskid = '##' + taskName.charAt(0).toUpperCase() + '00' + id.toString();
        const newTask = { taskName, totalMinutes, timeOfDay, completionStatus, id, taskid };
        list.push(newTask);

        // sort and write it back
        console.log("Added said task");
        await listsort(list);
        rl.close();
    }
    catch (err) {
        console.log('Error :', err);
    }
}
