import path from 'path'
import { existsSync, statSync } from 'fs'
import { copyFile } from 'node:fs/promises'
import validateArgs from './index.js'
import PromptSync from 'prompt-sync'
let promptSync = PromptSync()
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

const moveFile = async (sourcePath, destDir, dryrun, prompt) => {
    try {
        const fileName = path.basename(sourcePath)
        let destPath = await recursiveMove(fileName, destDir)
        if (prompt) {
            let answer = promptSync(`Move ${sourcePath} to ${destPath}? (y/n) `)
            if (answer.toLowerCase() !== 'y') {
                console.log('Aborting move')
                process.exit(0)
            }
            
        }
        if (dryrun) {
            console.log(`Dry run: ${sourcePath} ==> ${destPath}`)
            return { src: sourcePath, dest: destPath }
        }

        await copyFile(sourcePath, destPath)

        return { src: sourcePath, dest: destPath }
    } catch (err) {
        console.error(`The file could not be copied: ${err}`)
    }
}

const main = async (sourcePath, destDir, dryrun=false, prompt=false) => {
    try {
        await validateArgs(sourcePath, destDir)
        let src = path.resolve(sourcePath)
        let dest = path.resolve(destDir)

        let res = await moveFile(src, dest, dryrun, prompt)

        return res
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
export default main
