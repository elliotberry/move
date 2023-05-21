import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const moveFile = (sourcePath, destDir) => {
    const fileName = path.basename(sourcePath)
    let destPath = path.join(destDir, fileName)
    let count = 0
    while (fs.existsSync(destPath)) {
        count++
        destPath = path.join(
            destDir,
            `${path.parse(fileName).name}(${count})${path.extname(fileName)}`
        )
    }
    console.log(`${chalk.blue(sourcePath)} ==> ${chalk.green(destPath)}`)
    fs.renameSync(sourcePath, destPath)
}
export default moveFile