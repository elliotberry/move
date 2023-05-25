import os from 'os'
import {appendFileSync} from 'fs'
const opts = {
    log: true,
    error: true,
    file: true,
}
const log = {
    log: (msg) => opts.log && console.log(msg) && appendToTextFile(msg) ,
    error: (msg) => opts.error && console.error(msg) && appendToTextFile(msg),
}
const appendToTextFile = (msg) => opts.file && appendFileSync(`${os.homeDir}elliot.move.log`, msg + '\n')
