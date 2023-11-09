import path from 'path';
import whilst from 'async/whilst';
import exists from './exists.js'

const destPathFactory = (name, ext, destDir, count = 0) => {
    return path.join(destDir, `${name}${count === 0 ? '' : `--${count}`}${ext}`)
}
const recursiveRename = async (fileName, destDir) => {
    let name = path.parse(fileName).name;
    let ext = path.extname(fileName);
    let count = 0;
    let destPath = destPathFactory(name, ext, destDir, count);

    await whilst(exists(destPath), async () => {
        count++;
        destPath = destPathFactory(name, ext, destDir, count);
    });
    return destPath;
};
export default recursiveRename;
