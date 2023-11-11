import path from 'path'
import { whilst } from 'async'
import exists from './exists.js'

const destPathFactory = (name, ext, destDir, count = 0) => {
    return path.join(destDir, `${name}${count === 0 ? '' : `--${count}`}${ext}`)
}


const recursiveRename2 = async (destDir, fn) => {
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

const recursiveRename = async (fileName, destDir) => {
    let name = path.parse(fileName).name
    let ext = path.extname(fileName)
    let count = 0
    let destPath = destPathFactory(name, ext, destDir, count)

    await whilst(
        async function () {
            return await exists(destPath)
        },
        async () => {
            count++
            destPath = destPathFactory(name, ext, destDir, count)
        }
    )
    return destPath
}
export default recursiveRename2
