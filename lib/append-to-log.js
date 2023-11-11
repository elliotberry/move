import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import exists from './exists.js'

const appendToLog = async function (inputString) {
    try {
        // Read the package.json to get the application name
        const appName = 'moove'

        // Find user's home directory
        const homeDir = os.homedir()

        // Create directory if it doesn't exist
        const appDir = path.join(homeDir, `.${appName}`)
        try {
            await fs.mkdir(appDir)
        } catch (error) {
            if (error.code !== 'EEXIST') throw error // Ignore if the directory already exists
        }

        // Check for existing log files and manage new log files
        await checkExistingLogFiles(appDir, appName)

        // Write to log file
        const activeLogFile = path.join(appDir, `${appName}.log`)
        const isoDate = new Date().toISOString()
        await fs.appendFile(activeLogFile, `${isoDate}: ${inputString}\n`)
    } catch (error) {
        console.error('An error occurred:', error)
    }
}

const checkExistingLogFiles = async function (appDir, appName) {
    let backupNumber = 1
    let totalSize = 0
    let logFiles = []

    // Iterate to find all backup log files
    while (await exists(path.join(appDir, `${appName}.log.${backupNumber}`))) {
        const filePath = path.join(appDir, `${appName}.log.${backupNumber}`)
        const stats = await fs.stat(filePath)
        totalSize += stats.size
        logFiles.push(filePath)
        backupNumber++
    }

    // Log the count and total size of log files
    if (logFiles.length > 0) {
        console.log(
            `There are ${logFiles.length} outstanding log files taking up ${totalSize} bytes on your hard drive.`
        )
    }

    // Manage the active log file
    await manageLogFile(appDir, appName)
}

const rescursiveRename = async (destDir, fn) => {
    let count = 0
    const makeDestPath = (i) => path.join(destDir, fn(i))

    while (await exists(await makeDestPath(count))) {
        count++
    }

    return await makeDestPath(count)
}

const manageLogFile = async function (appDir, appName) {
    const logFile = path.join(appDir, `${appName}.log`)
    try {
        const data = await fs.readFile(logFile, 'utf8')
        const lines = data.split('\n')

        // Check if there are a thousand lines
        if (lines.length >= 1000) {
            // Find the next available backup file number

            let finalFilePath = await rescursiveRename(
                appDir,
                (i) => `${appName}.log.${i}`
            )

            // Rename the current log file to the backup file
            await fs.rename(logFile, finalFilePath)
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(logFile, '') // Create the file if it doesn't exist
        } else {
            throw error
        }
    }
}
appendToLog('Hello, world!')
export default appendToLog
