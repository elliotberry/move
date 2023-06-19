import { existsSync, statSync } from 'fs'
import path from 'path'
import log from './log.js'
import moveFile from './lib.js'

try {
    let [, , sourcePath, destDir] = process.argv

    moveFile(sourcePath, destDir).then((res) => {
        log.log(`${res.src} ==> ${res.dest}`)
    })
} catch (err) {
    log.error(err)
    process.exit(1)
}
