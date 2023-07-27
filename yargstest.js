#!/usr/bin/env node

import moveFile from './lib.js'
import log from './log.js'
import yargs from 'yargs/yargs'

var argv = yargs(process.argv.slice(2))
    .scriptName('move')
    .usage('$0 <source> <destination> [--dryrun] [--prompt]')
    .command(
        '$0 <source> <destination>',
        'Move a file to a folder',
        (yargs) => {
            return yargs
                .positional('source', {
                    describe: 'Source file to move',
                    type: 'string',
                })
                .positional('destination', {
                    describe: 'Destination folder',
                    type: 'string',
                })
                .options({
                    dryrun: {
                        alias: 'd',
                        describe: 'Perform a dry run (no actual move)',
                        type: 'boolean',
                        default: false,
                    },
                    prompt: {
                        alias: 'p',
                        describe: 'Prompt before moving the file',
                        type: 'boolean',
                        default: true,
                    },
                })
        }
    )
    .demandCommand()
    .help().argv

console.log(argv.source, argv.destination, argv.dryrun, argv.prompt)

try {
    let [, , sourcePath, destDir] = process.argv

    moveFile(argv.source, argv.destination, argv.dryrun, argv.prompt).then(
        (res) => {
            log.log(`${res.src} ==> ${res.dest}`)
        }
    )
} catch (err) {
    log.error(err)
    process.exit(1)
}
