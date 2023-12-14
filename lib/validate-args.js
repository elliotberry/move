import path from 'path'
import { stat } from 'node:fs/promises'
import exists from './exists.js'


const tryResolution = async (sourcePath, destDir) => {
    try {
        sourcePath = path.resolve(sourcePath)
        destDir = path.resolve(destDir)
        return [sourcePath, destDir]
    }
    catch (err) {
        throw new Error('Invalid path[s]')
    }
}

export const validateArgs = async (sourcePath, destDir, overwriteHandling) => {
    let possibleOverwriteValues = ['auto', 'prompt', 'skip', 'overwrite']
    if (!possibleOverwriteValues.includes(overwriteHandling)) {
        throw new Error('Invalid overwrite value')
    }
    if (!sourcePath || !destDir) {
        throw new Error(`Invalid arguments: source and dest needed`)
    }
   
    let [source, dest] = await tryResolution(sourcePath, destDir)
    let sourceStats = await stat(source)
    let destStats = await stat(dest)

    // Check if sourcePath is a valid path
    if (!(await exists(sourcePath)) || !(await exists(destDir))) {
        throw new Error('non-existent sourcePath or destdir')
    }

    // Check if destDir is a valid directory
    if (sourceStats.isDirectory() || !destStats.isDirectory()) {
        throw new Error('invalid path or dir')
    }

    return { sourcePath, destDir }
}
