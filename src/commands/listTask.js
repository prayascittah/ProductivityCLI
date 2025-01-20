import { promises as fs } from 'fs';
import Table from 'cli-table3';
import Chalk from 'chalk';
import readline from 'readline';
import { listsort } from '../utils/listSorter.js';
import { filechecker } from '../utils/fileHelper.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export async function listTask() {
    try {
        await filechecker(); // ensure the existence of file
        let data = await fs.readFile(filePath, 'utf-8');
        let list = JSON.parse(data);
        if (!list) console.log("Empty list accessed.")
        else {
            await listsort(list);
            list = JSON.parse(data);
            // For the completed task and the non completed task
            let nonCompletedTasks = list.filter(task => !task.completionStatus);
            let grouptask = {
                morning: [],
                evening: [],
                night: [],
            };
            
            // Group non-completed tasks by `timeOfDay`
            for (let t of nonCompletedTasks) {
                grouptask[t.timeOfDay.toLowerCase()].push(t);
            }

            // Group completed tasks by `timeOfDay`
            let completedTasks = list.filter(task => task.completionStatus);
            for (let t of completedTasks) {
                grouptask[t.timeOfDay.toLowerCase()].push(t);
            }
            
            // Create a table
            let table = new Table({ 
                colWidths: [15, 30, 20],
                style: { 
                    head: [], 
                    border: [] 
                }
            });
            table.push([{colSpan: 3, content: Chalk.bgHex('#7209b7')('TODO - List'), hAlign: 'center'}]);
            table.push([ 
                { content: Chalk.hex('#E16E22')('taskid'), hAlign: 'center' },
                { content: Chalk.hex('#E16E22')('taskName'), hAlign: 'center' },
                { content: Chalk.hex('#E16E22')('timeRequired'), hAlign: 'center' }
            ]);
            
            
            // Add non-completed tasks (green for pending)
            for (let timeOfDay in grouptask) {
                if (grouptask[timeOfDay].length > 0) {
                    // Add heading row for the time of day
                    table.push([{ colSpan: 3, content: Chalk.bgHex('#16C6D0').hex('#000000')(timeOfDay.toUpperCase())}]);
                    
                    // Add tasks under the heading
                    for (let t of grouptask[timeOfDay]) {
                        if (t.completionStatus === false) {
                            table.push([
                                { content: Chalk.hex('#5DD358')(t.taskid), hAlign: 'center' },
                                { content: Chalk.hex('#5DD358')(t.taskName), hAlign: 'center' },
                                { content: Chalk.hex('#adb5bd')(`${t.totalMinutes} minutes`), hAlign: 'center' }
                            ]);
                        }
                        else {
                            table.push([
                                { content: Chalk.hex('#5DD358')(t.taskid), hAlign: 'center' },
                                { content: Chalk.strikethrough.hex('#f21b3f')(t.taskName), hAlign: 'center' },
                                { content: Chalk.strikethrough.hex('#adb5bd')(`${t.totalMinutes} minutes`), hAlign: 'center' }
                            ]);
                        }
                        
                    }
                }
            }
            console.log(table.toString());
            rl.close();
        }
    }
    catch (err) {
        console.log('Error :', err)
    }
}