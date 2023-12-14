import path from 'path'
import { whilst } from 'async'
import exists from './exists.js'

const destPathFactory = (name, ext, destDir, count = 0) => {
    return path.join(destDir, `${name}${count === 0 ? '' : `--${count}`}${ext}`)
}


const recursiveRename = async (destDir, fn) => {
    let count = 0
    const makeDestPath = async (i) => {
        let resp = await fn(i);
        return path.join(destDir, resp)
    }

    while (await exists(await makeDestPath(count))) {
        count++
    }

    return await makeDestPath(count)
}

export default recursiveRename
