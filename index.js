import path from 'path'
import { existsSync, statSync } from 'fs'
import { copyFile } from 'node:fs/promises'

const validateArgs = (sourcePath, destDir) => {
    return new Promise((resolve, reject) => {
        if (!sourcePath || !destDir) {
            console.error('Usage: move <sourcePath> <destDir>')
            reject('Invalid arguments')
        }
        sourcePath = path.resolve(sourcePath)
        destDir = path.resolve(destDir)

        let sourceStats = statSync(sourcePath)
        let destStats = statSync(destDir)

        // Check if sourcePath is a valid path
        if (!existsSync(sourcePath) || !existsSync(destDir)) {
            console.error(`Error: ${sourcePath} is not a valid path`)
            reject('Invalid sourcePath')
        }

        // Check if destDir is a valid directory
        if (sourceStats.isDirectory() || !destStats.isDirectory()) {
            console.error(`Error: must copy a file to a folder`)
            reject('Invalid destDir')
        }

        resolve({ sourcePath, destDir })
    })
}

export default validateArgs