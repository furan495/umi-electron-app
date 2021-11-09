const { app, ipcMain, dialog, BrowserWindow } = require('electron')

const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const isDev = require('electron-is-dev')

let oss

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../electron/preload.js'),
        },
    })

    win.loadURL(
        isDev
            ? 'http://localhost:8000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    )

    oss = await utils.initOss()

    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' })
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.handle('download', async (event, file) => {
    try {
        const localPath = dialog.showSaveDialogSync(null, { defaultPath: file.realName })
        const result = await oss.getStream(`${file.realPath}/${file.realName}`)
        const writeStream = fs.createWriteStream(localPath)
        result.stream.pipe(writeStream)
        return localPath
    } catch (error) {
        return error
    }
})