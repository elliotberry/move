import path from 'path'
import { existsSync, statSync } from 'fs'
import theWork from './lib.js'
import yargs from 'yargs/yargs'

var argv = yargs(process.argv.slice(2))
    .scriptName('move')
    .usage('$0 <source> <destination> [--dryrun] [--prompt]')
    .option('dryrun', {
        alias: 'd',
        describe: 'Perform a dry run (no actual move)',
        type: 'boolean',
        default: false,
    })
    .option('overwrite', {
        //enum
        alias: 'o',
        describe: 'method of handling existing files',
        type: 'string',
        default: 'auto', // auto, prompt, skip, overwrite
    })
    .option('delete', {
        alias: 'D',
        describe: 'delete source file after moving',
        type: 'boolean',
        default: true,
    })
    .help().argv

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

async function main() {
    const source = argv._[0]
    const destination = argv._[1]
    const { sourcePath, destDir } = await validateArgs(source, destination)
    await theWork(sourcePath, destDir, argv.dryrun, argv.overwrite, argv.delete)
}
main()

