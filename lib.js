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

const destPathFactory = (name, ext, destDir, count = 0) => {
    return path.join(destDir, `${name}${count === 0 ? '' : `--${count}`}${ext}`)
}

const recursiveMove = (fileName, destDir) => {
    return new Promise((resolve, reject) => {
        let name = path.parse(fileName).name
        let ext = path.extname(fileName)
        let count = 0
        let destPath = destPathFactory(name, ext, destDir, count)
        while (existsSync(destPath)) {
            count++
            destPath = destPathFactory(name, ext, destDir, count)
        }
        resolve(destPath)
    })
}

const moveFile = async (sourcePath, destDir) => {
    try {
        const fileName = path.basename(sourcePath)
        let destPath = await recursiveMove(fileName, destDir)

        await copyFile(sourcePath, destPath)

        return { src: sourcePath, dest: destPath }
    } catch(err) {
        console.error(`The file could not be copied: ${err}`)
    }
}

const main = async (sourcePath, destDir) => {
    try {
        await validateArgs(sourcePath, destDir)
        let src = path.resolve(sourcePath)
        let dest = path.resolve(destDir)

    

        let res = await moveFile(src, dest)
      
       return res
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
export default main
