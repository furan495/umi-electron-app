const { app, ipcMain, BrowserWindow } = require('electron')

const fs = require('fs')
const path = require('path')
const request = require('./request')
const isDev = require('electron-is-dev')

function createWindow() {
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

ipcMain.handle('download', async (event, arg) => {
    const result = await request('data/find', { prefix: 'oss', method: 'POST', body: { prefix: '测试数据', searchName: '', isMyData: '' } })
    console.log(result)
    return 11
})