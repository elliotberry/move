import { existsSync, statSync } from 'fs'
import path from 'path'
import chalk from 'chalk'
import moveFile from './lib.js'

const opts = {
    echo: false,
    log: false,
}
const log = (msg) => opts.log && console.log(msg)
try {
    let [, , sourcePath, destDir] = process.argv

    sourcePath = path.resolve(sourcePath)
    destDir = path.resolve(destDir)

    // Check if sourcePath and destDir are provided
    if (!sourcePath || !destDir) {
        log.error(chalk.red('Usage: move <sourcePath> <destDir>'))
        new Error('Invalid arguments')
    }

    // Check if sourcePath is a valid path
    if (!existsSync(sourcePath)) {
        log.error(chalk.red(`Error: ${sourcePath} is not a valid path`))
        new Error('Invalid sourcePath')
    }

    // Check if destDir is a valid directory
    if (!existsSync(destDir) || !statSync(destDir).isDirectory()) {
        log.error(chalk.red(`Error: ${destDir} is not a valid directory`))
        new Error('Invalid destDir')
    }
    // Usage example:
    moveFile(sourcePath, destDir)
} catch (err) {
    log.error(chalk.red(err.message))
    process.exit(1)
}
