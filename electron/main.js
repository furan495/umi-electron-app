const { app, ipcMain, dialog, BrowserWindow } = require('electron')

const path = require('path')
const utils = require('./utils')
const isDev = require('electron-is-dev')
const { DownloadTask } = require('./task')

let oss

async function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
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
        win.webContents.openDevTools()
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

ipcMain.handle('download', async (event, record) => {
    try {
        const localPath = dialog.showSaveDialogSync(null, { defaultPath: record.fileName })
        if (record.isDirectory === 1) {
            utils.loopFolder(oss, record, localPath)
        } else {
            const task = new DownloadTask(oss, record, localPath)
            task.start()
        }
        return localPath
    } catch (error) {
        return error
    }
})
