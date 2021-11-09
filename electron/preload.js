const { ipcRenderer, contextBridge } = require('electron')
const request = require('./request')

contextBridge.exposeInMainWorld('httpRequest', request)
contextBridge.exposeInMainWorld('electron', { ipcRenderer })

