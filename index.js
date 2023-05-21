import fs from 'fs'

import chalk from 'chalk'
import moveFile from './lib.js'
const [, , sourcePath, destDir] = process.argv

// Check if sourcePath and destDir are provided
if (!sourcePath || !destDir) {
    console.error(chalk.red('Usage: move <sourcePath> <destDir>'))
    process.exit(1)
}

// Check if sourcePath is a valid path
if (!fs.existsSync(sourcePath)) {
    console.error(chalk.red(`Error: ${sourcePath} is not a valid path`))
    process.exit(1)
}

// Check if destDir is a valid directory
if (!fs.existsSync(destDir) || !fs.statSync(destDir).isDirectory()) {
    console.error(chalk.red(`Error: ${destDir} is not a valid directory`))
    process.exit(1)
}
// Usage example:
moveFile(sourcePath, destDir)
