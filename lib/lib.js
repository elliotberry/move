import path from 'path'
import { copyFile, rm } from 'node:fs/promises'
import PromptSync from 'prompt-sync'
import recursiveRename from './recursive-rename.js'
import exists from './exists.js'
import chalk from 'chalk'
import appendToLog from './append-to-log.js'
let promptSync = PromptSync()

const actuallyCopyTheFile = async (
    sourcePath,
    destPath,
    dryrun,
    deleteSource,
    renamed
) => {
    console.log(
        `${dryrun ? 'Dry run: ' : ''}${sourcePath} ==> ${destPath}${
            renamed ? '(renamed)' : ''
        }`
    )

    if (!dryrun) {
        await copyFile(sourcePath, destPath)
        if (deleteSource === true) {
            await rm(sourcePath)
            console.log(chalk.yellow(`Deleted ${sourcePath}`))
        }
    }
    return { src: sourcePath, dest: destPath }
}

const moveFile = async (
    sourcePath,
    destDir,
    dryrun,
    overwriteBehavior,
    deleteSource
) => {
    const fileName = path.basename(sourcePath)
    let destPath = path.join(destDir, fileName)

    let isOverwrite = await exists(destPath)
    let renamed = false

    if (isOverwrite) {
        if (overwriteBehavior === 'prompt') {
            let answer = promptSync(
                `Move ${sourcePath} to ${destPath}, overwriting existing? (y/n) `
            )
            if (answer.toLowerCase() !== 'y') {
                console.log('User indicated: abort move.')
                process.exit(0)
            }
        } else if (overwriteBehavior === 'auto') {
            const destPathFactory = (count) => {
                let name = path.parse(fileName).name
                let ext = path.extname(fileName)
                return `${name}${count === 0 ? '' : `--${count}`}${ext}`
            }
            destPath = await recursiveRename(destDir, destPathFactory)
            renamed = true
        } else {
            ///skip
            console.log(`Skipping ${sourcePath} due to conflict.`)
            process.exit(0)
        }
    }

    await actuallyCopyTheFile(
        sourcePath,
        destPath,
        dryrun,
        deleteSource,
        renamed
    )

    return { src: sourcePath, dest: destPath, renamed, deleted: deleteSource }
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
        await appendToLog(JSON.stringify(res))
        return res
    } catch (err) {
        console.error(chalk.red(err))
        process.exit(1)
    }
}
export default main
