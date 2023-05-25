import { existsSync, statSync } from 'fs'
import path from 'path'
import log from './log.js'
import moveFile from './lib.js'


try {
    let [, , sourcePath, destDir] = process.argv
    // Check if sourcePath and destDir are provided
    if (!sourcePath || !destDir) {
        log.error('Usage: move <sourcePath> <destDir>')
        throw new Error('Invalid arguments')
    }
    sourcePath = path.resolve(sourcePath)
    destDir = path.resolve(destDir)

    let sourceStats = statSync(sourcePath)
    let destStats = statSync(destDir)

    // Check if sourcePath is a valid path
    if (!existsSync(sourcePath) || !existsSync(destDir)) {
        log.error(`Error: ${sourcePath} is not a valid path`)
        throw new Error('Invalid sourcePath')
    }

    // Check if destDir is a valid directory
    if (sourceStats.isDirectory() || !destStats.isDirectory()) {
        log.error(`Error: must copy a file to a folder`)
        throw new Error('Invalid destDir')
    }
    // Usage example:
    let { src, dest } = moveFile(sourcePath, destDir)
    log.log(`${src} ==> ${dest}`)
} catch (err) {
    log.error(err)
    process.exit(1)
}
