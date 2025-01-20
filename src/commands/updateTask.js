import { promises as fs } from 'fs';
import readline from 'readline';
import { listsort } from '../utils/listSorter.js';
import { filechecker } from '../utils/fileHelper.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const filePath = path.resolve(process.env.FILE_PATH);

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export async function updateTask(taskid, taskName) {
    try {
        // ensure the existence of file
        await filechecker(); 
        let data = await fs.readFile(filePath, 'utf-8');
        const list = JSON.parse(data);

        // Find the task to update
        let taskIndex = -1;
        for (let i = 0; i < list.length; ++i) {
            if (list[i].taskName === taskName 
                && list[i].taskid === taskid ) {
                taskIndex = i;
                break;
            }
        }

        if (taskIndex === -1) {
            console.log("Task not found!");
            return;
        }

        const task = list[taskIndex];
        // Show current details
        console.log("Current task details:", task);

        // Ask user what to update
        rl.question('Update detail? (timeRequired / timeOfDay / taskName / completionStatus): ', (field) => {
            if (field.toLowerCase() === 'timerequired') {
                rl.question('New timeRequired (hh:mm): ', async (newTime) => {
                    const [hours, minutes] = newTime.split(':').map(Number);
                    if (isNaN(hours) || isNaN(minutes)) {
                        console.log("Invalid time format. Please enter in hh:mm format.");
                        rl.close();
                        return;
                    }
                    task.totalMinutes = (hours * 60) + minutes;
                    console.log("Updated task!");

                    // Sort the list and write it back to the JSON file
                    await listsort(list);
                    console.log("Task updated successfully!");
                    rl.close();
                });
            } 
            else if (field.toLowerCase() === 'timeofday') {
                rl.question('New timeOfDay (morning / evening / night): ', async (newTimeOfDay) => {
                    const validTimesOfDay = ['morning', 'evening', 'night'];
                    if (!validTimesOfDay.includes(newTimeOfDay.toLowerCase())) {
                        console.log("Invalid timeOfDay. Please choose from morning, evening, or night.");
                        rl.close();
                        return;
                    }
                    task.timeOfDay = newTimeOfDay; // Update the timeOfDay
                    console.log("Updated task!");

                    // Sort the list and write it back to the JSON file
                    await listsort(list);
                    console.log("Task updated successfully!");
                    rl.close();
                });
            } 
            else if (field.toLowerCase() === 'taskname') {
                rl.question('New taskName: ', async (newTaskName) => {
                    // Validate the taskName input (optional)
                    if (!newTaskName.trim()) {
                        console.log("Task name cannot be empty.");
                        rl.close();
                        return;
                    }

                    task.taskName = newTaskName.trim(); // Update the taskName
                    console.log("Updated task!");

                    // Sort the list and write it back to the JSON file
                    await listsort(list);
                    console.log("Task updated successfully!");
                    rl.close();
                });
            } 
            else if (field.toLowerCase() === 'completionstatus') {
                task.completionStatus = !task.completionStatus; // Toggle completionStatus
                console.log("Updated task!");

                // Sort the list and write it back to the JSON file
                listsort(list);
                console.log("Task updated successfully!");
                rl.close();
            } 
            else {
                console.log("Invalid data choice!");
                rl.close();
            }
        });
    } catch (err) {
        console.log('Error:', err);
        rl.close();
    }
}
