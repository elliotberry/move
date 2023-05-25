import fs from 'fs'
import path from 'path'


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
  
    fs.renameSync(sourcePath, destPath)
    return {src: sourcePath, dest: destPath}
}
export default moveFile