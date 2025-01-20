// import { promises as fs } from 'fs';
import { Command } from 'commander';
// import inquirer from 'inquirer';
// import figlet from 'figlet';
import readline from 'readline';


import { addTask } from './commands/addTask.js';
import { deleteTask } from './commands/deleteTask.js';
import { listTask } from './commands/listTask.js';
import { finishTask } from './commands/finishTask.js';
import { updateTask } from './commands/updateTask.js';
import { panel } from './commands/panel.js';
import { sortTasks } from './commands/sortTasks.js';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const program = new Command();

program
    .name('CliTodo')
    .usage('<options> command')
    .description('A CLI productivity tracker')
    .version('0.0.1', '-v, --version', 'display current version of command')
    .helpOption('-h, --help', 'display help for command');

program
    .command('add <taskName> <timeRequired> <timeOfDay>')
    .description('Add a new task')
    .action(addTask);

program
    .command('remove <taskid> <taskName>')
    .description('Remove a task')
    .action(deleteTask);

program
    .command('markdone <taskid> <taskName>')
    .description('check-off task from list')
    .action(finishTask);

program
    .command('update <taskid> <taskName>')
    .description('Update a task')
    .action(updateTask);

program
    .command('sortby')
    .description('Sort tasks by either alphabetical order | time')
    .option('-a, --alphabet <boolean>', 'Sort tasks alphabetically')
    .option('-t, --time <boolean>', 'Sort tasks by time')
    .action(sortTasks);

program
    .command('all')
    .description('List all tasks')
    .action(listTask);

program
    .command('clipanel')
    .description('Interactive CLI panel')
    .action(panel);

program.parse(process.argv);
