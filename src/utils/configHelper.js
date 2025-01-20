import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const filePath = path.resolve(process.env.FILE_PATH);
const configPath = path.resolve(process.env.CONFIG_PATH);

export async function writeConfig(config) {
    try {
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    } catch (err) {
        console.error("Error writing config file:", err);
    }
}

