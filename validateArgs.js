import path from 'path';
import { stat } from 'node:fs/promises'
import exists from './exists.js'

export const validateArgs = async (sourcePath, destDir) => {

        if (!sourcePath || !destDir) {
       
            throw new Error('Invalid arguments: no arg 1 or arg 2; both needed');
        }
        sourcePath = path.resolve(sourcePath);
        destDir = path.resolve(destDir);

        let sourceStats = await stat(sourcePath);
        let destStats = await stat(destDir);

        // Check if sourcePath is a valid path
        if (!await exists(sourcePath) || !await exists(destDir)) {
            throw new Error('non-existent sourcePath or destdir');
        }

        // Check if destDir is a valid directory
        if (sourceStats.isDirectory() || !destStats.isDirectory()) {
        
            throw new Error('invalid path or dir');
        }

        return { sourcePath, destDir }
   
};
