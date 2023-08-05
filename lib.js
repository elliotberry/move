import path from 'path'
import { existsSync, statSync } from 'fs'
import { copyFile, rm } from 'node:fs/promises'

import PromptSync from 'prompt-sync'

let promptSync = PromptSync()


const destPathFactory = (name, ext, destDir, count = 0) => {
    return path.join(destDir, `${name}${count === 0 ? '' : `--${count}`}${ext}`)
}

const recursiveRename = (fileName, destDir) => {
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
const actuallyCopyTheFile = async (sourcePath, destPath, dryrun, deleteSource) => {
    console.log(deleteSource)
    console.log(`${dryrun ? 'Dry run: ' : ''}${sourcePath} ==> ${destPath}`)
    if (!dryrun) {
        await copyFile(sourcePath, destPath)
        if (deleteSource === true) {
            await rm(sourcePath)
        }
    } 
    return { src: sourcePath, dest: destPath }
}
const moveFile = async (sourcePath, destDir, dryrun, overwrite, deleteSource) => {
    try {
        const fileName = path.basename(sourcePath)
        let destPath = path.join(destDir, fileName)

        let isOverwrite = await existsSync(destPath)
        if (isOverwrite) {
            if (overwrite === 'prompt') {
                let answer = promptSync(
                    `Move ${sourcePath} to ${destPath}? (y/n) `
                )
                if (answer.toLowerCase() !== 'y') {
                    console.log('Aborting move')
                    process.exit(0)
                }
            } else if (overwrite === 'auto') {
                destPath = await recursiveRename(sourcePath, destDir)
            } else {
                ///skip
                console.log(`Skipping ${sourcePath}`)
                process.exit(0)
            }
        }

        await actuallyCopyTheFile(sourcePath, destPath, dryrun, deleteSource)

        return { src: sourcePath, dest: destPath }
    } catch (err) {
        console.error(`The file could not be copied: ${err}`)
    }
}

const main = async (
    sourcePath,
    destDir,
    dryrun = false,
    overwrite = 'auto',
    deleteSource = true
) => {
    try {
       
        let src = path.resolve(sourcePath)
        let dest = path.resolve(destDir)

        let res = await moveFile(src, dest, dryrun, overwrite, deleteSource)

        return res
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
export default main
