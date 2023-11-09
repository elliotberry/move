import path from 'path';
import { stat } from 'node:fs/promises'
import exists from './exists.js'
export const validateArgs = async (sourcePath, destDir) => {

        if (!sourcePath || !destDir) {
            console.error('Usage: move <sourcePath> <destDir>');
            throw new Error('Invalid arguments');
        }
        sourcePath = path.resolve(sourcePath);
        destDir = path.resolve(destDir);

        let sourceStats = await stat(sourcePath);
        let destStats = stat(destDir);

        // Check if sourcePath is a valid path
        if (!await exists(sourcePath) || !await exists(destDir)) {
            console.error(`Error: ${sourcePath} is not a valid path`);
            throw new Error('Invalid sourcePath');
        }

        // Check if destDir is a valid directory
        if (sourceStats.isDirectory() || !destStats.isDirectory()) {
            console.error(`Error: must copy a file to a folder`);
            throw new Error('Invalid destDir');
        }

        return { sourcePath, destDir }
   
};
