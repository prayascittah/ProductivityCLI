import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import Chalk from 'chalk';
import figlet from 'figlet';
import readline from 'readline';
import { listTask } from '../commands/listTask.js';
import { filechecker } from '../utils/fileHelper.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

export async function panel() {
    try {
         // Ensure the file exists
        await filechecker();
        // Prompt user to select tasks to change their completion status
        const data = await fs.readFile(filePath, 'utf-8');
        const list = JSON.parse(data || '[]');

        // show the list
        await listTask();

        if (!list) {
            console.log("Empty list accessed.")
            return;
        }

        // Split tasks into completed and not completed
        const incompleteTasks = list.filter(i => i.completionStatus == false);
        const completeTasks = list.filter(i => i.completionStatus == true);

        // Display grouped tasks to the user
        const { changeStatus } = await inquirer.prompt([
            {
                type: 'list',
                name: 'changeStatus',
                message: 'What would you like to do?',
                choices: ['Red to Green', 'Green to Red', 'Exit'],
            }
        ]);

        let selectedTaskIds;
        // Move incomplete tasks to complete
        if (changeStatus.toLowerCase() === 'red to green') {
            selectedTaskIds = await selectTasks(completeTasks, 'Mark as Incomplete');
        }

        // Move complete tasks to incomplete
        else if (changeStatus.toLowerCase() === 'green to red') {
            selectedTaskIds = await selectTasks(incompleteTasks, 'Mark as Complete');
        }

        // Exit the process
        else {
            console.log(Chalk.green('No changes made.'));
            return;
        }

        // Update task completion status based on user input
        for (let i = 0; i < list.length; i++) {
            if (selectedTaskIds.includes(list[i].id)) {
                list[i].completionStatus = !list[i].completionStatus;
            }
        }
        
        // update the json file
        await fs.writeFile(filePath, JSON.stringify(list, null, 2));

        // Show updating message with ASCII art
        console.log(Chalk.yellow('\nUpdating list...'));
        console.log(figlet.textSync('Updating List!', { font: 'Big' }));

        // Final updated list
        await listTask();
        rl.close();
    }
    catch (err) {
        console.log('Err :', err);
    }
}

async function selectTasks(taskList, actionMessage) {
    const { selectedTaskIds } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedTaskIds',
            message: `Select tasks to ${actionMessage}:`,
            choices: taskList.map((task) => ({
                name: task.taskName,
                value: task.id
            })),
        }
    ]);
    return selectedTaskIds;
}