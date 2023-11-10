import theWork from './lib.js'
import yargs from 'yargs/yargs'
import { validateArgs } from './validateArgs.js'

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
        describe: 'DON\'T delete source file after moving',
        type: 'boolean',
        default: false
    })
    .help().argv

async function main() {
    const source = argv._[0]
    const destination = argv._[1]
    const { sourcePath, destDir } = await validateArgs(source, destination)
    let del = argv.keep ? false : true
    await theWork(sourcePath, destDir, argv.dryrun, argv.overwrite, del)
}
main()

