import theWork from './lib/lib.js'
import yargs from 'yargs/yargs'
import { validateArgs } from './lib/validate-args.js'
//import appendToLog from './lib/append-to-log.js'
import chalk from 'chalk'

var argv = yargs(process.argv.slice(2))
    .scriptName('move')
    .usage('$0 <source> <destination> [--dryrun] [--prompt]')
    .option('dryrun', {
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
    .option('keep', {
        alias: 'K',
        describe: "DON'T delete source file after moving",
        type: 'boolean',
        default: false,
    })
    .help().argv

async function main() {
    try {
        const source = argv._[0]
        const destination = argv._[1]
        const { sourcePath, destDir } = await validateArgs(
            source,
            destination,
            argv.overwrite
        )
        let del = argv.keep ? false : true
        let output = await theWork(
            sourcePath,
            destDir,
            argv.dryrun,
            argv.overwrite,
            del
        )
        //  await appendToLog(JSON.stringify(output))
    } catch (err) {
        console.error(chalk.red(err))
    }
}
main()
