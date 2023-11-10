import {access } from 'node:fs/promises'
 const exists = async (path) => {
    try {
        await access(path)
        return true
    } catch (err) {
        return false
    }
}

export default exists